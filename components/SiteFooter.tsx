// Footer: brand + blurb, two link columns, and a small-print row. A travelling line runs along the top.
import Link from "next/link";
import { Brand } from "@/components/Brand";

const columns = [
  ["Product", [["How it works", "/#how"], ["Developers", "/#developers"], ["Principles", "/#principles"], ["Pricing", "/pricing"]]],
  ["Resources", [["Docs", "/docs"], ["Connect your agent", "/connect"], ["Playground", "/try"]]],
  ["Account", [["Log in", "/login"], ["Create account", "/signup"]]],
] as const;

export function SiteFooter() {
  return (
    <footer>
      <span className="flow mx-auto max-w-6xl" aria-hidden />
      <div className="scrub mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Brand />
            <p className="mt-5 max-w-xs leading-relaxed text-muted">
              Check every AI answer against real sources. See the evidence, get the corrected answer.
            </p>
          </div>
          {columns.map(([title, links]) => (
            <nav key={title} aria-label={title}>
              <h3 className="font-semibold">{title}</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {links.map(([label, href]) => (
                  <li key={href}><Link href={href} className="navlink">{label}</Link></li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Fact Cookie. Verify. Discover. Trust.</p>
          <p>A claim with no reliable source is marked Unverifiable, never guessed.</p>
        </div>
      </div>
    </footer>
  );
}
