// /reset-password?token=...: set a new password.
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { btn, inputCls } from "@/components/ui/kit";
import { confirmPasswordReset } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export default function Reset() {
  const router = useRouter();
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState("");
  const [expired, setExpired] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => setToken(new URLSearchParams(window.location.search).get("token")), []);

  async function submit(e: FormEvent) {
    e.preventDefault(); setErr("");
    if (pw.length < 8) return setErr("Use at least 8 characters.");
    if (pw !== pw2) return setErr("Passwords do not match.");
    setBusy(true);
    try { await confirmPasswordReset(token!, pw); router.replace("/login?reset=1"); }
    catch (x) { if (x instanceof ApiError && (x.code === "invalid_reset_token" || x.status === 401)) setExpired(true); else setErr(x instanceof ApiError ? x.message : "Something went wrong."); }
    setBusy(false);
  }
  if (token === undefined) return null;
  return (
    <AuthCard title="Set a new password">
      {!token || expired ? (
        <p role="alert" className="text-sm">This reset link is invalid or has expired. <Link href="/forgot-password" className="font-medium underline underline-offset-4">Request a new one</Link>.</p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div><label htmlFor="pw" className="text-sm font-medium">New password</label><input id="pw" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} className={`${inputCls} mt-1.5`} /></div>
          <div><label htmlFor="pw2" className="text-sm font-medium">Confirm password</label><input id="pw2" type="password" autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} className={`${inputCls} mt-1.5`} /></div>
          {err && <p role="alert" className="text-sm text-contradicted">{err}</p>}
          <button disabled={busy} className={`${btn} w-full`}>{busy ? "Saving..." : "Reset password"}</button>
        </form>
      )}
    </AuthCard>
  );
}
