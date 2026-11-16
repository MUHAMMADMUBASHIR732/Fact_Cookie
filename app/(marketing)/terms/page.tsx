// /terms: concise terms of service.
import { InfoPage, infoH2, infoLink, infoList, infoP } from "@/components/marketing/InfoPage";

export const metadata = { title: "Terms | Fact Cookie" };

export default function Terms() {
  return (
    <InfoPage title="Terms of Service" text="The short version of the rules for using Fact Cookie.">
      <h2 className={infoH2}>Using the service</h2>
      <ul className={infoList}>
        <li>Use Fact Cookie for lawful purposes and do not abuse its verification or billing systems.</li>
        <li>Keep API keys and account credentials private. Keys you create can be revoked at any time from{" "}
          <a href="/settings" className={infoLink}>Settings</a>.</li>
        <li>Plan limits apply. When your plan&apos;s checks run out, the API returns <code className="font-mono text-sm">quota_exceeded</code>{" "}
          until you upgrade or the period resets.</li>
      </ul>
      <h2 className={infoH2}>Verdicts and corrections</h2>
      <p className={infoP}>
        Verdicts and corrected answers are generated automatically. They should be reviewed before being relied
        upon for important decisions. We show the evidence behind every verdict so you can judge it yourself.
      </p>
      <h2 className={infoH2}>Billing</h2>
      <p className={infoP}>
        Plans, limits and prices are described on the <a href="/pricing" className={infoLink}>pricing page</a>.
        Subscriptions renew each period and can be managed from the billing portal linked on{" "}
        <a href="/usage" className={infoLink}>Usage &amp; billing</a>.
      </p>
      <h2 className={infoH2}>Contact</h2>
      <p className={infoP}>
        Questions about these terms: <a href="mailto:hello@factcookie.app" className={infoLink}>hello@factcookie.app</a>.
        Also see our <a href="/privacy" className={infoLink}>Privacy Policy</a>.
      </p>
    </InfoPage>
  );
}
