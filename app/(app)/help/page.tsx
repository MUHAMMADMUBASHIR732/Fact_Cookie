// /help: verdict meanings, limits, privacy, FAQ.
import Link from "next/link";
import { VerdictBadge } from "@/components/ui/VerdictBadge";
import { Card, PageHeader } from "@/components/ui/kit";
import { API_URL } from "@/lib/config";

const faqs = [
  ["Why is a claim unverifiable?", "No reliable evidence was found. Fact Cookie only gives another verdict when it has a real source and snippet, so it never invents a source."],
  ["What does confidence mean?", "It is supporting metadata about the evidence, not a guarantee. The verdict is the conclusion."],
  ["Are claims always extracted perfectly?", "No. Extraction is deterministic but not perfect: claims may be merged, split, or marked unverifiable."],
  ["What are the limits?", "Up to 20,000 characters per check. Text over 2,000 characters runs in the background. Your plan sets the monthly claim quota."],
  ["Which documents can I upload?", ".pdf, .txt, .md and .markdown, up to 10 MB. They are searched automatically during verification."],
  ["How is my data handled?", "Verifications and documents are private to your account. Text you submit is not sent to analytics."],
  ["How do I connect Claude?", "See Connectors in the sidebar."],
] as const;

export default function Help() {
  return (
    <>
      <PageHeader title="Help" text="Fact Cookie is evidence-assisted verification: it shows sources, it does not prove truth." />
      <div className="space-y-6">
        <Card>
          <h2 className="font-semibold">What each verdict means</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {([["supported", "Evidence supports this claim."], ["contradicted", "Evidence contradicts this claim."], ["outdated", "This claim appears to be out of date."], ["unverifiable", "No reliable evidence was found for this claim."]] as const)
              .map(([v, t]) => <li key={v} className="flex flex-wrap items-center gap-3"><VerdictBadge verdict={v} /><span className="text-muted">{t}</span></li>)}
          </ul>
        </Card>
        <Card><h2 className="font-semibold">Getting started</h2><p className="mt-2 text-sm text-muted">Go to <Link className="underline underline-offset-4" href="/verify">Verify</Link>, paste an AI answer, and read each claim with its source. Upload your own files in <Link className="underline underline-offset-4" href="/documents">Documents</Link> to ground checks in your material.</p></Card>
        <section aria-label="FAQ" className="space-y-3">
          {faqs.map(([q, a]) => <details key={q} className="rounded-2xl border border-line bg-card p-4 text-sm"><summary className="cursor-pointer font-medium">{q}</summary><p className="mt-2 text-muted">{a}</p></details>)}
        </section>
        <p className="text-sm text-muted">Developers: the <a className="underline underline-offset-4" href={`${API_URL}/docs`} target="_blank" rel="noopener noreferrer">API reference</a> is available when the backend runs with DEBUG on.</p>
      </div>
    </>
  );
}
