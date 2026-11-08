// Hero centerpiece: an AI answer being checked in real time. All timing is CSS (--d); Replay remounts it.
"use client";
import { useState, type CSSProperties } from "react";
import { RotateCcw } from "lucide-react";
import { acmeVerification as v } from "@/data/acme";
import { VerdictBadge } from "@/components/ui/VerdictBadge";
import { useSpotlight } from "@/hooks/useSpotlight";

// Mock: the backend will send which spans of the corrected answer changed.
const CHANGED = ["13,400", "p. 41"];

type Piece = { text: string; claimIndex?: number };

// Cuts the original answer into plain pieces and claim pieces, in reading order.
function pieces(): Piece[] {
  const out: Piece[] = [];
  let rest = v.originalAnswer;
  v.claims.forEach((c, i) => {
    const at = rest.indexOf(c.text);
    out.push({ text: rest.slice(0, at) }, { text: c.text, claimIndex: i });
    rest = rest.slice(at + c.text.length);
  });
  return [...out, { text: rest }];
}

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function ProofSheet() {
  const [run, setRun] = useState(0);
  const ref = useSpotlight<HTMLDivElement>();
  let word = 0;

  return (
    <div ref={ref}
      className="spot rounded-3xl border border-line border-line bg-surface p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <p className="max-w-md text-sm text-muted">{v.question}</p>
        <button onClick={() => setRun((n) => n + 1)} aria-label="Replay the check"
          className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-muted transition hover:rotate-[-90deg] hover:text-text">
          <RotateCcw size={15} />
        </button>
      </div>

      <div key={run}>
        <p className="relative mt-6 font-display text-xl leading-[1.8] sm:text-2xl sm:leading-[1.8]">
          {pieces().map((p, i) =>
            p.claimIndex === undefined ? (
              p.text.split(/(?<= )/).map((w, j) => (
                <span key={`${i}-${j}`} className="word" style={delay(word++ * 40)}>{w}</span>
              ))
            ) : (
              <span key={i} className="word" style={delay(word++ * 40)}>
                <mark className="claim bg-transparent text-inherit"
                  style={{ "--v": `var(--v-${v.claims[p.claimIndex].verdict})`, "--d": `${1200 + p.claimIndex * 400}ms` } as CSSProperties}>
                  {p.text}
                </mark>
              </span>
            )
          )}
        </p>

        <ul className="mt-9 divide-y divide-line border-t border-line">
          {v.claims.map((c, i) => (
            <li key={c.id} className="stamp grid gap-2 py-4 sm:grid-cols-[10rem_1fr]" style={delay(1600 + i * 400)}>
              <div><VerdictBadge verdict={c.verdict} /></div>
              <div>
                <p className="text-sm">{c.note}</p>
                {c.source && (
                  <p className="mt-1.5 font-mono text-xs leading-relaxed text-muted">
                    “{c.source.snippet}” <span className="text-text">{c.source.location}</span>
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="clip mt-3 rounded-2xl bg-raised p-6" style={delay(2900)}>
          <p className="text-sm font-medium text-supported">Corrected answer</p>
          <p className="mt-2 leading-relaxed">
            {v.correctedAnswer.split(new RegExp(`(${CHANGED.join("|").replace(/\./g, "\\.")})`)).map((s, i) =>
              CHANGED.includes(s)
                ? <span key={i} className="rounded bg-[color-mix(in_srgb,var(--sand)_45%,transparent)] px-1 font-medium">{s}</span>
                : s
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
