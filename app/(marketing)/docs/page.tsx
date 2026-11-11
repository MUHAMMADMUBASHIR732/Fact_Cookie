// Documentation page: getting started, verdicts, claim kinds, connector tools, API basics, error codes.
import { PageHero } from "@/components/PageHero";
import { CodeWindow } from "@/components/landing/CodeWindow";
import { VerdictBadge } from "@/components/ui/VerdictBadge";
import { API_URL } from "@/lib/config";

export const metadata = { title: "Docs | Fact Cookie" };

const toc = [["start", "Getting started"], ["verdicts", "The four verdicts"], ["claims", "What gets checked"], ["connector", "Connector tools"], ["api", "API basics"], ["errors", "Error codes"]];
const verdicts = [
  ["supported", "A reliable source confirms the claim. You get the source link, a quoted snippet, and the page or section."],
  ["outdated", "The claim was true before, but a newer source gives a different value. You get the current value, the source and its date."],
  ["contradicted", "A reliable source says the opposite or a different value. You get the correct value and a rewritten answer."],
  ["unverifiable", "No reliable source could be found either way. You get a clear flag, never a guess."],
] as const;
const tools = [
  ["verify_text", "Check every claim in a whole answer."], ["verify_claim", "Check one claim."], ["check_citation", "Check that a citation says what it is claimed to say."],
  ["get_usage", "See your usage and plan limits."], ["get_verification", "Fetch an earlier check."], ["list_verifications", "List your recent checks."], ["health", "Confirm the connector is reachable."],
];
const errors = [
  ["unauthorized", "401", "Missing or expired login. Refresh once, then log in again."], ["forbidden", "403", "You don't have access to this."], ["not_found", "404", "That item doesn't exist."],
  ["conflict", "409", "It already exists, for example an email that is registered."], ["validation_error", "422", "The request was malformed."], ["rate_limited", "429", "Too many requests. Wait and retry."],
  ["budget_exceeded", "429", "A usage budget was reached."], ["quota_exceeded", "402", "Your plan's checks are used up."], ["payload_too_large", "413", "The text or file is too large."],
];
const h2 = "scroll-mt-28 text-2xl font-semibold tracking-tight";
const link = "font-medium text-umber underline underline-offset-4";

export default function Docs() {
  return (
    <main>
      <PageHero title="Documentation" text="Everything about how Fact Cookie judges a claim, how to connect your agent, and how to call it from code." />
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[14rem_1fr]">
        <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm lg:flex-col lg:gap-3">
            {toc.map(([id, label]) => <li key={id}><a href={`#${id}`} className="navlink">{label}</a></li>)}
          </ul>
        </nav>
        <div className="min-w-0 space-y-16">
          <section id="start"><h2 className={h2}>Getting started</h2>
            <ol className="mt-5 list-decimal space-y-3 pl-5 text-muted marker:text-text">
              <li>Create an account.</li>
              <li>Connect your agent with the <a href="/connect" className={link}>connect guide</a>.</li>
              <li>Ask your agent to verify an answer, or paste one into the <a href="/try" className={link}>playground</a>.</li>
              <li>Review every check in your history.</li>
            </ol></section>
          <section id="verdicts"><h2 className={h2}>The four verdicts</h2>
            <div className="mt-5 space-y-3">{verdicts.map(([v, text]) => (
              <div key={v} className="hover-shadow flex flex-col gap-3 rounded-2xl border border-line bg-card p-5 sm:flex-row sm:items-start"><div className="sm:w-40 sm:shrink-0"><VerdictBadge verdict={v} /></div><p className="text-muted">{text}</p></div>
            ))}</div></section>
          <section id="claims"><h2 className={h2}>What gets checked</h2>
            <p className="mt-5 max-w-2xl leading-relaxed text-muted">Fact Cookie picks out the parts of an answer that can be checked: numbers, dates, names, quotes and citations. Each becomes its own claim with its own verdict. Anything that cannot be checked is left alone.</p></section>
          <section id="connector"><h2 className={h2}>Connector tools</h2>
            <dl className="mt-5 divide-y divide-line border-y border-line">{tools.map(([n, d]) => (
              <div key={n} className="grid gap-1 py-4 sm:grid-cols-[14rem_1fr]"><dt className="font-mono text-sm">{n}</dt><dd className="text-muted">{d}</dd></div>))}</dl></section>
          <section id="api"><h2 className={h2}>API basics</h2>
            <ul className="mt-5 list-disc space-y-2 pl-5 text-muted marker:text-text">
              <li>Browsers use a login token. Servers and agents without browser login use an API key. Never put a key in client-side code.</li>
              <li>Texts up to 2000 characters are checked while you wait. Longer texts return a pending check you poll every 1.5 seconds.</li>
              <li>Statuses are pending, queued, running, completed and failed.</li>
            </ul>
            <div className="mt-6"><CodeWindow tabs={[{ label: "curl", code: `curl -X POST ${API_URL}/api/v1/verifications \\\n  -H "Authorization: Bearer fc_live_..." \\\n  -H "Content-Type: application/json" \\\n  -d '{ "text": "...", "mode": "sync" }'` }]} /></div></section>
          <section id="errors"><h2 className={h2}>Error codes</h2>
            <div className="mt-5 overflow-x-auto rounded-2xl border border-line"><table className="w-full min-w-[32rem] text-left text-sm">
              <thead className="bg-surface"><tr><th className="p-3 font-medium">Code</th><th className="p-3 font-medium">Status</th><th className="p-3 font-medium">Meaning</th></tr></thead>
              <tbody className="divide-y divide-line">{errors.map(([c, s, m]) => <tr key={c} className="hover:bg-surface"><td className="p-3 font-mono">{c}</td><td className="p-3">{s}</td><td className="p-3 text-muted">{m}</td></tr>)}</tbody></table></div></section>
        </div>
      </div>
    </main>
  );
}
