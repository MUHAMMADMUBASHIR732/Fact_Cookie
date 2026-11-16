// /insights: verdict mix, daily trend, top claims and domains (the four real insight endpoints).
"use client";
import { useState } from "react";
import { verdicts } from "@/components/app/VerifyResult";
import { VerdictBadge } from "@/components/ui/VerdictBadge";
import { Card, EmptyState, ErrorPanel, PageHeader, Skeleton } from "@/components/ui/kit";
import { useAsync } from "@/hooks/useAsync";
import { getTopClaims, getTopDomains, getTrends, getVerdictBreakdown } from "@/lib/api/account";
import { densifyTrends, domainOf } from "@/lib/format";

export default function Insights() {
  const [days, setDays] = useState(30);
  const breakdown = useAsync(getVerdictBreakdown);
  const trends = useAsync(() => getTrends(days), [days]);
  const claims = useAsync(() => getTopClaims(10));
  const domains = useAsync(() => getTopDomains(10));

  const total = verdicts.reduce((a, v) => a + (breakdown.data?.[v] ?? 0), 0);
  const perDay = densifyTrends(trends.data ?? [], days);
  const maxTrend = Math.max(1, ...perDay.map((p) => p.count));
  const empty = breakdown.data && total === 0 && perDay.every((p) => p.count === 0);

  return (
    <>
      <PageHeader title="Insights" text="Trends and aggregate evidence across your verifications." />
      {empty && <EmptyState title="Not enough data yet" text="Run a few verifications to see insights." />}

      <div className={`grid gap-6 lg:grid-cols-2 ${empty ? "mt-6" : ""}`}>
        <Card>
          <h2 className="font-semibold">Verdict breakdown</h2>
          {breakdown.error && !breakdown.data ? <div className="mt-3"><ErrorPanel error={breakdown.error} onRetry={breakdown.reload} /></div> :
            !breakdown.data ? <Skeleton className="mt-3 h-40" /> : (
              <ul className="mt-4 space-y-3">
                {verdicts.map((v) => {
                  const n = breakdown.data?.[v] ?? 0;
                  return (
                    <li key={v}>
                      <div className="flex items-center justify-between text-sm"><VerdictBadge verdict={v} /><span className="font-mono">{n}{total ? ` · ${Math.round((n / total) * 100)}%` : ""}</span></div>
                      <div aria-hidden className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface"><div className="h-full rounded-full" style={{ width: `${total ? (n / total) * 100 : 0}%`, background: `var(--v-${v})` }} /></div>
                    </li>
                  );
                })}
              </ul>
            )}
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Claims per day</h2>
            <label className="text-xs text-muted">Range <select value={days} onChange={(e) => setDays(+e.target.value)} className="ml-1 rounded-lg border border-line bg-bg px-2 py-1">
              {[7, 30, 90].map((d) => <option key={d} value={d}>{d} days</option>)}</select></label>
          </div>
          {trends.error && !trends.data ? <div className="mt-3"><ErrorPanel error={trends.error} onRetry={trends.reload} /></div> :
            !trends.data ? <Skeleton className="mt-3 h-40" /> : (
              <>
                <svg role="img" aria-label={`Bar chart of daily counts over ${days} days`} viewBox={`0 0 ${perDay.length * 10} 100`} preserveAspectRatio="none" className="mt-4 h-40 w-full">
                  {perDay.map((p, i) => <rect key={p.date} x={i * 10 + 1} width={8} y={100 - (p.count / maxTrend) * 96} height={(p.count / maxTrend) * 96 || 0.5} rx={1} fill="var(--umber)"><title>{`${p.date}: ${p.count}`}</title></rect>)}
                </svg>
                <details className="mt-2 text-xs text-muted"><summary className="cursor-pointer">View as table</summary>
                  <table className="mt-2 w-full text-left"><tbody>{trends.data.map((p) => <tr key={p.date}><td className="py-0.5">{p.date}</td><td className="text-right font-mono">{p.count}</td></tr>)}</tbody></table></details>
              </>
            )}
        </Card>

        <Card>
          <h2 className="font-semibold">Top claims</h2>
          {claims.error && !claims.data ? <div className="mt-3"><ErrorPanel error={claims.error} onRetry={claims.reload} /></div> :
            !claims.data ? <Skeleton className="mt-3 h-40" /> : claims.data.length === 0 ? <p className="mt-3 text-sm text-muted">Nothing yet.</p> : (
              <ol className="mt-3 space-y-2 text-sm">{claims.data.map((c, i) => <li key={i} className="flex justify-between gap-3"><span className="min-w-0 flex-1">{c.claim}</span><span className="font-mono text-muted">×{c.count}</span></li>)}</ol>
            )}
        </Card>

        <Card>
          <h2 className="font-semibold">Top source domains</h2>
          {domains.error && !domains.data ? <div className="mt-3"><ErrorPanel error={domains.error} onRetry={domains.reload} /></div> :
            !domains.data ? <Skeleton className="mt-3 h-40" /> : domains.data.length === 0 ? <p className="mt-3 text-sm text-muted">Nothing yet.</p> : (
              <ol className="mt-3 space-y-2 text-sm">{domains.data.map((d, i) => <li key={i} className="flex justify-between gap-3"><span className="min-w-0 flex-1 truncate">{domainOf(d.source_url)}</span><span className="font-mono text-muted">×{d.count}</span></li>)}</ol>
            )}
        </Card>
      </div>
    </>
  );
}
