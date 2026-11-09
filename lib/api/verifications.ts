// Verification calls: create (sync or async with polling), list, read, delete, export.
import { api, ApiError } from "./client";
import type { Verdict, Verification, VerificationStatus } from "./types";

const SYNC_MAX_CHARS = 2000; // backend default; it switches to async by itself above this
const running: VerificationStatus[] = ["pending", "queued", "running"];
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const getVerification = (id: string) => api<Verification>(`/api/v1/verifications/${id}`);
export const deleteVerification = (id: string) => api<void>(`/api/v1/verifications/${id}`, { method: "DELETE" });
export const exportVerification = (id: string, format: "json" | "csv" = "json") =>
  api<unknown>(`/api/v1/verifications/${id}/export?format=${format}`);

/** Runs a check and waits for it: short text answers at once, long text is polled every 1.5s (3 minute limit). */
export async function verify(text: string, context?: string): Promise<Verification> {
  const mode = text.length > SYNC_MAX_CHARS ? "async" : "sync";
  let v = await api<Verification>("/api/v1/verifications", { method: "POST", body: JSON.stringify({ text, context, mode }) });
  const startedAt = Date.now();
  while (running.includes(v.status)) {
    if (Date.now() - startedAt > 180_000) throw new ApiError(408, "timeout", "This check is taking too long. Look for it in your history in a minute.");
    await sleep(1500);
    v = await getVerification(v.id);
  }
  return v;
}

export interface HistoryFilters {
  verdict?: Verdict; status?: VerificationStatus; source_agent?: string; search?: string;
  date_from?: string; date_to?: string; limit?: number; offset?: number;
}
/** The guide doesn't show the list response shape, so accept a plain array or an {items} wrapper. */
export async function listVerifications(filters: HistoryFilters = {}): Promise<Verification[]> {
  const query = new URLSearchParams(Object.entries(filters).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)]));
  const res = await api<Verification[] | { items?: Verification[]; results?: Verification[] }>(`/api/v1/verifications?${query}`);
  return Array.isArray(res) ? res : res.items ?? res.results ?? [];
}
