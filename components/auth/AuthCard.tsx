// Centered single-card frame for small auth screens (forgot/reset password, OAuth consent).
import Link from "next/link";
import type { ReactNode } from "react";
import { Brand } from "@/components/Brand";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function AuthCard({ title, text, children, wide }: { title: string; text?: string; children: ReactNode; wide?: boolean }) {
  return (
    <main className="grid min-h-screen place-items-center px-6 py-12">
      <div className={`w-full ${wide ? "max-w-md" : "max-w-sm"}`}>
        <div className="mb-6 flex items-center justify-between"><Brand size={32} /><ThemeToggle /></div>
        <div className="rise rounded-3xl border border-line bg-raised p-7">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {text && <p className="mt-1 text-sm text-muted">{text}</p>}
          <div className="mt-6">{children}</div>
        </div>
        <p className="mt-6 text-center text-sm text-muted"><Link href="/login" className="underline underline-offset-4">Back to log in</Link></p>
      </div>
    </main>
  );
}
