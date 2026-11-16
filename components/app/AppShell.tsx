// Signed-in frame: sidebar on desktop, top bar with scrolling nav on mobile, usage pill, log out, auth guard.
"use client";
import { CircleHelp, CreditCard, FileText, History, LayoutDashboard, LogOut, PieChart, Plug, Settings, ShieldCheck, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Brand } from "@/components/Brand";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { UsageMeter } from "@/components/ui/kit";
import { getUsage } from "@/lib/api/account";
import { logout } from "@/lib/api/auth";
import { hasToken } from "@/lib/api/client";
import type { Usage } from "@/lib/api/types";

const nav = [
  ["Overview", "/dashboard", LayoutDashboard],
  ["Try it", "/verify", ShieldCheck],
  ["Verification history", "/verifications", History],
  ["Insights", "/insights", PieChart],
  ["Documents", "/documents", FileText],
  ["Preferences", "/preferences", SlidersHorizontal],
  ["API & connector", "/connectors", Plug],
  ["Billing & plans", "/usage", CreditCard],
  ["Account settings", "/settings", Settings],
  ["Help", "/help", CircleHelp],
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [usage, setUsage] = useState<Usage | null>(null);

  useEffect(() => {
    if (!hasToken()) { router.replace(`/login?next=${encodeURIComponent(pathname)}`); return; }
    getUsage<Usage>().then(setUsage).catch(() => {});
  }, [router, pathname]);

  const links = nav.map(([label, href, Icon]) => {
    const active = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link key={href} href={href} aria-current={active ? "page" : undefined}
        className={`flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-umber text-on-umber" : "text-muted hover:bg-surface hover:text-text"}`}>
        <Icon size={17} aria-hidden /> {label}
      </Link>
    );
  });

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="hidden border-r border-line bg-surface lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:p-5">
        <Brand size={32} />
        <nav className="mt-8 flex flex-col gap-1" aria-label="App">{links}</nav>
        <div className="mt-auto space-y-3 text-sm">
          {usage && (
            <div className="rounded-xl border border-line bg-bg p-3">
              <div className="flex items-center justify-between gap-2"><span className="font-medium">{usage.plan_name}</span><span className="text-xs text-muted">{usage.claims_used} / {usage.claims_limit ?? "∞"} claims</span></div>
              <UsageMeter used={usage.claims_used} limit={usage.claims_limit} />
              <Link href="/usage" className="mt-1 inline-block text-xs text-umber underline underline-offset-4">Upgrade plan</Link>
            </div>
          )}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={async () => { await logout(); router.replace("/login"); }} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line py-2 text-muted transition hover:text-text"><LogOut size={15} aria-hidden /> Log out</button>
          </div>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="flex items-center gap-3 border-b border-line px-4 py-3 lg:hidden">
          <Brand size={28} />
          <nav className="ml-auto flex gap-1 overflow-x-auto" aria-label="App">{links}</nav>
          <ThemeToggle />
        </header>
        <main className="mx-auto max-w-5xl p-5 sm:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
