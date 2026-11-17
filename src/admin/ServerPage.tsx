import { Meter, Spark } from "./Meter";
import { formatBytes, formatUptime } from "./stats";
import { useStats } from "./useStats";

export function ServerPage() {
  const { stats, cpuHistory, error } = useStats();
  const host = stats?.host;
  const memoryPct = host?.memoryTotal && host.memoryUsed !== null ? (host.memoryUsed / host.memoryTotal) * 100 : null;
  const diskPct = host?.diskTotal && host.diskUsed !== null ? (host.diskUsed / host.diskTotal) * 100 : null;

  return (
    <div className="grid gap-10">
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-5">
          <h1 className="font-display text-[clamp(2.35rem,5.4vw,4.5rem)] leading-[0.9] tracking-tighter">Server</h1>
          <p className="mt-4 text-sm text-muted">Load {host?.load?.map((n) => n.toFixed(2)).join("  ") || "Unavailable"}</p>
          <p className="mt-2 text-sm text-muted">Up {formatUptime(host?.uptimeSeconds ?? null)}</p>
          {host?.note ? <p className="mt-2 text-sm text-accent-text">{host.note}</p> : null}
          {error ? <p className="mt-2 text-sm text-accent-text">{error}</p> : null}
        </div>
        <div className="grid gap-5 md:col-span-6 md:col-start-7">
          <Meter label="Processor" value={host?.cpuPercent ?? null} />
          <Meter label="Memory" value={memoryPct} />
          <p className="text-sm text-muted">
            {formatBytes(host?.memoryUsed ?? null)} of {formatBytes(host?.memoryTotal ?? null)}
          </p>
          <Meter label="Disk" value={diskPct} />
          <p className="text-sm text-muted">
            {formatBytes(host?.diskUsed ?? null)} of {formatBytes(host?.diskTotal ?? null)}
          </p>
          <Spark points={cpuHistory} />
        </div>
      </div>
      <div>
        <h2 className="font-display text-2xl tracking-tight">Containers</h2>
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {(stats?.containers ?? []).map((item) => (
            <li key={item.name} className="grid gap-1 py-4 md:grid-cols-[1.2fr_1.4fr_auto]">
              <p className="font-display text-lg">{item.name}</p>
              <p className="text-sm text-muted">{item.image}</p>
              <p className="text-sm text-ink">
                {item.state}
                {item.health ? ` · ${item.health}` : ""}
                <span className="mt-1 block text-muted">{item.status}</span>
              </p>
            </li>
          ))}
          {stats && stats.containers.length === 0 ? <li className="py-4 text-sm text-muted">No containers reported.</li> : null}
        </ul>
      </div>
    </div>
  );
}
