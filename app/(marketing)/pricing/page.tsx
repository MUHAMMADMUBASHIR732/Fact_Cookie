// Pricing page.
import { PageHero } from "@/components/PageHero";
import { PricingPlans } from "@/components/landing/PricingPlans";

export const metadata = { title: "Pricing | Fact Cookie" };

const faqs = [
  ["What counts as a check?", "One verification of one AI answer. Each check is saved to your history with every claim and verdict."],
  ["What happens at my limit?", "The check is refused with a clear message and your history stays available. Upgrade, or wait for your allowance to reset."],
  ["Can I change plan later?", "Yes. You will be able to upgrade, downgrade or cancel from the billing page in your dashboard."],
];

export default function Pricing() {
  return (
    <main>
      <PageHero title="Simple plans for checking AI answers" text="Start free. Move up when you check answers every day or need a shared audit trail." />
      <section className="mx-auto max-w-6xl px-6 py-16"><PricingPlans /></section>
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <h2 className="text-2xl font-semibold">Pricing questions</h2>
        {faqs.map(([q, a]) => (
          <div key={q} className="hover-shadow mt-4 rounded-2xl border border-line bg-card p-6"><h3 className="font-semibold">{q}</h3><p className="mt-1.5 text-muted">{a}</p></div>
        ))}
      </section>
    </main>
  );
}
