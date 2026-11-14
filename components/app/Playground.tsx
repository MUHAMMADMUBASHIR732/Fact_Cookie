// "Try it": paste an AI answer, verify it through the real backend, read the verdicts.
"use client";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ClaimCard } from "@/components/app/ClaimCard";
import { VerdictBadge } from "@/components/ui/VerdictBadge";
import { ApiError } from "@/lib/api/client";
import type { Verdict, Verification } from "@/lib/api/types";
import { verify } from "@/lib/api/verifications";

const verdicts: Verdict[] = ["supported", "outdated", "contradicted", "unverifiable"];
type State = { phase: "idle" } | { phase: "running" } | { phase: "done"; result: Verification } | { phase: "error"; message: string };

function describe(e: unknown) {
  if (e instanceof ApiError) {
    if (e.status === 402) return "You've used all the checks in your plan this month.";
    if (e.status === 429) return "Too many checks right now. Wait a moment and try again.";
    if (e.status === 413) return "That text is too long to check.";
    return e.message;
  }
  return "Can't reach the server. Is the backend running?";
}

export function Playground() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [context, setContext] = useState("");
  const [state, setState] = useState<State>({ phase: "idle" });


  async function run() {
    setState({ phase: "running" });
    try {
      setState({ phase: "done", result: await verify(text.trim(), context.trim() || undefined) });
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) return router.replace("/login");
      setState({ phase: "error", message: describe(e) });
    }
  }

  const busy = state.phase === "running";
  return (
    <div className="max-w-4xl">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Try it</h1>
        <p className="mt-2 text-muted">Paste an answer from any AI and see which claims hold up.</p>

        <label htmlFor="answer" className="mt-8 block text-sm font-medium">AI answer</label>
        <textarea id="answer" value={text} onChange={(e) => setText(e.target.value)} rows={6}
          placeholder="The Eiffel Tower is 330 metres tall and was completed in 1889."
          className="mt-1.5 min-h-40 w-full rounded-2xl border border-line bg-raised p-4 text-[0.95rem] leading-relaxed outline-none transition focus:border-umber focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--umber)_14%,transparent)]" />
        <p className="mt-1.5 text-xs text-muted">{text.length} characters. Longer texts run in the background and can take a little longer.</p>

        <details className="mt-4 text-sm">
          <summary className="cursor-pointer text-muted hover:text-text">Add source material (optional)</summary>
          <textarea value={context} onChange={(e) => setContext(e.target.value)} rows={3} aria-label="Source material"
            className="mt-2 w-full rounded-2xl border border-line bg-raised p-4 outline-none transition focus:border-umber" />
        </details>

        <button onClick={run} disabled={busy || !text.trim()}
          className="group mt-6 inline-flex items-center gap-2 rounded-full bg-umber px-7 py-3.5 font-medium text-on-umber transition hover:brightness-110 hover:shadow-lg disabled:opacity-50">
          {busy ? "Checking..." : "Verify answer"}
          {!busy && <ArrowRight size={17} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />}
        </button>

        <div aria-live="polite" className="mt-10">
          {busy && <p className="flex items-center gap-3 text-muted"><span className="pulse-dot" aria-hidden /> Checking each claim against live sources...</p>}
          {state.phase === "error" && <p role="alert" className="rounded-xl border border-contradicted bg-surface p-4 text-sm">{state.message}</p>}
          {state.phase === "done" && <Results result={state.result} />}
        </div>
      </div>
    </div>
  );
}

function Results({ result }: { result: Verification }) {
  if (result.status === "failed") {
    return <p role="alert" className="rounded-xl border border-contradicted bg-surface p-4 text-sm">The check failed. {result.error ?? "Please try again."}</p>;
  }
  const counts = verdicts.map((v) => [v, result.claims.filter((c) => c.verdict === v).length] as const).filter(([, n]) => n > 0);
  return (
    <section>
      <h2 className="text-xl font-semibold">{result.claims.length} claims checked</h2>
      <div className="mt-3 flex flex-wrap gap-4">
        {counts.map(([v, n]) => <span key={v} className="inline-flex items-center gap-2 text-sm"><VerdictBadge verdict={v} /> × {n}</span>)}
      </div>
      {result.corrected_text && (
        <div className="mt-6 rounded-2xl bg-surface p-5">
          <p className="text-sm font-medium text-supported">Corrected answer</p>
          <p className="mt-2 leading-relaxed">{result.corrected_text}</p>
        </div>
      )}
      <ul className="mt-6 space-y-4">{result.claims.map((c, i) => <ClaimCard key={c.id} claim={c} index={i} />)}</ul>
    </section>
  );
}
