// Real auth calls (FRONTEND_INTEGRATION.md). The backend returns one 401 for any bad login, so we cannot tell
// "no account" from "wrong password" unless the backend adds separate codes.
import { api, ApiError, clearTokens, getRefreshToken, saveTokens } from "./client";

export type AuthResult =
  | { ok: true }
  | { ok: false; reason: "invalid-credentials" | "exists" | "other"; message?: string };
type Tokens = { access_token: string; refresh_token: string };

async function authenticate(path: string, body: object): Promise<AuthResult> {
  try {
    saveTokens(await api<Tokens>(path, { method: "POST", body: JSON.stringify(body) }));
    return { ok: true };
  } catch (e) {
    if (e instanceof ApiError) {
      if (e.status === 401) return { ok: false, reason: "invalid-credentials" };
      if (e.status === 409) return { ok: false, reason: "exists" };
      return { ok: false, reason: "other", message: e.message };
    }
    return { ok: false, reason: "other", message: "Can't reach the server. Is the backend running?" };
  }
}

export const login = (email: string, password: string) => authenticate("/api/v1/auth/login", { email, password });
export const signup = (email: string, password: string, name: string) =>
  authenticate("/api/v1/auth/register", { email, password, name });

// The backend has no Google endpoint yet, so be honest instead of pretending.
export async function loginWithGoogle(): Promise<AuthResult> {
  return { ok: false, reason: "other", message: "Google sign-in isn't available yet." };
}

export async function logout() {
  const refresh_token = getRefreshToken();
  try { if (refresh_token) await api("/api/v1/auth/logout", { method: "POST", body: JSON.stringify({ refresh_token }) }); }
  catch { /* signing out locally is enough if the server call fails */ }
  clearTokens();
}
