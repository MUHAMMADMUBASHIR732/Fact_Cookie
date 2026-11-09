// Everything else the dashboard needs. Response shapes the guide doesn't show are left generic (T = unknown):
// pages pass the real type once the backend developer confirms it.
import { api } from "./client";
import type { ApiKey, Preferences } from "./types";

const json = (method: string, body: object) => ({ method, body: JSON.stringify(body) });

export const getMe = <T = unknown>() => api<T>("/api/v1/auth/me");
export const updateMe = (body: { name?: string; email?: string }) => api("/api/v1/auth/me", json("PATCH", body));

export const getUsage = <T = unknown>() => api<T>("/api/v1/usage/current");
export const getUsageHistory = <T = unknown>(limit = 50, offset = 0) => api<T>(`/api/v1/usage/history?limit=${limit}&offset=${offset}`);

export const getPlans = <T = unknown>() => api<T>("/api/v1/billing/plans");
export const getSubscription = <T = unknown>() => api<T>("/api/v1/billing/subscription");
export const startCheckout = (plan_id: string) => api<{ url?: string }>("/api/v1/billing/checkout", json("POST", { plan_id }));
export const openBillingPortal = () => api<{ url?: string }>("/api/v1/billing/portal", { method: "POST" });

export const getPreferences = () => api<Preferences>("/api/v1/preferences");
export const savePreferences = (p: Preferences) => api<Preferences>("/api/v1/preferences", json("PUT", p));

export const listApiKeys = () => api<ApiKey[]>("/api/v1/api-keys");
export const createApiKey = (name: string) => api<ApiKey>("/api/v1/api-keys", json("POST", { name })); // `key` is shown once
export const deleteApiKey = (id: string) => api<void>(`/api/v1/api-keys/${id}`, { method: "DELETE" });

export const listDocuments = <T = unknown>() => api<T>("/api/v1/documents");
export const deleteDocument = (id: string) => api<void>(`/api/v1/documents/${id}`, { method: "DELETE" });
export function uploadDocument(file: File) {
  const form = new FormData();
  form.append("file", file);
  return api<unknown>("/api/v1/documents", { method: "POST", body: form });
}

export const getTopClaims = <T = unknown>(limit = 10) => api<T>(`/api/v1/insights/top-claims?limit=${limit}`);
export const getTopDomains = <T = unknown>(limit = 10) => api<T>(`/api/v1/insights/top-domains?limit=${limit}`);
export const getVerdictBreakdown = <T = unknown>() => api<T>("/api/v1/insights/verdict-breakdown");
export const getTrends = <T = unknown>(days = 30) => api<T>(`/api/v1/insights/trends?days=${days}`);
