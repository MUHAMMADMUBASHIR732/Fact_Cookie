// /forgot-password: always shows the same message so account existence is never revealed.
"use client";
import { useState, type FormEvent } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { btn, inputCls } from "@/components/ui/kit";
import { requestPasswordReset } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setErr("");
    try { await requestPasswordReset(email.trim()); setDone(true); }
    catch (x) { if (x instanceof ApiError && x.status === 429) setErr("Too many requests. Try again in a minute."); else setDone(true); }
    setBusy(false);
  }
  return (
    <AuthCard title="Forgot your password?" text="Enter your email and we'll send reset instructions.">
      {done ? <p role="status" className="rounded-xl bg-surface p-4 text-sm">If an account exists, we sent reset instructions.</p> : (
        <form onSubmit={submit} className="space-y-4">
          <div><label htmlFor="email" className="text-sm font-medium">Email</label><input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputCls} mt-1.5`} /></div>
          {err && <p role="alert" className="text-sm text-contradicted">{err}</p>}
          <button disabled={busy} className={`${btn} w-full`}>{busy ? "Sending..." : "Send reset instructions"}</button>
        </form>
      )}
    </AuthCard>
  );
}
