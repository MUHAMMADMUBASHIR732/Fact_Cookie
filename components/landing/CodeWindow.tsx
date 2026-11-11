// Dark code window with file tabs and a copy button. Changing the code re-runs a short swap animation.
"use client";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CodeWindow({ tabs }: { tabs: { label: string; code: string }[] }) {
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const tab = tabs[Math.min(index, tabs.length - 1)];

  async function copy() {
    try { await navigator.clipboard.writeText(tab.code); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* clipboard blocked */ }
  }

  return (
    <div className="band w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-line shadow-[0_30px_60px_-30px_color-mix(in_srgb,var(--ink)_70%,transparent)]">
      <div className="flex items-center justify-between border-b border-line pr-2">
        <div role="tablist" className="flex overflow-x-auto">
          {tabs.map((t, i) => (
            <button key={t.label} role="tab" aria-selected={i === index} onClick={() => setIndex(i)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 font-mono text-xs transition-colors ${i === index ? "border-umber text-text" : "border-transparent text-muted hover:text-text"}`}>
              {t.label}
            </button>
          ))}
        </div>
        <button onClick={copy} aria-label="Copy code" className="grid size-8 place-items-center rounded-lg text-muted transition hover:text-text">
          {copied ? <Check size={15} /> : <Copy size={15} />}
        </button>
      </div>
      <pre key={tab.code} className="swap overflow-x-auto p-5 font-mono text-[13px] leading-[1.75] text-text"><code>{tab.code}</code></pre>
    </div>
  );
}
