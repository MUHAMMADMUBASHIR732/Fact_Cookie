// /documents: upload and manage files that are searched automatically during verification.
"use client";
import { Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/app/Toast";
import { btn2, Card, ConfirmDialog, EmptyState, ErrorPanel, PageHeader, Skeleton } from "@/components/ui/kit";
import { useAsync } from "@/hooks/useAsync";
import { deleteDocument, listDocuments, uploadDocument } from "@/lib/api/account";
import type { DocumentItem } from "@/lib/api/types";
import { bytes, describeError, relativeTime } from "@/lib/format";

const MAX = 10 * 1024 * 1024;
const OK_EXT = /\.(pdf|txt|md|markdown)$/i;

export default function Documents() {
  const toast = useToast();
  const { data, error, reload } = useAsync(listDocuments);
  const [uploading, setUploading] = useState<string[]>([]);
  const [drag, setDrag] = useState(false);
  const [del, setDel] = useState<DocumentItem | null>(null);
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const processing = data?.some((d) => d.status === "processing");
  useEffect(() => { if (!processing) return; const t = setInterval(reload, 3000); return () => clearInterval(t); }, [processing, reload]);

  async function upload(files: FileList | File[]) {
    for (const file of Array.from(files)) {
      if (!OK_EXT.test(file.name)) { toast(`${file.name}: unsupported type. Use .pdf, .txt, .md or .markdown.`, "error"); continue; }
      if (file.size > MAX) { toast(`${file.name}: larger than 10 MB.`, "error"); continue; }
      setUploading((l) => [...l, file.name]);
      try { await uploadDocument(file); toast(`${file.name} uploaded.`, "success"); }
      catch (e) { toast(`${file.name}: ${describeError(e).message}`, "error"); }
      setUploading((l) => l.filter((n) => n !== file.name));
      reload();
    }
  }
  async function remove() {
    if (!del) return;
    setBusy(true);
    try { await deleteDocument(del.id); toast("Document deleted.", "success"); reload(); }
    catch (e) { toast(describeError(e).message, "error"); }
    setBusy(false); setDel(null);
  }

  return (
    <>
      <PageHeader title="Documents" text="Documents are searched automatically during verification. Treat them as private data: only you can see them." />

      <div onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); upload(e.dataTransfer.files); }}
        className={`rounded-2xl border-2 border-dashed p-10 text-center transition ${drag ? "border-umber bg-surface" : "border-line"}`}>
        <Upload size={24} aria-hidden className="mx-auto text-muted" />
        <p className="mt-3 font-medium">Drag and drop files here</p>
        <p className="mt-1 text-sm text-muted">.pdf, .txt, .md, .markdown · up to 10 MB each</p>
        <button onClick={() => input.current?.click()} className={`${btn2} mt-4`}>Browse files</button>
        <input ref={input} type="file" multiple accept=".pdf,.txt,.md,.markdown" className="sr-only" aria-label="Choose files"
          onChange={(e) => { if (e.target.files) upload(e.target.files); e.target.value = ""; }} />
      </div>
      {uploading.length > 0 && <ul aria-live="polite" className="mt-3 space-y-1 text-sm text-muted">{uploading.map((n) => <li key={n}>Uploading {n}...</li>)}</ul>}

      <div className="mt-8">
        {error && !data ? <ErrorPanel error={error} onRetry={reload} /> :
          !data ? <div className="space-y-3"><Skeleton /><Skeleton /></div> :
          data.length === 0 ? <EmptyState title="No documents" text="Upload a report or notes and they will be used as evidence." /> : (
            <ul className="space-y-3">
              {data.map((d) => (
                <li key={d.id}><Card className="!p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{d.filename}</p>
                      <p className="mt-0.5 text-xs text-muted">{d.content_type} · {bytes(d.size_bytes)} · {d.page_count} {d.page_count === 1 ? "page" : "pages"} · {relativeTime(d.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full border px-2.5 py-1 text-xs capitalize" style={{ color: d.status === "ready" ? "var(--v-supported)" : d.status === "failed" ? "var(--v-contradicted)" : "var(--v-outdated)" }}>{d.status}</span>
                      <button onClick={() => setDel(d)} aria-label={`Delete ${d.filename}`} className="grid size-9 place-items-center rounded-lg text-muted hover:text-contradicted"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  {d.status === "failed" && <p className="mt-2 text-xs text-muted">Text could not be extracted. Scanned PDFs often fail: try a text-based PDF or a .txt/.md file.</p>}
                </Card></li>
              ))}
            </ul>
          )}
      </div>
      <ConfirmDialog open={!!del} title="Delete document?" text={`${del?.filename ?? "This document"} will no longer be searched during verification.`} confirmLabel="Delete" busy={busy} onConfirm={remove} onClose={() => setDel(null)} />
    </>
  );
}
