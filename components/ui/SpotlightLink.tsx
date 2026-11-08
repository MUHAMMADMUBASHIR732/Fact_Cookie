// Link-button whose surface is lit by the cursor. "solid" = accent fill, "ghost" = outline.
"use client";
import Link from "next/link";
import { useSpotlight } from "@/hooks/useSpotlight";

const looks = {
  solid: "bg-umber text-white hover:brightness-110 [--spot:color-mix(in_srgb,white_25%,transparent)]",
  ghost: "border border-line hover:bg-surface",
};

export function SpotlightLink({ href, variant = "solid", children }: {
  href: string; variant?: keyof typeof looks; children: React.ReactNode;
}) {
  const ref = useSpotlight<HTMLAnchorElement>();
  return (
    <Link ref={ref} href={href}
      className={`spot rounded-full px-6 py-3 text-[0.95rem] font-medium transition-transform duration-300 ease-out active:scale-[.97] ${looks[variant]}`}>
      {children}
    </Link>
  );
}
