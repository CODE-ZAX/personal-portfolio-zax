import { useEffect, useState } from "react";
import { pb } from "./pb";
import { navigate } from "./router";
import type { StatsPayload } from "./stats";

export function useStats() {
  const [stats, setStats] = useState<StatsPayload | null>(null);
  const [cpuHistory, setCpuHistory] = useState<number[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let dead = false;
    let timer = 0;

    const tick = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const next = await pb.send<StatsPayload>("/api/admin/stats", { method: "GET" });
        if (dead) return;
        setStats(next);
        setError("");
        if (typeof next.host.cpuPercent === "number") {
          setCpuHistory((history) => [...history, next.host.cpuPercent as number].slice(-24));
        }
      } catch (err) {
        const status = (err as { status?: number }).status;
        if (status === 401 || status === 403) {
          pb.authStore.clear();
          navigate("/admin/login");
          window.location.assign("/admin/login");
          return;
        }
        if (!dead) setError("The host did not answer.");
      }
    };

    const loop = () => {
      tick();
      timer = window.setTimeout(loop, 5000);
    };
    loop();
    const onVis = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      dead = true;
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return { stats, cpuHistory, error };
}
