// Result of one verification: summary strip, corrected text, filterable claim list. Used by /verify and the detail page.
"use client";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { ClaimCard } from "@/components/app/ClaimCard";
import { VerdictBadge } from "@/components/ui/VerdictBadge";
import type { Verdict, Verification } from "@/lib/api/types";

export const verdicts: Verdict[] = ["supported", "contradicted", "outdated", "unverifiable"];

export function verdictCounts(claims: Verification["claims"]) {
  return verdicts.map((v) => [v, claims.filter((c) => c.verdict === v).length] as const).filter(([, n]) => n > 0);
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button onClick={async () => { try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); } catch { /* blocked */ } }}
      className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text">
      {done ? <Check size={13} /> : <Copy size={13} />} {done ? "Copied" : label}
    </button>
  );
}

export function VerifyResult({ v }: { v: Verification }) {
  const [filter, setFilter] = useState<Verdict | "all">("all");
  const counts = verdictCounts(v.claims);
  const shown = filter === "all" ? v.claims : v.claims.filter((c) => c.verdict === filter);
  const duration = v.started_at && v.completed_at ? Math.max(0, Math.round((+new Date(v.completed_at) - +new Date(v.started_at)) / 1000)) : null;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <h2 className="text-xl font-semibold">{v.claims.length} {v.claims.length === 1 ? "claim" : "claims"} checked</h2>
        {counts.map(([verdict, n]) => <span key={verdict} className="inline-flex items-center gap-2 text-sm"><VerdictBadge verdict={verdict} /> × {n}</span>)}
      </div>
      <p className="mt-2 text-xs text-muted">
        {duration !== null && `Took ${duration}s. `}
        {v.tavily_search_count !== undefined && `${v.tavily_search_count} searches, ${v.tavily_extract_count ?? 0} page reads. `}
        Verdicts are evidence-assisted, not proof; confidence is not a guarantee.
      </p>

      {v.corrected_text && (
        <div className="mt-6 rounded-2xl bg-surface p-5">
          <div className="flex items-center justify-between"><p className="text-sm font-medium text-supported">Corrected answer</p><CopyButton text={v.corrected_text} /></div>
          <p className="mt-2 whitespace-pre-line leading-relaxed">{v.corrected_text}</p>
        </div>
      )}

      {v.claims.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-line bg-surface p-5 text-sm text-muted">
          No checkable claims were found. Try text with numbers, dates, names, quotes or citations.
        </p>
      ) : (
        <>
          <div role="group" aria-label="Filter claims" className="mt-6 flex flex-wrap gap-2 text-sm">
            {(["all", ...verdicts] as const).map((f) => (
              <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}
                className={`min-h-9 rounded-full border px-3.5 capitalize transition ${filter === f ? "border-umber bg-umber text-on-umber" : "border-line text-muted hover:text-text"}`}>
                {f}{f !== "all" && ` (${v.claims.filter((c) => c.verdict === f).length})`}
              </button>
            ))}
          </div>
          <ul className="mt-4 space-y-4">{shown.map((c, i) => <ClaimCard key={c.id} claim={c} index={i} />)}</ul>
        </>
      )}
    </div>
  );
}
