// /settings: profile, preferences, API keys, appearance.
"use client";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useSession } from "@/components/app/Session";
import { useToast } from "@/components/app/Toast";
import { CopyButton } from "@/components/app/VerifyResult";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { btn, btn2, Card, ConfirmDialog, Dialog, EmptyState, ErrorPanel, inputCls, PageHeader, Skeleton } from "@/components/ui/kit";
import { useAsync } from "@/hooks/useAsync";
import { createApiKey, getPreferences, listApiKeys, revokeApiKey, savePreferences, updateMe } from "@/lib/api/account";
import { logout } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import type { ApiKey, Preferences } from "@/lib/api/types";
import { describeError, relativeTime } from "@/lib/format";

const tabs = ["Profile", "Preferences", "API keys", "Appearance"] as const;
type Tab = (typeof tabs)[number];

export default function Settings() {
  const [tab, setTab] = useState<Tab>("Profile");
  return (
    <>
      <PageHeader title="Settings" />
      <div role="tablist" aria-label="Settings sections" className="mb-8 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
            className={`min-h-11 rounded-full border px-4 text-sm transition ${tab === t ? "border-umber bg-umber text-on-umber" : "border-line text-muted hover:text-text"}`}>{t}</button>
        ))}
      </div>
      <div role="tabpanel">
        {tab === "Profile" && <Profile />}
        {tab === "Preferences" && <Prefs />}
        {tab === "API keys" && <Keys />}
        {tab === "Appearance" && <Appearance />}
      </div>
    </>
  );
}

