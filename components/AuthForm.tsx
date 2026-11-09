// Sign-up / log-in screen: info panel, back button, form card with icons, strength bar and Google option.
"use client";
import { ArrowLeft, ArrowRight, Lock, Mail, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type CSSProperties, type FormEvent } from "react";
import { AuthField } from "@/components/auth/AuthField";
import { Brand } from "@/components/Brand";
import { GoogleIcon } from "@/components/GoogleIcon";
import { PasswordRules } from "@/components/PasswordRules";
import { SideNote } from "@/components/SideNote";
import { VerdictBadge } from "@/components/ui/VerdictBadge";
import { login, loginWithGoogle, signup, type AuthResult } from "@/lib/api/auth";
import { passwordIsStrong } from "@/lib/utils/password";

const sideLine = "Check every AI answer against a real source, so a stale fact never slips through.";
const verdicts = ["supported", "outdated", "contradicted", "unverifiable"] as const;
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<Extract<AuthResult, { ok: false }> | null>(null);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [doneText, setDoneText] = useState("");

  function handle(result: AuthResult, success: string) {
    setBusy(false);
    if (result.ok) { setDoneText(success); return router.push("/try"); }
    setNotice(result);
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
    handle(await (isSignup ? signup(email, password, String(data.get("name"))) : login(email, password)), isSignup ? "Account created." : "Logged in.");
  }

  async function google() {
    setBusy(true);
    handle(await loginWithGoogle(), "Signed in with Google.");
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <SideNote side="left">{sideLine}</SideNote>
      <SideNote side="right">{sideLine}</SideNote>

      <aside className="hidden flex-col justify-between bg-surface p-12 lg:flex">
        <Brand />
        <div>
          <Image src="/logo-mark.png" alt="" width={144} height={144} className="float rounded-[28%] border border-line" />
          <p className="mt-8 font-display text-4xl font-semibold leading-tight tracking-tight">Verify. Discover. Trust.</p>
          <p className="mt-3 max-w-sm text-muted">Every claim in an AI answer, checked against a real source.</p>
          <div className="mt-6 flex flex-wrap gap-2">{verdicts.map((v) => <VerdictBadge key={v} verdict={v} />)}</div>
        </div>
        <p className="text-sm text-muted">Unverifiable claims are flagged, never guessed.</p>
      </aside>

      <div className="relative grid place-items-center px-6 py-12">
        <span aria-hidden className="vline hidden md:block" style={{ left: "calc(50% - 15rem)" }} />
        <span aria-hidden className="vline hidden md:block" style={{ left: "calc(50% + 15rem)", "--d": "-1.7s" } as CSSProperties} />
        <div className="w-full max-w-sm">
          <Link href="/" className="group mb-6 inline-flex items-center gap-2 text-sm text-muted transition hover:text-text">
            <ArrowLeft size={16} aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1" /> Back to home
          </Link>

          <div className="rise rounded-3xl border border-line bg-raised p-7 shadow-[0_30px_60px_-30px_color-mix(in_srgb,var(--umber)_45%,transparent)]">
            <div className="mb-6 lg:hidden"><Brand /></div>
            <h1 className="rise text-2xl font-semibold tracking-tight" style={delay(80)}>{isSignup ? "Create your account" : "Welcome back"}</h1>
            <p className="rise mt-1 text-sm text-muted" style={delay(140)}>{isSignup ? "Start checking AI answers in a minute." : "Log in to see your checks."}</p>

            {doneText ? (
              <p role="status" className="mt-8 rounded-xl bg-surface p-4 text-sm">{doneText} Taking you to the verifier...</p>
            ) : (
              <>
                <button type="button" onClick={google} disabled={busy} style={delay(200)}
                  className="rise mt-7 flex w-full items-center justify-center gap-3 rounded-full border border-line bg-bg py-3 text-[0.95rem] font-medium transition hover:border-umber hover:shadow-md disabled:opacity-60">
                  <GoogleIcon /> Continue with Google
                </button>
                <p className="my-5 flex items-center gap-3 text-xs text-muted before:h-px before:flex-1 before:bg-[var(--line)] after:h-px after:flex-1 after:bg-[var(--line)]">or use your email</p>

                <form onSubmit={submit} noValidate className="space-y-4">
                  {isSignup && <AuthField name="name" label="Name" icon={User} autoComplete="name" error={errors.name} delay={240} />}
                  <AuthField name="email" label="Email" icon={Mail} type="email" autoComplete="email" error={errors.email} delay={300} />
                  <AuthField name="password" label="Password" icon={Lock} type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    autoComplete={isSignup ? "new-password" : "current-password"} error={errors.password} delay={360} />
                  {isSignup && <PasswordRules value={password} />}

                  {notice && (
                    <p role="alert" className="rounded-xl border border-contradicted bg-surface p-3 text-sm">
                      {notice.reason === "exists" && "An account with this email already exists. "}
                      {notice.reason === "invalid-credentials" && "Incorrect email or password. "}
                      {notice.reason === "other" && notice.message}
                      {notice.reason !== "other" && (
                        <Link href={notice.reason === "exists" ? "/login" : "/signup"} className="font-medium underline underline-offset-4">
                          {notice.reason === "exists" ? "Log in instead" : "New here? Create an account"}
                        </Link>
                      )}
                    </p>
                  )}
                  <button disabled={busy} style={delay(420)}
                    className="rise group flex w-full items-center justify-center gap-2 rounded-full bg-umber py-3.5 font-medium text-white transition hover:brightness-110 hover:shadow-lg disabled:opacity-60">
                    {busy ? "Please wait..." : isSignup ? "Create account" : "Log in"}
                    {!busy && <ArrowRight size={17} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />}
                  </button>
                </form>
              </>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-muted">
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
