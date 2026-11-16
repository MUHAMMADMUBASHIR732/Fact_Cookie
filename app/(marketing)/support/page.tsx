// /support: how to get help, with links into the product.
import { InfoPage, infoH2, infoLink, infoList, infoP } from "@/components/marketing/InfoPage";
import Link from "next/link";

export const metadata = { title: "Support | Fact Cookie" };

const topics = [
  ["Why was my claim marked Unverifiable?", "/docs#verdicts"],
  ["How do plan limits and usage metering work?", "/usage"],
  ["How do I connect Claude, ChatGPT or another agent?", "/connect"],
  ["How do I revoke connector or API key access?", "/settings"],
  ["How are my uploaded documents stored and used?", "/documents"],
];

export default function Support() {
  return (
    <InfoPage title="Support" text="Questions about verifications, billing or connecting your agent — we reply within one business day.">
      <p className={infoP}>
        Email <a href="mailto:support@factcookie.app" className={infoLink}>support@factcookie.app</a>. Include what you
        were verifying and, if you can, the verification link from your{" "}
        <Link href="/verifications" className={infoLink}>history</Link> — it makes the answer much faster.
      </p>
      <h2 className={infoH2}>Common topics</h2>
      <ul className="mt-5 space-y-3">
        {topics.map(([q, href]) => (
          <li key={href} className="rounded-2xl border border-line bg-card p-4 text-sm">
            <Link href={href} className="font-medium hover:text-umber">{q}</Link>
          </li>
        ))}
      </ul>
      <h2 className={infoH2}>Self-serve</h2>
      <ul className={infoList}>
        <li>The <Link href="/docs" className={infoLink}>docs</Link> cover verdicts, connector tools and the API.</li>
        <li>The in-app <Link href="/help" className={infoLink}>help page</Link> answers day-to-day questions.</li>
        <li>Live API health is on the <Link href="/status" className={infoLink}>status page</Link>.</li>
      </ul>
    </InfoPage>
  );
}
