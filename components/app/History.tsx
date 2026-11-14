// History: search, verdict and status filters, paging. Server filters plus a client-side verdict fallback (per the guide).
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { VerdictMix, formatDate } from "@/components/app/VerdictMix";
import { ApiError } from "@/lib/api/client";
import type { Verdict, Verification, VerificationStatus } from "@/lib/api/types";
import { listVerifications } from "@/lib/api/verifications";

const PAGE = 20;
const select = "rounded-xl border border-line bg-raised px-3 py-2.5 text-sm outline-none focus:border-umber";

export function History() {
  const [search, setSearch] = useState("");
  const [verdict, setVerdict] = useState<Verdict | "">("");
  const [status, setStatus] = useState<VerificationStatus | "">("");
  const [offset, setOffset] = useState(0);
  const [items, setItems] = useState<Verification[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setItems(null);
    const t = setTimeout(() => {
      listVerifications({ search: search || undefined, verdict: verdict || undefined, status: status || undefined, limit: PAGE, offset })
        .then((rows) => setItems(verdict ? rows.filter((v) => v.claims.some((c) => c.verdict === verdict)) : rows))
        .catch((e) => setError(e instanceof ApiError ? e.message : "Can't reach the server."));
    }, 300);
    return () => clearTimeout(t);
  }, [search, verdict, status, offset]);

  const reset = (fn: () => void) => { fn(); setOffset(0); };
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">History</h1>
        <Link href="/verify" className="rounded-full bg-umber px-5 py-2.5 text-sm font-medium text-on-umber transition hover:brightness-110">New verification</Link>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <input value={search} onChange={(e) => reset(() => setSearch(e.target.value))} placeholder="Search your checks" aria-label="Search" className={`${select} min-w-0 flex-1 sm:flex-none sm:w-64`} />
        <select value={verdict} onChange={(e) => reset(() => setVerdict(e.target.value as Verdict | ""))} aria-label="Verdict" className={select}>
          <option value="">Any verdict</option>{["supported", "outdated", "contradicted", "unverifiable"].map((v) => <option key={v} value={v}>{v}</option>)}</select>
        <select value={status} onChange={(e) => reset(() => setStatus(e.target.value as VerificationStatus | ""))} aria-label="Status" className={select}>
          <option value="">Any status</option>{["completed", "running", "pending", "failed"].map((v) => <option key={v} value={v}>{v}</option>)}</select>
      </div>
      <div className="mt-6" aria-live="polite">
        {error && <p role="alert" className="rounded-xl border border-contradicted bg-surface p-4 text-sm">{error}</p>}
        {!error && !items && <div className="space-y-3" aria-busy="true">{[0, 1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-surface" />)}</div>}
        {items && items.length === 0 && <p className="rounded-2xl border border-line bg-card p-8 text-center text-muted">No checks found. <Link href="/verify" className="font-medium text-text underline underline-offset-4">Verify an answer</Link> to get started.</p>}
        {items && items.length > 0 && (
          <ul className="space-y-3">{items.map((v) => (
            <li key={v.id}><Link href={`/verifications/${v.id}`} className="hover-shadow block rounded-2xl border border-line bg-card p-5">
              <p className="line-clamp-2 text-sm font-medium">{v.input_text}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2"><VerdictMix v={v} />
                <span className="text-xs text-muted">{v.status} · {v.claim_count} claims · {v.source_agent} · {formatDate(v.created_at)}</span></div></Link></li>))}</ul>)}
      </div>
      <div className="mt-6 flex justify-between">
        <button disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE))} className="rounded-full border border-line px-5 py-2 text-sm disabled:opacity-40">Previous</button>
        <button disabled={!items || items.length < PAGE} onClick={() => setOffset(offset + PAGE)} className="rounded-full border border-line px-5 py-2 text-sm disabled:opacity-40">Next</button>
      </div>
    </div>
  );
}
