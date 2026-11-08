// Types the text out once. The not-yet-typed part stays in the layout (invisible) so nothing jumps.
"use client";
import { useEffect, useState } from "react";

export function Typewriter({ text, speed = 55, startAfter = 300 }: { text: string; speed?: number; startAfter?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setCount(text.length); return; }
    let timer: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      timer = setInterval(() => setCount((c) => { if (c >= text.length) { clearInterval(timer); return c; } return c + 1; }), speed);
    }, startAfter);
    return () => { clearTimeout(start); clearInterval(timer); };
  }, [text, speed, startAfter]);

  return (
    <span aria-label={text}>
      <span aria-hidden>
        {text.slice(0, count)}
        {count < text.length && <span className="caret" />}
        <span className="invisible">{text.slice(count)}</span>
      </span>
    </span>
  );
}
