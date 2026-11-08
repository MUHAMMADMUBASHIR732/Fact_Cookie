// Landing page: hero, ticker, features, steps, problems, FAQ, closing call to action.
import type { CSSProperties } from "react";
import { BarChart3, ChevronDown, Clock3, FileSearch, FileUp, Hash, History, Plug, Quote, ScrollText, SlidersHorizontal } from "lucide-react";
import { CopyField } from "@/components/landing/CopyField";
import { IconCard } from "@/components/landing/IconCard";
import { Ticker } from "@/components/landing/Ticker";
import { ProofSheet } from "@/components/ProofSheet";
import { SpotlightLink } from "@/components/ui/SpotlightLink";
import { VerdictBadge } from "@/components/ui/VerdictBadge";

const verdictWords = ["supported", "outdated", "contradicted", "unverifiable"] as const;
const claimTypes = ["Numbers", "Dates", "Names", "Quotes", "Citations", "Prices", "Statistics", "Office-holders", "Policies"];
const evidence = ["$4.2 billion", "13,400 employees", "p. 41", "31 December 2024", "Annual Report 2024", "Financial Highlights", "Company Facts"];
const mcpUrl = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/mcp`;
const stats = [["4", "verdicts for every claim"], ["5", "kinds of claim checked"], ["3+", "AI agents supported"]];
const steps = [
  ["Your AI answers", "Ask Claude, ChatGPT or opencode as you always do."],
  ["We pick out the claims", "Numbers, dates, names, quotes and citations."],
  ["We read the sources", "Live pages, plus any documents you upload."],
  ["You get verdicts and a fix", "Each claim is judged, and the answer is rewritten with real sources."],
];
const features = [
  [FileSearch, "Evidence you can open", "Every verdict links to its source, with the snippet and the page or section."],
  [FileUp, "Your own documents", "Upload PDF, text or Markdown files and use them as private evidence."],
  [SlidersHorizontal, "Your rules", "Choose trusted and blocked sources, how strict to be, and how recent a source must be."],
  [History, "A full audit trail", "Every check is saved and can be exported as JSON or CSV."],
  [BarChart3, "Insights", "See the most-checked claims, the domains used and the trends over time."],
  [Plug, "One connector", "Add it to your AI agent in a minute, or call the API with a key."],
] as const;
const problems = [
  [Clock3, "Stale answers", "Prices, policies and office-holders change. The model's memory does not."],
  [Quote, "Invented citations", "A page number that looks right, in a report that never said it."],
  [Hash, "Unsupported numbers", "A precise figure that no real source contains."],
  [ScrollText, "No audit trail", "Every check is saved, so you can show where a statement came from."],
] as const;
const faqs = [
  ["Which AI tools does it work with?", "Claude, ChatGPT, opencode and other agents that support MCP connectors."],
  ["What happens when no source is found?", "The claim is marked Unverifiable and left as it was. Nothing is guessed."],
  ["Can I use my own documents?", "Yes. Upload PDF, text or Markdown files and they are searched as private evidence."],
  ["Can I keep a record of a check?", "Yes. Every verification is saved and can be exported as JSON or CSV."],
];

export default function Landing() {
  return (
    <main className="mx-auto max-w-6xl px-6">
      <section className="grid items-start gap-12 py-10 lg:grid-cols-2 lg:py-14">
        <div>
          <p className="inline-flex items-center gap-2.5 rounded-full border border-line bg-raised px-3.5 py-1.5 text-sm text-muted">
            <span className="pulse-dot" aria-hidden /> Works with Claude, ChatGPT and opencode
          </p>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.15] tracking-tight sm:text-5xl">
            Find out if your AI’s answer is{" "}
            <span className="cycle" aria-label="supported, outdated, contradicted or unverifiable">
              {verdictWords.map((w, i) => (
                <span key={w} aria-hidden style={{ "--v": `var(--v-${w})`, animationDelay: `${i * 3}s` } as CSSProperties}>{w}</span>
              ))}
            </span>.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
            Add Fact Cookie to your AI agent. Every answer you verify comes back with a verdict for each claim,
            the exact source, and a corrected version.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <SpotlightLink href="/signup">Create free account</SpotlightLink>
            <SpotlightLink href="#how" variant="ghost">See how it works</SpotlightLink>
          </div>
          <div className="mt-9">
            <p className="text-sm text-muted">Every claim gets one of four verdicts:</p>
            <div className="mt-3 flex flex-wrap gap-2">{verdictWords.map((w) => <VerdictBadge key={w} verdict={w} />)}</div>
          </div>
          <dl className="mt-9 grid grid-cols-3 gap-6 border-t border-line pt-7">
            {stats.map(([n, label]) => (
              <div key={label}>
                <dt className="font-display text-4xl font-semibold text-umber dark:text-sand">{n}</dt>
                <dd className="mt-1 text-sm leading-snug text-muted">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <ProofSheet />
      </section>

      <section aria-label="What we check" className="space-y-4 overflow-hidden border-y border-line py-6 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <Ticker items={claimTypes} />
        <Ticker items={evidence} reverse mono />
      </section>

      <section id="features" className="defer scroll-mt-24 py-14">
        <h2 className="max-w-xl text-3xl font-semibold tracking-tight">Everything you need to trust an answer</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(([Icon, title, text]) => <IconCard key={title} icon={<Icon size={20} aria-hidden />} title={title} text={text} />)}
        </div>
      </section>

      <section id="connect" className="defer scroll-mt-24 border-t border-line py-14">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Connect in a minute</h2>
            <p className="mt-3 max-w-md text-muted">Add Fact Cookie as a connector in your AI agent, log in once, then ask it to verify any answer.</p>
            <ol className="mt-6 space-y-3 text-sm">
              {["Open your agent’s connector settings", "Paste the name and URL", "Click log in once"].map((t, i) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="grid size-6 place-items-center rounded-full bg-umber text-xs font-medium text-white">{i + 1}</span>{t}
                </li>
              ))}
            </ol>
          </div>
          <div className="scrub space-y-5 rounded-3xl border border-line bg-card p-6">
            <CopyField label="Connector name" value="Fact Cookie" />
            <CopyField label="Connector URL" value={mcpUrl} />
          </div>
        </div>
      </section>

      <section id="how" className="defer scroll-mt-24 border-t border-line py-14">
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

      <section id="problems" className="defer scroll-mt-24 border-t border-line py-14">
        <h2 className="text-3xl font-semibold tracking-tight">What goes wrong with AI answers</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {problems.map(([Icon, title, text]) => <IconCard key={title} icon={<Icon size={20} aria-hidden />} title={title} text={text} />)}
        </div>
      </section>

      <section className="defer border-t border-line py-14">
        <h2 className="text-3xl font-semibold tracking-tight">Questions</h2>
        <div className="mt-6 max-w-3xl">
          {faqs.map(([q, a]) => (
            <details key={q} className="group border-b border-line py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {q}<ChevronDown size={20} aria-hidden className="shrink-0 text-muted transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="defer mb-12 rounded-3xl bg-surface px-8 py-12 text-center">
        <h2 className="shine text-4xl font-semibold tracking-tight sm:text-5xl">Verify. Discover. Trust.</h2>
        <p className="mx-auto mt-3 max-w-md text-muted">Connect it to your AI in a couple of minutes.</p>
        <div className="mt-7 flex justify-center"><SpotlightLink href="/signup">Create free account</SpotlightLink></div>
      </section>
    </main>
  );
}
