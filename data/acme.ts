// Mock data: the fictional Acme Corp example from the product document.
import type { Verification } from "./types";

export const acmeVerification: Verification = {
  id: "v_001",
  createdAt: "2026-11-08T09:14:00Z",
  agent: "Claude",
  question: "What was Acme Corp's revenue in 2024 and how many people work there?",
  originalAnswer:
    "Acme Corp reported revenue of $4.2 billion in 2024 and employs about 12,000 people (Annual Report, p. 38).",
  correctedAnswer:
    "Acme Corp reported revenue of $4.2 billion in 2024 (Annual Report 2024, p. 41, Financial Highlights). It had about 13,400 employees as of 31 December 2024 (Investor Relations, Company Facts).",
  claims: [
    { id: "c1", text: "revenue of $4.2 billion in 2024", kind: "number", verdict: "supported", confidence: 0.97,
      note: "Matches the annual report.",
      source: { title: "Acme Corp Annual Report 2024", url: "https://example.com/acme/annual-report-2024",
        snippet: "Total revenue for fiscal 2024 was $4.2 billion.", location: "p. 41, Financial Highlights" } },
    { id: "c2", text: "about 12,000 people", kind: "number", verdict: "outdated", confidence: 0.91,
      note: "A newer figure exists: 13,400.",
      source: { title: "Acme Corp Company Facts", url: "https://example.com/acme/company-facts",
        snippet: "Employees: 13,400 as of 31 December 2024.", location: "Company Facts", date: "2025-01-15" } },
    { id: "c3", text: "(Annual Report, p. 38)", kind: "citation", verdict: "contradicted", confidence: 0.95,
      note: "The revenue figure is on page 41, not 38.",
      source: { title: "Acme Corp Annual Report 2024", url: "https://example.com/acme/annual-report-2024",
        snippet: "Financial Highlights ... Total revenue $4.2 billion.", location: "p. 41" } },
  ],
};
