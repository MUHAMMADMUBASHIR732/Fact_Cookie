// Landing page: calm hero with a rotating verdict word, live example, steps, problems, closing call to action.
import type { CSSProperties } from "react";
import { Clock3, Hash, Quote, ScrollText } from "lucide-react";
import { ProofSheet } from "@/components/ProofSheet";
import { SpotlightLink } from "@/components/ui/SpotlightLink";
import { VerdictBadge } from "@/components/ui/VerdictBadge";

const verdictWords = ["supported", "outdated", "contradicted", "unverifiable"];
const steps = [
  ["Your AI answers", "Ask Claude, ChatGPT or opencode as you always do."],
  ["We pick out the claims", "Numbers, dates, names, quotes and citations."],
  ["We read the sources", "Live pages, plus any documents you upload."],
  ["You get verdicts and a fix", "Each claim is judged, and the answer is rewritten with real sources."],
];
const icons = [Clock3, Quote, Hash, ScrollText];
const problems = [
  ["Stale answers", "Prices, policies and office-holders change. The model's memory does not."],
  ["Invented citations", "A page number that looks right, in a report that never said it."],
  ["Unsupported numbers", "A precise figure that no real source contains."],
  ["No audit trail", "Every check is saved, so you can show where a statement came from."],
];

export default function Landing() {
  return (
    <>
      <main className="mx-auto max-w-6xl px-6">
        <section className="grid items-center gap-12 py-10 lg:grid-cols-2 lg:py-16">
          <div>
            <h1 className="text-4xl font-semibold leading-[1.15] tracking-tight sm:text-5xl">
              Find out if your AI’s answer is{" "}
              <span className="cycle" aria-label="supported, outdated, contradicted or unverifiable">
                {verdictWords.map((w, i) => (
                  <span key={w} aria-hidden style={{ "--v": `var(--v-${w})`, animationDelay: `${i * 3}s` } as CSSProperties}>{w}</span>
                ))}
              </span>.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
              Add Fact Cookie to Claude or ChatGPT. Every answer you verify comes back with a verdict for each
              claim, the exact source, and a corrected version.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <SpotlightLink href="/signup">Create free account</SpotlightLink>
              <SpotlightLink href="#how" variant="ghost">See how it works</SpotlightLink>
            </div>
            <div className="mt-10">
              <p className="text-sm text-muted">Every claim gets one of four verdicts:</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {verdictWords.map((w) => <VerdictBadge key={w} verdict={w as "supported"} />)}
              </div>
            </div>
          </div>
          <ProofSheet />
        </section>

        <section id="how" className="defer scroll-mt-24 border-t border-line py-12">
          <h2 className="text-3xl font-semibold tracking-tight">How it works</h2>
          <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(([title, text], i) => (
              <li key={title} className="scrub">
                <span className="flow" aria-hidden style={{ "--d": `${i * 0.5}s` } as CSSProperties} />
                <span className="mt-4 block text-sm font-medium text-muted">Step {i + 1}</span>
                <h3 className="mt-1 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="problems" className="defer scroll-mt-24 border-t border-line py-12">
          <h2 className="text-3xl font-semibold tracking-tight">What goes wrong with AI answers</h2>
          <dl className="mt-8 grid gap-5 sm:grid-cols-2">
            {problems.map(([term, text], i) => {
              const Icon = icons[i];
              return (
              <div key={term} className="scrub group rounded-3xl border border-line bg-card p-7 transition-colors duration-300 hover:border-umber">
                <span className="mb-4 grid size-11 place-items-center rounded-xl border border-[color-mix(in_srgb,var(--umber)_40%,transparent)] bg-raised text-umber transition duration-300 ease-out group-hover:-translate-y-1 group-hover:-rotate-6 group-hover:bg-umber group-hover:text-white dark:text-sand dark:group-hover:bg-sand dark:group-hover:text-ink"><Icon size={20} aria-hidden /></span>
                <dt className="text-lg font-semibold transition-colors duration-300 group-hover:text-umber dark:group-hover:text-sand">{term}</dt>
                <dd className="mt-1.5 leading-relaxed text-muted">{text}</dd>
              </div>
            ); })}
          </dl>
        </section>

        <section className="defer mb-12 rounded-3xl bg-surface px-8 py-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Verify. Discover. Trust.</h2>
          <p className="mx-auto mt-3 max-w-md text-muted">Start free. Connect it to your AI in a couple of minutes.</p>
          <div className="mt-7 flex justify-center"><SpotlightLink href="/signup">Create free account</SpotlightLink></div>
        </section>
      </main>

    </>
  );
}
