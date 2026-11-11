// Connect guide: pick an agent, follow the steps, copy the connector name and URL.
"use client";
import Link from "next/link";
import { useState } from "react";
import { CopyField } from "@/components/ui/CopyField";
import { API_URL } from "@/lib/config";

const agents = {
  Claude: ["In Claude, open Settings, find Connectors, and add a custom connector.", "Click connect. A Fact Cookie login opens in your browser."],
  ChatGPT: ["In ChatGPT, open the connectors settings and add a custom MCP connector. What you see depends on your plan.", "Click connect and log in to Fact Cookie when the browser window opens."],
  opencode: ["Add Fact Cookie as a remote MCP server in your opencode configuration.", "Log in through the browser when opencode asks, or use an API key as the bearer token."],
  "Other MCP client": ["Open the MCP or connector settings and add a remote server.", "Log in through the browser. If your client can't, use an API key as the bearer token."],
} as const;

export function ConnectGuide() {
  const [agent, setAgent] = useState<keyof typeof agents>("Claude");
  const [open, last] = agents[agent];
  const steps = [open, "Paste the connector name and URL below.", last, "Paste any AI answer and say: verify this with Fact Cookie."];
  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-3xl border border-line bg-card p-8">
        <div role="tablist" className="flex flex-wrap gap-2">
          {(Object.keys(agents) as (keyof typeof agents)[]).map((a) => (
            <button key={a} role="tab" aria-selected={a === agent} onClick={() => setAgent(a)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${a === agent ? "border-umber bg-umber text-white" : "border-line hover:border-umber"}`}>{a}</button>
          ))}
        </div>
        <ol key={agent} className="mt-8 space-y-5">
          {steps.map((s, i) => (
            <li key={s} className="rise flex gap-4" style={{ "--d": `${i * 80}ms` } as React.CSSProperties}>
              <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line bg-bg text-sm font-medium">{i + 1}</span>
              <p className="pt-1 leading-relaxed">{s}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 space-y-4"><CopyField label="Connector name" value="Fact Cookie" /><CopyField label="Connector URL" value={`${API_URL}/mcp`} /></div>
      </div>
      <aside className="space-y-6">
        <div className="hover-shadow rounded-3xl border border-line bg-card p-8"><h2 className="text-xl font-semibold">Want to look first?</h2>
          <p className="mt-2 text-muted">Paste any AI answer in the playground and see a verification right away.</p>
          <Link href="/try" className="mt-5 inline-block rounded-full border border-line px-5 py-2.5 text-sm font-medium transition hover:border-umber">Open playground</Link></div>
        <div className="hover-shadow rounded-3xl border border-line bg-card p-8"><h2 className="text-xl font-semibold">No browser login?</h2>
          <p className="mt-2 text-muted">Create an API key in your dashboard and use it as the bearer token instead.</p></div>
      </aside>
    </div>
  );
}
