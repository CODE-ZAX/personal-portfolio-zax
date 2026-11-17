import { useEffect, useState } from "react";
import { pb } from "./pb";
import { useStats } from "./useStats";
import { ToolIcon } from "./icons";
import { defaultTools, type AdminTool } from "./tools";

export function ToolsPage() {
  const [tools, setTools] = useState<AdminTool[]>(defaultTools);
  const { stats } = useStats();

  useEffect(() => {
    let dead = false;
    pb.collection("admin_tools")
      .getFullList({ sort: "sortOrder" })
      .then((records) => {
        if (dead || records.length === 0) return;
        setTools(
          records.map((record) => ({
            name: String(record.name ?? ""),
            url: String(record.url ?? ""),
            description: String(record.description ?? ""),
            icon: String(record.icon ?? "content"),
            sortOrder: Number(record.sortOrder ?? 0),
            healthUrl: String(record.healthUrl ?? ""),
          })),
        );
      })
      .catch(() => undefined);
    return () => {
      dead = true;
    };
  }, []);

  const health = new Map((stats?.tools ?? []).map((tool) => [tool.name, tool.ok]));

  return (
    <div>
      <h1 className="max-w-[10ch] font-display text-[clamp(2.35rem,5.4vw,4.5rem)] leading-[0.9] tracking-tighter">Tools</h1>
      <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-muted">
        Each tile opens in this host. Add another by creating an admin tool record.
      </p>
      <ul className="mt-8 divide-y divide-line border-y border-line">
        {tools.map((tool, index) => {
          const dot = health.get(tool.name);
          return (
            <li key={tool.url} className={index === 0 ? "py-6" : "py-4"}>
              <a href={tool.url} className="group grid items-center gap-4 md:grid-cols-[auto_1fr_auto]" target={tool.url.startsWith("http") ? "_blank" : undefined} rel={tool.url.startsWith("http") ? "noreferrer" : undefined}>
                <span className="grid h-11 w-11 place-items-center rounded-2xl border border-line text-accent-text">
                  <ToolIcon name={tool.icon} />
                </span>
                <span>
                  <span className={`block font-display tracking-tight ${index === 0 ? "text-3xl" : "text-xl"}`}>{tool.name}</span>
                  <span className="mt-1 block max-w-[52ch] text-sm leading-relaxed text-muted">{tool.description}</span>
                </span>
                <span className="flex items-center gap-2 font-display text-xs uppercase tracking-[0.14em] text-muted">
                  {dot === undefined ? null : (
                    <span className={`inline-block h-2 w-2 rounded-full ${dot ? "bg-accent" : "bg-line"}`} aria-label={dot ? "Reachable" : "Not reachable"} />
                  )}
                  Open
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
