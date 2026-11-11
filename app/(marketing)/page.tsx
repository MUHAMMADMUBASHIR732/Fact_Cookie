// Landing page: dark hero band, scroll-driven pipeline, developer code tabs, principles, FAQ, closing band.
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { CodeWindow } from "@/components/landing/CodeWindow";
import { Pipeline, type PipelineStep } from "@/components/landing/Pipeline";
import { Ticker } from "@/components/landing/Ticker";
import { Typewriter } from "@/components/landing/Typewriter";
import { ProofSheet } from "@/components/ProofSheet";
import { SpotlightLink } from "@/components/ui/SpotlightLink";
import { API_URL } from "@/lib/config";

const verdictWords = ["supported", "outdated", "contradicted", "unverifiable"];
const claimTypes = ["Numbers", "Dates", "Names", "Quotes", "Citations", "Prices", "Statistics", "Office-holders", "Policies"];
const metrics = [["4", "verdicts, never a guess"], ["5", "kinds of claim checked"], ["7", "tools in the connector"], ["0", "invented sources"]];
const agents = ["Claude", "ChatGPT", "opencode", "Any MCP client"];

const pipeline: PipelineStep[] = [
  { title: "Your agent calls the connector", text: "Ask Claude, ChatGPT or opencode to verify an answer. The connector receives the text and knows who you are from your login.", file: "agent.log",
    code: `// the agent calls Fact Cookie\nverify_text({\n  text: "Acme Corp reported revenue of $4.2 billion\n         in 2024 and employs about 12,000 people\n         (Annual Report, p. 38)."\n})` },
  { title: "Claims are picked out", text: "Numbers, dates, names, quotes and citations become separate claims, so each one can be judged on its own.", file: "claims.json",
    code: `[\n  { "text": "revenue of $4.2 billion in 2024", "type": "number" },\n  { "text": "about 12,000 people",             "type": "number" },\n  { "text": "(Annual Report, p. 38)",          "type": "citation" }\n]` },
  { title: "Sources are read, not skimmed", text: "Live pages and your uploaded documents are searched and read, and every claim is compared with what the source actually says.", file: "sources.log",
    code: `search  acme corp annual report 2024\nfetch   example.com/acme/annual-report-2024\nread    p. 41  "Total revenue ... was $4.2 billion."\nfetch   example.com/acme/company-facts\nread    "Employees: 13,400 as of 31 December 2024."` },
  { title: "Verdicts and a corrected answer", text: "Each claim gets one verdict with its evidence. If nothing reliable is found, it stays Unverifiable.", file: "result.json",
    code: `{\n  "claims": [\n    { "verdict": "supported",    "page_or_section": "p. 41" },\n    { "verdict": "outdated",     "snippet": "Employees: 13,400" },\n    { "verdict": "contradicted", "explanation": "Revenue is on p. 41, not 38." }\n  ],\n  "corrected_text": "Acme Corp reported revenue of $4.2 billion\\n    in 2024 (p. 41) and had about 13,400 employees."\n}` },
];

const devTabs = [
  { label: "curl", code: `curl -X POST ${API_URL}/api/v1/verifications \\\n  -H "Authorization: Bearer fc_live_..." \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "text": "The Eiffel Tower is 330 metres tall and was completed in 1889.",\n    "mode": "sync"\n  }'` },
  { label: "response.json", code: `{\n  "id": "verification-id",\n  "status": "completed",\n  "claim_count": 2,\n  "claims": [{\n    "text": "The Eiffel Tower is 330 metres tall",\n    "verdict": "supported",\n    "confidence": 0.91,\n    "source_url": "https://...",\n    "snippet": "...",\n    "page_or_section": null\n  }]\n}` },
  { label: "mcp", code: `Connector name   Fact Cookie\nConnector URL    ${API_URL}/mcp\nLogin            browser (OAuth) or API key\n\nTools\n  verify_text   verify_claim   check_citation\n  get_usage     get_verification   list_verifications` },
];

