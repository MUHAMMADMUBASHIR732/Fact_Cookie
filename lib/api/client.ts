// The one fetch wrapper for the Fact Cookie backend: base URL, bearer token, one refresh retry, error envelope.
import { API_URL as BASE } from "@/lib/config";

const ACCESS = "fc_access_token";
const REFRESH = "fc_refresh_token";

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}

export function saveTokens(t: { access_token: string; refresh_token: string }) {
  localStorage.setItem(ACCESS, t.access_token);
  localStorage.setItem(REFRESH, t.refresh_token);
}
export const hasToken = () => !!localStorage.getItem(ACCESS);
export const getRefreshToken = () => localStorage.getItem(REFRESH);
export function clearTokens() {
  localStorage.removeItem(ACCESS);
  localStorage.removeItem(REFRESH);
}

// Refresh rotates both tokens: store the new pair.
async function refresh(): Promise<boolean> {
  const refresh_token = localStorage.getItem(REFRESH);
  if (!refresh_token) return false;
  const res = await fetch(`${BASE}/api/v1/auth/refresh`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ refresh_token }),
  });
  if (!res.ok) { clearTokens(); return false; }
  saveTokens(await res.json());
  return true;
}

export async function api<T>(path: string, init: RequestInit = {}, canRetry = true): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  const access = localStorage.getItem(ACCESS);
  if (access) headers.set("Authorization", `Bearer ${access}`);

  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  if (res.status === 401 && canRetry && (await refresh())) return api<T>(path, init, false);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body?.error?.code ?? "error", body?.error?.message ?? "Something went wrong.");
  }
  return res.status === 204 ? (undefined as T) : res.json();
}
