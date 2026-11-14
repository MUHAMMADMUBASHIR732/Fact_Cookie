// /connectors: connect Claude (or another MCP client) to Fact Cookie.
"use client";
import Link from "next/link";
import { CopyField } from "@/components/ui/CopyField";
import { Card, PageHeader } from "@/components/ui/kit";
import { API_URL } from "@/lib/config";

const tools = [
  ["health", "none", "API status."], ["verify_text", "text, context?, mode?", "Verify an answer. Async adds job_id."],
  ["verify_claim", "claim, context?", "Verify one claim."], ["check_citation", "citation_text, claim?, context?", "Check a citation."],
  ["get_usage", "none", "Your quota and usage."], ["get_verification", "verification_id", "Status and claims of one check."],
  ["list_verifications", "limit?", "Recent verifications (max 50)."],
] as const;
const prompts = ["Use Fact Cookie to verify this answer: …", "Check this citation with Fact Cookie: …", "How much of my Fact Cookie quota is left?", "List my last five Fact Cookie verifications."];
const trouble = [
  ["Auth loop or 401", "Confirm the URL ends in /mcp, remove and re-add the connector, then sign in again."],
  ["Tunnel URL changed", "Update the connector URL and re-authenticate."], ["API key rejected", "It must start with fc_live_ and must not be revoked."],
  ["Quota errors", "Ask for get_usage, or open Usage & billing."], ["No claims found", "Try text with numbers, dates, names, quotes or citations."],
];

export default function Connectors() {
  const url = `${API_URL}/mcp`;
  const config = JSON.stringify({ mcpServers: { "fact-cookie": { url } } }, null, 2);
  return (
    <>
      <PageHeader title="Connectors" text="Use Fact Cookie from Claude or any MCP client. MCP (Model Context Protocol) lets an AI assistant call tools in another app, here to verify text and read your usage." />
      <div className="space-y-6">
        <Card><CopyField label="Connector URL" value={url} /><p className="mt-2 text-xs text-muted">Must include /mcp.</p></Card>
        <Card>
          <h2 className="font-semibold">Claude setup</h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted">
            <li>Open Claude connector settings.</li><li>Add a custom connector.</li><li>Paste the connector URL above.</li>
            <li>Sign in to Fact Cookie when the browser opens, then choose <em>Allow connection</em>. You are sent back to Claude.</li>
          </ol>
        </Card>
        <Card>
          <h2 className="font-semibold">API key fallback</h2>
          <p className="mt-2 text-sm text-muted">For clients that support headers, <Link href="/settings" className="underline underline-offset-4">create a key in Settings → API keys</Link> and send <code className="font-mono">Authorization: Bearer fc_live_…</code>. Some clients require OAuth and do not accept a static key.</p>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-bg p-4 font-mono text-xs">{config}</pre>
        </Card>
        <Card>
          <h2 className="font-semibold">Available tools</h2>
          <table className="mt-3 w-full text-left text-sm"><thead className="text-xs text-muted"><tr><th className="pb-2 font-medium">Tool</th><th className="pb-2 font-medium">Arguments</th><th className="pb-2 font-medium">Does</th></tr></thead>
            <tbody>{tools.map(([n, a, d]) => <tr key={n} className="border-t border-line align-top"><td className="py-2 pr-3 font-mono">{n}</td><td className="py-2 pr-3 font-mono text-xs text-muted">{a}</td><td className="py-2">{d}</td></tr>)}</tbody></table>
        </Card>
        <Card><h2 className="font-semibold">Example prompts</h2><ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">{prompts.map((p) => <li key={p}>{p}</li>)}</ul></Card>
        <Card><h2 className="font-semibold">Troubleshooting</h2><dl className="mt-3 space-y-3 text-sm">{trouble.map(([k, v]) => <div key={k}><dt className="font-medium">{k}</dt><dd className="text-muted">{v}</dd></div>)}</dl></Card>
      </div>
    </>
  );
}
