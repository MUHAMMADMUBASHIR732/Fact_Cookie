// Minimal toast system: toast("message", "error") from anywhere inside <ToastProvider>.
"use client";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type Kind = "info" | "success" | "error";
const Ctx = createContext<(message: string, kind?: Kind) => void>(() => {});
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<{ id: number; message: string; kind: Kind }[]>([]);
  const toast = useCallback((message: string, kind: Kind = "info") => {
    const id = Date.now() + Math.random();
    setItems((l) => [...l, { id, message, kind }]);
    setTimeout(() => setItems((l) => l.filter((t) => t.id !== id)), 5000);
  }, []);
  return (
    <Ctx.Provider value={toast}>
      {children}
      <div aria-live="polite" className="fixed bottom-4 right-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2">
        {items.map((t) => (
          <p key={t.id} role={t.kind === "error" ? "alert" : "status"}
            className="rise rounded-xl border bg-raised p-3 text-sm shadow-lg"
            style={{ borderColor: t.kind === "error" ? "var(--v-contradicted)" : t.kind === "success" ? "var(--v-supported)" : "var(--line)" }}>
            {t.message}
          </p>
        ))}
      </div>
    </Ctx.Provider>
  );
}
