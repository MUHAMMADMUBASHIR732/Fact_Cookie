// Shapes the backend will return. Keep in sync with the FastAPI/FastMCP result.
import type { Verdict } from "@/lib/api/types";
export type { Verdict };

export interface Claim {
  id: string;
  text: string;
  kind: "number" | "date" | "name" | "quote" | "citation";
  verdict: Verdict;
  confidence: number;
  note: string;
  source?: { title: string; url: string; snippet: string; location: string; date?: string };
}

export interface Verification {
  id: string;
  createdAt: string;
  agent: "Claude" | "ChatGPT" | "opencode";
  question: string;
  originalAnswer: string;
  correctedAnswer: string;
  claims: Claim[];
}
