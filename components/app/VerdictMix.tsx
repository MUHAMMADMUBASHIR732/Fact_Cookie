// Small row of verdict chips with counts for one verification, plus a date helper.
import { VerdictBadge } from "@/components/ui/VerdictBadge";
import type { Verdict, Verification } from "@/lib/api/types";

const order: Verdict[] = ["supported", "outdated", "contradicted", "unverifiable"];
export const formatDate = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

export function VerdictMix({ v }: { v: Verification }) {
  const counts = order.map((k) => [k, v.claims.filter((c) => c.verdict === k).length] as const).filter(([, n]) => n > 0);
  if (!counts.length) return <span className="text-xs text-muted">{v.status === "failed" ? "Failed" : "No claims yet"}</span>;
  return <div className="flex flex-wrap gap-1.5">{counts.map(([k, n]) => <span key={k} className="inline-flex items-center gap-1 text-xs"><VerdictBadge verdict={k} />{n}</span>)}</div>;
}
