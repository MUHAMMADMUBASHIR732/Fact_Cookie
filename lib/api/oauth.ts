// OAuth consent page calls (FRONTEND_INTEGRATION.md §7.15.1). Never call /oauth/token from the browser.
import { api } from "./client";
import type { OAuthContext, OAuthParams } from "./types";

export const getOAuthContext = (p: OAuthParams) => {
  const q = new URLSearchParams({ client_id: p.client_id, redirect_uri: p.redirect_uri, response_type: p.response_type });
  if (p.scope) q.set("scope", p.scope);
  return api<OAuthContext>(`/oauth/authorize/context?${q}`);
};
export const submitConsent = (p: OAuthParams, decision: "allow" | "deny") =>
  api<{ redirect_url: string }>("/oauth/authorize/consent", { method: "POST", body: JSON.stringify({ ...p, decision }) });
