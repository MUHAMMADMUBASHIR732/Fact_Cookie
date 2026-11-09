// One checked claim: verdict, confidence, explanation, evidence snippet, source link, correction.
import type { CSSProperties } from "react";
import { VerdictBadge } from "@/components/ui/VerdictBadge";
import type { Claim } from "@/lib/api/types";

export function ClaimCard({ claim, index }: { claim: Claim; index: number }) {
  const safeUrl = claim.source_url && /^https?:\/\//.test(claim.source_url) ? claim.source_url : null;
  return (
    <li className="rise hover-shadow rounded-2xl border border-line bg-card p-5" style={{ "--d": `${index * 90}ms` } as CSSProperties}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <VerdictBadge verdict={claim.verdict} />
        <span className="text-xs text-muted">{Math.round(claim.confidence * 100)}% confident</span>
      </div>
      <p className="mt-3 font-medium">{claim.text}</p>
      {claim.explanation && <p className="mt-1.5 text-sm leading-relaxed text-muted">{claim.explanation}</p>}
      {(claim.snippet || safeUrl) && (
        <div className="mt-3 rounded-xl bg-raised p-3 text-xs">
          {claim.snippet && <p className="font-mono leading-relaxed">“{claim.snippet}”</p>}
          {claim.page_or_section && <p className="mt-1 text-muted">{claim.page_or_section}</p>}
          {safeUrl && <a href={safeUrl} target="_blank" rel="noopener noreferrer" className="mt-1.5 block truncate text-umber underline underline-offset-2 dark:text-sand">{safeUrl}</a>}
        </div>
      )}
      {claim.corrected_text && <p className="mt-3 text-sm"><span className="font-medium text-supported">Corrected: </span>{claim.corrected_text}</p>}
    </li>
  );
}
