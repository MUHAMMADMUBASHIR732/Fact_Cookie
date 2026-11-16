// Preferences form, shared by /preferences and the Preferences tab in /settings.
"use client";
import { useEffect, useState, type FormEvent } from "react";
import { useToast } from "@/components/app/Toast";
import { btn, Card, ErrorPanel, inputCls, Skeleton } from "@/components/ui/kit";
import { useAsync } from "@/hooks/useAsync";
import { getPreferences, savePreferences } from "@/lib/api/account";
import type { Preferences } from "@/lib/api/types";
import { describeError } from "@/lib/format";

function TagInput({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState("");
  const add = () => { const d = draft.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, ""); if (d && !value.includes(d)) onChange([...value, d]); setDraft(""); };
  return (
    <div>
      <label htmlFor={label} className="text-sm font-medium">{label}</label>
      <div className="mt-1.5 flex gap-2">
        <input id={label} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="example.com"
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} className={inputCls} />
        <button type="button" onClick={add} className={btn}>Add</button>
      </div>
      <ul className="mt-2 flex flex-wrap gap-2">
        {value.map((d) => <li key={d} className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs">{d}
          <button type="button" aria-label={`Remove ${d}`} onClick={() => onChange(value.filter((x) => x !== d))} className="text-muted hover:text-text">×</button></li>)}
      </ul>
    </div>
  );
}

export function PreferencesPanel() {
  const toast = useToast();
  const { data, error, reload } = useAsync(getPreferences);
  const [p, setP] = useState<Preferences | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (data) setP(data); }, [data]);
  if (error && !data) return <ErrorPanel error={error} onRetry={reload} />;
  if (!p) return <Skeleton className="h-64" />;
  async function save(e: FormEvent) {
    e.preventDefault(); setBusy(true);
    try { setP(await savePreferences(p!)); toast("Preferences saved.", "success"); } catch (x) { toast(describeError(x).message, "error"); }
    setBusy(false);
  }
  return (
    <Card className="max-w-xl">
      <form onSubmit={save} className="space-y-5">
        <TagInput label="Trusted domains" value={p.trusted_domains} onChange={(v) => setP({ ...p, trusted_domains: v })} />
        <TagInput label="Blocked domains" value={p.blocked_domains} onChange={(v) => setP({ ...p, blocked_domains: v })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">Strictness
            <select value={p.strictness} onChange={(e) => setP({ ...p, strictness: e.target.value as Preferences["strictness"] })} className={`${inputCls} mt-1.5`}>
              {["lenient", "standard", "strict"].map((s) => <option key={s}>{s}</option>)}</select></label>
          <label className="text-sm font-medium">Recency (days, optional)
            <input type="number" min={1} max={3650} value={p.recency_days ?? ""} onChange={(e) => setP({ ...p, recency_days: e.target.value ? Math.min(3650, Math.max(1, +e.target.value)) : null })} className={`${inputCls} mt-1.5`} placeholder="Any" /></label>
          <label className="text-sm font-medium">Citation style
            <select value={p.citation_style} onChange={(e) => setP({ ...p, citation_style: e.target.value })} className={`${inputCls} mt-1.5`}>
              {["apa", "mla", "chicago", "harvard"].map((s) => <option key={s} value={s}>{s.toUpperCase()}</option>)}</select></label>
          <label className="text-sm font-medium">Language
            <input value={p.language} onChange={(e) => setP({ ...p, language: e.target.value })} className={`${inputCls} mt-1.5`} /></label>
        </div>
        <button disabled={busy} className={btn}>{busy ? "Saving..." : "Save preferences"}</button>
      </form>
    </Card>
  );
}
