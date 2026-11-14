// Small formatting helpers shared by pages.
import { ApiError } from "@/lib/api/client";

export function relativeTime(iso: string | null | undefined) {
  if (!iso) return "";
  const diff = (new Date(iso).getTime() - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [["second", 60], ["minute", 60], ["hour", 24], ["day", 30], ["month", 12], ["year", Infinity]];
  let value = diff;
  for (const [unit, size] of steps) {
    if (Math.abs(value) < size) return rtf.format(Math.round(value), unit);
    value /= size;
  }
  return "";
}
export const fullDate = (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleString() : "");
export const shortDate = (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleDateString(undefined, { dateStyle: "medium" }) : "");
export function bytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
export const safeUrl = (u: string | null | undefined) => (u && /^https?:\/\//i.test(u) ? u : null);
export function domainOf(u: string) {
  try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return u; }
}
export function confidenceLabel(c: number) {
  if (c >= 0.85) return "Strong evidence";
  if (c >= 0.65) return "Moderate evidence";
  if (c >= 0.4) return "Limited evidence";
  return "Weak evidence";
}
export const planPrice = (cents: number, currency = "usd") =>
  cents === 0 ? "Free" : new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(cents / 100);

/** Turns any thrown error into a friendly message; `upgrade` tells the UI to show an upgrade CTA. */
export function describeError(e: unknown): { message: string; upgrade: boolean; requestId?: string } {
  if (!(e instanceof ApiError)) return { message: "Something went wrong.", upgrade: false };
  const requestId = e.requestId;
  switch (e.code) {
    case "quota_exceeded": case "plan_limit_exceeded": return { message: "You've used all the checks in your plan this month.", upgrade: true, requestId };
    case "budget_exceeded": return { message: "The daily model budget has been reached. Try again tomorrow.", upgrade: false, requestId };
    case "rate_limited": return { message: "Too many requests right now. Wait a moment and try again.", upgrade: false, requestId };
    case "payload_too_large": return { message: "That is too large. Shorten the text (20,000 characters) or file (10 MB).", upgrade: false, requestId };
    case "unsupported_media_type": return { message: "Unsupported file type. Use .pdf, .txt, .md or .markdown.", upgrade: false, requestId };
    case "billing_not_configured": return { message: "Billing is not configured on this server.", upgrade: false, requestId };
  }
  if (e.status === 402) return { message: "You've used all the checks in your plan this month.", upgrade: true, requestId };
  if (e.status === 429) return { message: "Too many requests right now. Wait a moment and try again.", upgrade: false, requestId };
  if (e.status === 413) return { message: "That is too large to process.", upgrade: false, requestId };
  if (e.status === 415) return { message: "Unsupported file type. Use .pdf, .txt, .md or .markdown.", upgrade: false, requestId };
  return { message: e.message, upgrade: false, requestId };
}

/** Hand text to /verify from another page (dashboard composer, re-run). Session-only, never in the URL. */
export function setPrefill(text: string, context?: string | null) {
  try { sessionStorage.setItem("fc_prefill", JSON.stringify({ text, context: context ?? "" })); } catch { /* storage blocked */ }
}
export function takePrefill(): { text: string; context: string } | null {
  try {
    const raw = sessionStorage.getItem("fc_prefill");
    if (!raw) return null;
    sessionStorage.removeItem("fc_prefill");
    return JSON.parse(raw);
  } catch { return null; }
}
