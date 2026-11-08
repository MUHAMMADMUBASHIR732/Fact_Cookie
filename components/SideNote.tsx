// Decorative vertical line of text on a screen edge. It drifts up and down; left reads upward, right reads downward.
export function SideNote({ side, children }: { side: "left" | "right"; children: React.ReactNode }) {
  return (
    <div aria-hidden
      className={`pointer-events-none fixed inset-y-0 z-10 hidden items-center text-sm tracking-[0.18em] text-muted md:flex ${side === "left" ? "left-5" : "right-5"}`}>
      <span className="drift">
        <span className={`block font-display [writing-mode:vertical-rl] ${side === "left" ? "rotate-180" : ""}`}>{children}</span>
      </span>
    </div>
  );
}
