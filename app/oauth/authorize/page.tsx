// /oauth/authorize: public consent screen for Claude / MCP clients (FRONTEND_INTEGRATION.md §7.15.1).
// Never shows or logs the OAuth code, tokens or code_challenge. Navigates only to the redirect_url the backend returns.
"use client";
import { Lock, Mail } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Skeleton, btn, btn2, inputCls } from "@/components/ui/kit";
import { getMe } from "@/lib/api/account";
import { login, logout } from "@/lib/api/auth";
import { ApiError, hasToken } from "@/lib/api/client";
import { getOAuthContext, submitConsent } from "@/lib/api/oauth";
import type { OAuthContext, OAuthParams, User } from "@/lib/api/types";

const permissionText: Record<string, string[]> = {
  "factcookie:verify": ["Verify text and claims.", "Read your verification history and usage.", "Use your verification quota."],
};

function readParams(): OAuthParams | null {
  const q = new URLSearchParams(window.location.search);
  const client_id = q.get("client_id"), redirect_uri = q.get("redirect_uri");
  if (!client_id || !redirect_uri) return null;
  const opt = <K extends keyof OAuthParams>(k: K) => (q.get(k) ?? undefined) as OAuthParams[K];
  return {
    client_id, redirect_uri, response_type: (q.get("response_type") ?? "code") as "code", scope: opt("scope"), state: opt("state"),
    code_challenge: opt("code_challenge"), code_challenge_method: opt("code_challenge_method"), resource: opt("resource"),
  };
}

export default function OAuthAuthorize() {
  const [params, setParams] = useState<OAuthParams | null | undefined>(undefined);
  const [ctx, setCtx] = useState<OAuthContext | null>(null);
  const [ctxError, setCtxError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [checkedUser, setCheckedUser] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const loadUser = useCallback(async () => {
    if (!hasToken()) { setUser(null); setCheckedUser(true); return; }
    try { setUser(await getMe()); } catch { setUser(null); }
    setCheckedUser(true);
  }, []);

  useEffect(() => {
    const p = readParams();
    setParams(p);
    if (!p) return;
    getOAuthContext(p).then(setCtx).catch((e) => {
      const m = e instanceof ApiError ? e.message : "";
      setCtxError(/redirect/i.test(m) ? "The redirect URL is not registered for this client." : /response/i.test(m) ? "This client requested an unsupported response type." : "This connection request is not valid.");
    });
    loadUser();
  }, [loadUser]);

  async function signIn(e: FormEvent) {
    e.preventDefault(); setError(""); setBusy(true);
    const r = await login(email.trim(), password);
    setPassword("");
    if (r.ok) await loadUser();
    else setError(r.reason === "invalid-credentials" ? "Invalid email or password." : r.message ?? "Could not sign in.");
    setBusy(false);
  }

  async function decide(decision: "allow" | "deny") {
    if (!params) return;
    setError(""); setBusy(true);
    try {
      const { redirect_url } = await submitConsent(params, decision);
      window.location.assign(redirect_url);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) { setUser(null); setError("Your session expired. Please sign in again."); }
      else setError(e instanceof ApiError ? e.message : "Could not complete connection.");
      setBusy(false);
    }
  }

  if (params === undefined) return null;
  if (params === null || ctxError) {
    return <AuthCard title="Connect to Claude"><p role="alert" className="rounded-xl border border-contradicted bg-surface p-4 text-sm">{ctxError || "This connection request is not valid."}</p></AuthCard>;
  }
  if (!ctx || !checkedUser) return <AuthCard title="Connect to Claude" text="Checking connection..."><Skeleton className="h-32" /></AuthCard>;

  const scopes = ctx.scopes.length ? ctx.scopes : ctx.scope ? ctx.scope.split(" ") : [];
  const perms = scopes.flatMap((s) => permissionText[s] ?? [`Access: ${s}`]);
  return (
    <AuthCard wide title={`${ctx.client_name} wants to connect`} text="Connect it to your Fact Cookie account. You can remove access at any time from the client or by revoking the connection.">
      <p className="mb-4 text-xs text-muted">Verified OAuth client: <strong className="text-text">{ctx.client_name}</strong></p>
      <ul className="mb-6 list-disc space-y-1 pl-5 text-sm">{perms.map((p) => <li key={p}>{p}</li>)}</ul>

      {error && <p role="alert" className="mb-4 rounded-xl border border-contradicted bg-surface p-3 text-sm">{error}</p>}

      {!user ? (
        <form onSubmit={signIn} className="space-y-4">
          <div className="relative"><Mail size={16} aria-hidden className="absolute left-3.5 top-[2.35rem] text-muted" /><label htmlFor="oe" className="text-sm font-medium">Email</label>
            <input id="oe" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputCls} mt-1.5 pl-10`} /></div>
          <div className="relative"><Lock size={16} aria-hidden className="absolute left-3.5 top-[2.35rem] text-muted" /><label htmlFor="op" className="text-sm font-medium">Password</label>
            <input id="op" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputCls} mt-1.5 pl-10`} /></div>
          <button disabled={busy} className={`${btn} w-full`}>{busy ? "Signing in..." : "Continue"}</button>
        </form>
      ) : (
        <div>
          <div className="flex items-center gap-3 rounded-xl bg-surface p-3 text-sm">
            <span aria-hidden className="grid size-9 place-items-center rounded-full bg-umber font-medium text-on-umber">{(user.name || user.email)[0]?.toUpperCase()}</span>
            <div className="min-w-0"><p className="truncate font-medium">{user.name || user.email}</p>{user.name && <p className="truncate text-xs text-muted">{user.email}</p>}</div>
          </div>
          <button type="button" onClick={async () => { await logout(); setUser(null); }} className="mt-2 text-xs text-muted underline underline-offset-4">Not you? Use another account</button>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
            <button onClick={() => decide("allow")} disabled={busy} className={`${btn} flex-1`}>{busy ? "Connecting..." : "Allow connection"}</button>
            <button onClick={() => decide("deny")} disabled={busy} className={`${btn2} flex-1`}>Deny</button>
          </div>
        </div>
      )}
    </AuthCard>
  );
}
