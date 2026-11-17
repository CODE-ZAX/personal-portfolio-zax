export function ToolIcon({ name }: { name: string }) {
  const common = { viewBox: "0 0 24 24", className: "h-5 w-5", "aria-hidden": true as const };
  if (name === "containers") {
    return (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="6" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <rect x="3" y="14" width="18" height="6" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }
  if (name === "workflow") {
    return (
      <svg {...common}>
        <path d="M5 7h6M13 17h6M8 7v6a3 3 0 0 0 3 3h2" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="5" cy="7" r="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="19" cy="17" r="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }
  if (name === "chat") {
    return (
      <svg {...common}>
        <path d="M6 16.5 4 20l4.2-1.4A8 8 0 1 0 6 16.5Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M6 4h9l3 3v13H6V4Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 11h6M9 15h4" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
