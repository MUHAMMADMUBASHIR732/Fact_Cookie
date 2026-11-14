// /usage: plan, quota, usage history, plans grid, upgrade and billing portal.
"use client";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "@/components/app/Session";
import { useToast } from "@/components/app/Toast";
import { btn, btn2, Card, ErrorPanel, PageHeader, Skeleton, UsageMeter } from "@/components/ui/kit";
import { useAsync } from "@/hooks/useAsync";
import { getPlans, getSubscription, getUsageHistory, openBillingPortal, startCheckout } from "@/lib/api/account";
import { describeError, fullDate, planPrice, shortDate } from "@/lib/format";

const PAGE = 20;

export default function UsagePage() {
  const toast = useToast();
  const { usage } = useSession();
  const [page, setPage] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const sub = useAsync(getSubscription);
  const plans = useAsync(getPlans);
  const history = useAsync(() => getUsageHistory(PAGE, page * PAGE), [page]);

  const u = sub.data?.usage ?? usage;
  const s = sub.data?.subscription;
  const mock = s?.provider === "mock";
  const currentId = u?.plan_id ?? s?.plan_id;

  async function go(kind: string, fn: () => Promise<{ url: string }>) {
    setBusy(kind);
    try { window.location.assign((await fn()).url); }
    catch (e) { toast(describeError(e).message, "error"); setBusy(null); }
  }

  return (
    <>
      <PageHeader title="Usage & billing" text="Your plan, claim quota and history." />
      {mock && <p className="mb-6 rounded-2xl border border-line bg-surface p-4 text-sm text-muted">Billing is running in mock mode: no real payment occurs.</p>}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Current plan</h2>
          {sub.error && !sub.data ? <div className="mt-3"><ErrorPanel error={sub.error} onRetry={sub.reload} /></div> : !u ? <Skeleton className="mt-3 h-24" /> : (
            <>
              <p className="mt-2 font-display text-3xl font-semibold">{s?.plan_name ?? u.plan_name}</p>
              <p className="mt-1 text-sm capitalize text-muted">{s?.status ?? u.status}{s?.cancel_at_period_end ? " · cancels at period end" : ""}</p>
              <p className="mt-1 text-xs text-muted">Period: {shortDate(s?.current_period_start ?? u.period_start)} to {shortDate(s?.current_period_end ?? u.period_end) || "ongoing"}</p>
              <button onClick={() => go("portal", openBillingPortal)} disabled={busy !== null} className={`${btn2} mt-4`}>{busy === "portal" ? "Opening..." : "Manage billing"}</button>
            </>
          )}
        </Card>
        <Card>
          <h2 className="font-semibold">Usage this period</h2>
          {!u ? <Skeleton className="mt-3 h-16" /> : (
            <div className="mt-4">
              <UsageMeter used={u.claims_used} limit={u.claims_limit} />
              <p className="mt-2 text-sm text-muted">{u.claims_remaining === null ? "Unlimited claims remaining." : `${u.claims_remaining.toLocaleString()} claims remaining.`}</p>
            </div>
          )}
        </Card>
      </div>

      <h2 className="mb-4 mt-10 text-xl font-semibold">Plans</h2>
      {plans.error && !plans.data ? <ErrorPanel error={plans.error} onRetry={plans.reload} /> : !plans.data ? <Skeleton className="h-48" /> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plans.data.map((p) => (
            <Card key={p.id} className="flex flex-col">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="mt-2 font-display text-2xl font-semibold">{p.id === "enterprise" ? "Custom" : planPrice(p.price_cents, p.currency)}{p.price_cents > 0 && <span className="text-sm font-normal text-muted"> / month</span>}</p>
              <p className="mt-1 flex-1 text-sm text-muted">{p.monthly_claim_limit === null ? "Unlimited claims" : `${p.monthly_claim_limit.toLocaleString()} claims / month`}</p>
              {p.id === currentId ? <span className="mt-4 text-center text-sm font-medium text-supported">Current plan</span> :
                p.id === "enterprise" ? <p className="mt-4 text-center text-sm text-muted">Contact us</p> :
                <button className={`${btn} mt-4`} disabled={busy !== null} onClick={() => go(p.id, () => startCheckout(p.id))}>{busy === p.id ? "Redirecting..." : p.price_cents === 0 ? "Switch" : "Upgrade"}</button>}
            </Card>
          ))}
        </div>
      )}

      <h2 className="mb-4 mt-10 text-xl font-semibold">Usage history</h2>
      {history.error && !history.data ? <ErrorPanel error={history.error} onRetry={history.reload} /> : !history.data ? <Skeleton className="h-32" /> :
        history.data.length === 0 ? <p className="text-sm text-muted">No usage yet.</p> : (
          <>
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-muted"><tr><th className="pb-2 font-medium">Date</th><th className="pb-2 font-medium">Verification</th><th className="pb-2 text-right font-medium">Claims</th><th className="pb-2 pl-4 font-medium">Source</th></tr></thead>
              <tbody>{history.data.map((e) => (
                <tr key={e.id} className="border-t border-line">
                  <td className="py-2.5">{fullDate(e.created_at)}</td>
                  <td className="py-2.5">{e.verification_id ? <Link href={`/verifications/${e.verification_id}`} className="underline underline-offset-4">View</Link> : "–"}</td>
                  <td className="py-2.5 text-right font-mono">{e.claim_count}</td><td className="py-2.5 pl-4">{e.source}</td>
                </tr>))}</tbody>
            </table>
            <div className="mt-4 flex items-center justify-between text-sm">
              <button className={btn2} disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
              <span className="text-muted">Page {page + 1}</span>
              <button className={btn2} disabled={history.data.length < PAGE} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          </>
        )}
    </>
  );
}
