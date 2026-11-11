// Connect guide page.
import { PageHero } from "@/components/PageHero";
import { ConnectGuide } from "@/components/landing/ConnectGuide";

export const metadata = { title: "Connect your agent | Fact Cookie" };

export default function Connect() {
  return (
    <main>
      <PageHero title="Connect Fact Cookie to your AI agent" text="Add the connector once. After that, ask your agent to verify any answer." />
      <section className="mx-auto max-w-6xl px-6 py-16"><ConnectGuide /></section>
    </main>
  );
}
