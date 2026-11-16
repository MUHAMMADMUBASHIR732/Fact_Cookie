// /preferences: verification preferences (trusted/blocked domains, strictness, recency, citations).
"use client";
import { PageHeader } from "@/components/ui/kit";
import { PreferencesPanel } from "@/components/app/PreferencesPanel";

export default function PreferencesPage() {
  return (
    <>
      <PageHeader title="Preferences" text="How your sources are checked: trusted and blocked domains, strictness and citations." />
      <PreferencesPanel />
    </>
  );
}
