// Read-only value with a copy button that confirms with a check mark.
"use client";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked: nothing to do */ }
  }

  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-line bg-raised py-1.5 pl-4 pr-1.5">
        <code className="min-w-0 flex-1 truncate font-mono text-sm">{value}</code>
        <button onClick={copy} aria-label={`Copy ${label}`}
          className="grid size-9 shrink-0 place-items-center rounded-lg bg-umber text-white transition hover:brightness-110 active:scale-90">
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <span role="status" className="sr-only">{copied ? "Copied" : ""}</span>
    </div>
  );
}
