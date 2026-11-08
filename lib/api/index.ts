// The ONLY place the UI gets data. Mock now; swap bodies for fetch() calls to FastAPI later.
import { acmeVerification } from "@/data/acme";
import type { Verification } from "@/data/types";

export async function listVerifications(): Promise<Verification[]> {
  return [acmeVerification];
}
export async function getVerification(id: string): Promise<Verification | undefined> {
  return (await listVerifications()).find((v) => v.id === id);
}
