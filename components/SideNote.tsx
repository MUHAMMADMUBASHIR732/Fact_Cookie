// Decorative vertical ticker on a screen edge. The line repeats and scrolls in ONE direction forever.
// Left scrolls up and reads upward; right scrolls down and reads downward.
const REPEATS = 3;

export function SideNote({ side, children }: { side: "left" | "right"; children: string }) {
  const up = side === "left";
  // One group = the line repeated; two identical groups make the loop seamless.
  const group = Array.from({ length: REPEATS }, () => children).join("  •  ") + "  •  ";

  return (
    <div aria-hidden
      className={`pointer-events-none fixed inset-y-0 z-10 hidden w-6 overflow-hidden text-sm tracking-[0.18em] text-muted [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] md:block ${up ? "left-3" : "right-3"}`}>
      <div className={`flex flex-col ${up ? "marquee-up" : "marquee-down"}`}>
        {[0, 1].map((n) => (
          <span key={n} className={`block h-max whitespace-pre font-display [writing-mode:vertical-rl] ${up ? "rotate-180" : ""}`}>
            {group}
          </span>
        ))}
      </div>
    </div>
  );
}
