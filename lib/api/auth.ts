// Mock auth for the demo. Backend dev: replace each function body with a fetch() to FastAPI, keep the result shape.
// Demo accounts live in this browser only, and passwords are stored as SHA-256 hashes.
export type AuthResult = { ok: true } | { ok: false; reason: "no-account" | "wrong-password" | "exists" };

const KEY = "fact-cookie-demo-users";
const wait = () => new Promise((r) => setTimeout(r, 600));

async function hash(text: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(bytes)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function readUsers(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "{}"); } catch { return {}; }
}

export async function login(email: string, password: string): Promise<AuthResult> {
  await wait();
  const stored = readUsers()[email.toLowerCase()];
  if (!stored) return { ok: false, reason: "no-account" };
  if (stored !== (await hash(password))) return { ok: false, reason: "wrong-password" };
  return { ok: true };
}

export async function signup(email: string, password: string): Promise<AuthResult> {
  await wait();
  const users = readUsers();
  const key = email.toLowerCase();
  if (key in users) return { ok: false, reason: "exists" };
  users[key] = await hash(password);
  try { localStorage.setItem(KEY, JSON.stringify(users)); } catch { /* storage blocked: demo only */ }
  return { ok: true };
}

// Real version: redirect to the backend's Google OAuth start URL.
export async function loginWithGoogle(): Promise<AuthResult> {
  await wait();
  return { ok: true };
}
