// Plan cards with a monthly / yearly switch. Example plans: final tiers and limits are still to be decided.
"use client";
import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const plans = [
  { name: "Free", monthly: 0, yearly: 0, blurb: "Try it on your own answers.", features: ["Playground and connector", "All four verdicts with evidence", "Verification history"] },
  { name: "Pro", monthly: 19, yearly: 190, highlight: true, blurb: "For people who check AI answers every day.", features: ["More checks every month", "Private documents as evidence", "Trusted and blocked sources", "Export as JSON or CSV"] },
  { name: "Team", monthly: 49, yearly: 490, blurb: "For teams that need an audit trail.", features: ["Everything in Pro", "Team usage overview", "API keys for your servers"] },
];

export function PricingPlans() {
  const [yearly, setYearly] = useState(false);
  return (
    <div>
      <div role="group" aria-label="Billing period" className="mx-auto flex w-fit rounded-full border border-line p-1 text-sm">
        {[["Monthly", false], ["Yearly", true]].map(([label, value]) => (
          <button key={String(label)} aria-pressed={yearly === value} onClick={() => setYearly(value as boolean)}
            className={`rounded-full px-5 py-2 font-medium transition-colors duration-300 ${yearly === value ? "bg-umber text-white" : "text-muted hover:text-text"}`}>{label as string}</button>
        ))}
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className={`hover-shadow flex flex-col rounded-3xl border border-line p-8 ${p.highlight ? "band" : "bg-card"}`}>
            <h3 className="text-xl font-semibold">{p.name}</h3>
            <p className="mt-1 text-sm text-muted">{p.blurb}</p>
            <p className="mt-6 font-display text-5xl font-semibold">${yearly ? Math.round(p.yearly / 12) : p.monthly}<span className="text-base font-normal text-muted"> / month</span></p>
            <p className="mt-1 h-5 text-xs text-muted">{yearly && p.yearly ? `Billed $${p.yearly} a year` : ""}</p>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {p.features.map((f) => <li key={f} className="flex gap-3"><Check size={17} aria-hidden className="mt-0.5 shrink-0 text-supported" />{f}</li>)}
            </ul>
            <Link href="/signup" className="mt-8 rounded-full bg-umber py-3 text-center font-medium text-white transition hover:brightness-110">{p.monthly ? `Choose ${p.name}` : "Start free"}</Link>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-muted">Plans and prices shown are examples until pricing is final.</p>
    </div>
  );
}
