// Backend address comes from .env.local (NEXT_PUBLIC_API_URL). Nothing else in the app hard-codes it.
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");