const principles = [
  ["No source, no verdict", "A claim without a reliable source is marked Unverifiable. Nothing is guessed."],
  ["Evidence you can open", "Every verdict links to its source, with the snippet and the page or section."],
  ["Your rules", "Choose trusted and blocked domains, how strict to be, and how recent a source must be."],
  ["Your documents", "Upload PDF, text or Markdown files and use them as private evidence."],
  ["An audit trail", "Every check is saved, searchable, and exportable as JSON or CSV."],
  ["Usage you can see", "Your monthly usage and plan limits are tracked for every check."],
];
const audiences = [
  ["Analysts and researchers", "Check the figures and citations in AI-drafted summaries before they go into a report."],
  ["Writers and editors", "Catch stale facts and invented quotes before anything is published."],
  ["Teams and reviewers", "Show where every AI-assisted statement came from, with a saved audit trail."],
  ["Developers", "Add verification to your own tools through the API or the connector."],
];
const compare = [
  ["A figure that has changed", "Repeats last year's number", "Flags it Outdated, with the current value and its date"],
  ["A citation", "A page number that sounds right", "Checked against the real page, and corrected"],
  ["No source exists", "Answers confidently anyway", "Marked Unverifiable, never guessed"],
  ["Showing your work", "Nothing to give a reviewer", "Every check saved and exportable"],
];
const faqs = [
  ["Which AI tools does it work with?", "Fact Cookie connects through MCP, so it works with Claude, ChatGPT, opencode and any other agent that supports MCP connectors. You add the connector name and URL once, log in with your account, and from then on you can ask the agent to verify an answer."],
  ["Do I need an API key?", "Not for normal use. The website and the connector use your login. An API key is for agents that can't log in through the browser, and for server-to-server calls. Create one in the dashboard and never put it in client-side code."],
  ["What happens when no source is found?", "The claim is marked Unverifiable and left exactly as it was, with a short note. Fact Cookie never invents evidence to fill a gap. You can check that claim by hand, or upload a document that covers it and run the check again."],
  ["Can I use my own documents?", "Yes. Upload PDF, text or Markdown files and they are searched as private evidence next to live web pages, down to the page or section. You can delete a document whenever you like."],
  ["Can I keep a record of a check?", "Yes. Every verification is saved to your history with the original answer, each verdict, the evidence and the corrected answer. You can search and filter it, and export any check as JSON or CSV."],
  ["How long do checks take?", "Short texts, up to 2000 characters, are checked while you wait. Longer texts run in the background and you can come back to the result in your history."],
];

