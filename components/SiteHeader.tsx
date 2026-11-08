// Centered floating header. Drops in on load, gains a surface when scrolled, mobile menu opens with the animated burger.
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Brand } from "@/components/Brand";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useScrollY } from "@/hooks/useScrollY";

const links = [["How it works", "#how"], ["Problems", "#problems"], ["Log in", "/login"]];
const lifted = "border-line bg-raised shadow-[0_10px_30px_-14px_color-mix(in_srgb,var(--ink)_40%,transparent)]";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrollY() > 20;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="drop sticky top-0 z-40 px-4 pt-3">
      <div className={`mx-auto max-w-4xl rounded-3xl border transition-all duration-500 ${scrolled || open ? lifted : "border-transparent"}`}>
        <div className="flex h-14 items-center justify-between gap-4 px-4">
          <Brand size={32} />
          <nav className="hidden items-center gap-7 text-sm md:flex" aria-label="Main">
            {links.map(([label, href]) => <Link key={href} href={href} className="navlink">{label}</Link>)}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/signup" className="hidden rounded-full bg-umber px-4 py-2 text-sm font-medium text-white transition hover:brightness-110 md:inline-flex">
              Create account
            </Link>
            <button className="burger md:hidden" aria-expanded={open} aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
              <span /><span /><span />
            </button>
          </div>
        </div>

        <div id="mobile-menu" className={`grid transition-[grid-template-rows] duration-300 ease-out md:hidden ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <ul className="flex flex-col items-center gap-1 overflow-hidden px-4 text-center">
            {[...links, ["Create account", "/signup"]].map(([label, href], i) => (
              <li key={href} className={`w-full transition duration-300 ${open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
                style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}>
                <Link href={href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}
                  className="block rounded-xl py-3 font-medium transition hover:bg-surface">{label}</Link>
              </li>
            ))}
            <li className="h-3" aria-hidden />
          </ul>
        </div>
      </div>
    </header>
  );
}
