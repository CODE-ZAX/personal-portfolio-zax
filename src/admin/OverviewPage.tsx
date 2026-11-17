import { Meter, Spark } from "./Meter";
import { formatBytes, formatUptime } from "./stats";
import { useStats } from "./useStats";

export function OverviewPage() {
  const { stats, cpuHistory, error } = useStats();
  const host = stats?.host;
  const memoryPct = host?.memoryTotal && host.memoryUsed !== null ? (host.memoryUsed / host.memoryTotal) * 100 : null;
  const diskPct = host?.diskTotal && host.diskUsed !== null ? (host.diskUsed / host.diskTotal) * 100 : null;

  return (
    <div className="grid gap-8 md:grid-cols-12">
      <div className="md:col-span-5">
        <h1 className="font-display text-[clamp(2.35rem,5.4vw,4.5rem)] leading-[0.9] tracking-tighter">This host</h1>
        <p className="mt-4 max-w-[42ch] text-base leading-relaxed text-muted">
          Content, containers, and the machine they run on. Figures refresh while this tab is open.
        </p>
        <p className="mt-6 font-display text-sm text-muted">Uptime {formatUptime(host?.uptimeSeconds ?? null)}</p>
        {error ? <p className="mt-3 text-sm text-accent-text">{error}</p> : null}
      </div>
      <div className="grid content-start gap-6 md:col-span-6 md:col-start-7 md:mt-16">
        <Meter label="Processor" value={host?.cpuPercent ?? null} />
        <Meter label="Memory" value={memoryPct} />
        <Meter label="Disk" value={diskPct} />
        <p className="text-sm text-muted">
          Memory {formatBytes(host?.memoryUsed ?? null)} of {formatBytes(host?.memoryTotal ?? null)}. Disk{" "}
          {formatBytes(host?.diskUsed ?? null)} of {formatBytes(host?.diskTotal ?? null)}.
        </p>
        <Spark points={cpuHistory} />
      </div>
    </div>
  );
}
