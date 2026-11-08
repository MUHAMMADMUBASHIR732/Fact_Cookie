// Back-to-top button: pops in after scrolling, ring fills with scroll progress, arrow bobs on hover.
"use client";
import { ArrowUp } from "lucide-react";
import { useScrollY } from "@/hooks/useScrollY";

const R = 20;
const C = 2 * Math.PI * R;

export function BackToTop() {
  const y = useScrollY();
  const max = y > 0 ? document.documentElement.scrollHeight - window.innerHeight : 1; // y is 0 on first render, so no hydration mismatch
  const progress = Math.min(1, y / Math.max(1, max));
  const show = y > 400;

  const goTop = () => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" });
  };

  return (
    <button onClick={goTop} aria-label="Back to top" tabIndex={show ? 0 : -1}
      className={`group fixed bottom-6 right-6 z-40 grid size-12 place-items-center rounded-full border border-line bg-raised text-umber shadow-lg transition duration-500 ease-out hover:scale-105 dark:text-sand ${
        show ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-6 scale-75 opacity-0"}`}>
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48" aria-hidden>
        <circle cx="24" cy="24" r={R} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - progress)} />
      </svg>
      <ArrowUp size={18} className="group-hover:animate-[bob_900ms_ease-in-out_infinite]" />
    </button>
  );
}
