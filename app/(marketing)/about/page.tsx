// /about: what Fact Cookie is and why it exists.
import { InfoPage, infoH2, infoLink, infoP } from "@/components/marketing/InfoPage";
import { Card } from "@/components/ui/kit";

export const metadata = { title: "About | Fact Cookie" };

export default function About() {
  return (
    <InfoPage title="About Fact Cookie" text="A verification layer for AI answers — built on evidence, never guesses.">
      <p className={infoP}>
        AI assistants are fast and fluent, but they sometimes give answers that cannot be trusted: figures that
        appear in no source, citations that were never written, or facts that were true once and are now out of
        date.
      </p>
      <p className={infoP}>
        Fact Cookie reads an answer, finds the claims that can be checked, looks them up in live web pages and your
        own documents, and reports whether each claim holds up — with the evidence attached. When a claim is wrong
        or outdated, it rewrites the answer using the real source.
      </p>
      <p className={infoP}>
        We never invent evidence to fill a gap. If nothing reliable is found, the claim is flagged{" "}
        <strong className="text-text">Unverifiable</strong> — never guessed.
      </p>
      <h2 className={infoH2}>What we believe</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {[
          ["Evidence over confidence", "Every verdict points at a source you can open, quote and judge yourself."],
          ["No silent guesses", "A claim with no reliable source is marked Unverifiable, never papered over."],
          ["Corrections, not lectures", "When something is wrong you get the corrected answer, rewritten from the real source."],
          ["Your data stays yours", "Documents you upload are private evidence sources. Delete them at any time."],
        ].map(([t, d]) => (
          <Card key={t}>
            <h3 className="font-semibold">{t}</h3>
            <p className="mt-1.5 text-sm text-muted">{d}</p>
          </Card>
        ))}
      </div>
      <p className={infoP}>
        Want the technical detail? Read the <a href="/docs" className={infoLink}>docs</a> or see{" "}
        <a href="/pricing" className={infoLink}>pricing</a>.
      </p>
    </InfoPage>
  );
}
