// One verification: original text, corrected answer, every claim, export (JSON/CSV) and delete. Polls while it is still running.
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ClaimCard } from "@/components/app/ClaimCard";
import { VerdictMix, formatDate } from "@/components/app/VerdictMix";
import { ApiError } from "@/lib/api/client";
import type { Verification } from "@/lib/api/types";
import { deleteVerification, getVerification } from "@/lib/api/verifications";

function download(name: string, type: string, body: string) {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  a.click();
  URL.revokeObjectURL(url);
}
const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

export function VerificationDetail({ id }: { id: string }) {
  const router = useRouter();
  const [v, setV] = useState<Verification | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const load = () => getVerification(id).then((r) => { setV(r); if (r.status === "pending" || r.status === "running") timer = setTimeout(load, 2000); })
      .catch((e) => setError(e instanceof ApiError ? e.message : "Can't reach the server."));
    load();
    return () => clearTimeout(timer);
  }, [id]);

  async function remove() {
    if (!confirm("Delete this check? This can't be undone.")) return;
    try { await deleteVerification(id); router.replace("/verifications"); } catch (e) { setError(e instanceof ApiError ? e.message : "Couldn't delete."); }
  }
  function exportCsv(x: Verification) {
    const head = ["position", "text", "claim_type", "verdict", "confidence", "source_url", "snippet", "page_or_section"];
    const rows = x.claims.map((c) => [c.position, c.text, c.claim_type, c.verdict, c.confidence, c.source_url, c.snippet, c.page_or_section].map(cell).join(","));
    download(`verification-${x.id}.csv`, "text/csv", [head.join(","), ...rows].join("\n"));
  }

  if (error) return <p role="alert" className="rounded-xl border border-contradicted bg-surface p-4 text-sm">{error}</p>;
  if (!v) return <div className="h-40 animate-pulse rounded-3xl bg-surface" aria-busy="true" />;
  const btn = "rounded-full border border-line px-4 py-2 text-sm transition hover:border-umber";
  return (
    <div>
      <Link href="/verifications" className="text-sm text-muted hover:text-text">← History</Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div><h1 className="text-3xl font-semibold tracking-tight">Verification</h1>
          <p className="mt-1 text-sm text-muted">{v.status} · {v.claim_count} claims · {v.source_agent} · {formatDate(v.created_at)}</p></div>
        <div className="flex flex-wrap gap-2">
          <button className={btn} onClick={() => download(`verification-${v.id}.json`, "application/json", JSON.stringify(v, null, 2))}>Export JSON</button>
          <button className={btn} onClick={() => exportCsv(v)}>Export CSV</button>
          <button className={`${btn} text-contradicted`} onClick={remove}>Delete</button>
        </div>
      </div>
      <div className="mt-4"><VerdictMix v={v} /></div>
      {v.status === "failed" && <p role="alert" className="mt-6 rounded-xl border border-contradicted bg-surface p-4 text-sm">This check failed. {v.error ?? ""}</p>}
      {(v.status === "pending" || v.status === "running") && <p className="mt-6 flex items-center gap-3 text-muted"><span className="pulse-dot" aria-hidden /> Still checking. This page updates by itself.</p>}
      <section className="mt-8 rounded-3xl border border-line bg-card p-6"><h2 className="text-sm font-medium text-muted">Original text</h2><p className="mt-2 whitespace-pre-wrap leading-relaxed">{v.input_text}</p></section>
      {v.corrected_text && <section className="mt-4 rounded-3xl bg-surface p-6"><h2 className="text-sm font-medium text-supported">Corrected answer</h2><p className="mt-2 whitespace-pre-wrap leading-relaxed">{v.corrected_text}</p></section>}
      <ul className="mt-6 space-y-4">{v.claims.map((c, i) => <ClaimCard key={c.id} claim={c} index={i} />)}</ul>
    </div>
  );
}
