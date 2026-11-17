import { useEffect, useState } from "react";
import { useMotionPrefs } from "./MotionProvider";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const { reduced, paused } = useMotionPrefs();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (reduced || paused) {
      setDisplay(text);
      return;
    }
    let frame = 0;
    const id = window.setInterval(() => {
      frame += 1;
      const reveal = frame / 3;
      setDisplay(
        text
          .split("")
          .map((char, index) => {
            if (char === " " || char === "-" || char === ".") return char;
            if (index < reveal) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join(""),
      );
      if (reveal >= text.length) window.clearInterval(id);
    }, 30);
    return () => window.clearInterval(id);
  }, [text, reduced, paused]);

  return (
    <span className={className}>
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
