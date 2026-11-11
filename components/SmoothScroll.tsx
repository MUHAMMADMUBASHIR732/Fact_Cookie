// Inertia scrolling for the whole page (Lenis). Skipped for visitors who prefer reduced motion.
"use client";
import Lenis from "lenis";
import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.15, anchors: true });
    let frame = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    });
    return () => { cancelAnimationFrame(frame); lenis.destroy(); };
  }, []);
  return null;
}
