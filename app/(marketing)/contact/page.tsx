// /contact: sales, partnerships, press and support addresses.
import { InfoPage, infoH2, infoLink, infoP } from "@/components/marketing/InfoPage";

export const metadata = { title: "Contact | Fact Cookie" };

export default function Contact() {
  return (
    <InfoPage title="Contact" text="The right address for sales, partnerships, press and support.">
      <p className={infoP}>
        For sales, partnerships or press:{" "}
        <a href="mailto:hello@factcookie.app" className={infoLink}>hello@factcookie.app</a>
      </p>
      <p className={infoP}>
        For support: <a href="mailto:support@factcookie.app" className={infoLink}>support@factcookie.app</a>
      </p>
      <h2 className={infoH2}>Before you write</h2>
      <p className={infoP}>
        Many questions are answered faster in the <a href="/docs" className={infoLink}>docs</a>, on the{" "}
        <a href="/support" className={infoLink}>support page</a>, or by checking{" "}
        <a href="/status" className={infoLink}>status</a> if something seems down.
      </p>
    </InfoPage>
  );
}
