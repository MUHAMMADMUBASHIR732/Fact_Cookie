// Shapes returned by the Fact Cookie backend (FRONTEND_INTEGRATION.md). Field names match the API exactly.
export type Verdict = "supported" | "outdated" | "contradicted" | "unverifiable";
export type VerificationStatus = "pending" | "queued" | "running" | "completed" | "failed";

export interface Claim {
  id: string; position: number; text: string; claim_type: string; verdict: Verdict; confidence: number;
  explanation: string | null; source_url: string | null; snippet: string | null;
  page_or_section: string | null; corrected_text: string | null; evidence: unknown[];
}
export interface Verification {
  id: string; status: VerificationStatus; mode: "sync" | "async"; source_agent: string;
  input_text: string; context_text: string | null; corrected_text: string | null; error: string | null;
  claim_count: number; created_at: string; started_at: string | null; completed_at: string | null; claims: Claim[];
}
export interface Preferences {
  trusted_domains: string[]; blocked_domains: string[]; strictness: string;
  recency_days: number; citation_style: string; language: string;
}
export interface ApiKey { id: string; name: string; prefix: string; key?: string; created_at: string }