export default function Landing() {
  return (
    <main>
      <section className="px-4 pt-3 sm:px-6">
        <div className="band mx-auto max-w-7xl rounded-[2rem] border border-line p-8 sm:p-12 lg:p-16">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
            <div>
              <p className="inline-flex items-center gap-2.5 rounded-full border border-line px-3.5 py-1.5 text-sm text-muted">
                <span className="pulse-dot" aria-hidden /> Works with Claude, ChatGPT and opencode
              </p>
              <h1 className="mt-6 text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
                <Typewriter text="Find out if your AI’s answer is" />{" "}
                <span className="cycle" aria-label="supported, outdated, contradicted or unverifiable">
                  {verdictWords.map((w, i) => (
                    <span key={w} aria-hidden style={{ "--v": `var(--v-${w})`, animationDelay: `${i * 3 + 2.2}s` } as CSSProperties}>{w}</span>
                  ))}
                </span>.
              </h1>
              <p className="slide-in mt-6 max-w-lg text-lg leading-relaxed text-muted">
                Fact Cookie checks every number, date, name, quote and citation in an AI answer against live sources, then hands back a corrected answer with proof.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <SpotlightLink href="/signup">Get started free</SpotlightLink>
                <SpotlightLink href="#how" variant="ghost">See how it works</SpotlightLink>
              </div>
            </div>
            <ProofSheet />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6">
        <dl className="grid grid-cols-2 divide-x divide-y divide-line border-b border-line lg:grid-cols-4 lg:divide-y-0">
          {metrics.map(([n, label]) => (
            <div key={label} className="scrub px-6 py-8">
              <dt className="font-display text-5xl font-semibold text-umber">{n}</dt>
              <dd className="mt-2 text-sm text-muted">{label}</dd>
            </div>
          ))}
        </dl>
        <div className="overflow-hidden border-b border-line py-5 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]" aria-label="What we check">
          <Ticker items={claimTypes} />
        </div>
      </section>

      <section id="how" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-20">
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">What happens when your agent asks for a check</h2>
        <p className="mt-3 max-w-xl text-muted">Scroll through one real example: the Acme Corp answer, from the first call to the corrected result.</p>
        <Pipeline steps={pipeline} />
      </section>

      <section id="developers" className="defer scroll-mt-24 border-y border-line bg-surface">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Built to be called by software</h2>
            <p className="mt-4 max-w-md leading-relaxed text-muted">The website, the connector and the API share one account and one result format: verdict, confidence, source, snippet, page or section, and the corrected text.</p>
            <ul className="mt-6 space-y-2 text-sm text-muted">
              <li>Sign in once with a browser login, or use an API key.</li>
              <li>Short texts return at once. Long texts run in the background.</li>
              <li>Clear error codes for limits, size and rate limiting.</li>
            </ul>
          </div>
          <CodeWindow tabs={devTabs} />
        </div>
      </section>

      <section id="principles" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-20">
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">Six rules we don’t bend</h2>
        <ol className="mt-10 border-t border-line">
          {principles.map(([title, text], i) => (
            <li key={title} className="scrub group grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-b border-line py-7 transition-colors hover:bg-surface sm:grid-cols-[5rem_18rem_1fr_auto] sm:px-4">
              <span className="font-mono text-sm text-muted">0{i + 1}</span>
              <h3 className="font-display text-xl font-semibold transition-transform duration-500 group-hover:translate-x-2 sm:text-2xl">{title}</h3>
              <p className="col-start-2 text-muted sm:col-start-auto">{text}</p>
              <ArrowRight aria-hidden size={20} className="text-muted opacity-0 transition duration-500 group-hover:translate-x-1 group-hover:opacity-100" />
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">Who uses it</h2>
        <div className="mt-8 grid divide-line border border-line sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
          {audiences.map(([who, what]) => (
            <div key={who} className="scrub border-b border-line p-7 transition-colors hover:bg-surface sm:border-b-0"><h3 className="font-display text-xl font-semibold">{who}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{what}</p></div>
          ))}
        </div>
      </section>

      <section className="defer mx-auto max-w-7xl px-6 pb-20">
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">Without it, and with it</h2>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="bg-surface"><tr><th className="p-4 font-medium"><span className="sr-only">Situation</span></th><th className="p-4 font-medium text-muted">Without Fact Cookie</th><th className="p-4 font-medium">With Fact Cookie</th></tr></thead>
            <tbody className="divide-y divide-line">
              {compare.map(([what, without, withFc]) => <tr key={what} className="transition-colors hover:bg-surface"><th scope="row" className="p-4 font-medium">{what}</th><td className="p-4 text-muted">{without}</td><td className="p-4">{withFc}</td></tr>)}
            </tbody>
          </table>
        </div>
      </section>

      <section className="border-y border-line">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-line lg:grid-cols-4">
          {agents.map((a) => <p key={a} className="px-6 py-8 text-center font-display text-2xl text-muted transition-colors hover:text-text">{a}</p>)}
        </div>
      </section>

      <section id="faq" className="defer mx-auto max-w-4xl scroll-mt-24 px-6 py-20">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Questions</h2>
        <div className="mt-8">
          {faqs.map(([q, a]) => (
            <details key={q} className="group border-b border-line py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {q}<span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-full border border-line text-muted transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="defer px-4 pb-12 sm:px-6">
        <div className="band mx-auto max-w-7xl rounded-[2rem] border border-line px-8 py-16 text-center">
          <h2 className="shine text-4xl font-semibold tracking-tight sm:text-6xl">Verify. Discover. Trust.</h2>
          <p className="mx-auto mt-4 max-w-md text-muted">Connect Fact Cookie to your AI agent in a couple of minutes.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <SpotlightLink href="/signup">Get started free</SpotlightLink>
            <SpotlightLink href="/login" variant="ghost">Log in</SpotlightLink>
          </div>
        </div>
      </section>
    </main>
  );
}
