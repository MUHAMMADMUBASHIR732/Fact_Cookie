"use client";
// Card with an outlined icon tile: used for the feature and problem grids. Tile fills on hover.
import type { ReactNode } from "react";
import { useSpotlight } from "@/hooks/useSpotlight";

export function IconCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  const ref = useSpotlight<HTMLDivElement>();
  return (
    <div ref={ref} className="spot scrub group [--spot:color-mix(in_srgb,var(--sand)_38%,transparent)] rounded-3xl border border-line bg-card p-7 transition-colors duration-300 hover:border-umber">
      <span className="mb-4 grid size-11 place-items-center rounded-xl border border-[color-mix(in_srgb,var(--umber)_40%,transparent)] bg-raised text-umber transition duration-300 ease-out group-hover:-translate-y-1 group-hover:-rotate-6 group-hover:bg-umber group-hover:text-white dark:text-sand dark:group-hover:bg-sand dark:group-hover:text-ink">
        {icon}
      </span>
      <h3 className="text-lg font-semibold transition-colors duration-300 group-hover:text-umber dark:group-hover:text-sand">{title}</h3>
      <p className="mt-1.5 leading-relaxed text-muted">{text}</p>
    </div>
  );
}
