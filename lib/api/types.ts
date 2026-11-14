// Types from FRONTEND_INTEGRATION.md section 11. Field names match the backend exactly.
export type ClaimType = "number" | "date" | "name" | "quote" | "citation" | "other";
export type Verdict = "supported" | "outdated" | "contradicted" | "unverifiable";
export type VerificationStatus = "pending" | "running" | "completed" | "failed";

export interface User { id: string; email: string; name: string | null; is_active: boolean; created_at: string }
export interface Evidence {
  source_url: string; snippet: string; title: string | null; page_or_section: string | null;
  content: string; provider: string; published_date: string | null;
}
export interface Claim {
  id: string; position: number; text: string; claim_type: ClaimType; verdict: Verdict; confidence: number;
  explanation: string | null; source_url: string | null; snippet: string | null;
  page_or_section: string | null; corrected_text: string | null; evidence: Evidence[];
}
export interface Verification {
  id: string; status: VerificationStatus; mode: "sync" | "async"; source_agent: string; input_text: string;
  context_text: string | null; orchestration_mode: string; llm_mode: string; trace_id: string | null;
  corrected_text: string | null; result: Record<string, unknown> | null; error: string | null; claim_count: number;
  tavily_search_count: number; tavily_extract_count: number;
  created_at: string; started_at: string | null; completed_at: string | null; claims: Claim[];
}
export interface Usage {
  plan_id: string; plan_name: string; period_start: string; period_end: string | null;
  claims_used: number; claims_limit: number | null; claims_remaining: number | null; status: string;
}
export interface Preferences {
  trusted_domains: string[]; blocked_domains: string[]; strictness: "lenient" | "standard" | "strict";
  recency_days: number | null; citation_style: string; language: string;
}
export interface ApiKey { id: string; name: string; prefix: string; last_used_at: string | null; revoked_at: string | null; created_at: string; key?: string }
export type VerdictBreakdown = Partial<Record<Verdict, number>>;
export interface TrendPoint { date: string; count: number }

export type DocumentStatus = "processing" | "ready" | "failed";
export interface DocumentItem {
  id: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  page_count: number;
  status: DocumentStatus;
  created_at: string;
}

export interface OAuthParams {
  client_id: string;
  redirect_uri: string;
  response_type: "code";
  scope?: string;
  state?: string;
  code_challenge?: string;
  code_challenge_method?: string;
  resource?: string;
}
export interface OAuthContext {
  client_name: string;
  scopes: string[];
  scope?: string;
}