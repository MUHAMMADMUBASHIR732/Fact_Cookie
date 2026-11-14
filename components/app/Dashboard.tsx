// Dashboard: usage meter, verdict breakdown, 30-day trend, recent checks (all from the backend).
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { VerdictMix, formatDate } from "@/components/app/VerdictMix";
import { VerdictBadge } from "@/components/ui/VerdictBadge";
import { getTrends, getUsage, getVerdictBreakdown } from "@/lib/api/account";
import { ApiError } from "@/lib/api/client";
import type { TrendPoint, Usage, Verdict, VerdictBreakdown, Verification } from "@/lib/api/types";
import { listVerifications } from "@/lib/api/verifications";

const verdicts: Verdict[] = ["supported", "outdated", "contradicted", "unverifiable"];
type Data = { usage: Usage; recent: Verification[]; breakdown: VerdictBreakdown; trends: TrendPoint[] };
const card = "rounded-3xl border border-line bg-card p-6";

export function Dashboard() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getUsage<Usage>(), listVerifications({ limit: 8 }), getVerdictBreakdown<VerdictBreakdown>(), getTrends<TrendPoint[]>(30)])
      .then(([usage, recent, breakdown, trends]) => setData({ usage, recent, breakdown, trends }))
      .catch((e) => setError(e instanceof ApiError ? e.message : "Can't reach the server. Is the backend running?"));
  }, []);

  if (error) return <p role="alert" className="rounded-xl border border-contradicted bg-surface p-4 text-sm">{error}</p>;
  if (!data) return <div className="space-y-4" aria-busy="true">{[0, 1, 2].map((i) => <div key={i} className="h-32 animate-pulse rounded-3xl bg-surface" />)}</div>;

  const { usage, recent, breakdown, trends } = data;
  const pct = usage.claims_limit ? Math.min(100, (usage.claims_used / usage.claims_limit) * 100) : 0;
  const total = verdicts.reduce((n, v) => n + (breakdown[v] ?? 0), 0);
  const peak = Math.max(1, ...trends.map((t) => t.count));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className={card}>
          <h2 className="font-semibold">{usage.plan_name} plan usage</h2>
          <p className="mt-3 font-display text-4xl font-semibold">{usage.claims_used}<span className="text-base font-normal text-muted"> / {usage.claims_limit ?? "unlimited"} claims</span></p>
          {usage.claims_limit && <div className="mt-4 h-2 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-umber transition-all duration-700" style={{ width: `${pct}%` }} /></div>}
        </section>
        <section className={card}>
          <h2 className="font-semibold">Verdicts</h2>
          {total === 0 ? <p className="mt-3 text-sm text-muted">Run a few checks to see your verdicts.</p> : (
            <ul className="mt-4 space-y-3">{verdicts.map((v) => (
              <li key={v} className="grid grid-cols-[9rem_1fr_2rem] items-center gap-3 text-sm"><VerdictBadge verdict={v} />
                <div className="h-2 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full" style={{ width: `${((breakdown[v] ?? 0) / total) * 100}%`, background: `var(--v-${v})` }} /></div>
                <span className="text-right text-muted">{breakdown[v] ?? 0}</span></li>))}</ul>)}
        </section>
      </div>
      <section className={card}>
        <h2 className="font-semibold">Checks per day, last 30 days</h2>
        {trends.length === 0 ? <p className="mt-3 text-sm text-muted">Nothing yet.</p> : (
          <div className="mt-5 flex h-28 items-end gap-1" role="img" aria-label="Checks per day">
            {trends.map((t) => <div key={t.date} title={`${t.date}: ${t.count}`} className="flex-1 rounded-t bg-umber" style={{ height: `${(t.count / peak) * 100}%`, minHeight: 4 }} />)}
          </div>)}
      </section>
      <section className={card}>
        <div className="flex items-center justify-between"><h2 className="font-semibold">Recent checks</h2><Link href="/verifications" className="text-sm font-medium underline underline-offset-4">View all</Link></div>
        {recent.length === 0 ? <p className="mt-3 text-sm text-muted">No checks yet. <Link href="/verify" className="font-medium underline underline-offset-4">Verify your first answer</Link>.</p> : (
          <ul className="mt-4 divide-y divide-line">{recent.map((v) => (
            <li key={v.id}><Link href={`/verifications/${v.id}`} className="block rounded-xl py-3 transition-colors hover:bg-surface sm:px-3">
              <p className="truncate text-sm font-medium">{v.input_text}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1"><VerdictMix v={v} /><span className="text-xs text-muted">{formatDate(v.created_at)}</span></div></Link></li>))}</ul>)}
      </section>
    </div>
  );
}
