// /onboarding: skippable first-run setup (verdicts, preferences, optional document, first verification).
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/app/Toast";
import { VerdictBadge } from "@/components/ui/VerdictBadge";
import { btn, btn2, Card, inputCls, PageHeader } from "@/components/ui/kit";
import { getPreferences, savePreferences, uploadDocument } from "@/lib/api/account";
import { describeError, setPrefill } from "@/lib/format";

const sample = "The Eiffel Tower is 330 metres tall and was completed in 1889.";

export default function Onboarding() {
  const router = useRouter();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [strictness, setStrictness] = useState<"lenient" | "standard" | "strict">("standard");
  const [busy, setBusy] = useState(false);
  const next = () => setStep((s) => s + 1);

  async function savePrefs() {
    setBusy(true);
    try { await savePreferences({ ...(await getPreferences()), strictness }); }
    catch { toast("Could not save preferences. Defaults will be used.", "error"); } // never block onboarding
    setBusy(false); next();
  }
  async function upload(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try { await uploadDocument(file); toast("Document uploaded.", "success"); next(); } catch (e) { toast(describeError(e).message, "error"); }
    setBusy(false);
  }

  return (
    <>
      <PageHeader title="Welcome to Fact Cookie" text="A minute of setup. You can skip any step." action={<Link href="/dashboard" className="text-sm text-muted underline underline-offset-4">Skip setup</Link>} />
      <p className="mb-4 text-xs text-muted" aria-live="polite">Step {step + 1} of 4</p>
      <Card className="max-w-2xl">
        {step === 0 && (
          <>
            <h2 className="text-lg font-semibold">How verdicts work</h2>
            <p className="mt-2 text-sm text-muted">Fact Cookie checks AI-written answers claim by claim and shows the evidence behind every verdict.</p>
            <div className="mt-4 flex flex-wrap gap-2">{(["supported", "contradicted", "outdated", "unverifiable"] as const).map((v) => <VerdictBadge key={v} verdict={v} />)}</div>
            <button className={`${btn} mt-6`} onClick={next}>Continue</button>
          </>
        )}
        {step === 1 && (
          <>
            <h2 className="text-lg font-semibold">How strict should checks be?</h2>
            <select aria-label="Strictness" value={strictness} onChange={(e) => setStrictness(e.target.value as typeof strictness)} className={`${inputCls} mt-3 max-w-xs`}>
              {["lenient", "standard", "strict"].map((s) => <option key={s}>{s}</option>)}</select>
            <p className="mt-2 text-xs text-muted">Trusted and blocked domains can be set later in Settings.</p>
            <div className="mt-6 flex gap-3"><button className={btn} disabled={busy} onClick={savePrefs}>Save and continue</button><button className={btn2} onClick={next}>Skip</button></div>
          </>
        )}
        {step === 2 && (
          <>
            <h2 className="text-lg font-semibold">Add a document (optional)</h2>
            <p className="mt-2 text-sm text-muted">Uploaded files are searched automatically during verification. .pdf, .txt, .md, up to 10 MB.</p>
            <input type="file" accept=".pdf,.txt,.md,.markdown" aria-label="Choose a document" disabled={busy} onChange={(e) => upload(e.target.files?.[0])} className="mt-3 text-sm" />
            <div className="mt-6"><button className={btn2} onClick={next}>Skip</button></div>
          </>
        )}
        {step === 3 && (
          <>
            <h2 className="text-lg font-semibold">Run your first verification</h2>
            <p className="mt-2 text-sm text-muted">We will prefill a sample answer on the verify page.</p>
            <blockquote className="mt-3 rounded-xl bg-surface p-3 text-sm">{sample}</blockquote>
            <div className="mt-6 flex gap-3"><button className={btn} onClick={() => { setPrefill(sample); router.push("/verify"); }}>Try the sample</button><Link href="/dashboard" className={btn2}>Go to dashboard</Link></div>
          </>
        )}
      </Card>
    </>
  );
}