function Profile() {
  const { user, setUser } = useSession();
  const toast = useToast();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (user) { setName(user.name ?? ""); setEmail(user.email); } }, [user]);

  async function save(e: FormEvent) {
    e.preventDefault(); setErr(""); setBusy(true);
    try { setUser(await updateMe({ name: name.trim() || undefined, email: email.trim() })); toast("Profile saved.", "success"); }
    catch (x) { setErr(x instanceof ApiError && x.code === "email_taken" ? "That email is already in use." : describeError(x).message); }
    setBusy(false);
  }
  return (
    <Card className="max-w-lg">
      {!user ? <Skeleton className="h-40" /> : (
        <form onSubmit={save} className="space-y-4">
          <div><label htmlFor="pn" className="text-sm font-medium">Name</label><input id="pn" value={name} onChange={(e) => setName(e.target.value)} className={`${inputCls} mt-1.5`} autoComplete="name" /></div>
          <div><label htmlFor="pe" className="text-sm font-medium">Email</label><input id="pe" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputCls} mt-1.5`} autoComplete="email" aria-invalid={!!err} />
            {err && <p role="alert" className="mt-1 text-xs text-contradicted">{err}</p>}</div>
          <div className="flex flex-wrap gap-3"><button disabled={busy} className={btn}>{busy ? "Saving..." : "Save profile"}</button>
            <button type="button" className={btn2} onClick={async () => { await logout(); router.replace("/login"); }}>Log out</button></div>
          <p className="text-xs text-muted">Logging out ends this browser session only. There is no “sign out all devices” yet.</p>
        </form>
      )}
    </Card>
  );
}

function TagInput({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState("");
  const add = () => { const d = draft.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, ""); if (d && !value.includes(d)) onChange([...value, d]); setDraft(""); };
  return (
    <div>
      <label htmlFor={label} className="text-sm font-medium">{label}</label>
      <div className="mt-1.5 flex gap-2">
        <input id={label} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="example.com"
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} className={inputCls} />
        <button type="button" onClick={add} className={btn2}>Add</button>
      </div>
      <ul className="mt-2 flex flex-wrap gap-2">
        {value.map((d) => <li key={d} className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs">{d}
          <button type="button" aria-label={`Remove ${d}`} onClick={() => onChange(value.filter((x) => x !== d))} className="text-muted hover:text-text">×</button></li>)}
      </ul>
    </div>
  );
}

function Prefs() {
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

function Keys() {
  const toast = useToast();
  const { data, error, reload } = useAsync(listApiKeys);
  const [name, setName] = useState("");
  const [created, setCreated] = useState<ApiKey | null>(null);
  const [revoke, setRevoke] = useState<ApiKey | null>(null);
  const [busy, setBusy] = useState(false);

  async function create(e: FormEvent) {
    e.preventDefault(); if (!name.trim()) return; setBusy(true);
    try { setCreated(await createApiKey(name.trim())); setName(""); reload(); } catch (x) { toast(describeError(x).message, "error"); }
    setBusy(false);
  }
  async function doRevoke() {
    if (!revoke) return; setBusy(true);
    try { await revokeApiKey(revoke.id); toast("Key revoked.", "success"); reload(); } catch (x) { toast(describeError(x).message, "error"); }
    setBusy(false); setRevoke(null);
  }
  return (
    <div className="max-w-2xl space-y-6">
      <p className="text-sm text-muted">API keys are for server-to-server calls and MCP clients. Never put a key in browser code. For Claude, <Link href="/connectors" className="underline underline-offset-4">use the connector</Link>.</p>
      <Card>
        <form onSubmit={create} className="flex flex-wrap gap-3">
          <label htmlFor="kn" className="sr-only">Key name</label>
          <input id="kn" value={name} onChange={(e) => setName(e.target.value)} placeholder="Key name, e.g. Claude Desktop" className={`${inputCls} min-w-0 flex-1`} />
          <button disabled={busy || !name.trim()} className={btn}>Create key</button>
        </form>
      </Card>
      {error && !data ? <ErrorPanel error={error} onRetry={reload} /> : !data ? <Skeleton className="h-24" /> : data.length === 0 ? <EmptyState title="No API keys" /> : (
        <ul className="space-y-3">
          {data.map((k) => (
            <li key={k.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-card p-4 text-sm">
              <div className="min-w-0"><p className="font-medium">{k.name}</p>
                <p className="mt-0.5 font-mono text-xs text-muted">{k.prefix}… · created {relativeTime(k.created_at)} · {k.last_used_at ? `used ${relativeTime(k.last_used_at)}` : "never used"}</p></div>
              {k.revoked_at ? <span className="text-xs text-muted">Revoked {relativeTime(k.revoked_at)}</span> :
                <button onClick={() => setRevoke(k)} aria-label={`Revoke ${k.name}`} className="inline-flex items-center gap-1.5 text-contradicted"><Trash2 size={15} /> Revoke</button>}
            </li>
          ))}
        </ul>
      )}
      <Dialog open={!!created} onClose={() => setCreated(null)} title="Your new API key">
        <p className="rounded-xl border border-outdated bg-surface p-3 text-sm">This key is shown once. Store it securely. Anyone with this key can use your Fact Cookie quota. Revoke it immediately if it leaks.</p>
        <code className="mt-4 block break-all rounded-xl bg-bg p-3 font-mono text-sm">{created?.key}</code>
        <div className="mt-3 flex justify-between"><CopyButton text={created?.key ?? ""} label="Copy key" /><button onClick={() => setCreated(null)} className={btn}>I saved it</button></div>
      </Dialog>
      <ConfirmDialog open={!!revoke} title="Revoke this key?" text={`Anything using “${revoke?.name}” will stop working immediately.`} confirmLabel="Revoke" busy={busy} onConfirm={doRevoke} onClose={() => setRevoke(null)} />
    </div>
  );
}

function Appearance() {
  return (
    <Card className="max-w-lg">
      <div className="flex items-center justify-between"><div><p className="font-medium">Theme</p><p className="text-sm text-muted">Switch between light and dark.</p></div><ThemeToggle /></div>
      <p className="mt-4 text-sm text-muted">Your session stays signed in on this browser until you log out or it expires (refresh tokens last 30 days).</p>
    </Card>
  );
}
