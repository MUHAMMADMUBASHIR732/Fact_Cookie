// Holds the signed-in user and current usage for every app page.
"use client";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { getMe, getUsage } from "@/lib/api/account";
import type { Usage, User } from "@/lib/api/types";

interface SessionValue { user: User | null; usage: Usage | null; reloadUsage: () => Promise<void>; setUser: (u: User) => void }
const Ctx = createContext<SessionValue>({ user: null, usage: null, reloadUsage: async () => {}, setUser: () => {} });
export const useSession = () => useContext(Ctx);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const reloadUsage = useCallback(async () => { try { setUsage(await getUsage()); } catch { /* shown per page */ } }, []);
  useEffect(() => {
    getMe().then(setUser).catch(() => {});
    reloadUsage();
  }, [reloadUsage]);
  return <Ctx.Provider value={{ user, usage, reloadUsage, setUser }}>{children}</Ctx.Provider>;
}
