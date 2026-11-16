// Shared frame for the simple public info pages (about, support, contact, privacy, terms).
import { PageHero } from "@/components/PageHero";
import type { ReactNode } from "react";

export function InfoPage({ title, text, children }: { title: string; text: string; children: ReactNode }) {
  return (
    <main>
      <PageHero title={title} text={text} />
      <div className="mx-auto max-w-3xl px-6 py-16">{children}</div>
    </main>
  );
}

export const infoH2 = "mt-12 text-2xl font-semibold tracking-tight";
export const infoP = "mt-4 leading-relaxed text-muted";
export const infoLink = "font-medium text-umber underline underline-offset-4";
export const infoList = "mt-4 list-disc space-y-2 pl-5 leading-relaxed text-muted marker:text-text";
