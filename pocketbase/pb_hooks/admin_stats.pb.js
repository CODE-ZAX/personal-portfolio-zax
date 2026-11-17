/// <reference path="../pb_data/types.d.ts" />

routerAdd("GET", "/api/admin/stats", (e) => {
  function readText(path) {
    return toString($os.readFile(path));
  }

  function cpuSample() {
    const line = readText("/host/proc/stat").split("\n")[0].trim().split(/\s+/).slice(1);
    let idle = 0;
    let total = 0;
    for (let i = 0; i < line.length; i++) {
      const n = Number(line[i]) || 0;
      total += n;
      if (i === 3 || i === 4) idle += n;
    }
    return { idle: idle, total: total };
  }

  function hostMetrics() {
    const metrics = {
      cpuPercent: null,
      load: [],
      memoryUsed: null,
      memoryTotal: null,
      diskUsed: null,
      diskTotal: null,
      uptimeSeconds: null,
      note: "",
    };

    try {
      const first = cpuSample();
      $os.cmd("sleep", "0.2").run();
      const second = cpuSample();
      const idle = second.idle - first.idle;
      const total = second.total - first.total;
      if (total > 0) metrics.cpuPercent = Math.max(0, Math.min(100, (1 - idle / total) * 100));
    } catch (_) {
      metrics.note = "CPU sample unavailable";
    }

    try {
      const load = readText("/host/proc/loadavg").trim().split(/\s+/);
      metrics.load = [Number(load[0]), Number(load[1]), Number(load[2])];
    } catch (_) {}

    try {
      const mem = {};
      const lines = readText("/host/proc/meminfo").split("\n");
      for (let i = 0; i < lines.length; i++) {
        const parts = lines[i].split(":");
        if (parts.length < 2) continue;
        mem[parts[0]] = Number(parts[1].trim().split(/\s+/)[0]) * 1024;
      }
      metrics.memoryTotal = mem.MemTotal || null;
      if (mem.MemTotal && mem.MemAvailable) metrics.memoryUsed = mem.MemTotal - mem.MemAvailable;
    } catch (_) {}

    try {
      metrics.uptimeSeconds = Number(readText("/host/proc/uptime").trim().split(/\s+/)[0]);
    } catch (_) {}

    try {
      const out = toString($os.cmd("df", "-B1", "/host/root").combinedOutput());
      const rows = out.trim().split("\n");
      if (rows.length > 1) {
        const cols = rows[rows.length - 1].trim().split(/\s+/);
        metrics.diskTotal = Number(cols[1]);
        metrics.diskUsed = Number(cols[2]);
      }
    } catch (_) {
      if (!metrics.note) metrics.note = "Disk sample unavailable";
    }

    return metrics;
  }

  function containers() {
    const base = $os.getenv("DOCKER_PROXY_URL") || "http://docker-socket-proxy:2375";
    try {
      const res = $http.send({
        url: base + "/containers/json?all=1",
        method: "GET",
        timeout: 3,
      });
      const items = Array.isArray(res.json) ? res.json : [];
      const out = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const status = String(item.Status || "");
        let health = "";
        if (status.indexOf("(unhealthy)") >= 0) health = "unhealthy";
        else if (status.indexOf("(healthy)") >= 0) health = "healthy";
        else if (status.indexOf("(health: starting)") >= 0) health = "starting";
        const rawName = item.Names && item.Names.length ? String(item.Names[0]) : String(item.Id || "");
        out.push({
          name: rawName.replace(/^\//, ""),
          image: String(item.Image || ""),
          state: String(item.State || ""),
          status: status,
          health: health,
        });
      }
      return out;
    } catch (_) {
      return [];
    }
  }

  function toolHealth() {
    let records = [];
    try {
      records = $app.findRecordsByFilter("admin_tools", "healthUrl != ''", "sortOrder", 20, 0);
    } catch (_) {
      return [];
    }
    const out = [];
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const url = String(record.get("healthUrl") || "");
      let ok = false;
      if (url) {
        try {
          const res = $http.send({ url: url, method: "GET", timeout: 2 });
          ok = res.statusCode >= 200 && res.statusCode < 400;
        } catch (_) {
          ok = false;
        }
      }
      out.push({ name: String(record.get("name") || ""), ok: ok });
    }
    return out;
  }

  try {
    return e.json(200, {
      host: hostMetrics(),
      containers: containers(),
      tools: toolHealth(),
    });
  } catch (err) {
    console.log("admin stats: " + String(err && err.message ? err.message : err));
    return e.json(500, { message: "Stats unavailable" });
  }
}, $apis.requireSuperuserAuth());
