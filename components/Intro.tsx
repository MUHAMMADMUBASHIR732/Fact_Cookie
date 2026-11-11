// First-visit intro: logo, three words, then a curtain that splits open. Once per session, skippable (click or Esc).
"use client";
import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";

const words = ["Verify.", "Discover.", "Trust."];
const dots = [["supported", 100, 4], ["outdated", 196, 100], ["contradicted", 100, 196], ["unverifiable", 4, 100]] as const;

export function Intro() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const finish = () => {
      try { sessionStorage.setItem("intro", "1"); } catch { /* storage blocked */ }
      root.dataset.intro = "seen";
      document.body.style.overflow = "";
      setDone(true);
    };
    if (root.dataset.intro === "seen" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { finish(); return; }
    document.body.style.overflow = "hidden";
    const timer = setTimeout(finish, 3800);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finish();
    window.addEventListener("keydown", onKey);
    (window as unknown as { __skipIntro?: () => void }).__skipIntro = finish;
    return () => { clearTimeout(timer); window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, []);

  if (done) return null;
  return (
    <div className="intro band" role="presentation">
      <div className="intro-half top" />
      <div className="intro-half bottom" />
      <div className="intro-content" aria-hidden>
        <span className="intro-beam" />
        {["tl", "tr", "bl", "br"].map((c) => <span key={c} className={`intro-corner ${c}`} />)}
        <div className="intro-orb">
          <svg viewBox="0 0 200 200" className="absolute inset-0 size-full">
            <circle cx="100" cy="100" r="96" fill="none" stroke="var(--line)" strokeWidth="1.5" />
            <circle className="intro-ring" cx="100" cy="100" r="96" fill="none" stroke="var(--umber)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="604" />
            <g className="intro-orbit">{dots.map(([v, x, y]) => <circle key={v} cx={x} cy={y} r="5.5" fill={`var(--v-${v})`} />)}</g>
          </svg>
          <Image src="/logo-mark.png" alt="" width={88} height={88} priority className="intro-logo absolute inset-0 m-auto rounded-[28%]" />
        </div>
        <div className="text-center">
          {words.map((w, i) => <span key={w} className="intro-word" style={{ "--d": `${700 + i * 420}ms` } as CSSProperties}>{w}</span>)}
        </div>
        <span className="intro-line" />
      </div>
      <button className="intro-skip" onClick={() => (window as unknown as { __skipIntro?: () => void }).__skipIntro?.()}>Skip</button>
    </div>
  );
}
