export type HostStats = {
  cpuPercent: number | null;
  load: number[];
  memoryUsed: number | null;
  memoryTotal: number | null;
  diskUsed: number | null;
  diskTotal: number | null;
  uptimeSeconds: number | null;
  note: string;
};

export type ContainerStat = {
  name: string;
  image: string;
  state: string;
  status: string;
  health: string;
};

export type StatsPayload = {
  host: HostStats;
  containers: ContainerStat[];
  tools: { name: string; ok: boolean }[];
};

export function formatBytes(value: number | null) {
  if (value === null || Number.isNaN(value)) return "Unavailable";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let n = value;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i += 1;
  }
  return `${n.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function formatUptime(seconds: number | null) {
  if (seconds === null || Number.isNaN(seconds)) return "Unavailable";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
