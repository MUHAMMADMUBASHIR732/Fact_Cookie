// /privacy: concise privacy policy matching what the backend actually stores.
import { InfoPage, infoH2, infoLink, infoList, infoP } from "@/components/marketing/InfoPage";

export const metadata = { title: "Privacy | Fact Cookie" };

export default function Privacy() {
  return (
    <InfoPage title="Privacy Policy" text="What we store, what we never do, and how you stay in control.">
      <h2 className={infoH2}>What we store</h2>
      <ul className={infoList}>
        <li>Account basics: your name, email and password hash.</li>
        <li>Verification history: the answers you check, the claims found and the evidence behind each verdict.</li>
        <li>Uploaded documents, used as private evidence sources for your verifications.</li>
        <li>Preferences, such as trusted domains, strictness and citation style.</li>
      </ul>
      <h2 className={infoH2}>What we never do</h2>
      <ul className={infoList}>
        <li>We do not sell personal data.</li>
        <li>We do not use your documents to train models or share them with other accounts.</li>
        <li>We do not invent evidence — a claim with no reliable source is marked Unverifiable.</li>
      </ul>
      <h2 className={infoH2}>Your controls</h2>
      <ul className={infoList}>
        <li>Delete uploaded documents at any time from <a href="/documents" className={infoLink}>Documents</a>.</li>
        <li>Delete individual verifications from their detail page in your <a href="/verifications" className={infoLink}>history</a>.</li>
        <li>Revoke API keys and connector access from <a href="/settings" className={infoLink}>Settings</a> — revoked keys stop working immediately.</li>
        <li>Email <a href="mailto:support@factcookie.app" className={infoLink}>support@factcookie.app</a> to close your account and erase its data.</li>
      </ul>
      <h2 className={infoH2}>Questions</h2>
      <p className={infoP}>
        Anything about your data, write to <a href="mailto:support@factcookie.app" className={infoLink}>support@factcookie.app</a>.
        Also see our <a href="/terms" className={infoLink}>Terms of Service</a>.
      </p>
    </InfoPage>
  );
}
