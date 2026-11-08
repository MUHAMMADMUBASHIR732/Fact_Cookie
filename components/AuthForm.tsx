// Sign-up / log-in form: inline validation, wrong-email and wrong-password messages, Google option.
"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties, type FormEvent } from "react";
import { Brand } from "@/components/Brand";
import { GoogleIcon } from "@/components/GoogleIcon";
import { PasswordRules } from "@/components/PasswordRules";
import { SideNote } from "@/components/SideNote";
import { login, loginWithGoogle, signup, type AuthResult } from "@/lib/api/auth";
import { passwordIsStrong } from "@/lib/utils/password";

const sideLine = "Check every AI answer against a real source.";
const field = "mt-1.5 w-full rounded-xl border border-line bg-raised px-4 py-3 text-[0.95rem] font-normal outline-none transition focus:border-umber";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<"no-account" | "exists" | null>(null);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [doneText, setDoneText] = useState("");

  function handle(result: AuthResult, success: string) {
    setBusy(false);
    if (result.ok) return setDoneText(success);
    if (result.reason === "wrong-password") return setErrors({ password: "Incorrect password. Try again." });
    setNotice(result.reason);
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email")).trim();
    const next: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (isSignup && !passwordIsStrong(password)) next.password = "Your password doesn't meet all the requirements.";
    if (!isSignup && !password) next.password = "Enter your password.";
    if (isSignup && !String(data.get("name")).trim()) next.name = "Enter your name.";
    setErrors(next);
    setNotice(null);
    if (Object.keys(next).length) return;
    setBusy(true);
    handle(await (isSignup ? signup(email, password) : login(email, password)), isSignup ? "Account created (demo)." : "Logged in (demo).");
  }

  async function google() {
    setBusy(true);
    handle(await loginWithGoogle(), "Signed in with Google (demo).");
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <SideNote side="left">{sideLine}</SideNote>
      <SideNote side="right">{sideLine}</SideNote>
      <aside className="hidden flex-col justify-between bg-surface p-12 lg:flex">
        <Brand />
        <div>
          <Image src="/logo-mark.png" alt="" width={144} height={144} className="rounded-[28%] border border-line" />
          <p className="mt-8 font-display text-4xl font-semibold leading-tight tracking-tight">Verify. Discover. Trust.</p>
          <p className="mt-3 max-w-sm text-muted">Every claim in an AI answer, checked against a real source.</p>
        </div>
        <p className="text-sm text-muted">Unverifiable claims are flagged, never guessed.</p>
      </aside>

      <div className="relative grid place-items-center px-6 py-12">
        <span aria-hidden className="vline hidden md:block" style={{ left: "calc(50% - 15rem)" }} />
        <span aria-hidden className="vline hidden md:block" style={{ left: "calc(50% + 15rem)", "--d": "-1.7s" } as CSSProperties} />
        <div className="w-full max-w-sm">
          <div className="lg:hidden"><Brand /></div>
          <h1 className="mt-10 text-2xl font-semibold tracking-tight lg:mt-0">{isSignup ? "Create your account" : "Welcome back"}</h1>
          <p className="mt-1 text-sm text-muted">{isSignup ? "Free plan, no card needed." : "Log in to see your checks."}</p>

          {doneText ? (
            <p role="status" className="mt-8 rounded-xl bg-surface p-4 text-sm">{doneText} The backend will take over from here.</p>
          ) : (
            <>
              <button type="button" onClick={google} disabled={busy}
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-full border border-line bg-raised py-3 text-[0.95rem] font-medium transition hover:border-umber disabled:opacity-60">
                <GoogleIcon /> Continue with Google
              </button>
              <p className="my-5 flex items-center gap-3 text-xs text-muted before:h-px before:flex-1 before:bg-[var(--line)] after:h-px after:flex-1 after:bg-[var(--line)]">or use your email</p>

              <form onSubmit={submit} noValidate className="space-y-4">
                {isSignup && (
                  <label className="block text-sm font-medium">Name
                    <input name="name" autoComplete="name" aria-invalid={!!errors.name} className={field} />
                    {errors.name && <Error text={errors.name} />}
                  </label>
                )}
                <label className="block text-sm font-medium">Email
                  <input name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} className={field} />
                  {errors.email && <Error text={errors.email} />}
                </label>
                <label className="block text-sm font-medium">Password
                  <input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    autoComplete={isSignup ? "new-password" : "current-password"} aria-invalid={!!errors.password} className={field} />
                  {errors.password && <Error text={errors.password} />}
                </label>
                {isSignup && <PasswordRules value={password} />}

                {notice && (
                  <p role="alert" className="rounded-xl border border-contradicted bg-surface p-3 text-sm">
                    {notice === "no-account" ? "We couldn't find an account with this email. " : "An account with this email already exists. "}
                    <Link href={notice === "no-account" ? "/signup" : "/login"} className="font-medium underline underline-offset-4">
                      {notice === "no-account" ? "Create an account" : "Log in instead"}
                    </Link>
                  </p>
                )}
                <button disabled={busy} className="w-full rounded-full bg-umber py-3 font-medium text-white transition hover:brightness-110 disabled:opacity-60">
                  {busy ? "Please wait..." : isSignup ? "Create account" : "Log in"}
                </button>
              </form>
            </>
          )}
          <p className="mt-6 text-sm text-muted">
            {isSignup ? "Already have an account? " : "New here? "}
            <Link href={isSignup ? "/login" : "/signup"} className="font-medium text-text underline underline-offset-4">
              {isSignup ? "Log in" : "Create an account"}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

function Error({ text }: { text: string }) {
  return <span role="alert" className="mt-1 block text-xs font-normal text-contradicted">{text}</span>;
}
