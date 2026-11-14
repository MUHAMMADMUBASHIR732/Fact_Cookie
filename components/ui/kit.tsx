// Shared building blocks: button/input classes, Card, Skeleton, EmptyState, ErrorPanel, Dialog, meters, headers.
"use client";
import { AlertTriangle, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { confidenceLabel, describeError } from "@/lib/format";

export const btn = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-umber px-5 text-sm font-medium text-on-umber transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50";
export const btn2 = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line px-5 text-sm font-medium transition hover:border-umber disabled:cursor-not-allowed disabled:opacity-50";
export const btnDanger = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-contradicted px-5 text-sm font-medium text-contradicted transition hover:bg-surface disabled:opacity-50";
export const inputCls = "w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-[0.95rem] outline-none transition focus:border-umber focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--umber)_14%,transparent)]";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-line bg-card p-5 ${className}`}>{children}</section>;
}

export function PageHeader({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {text && <p className="mt-1.5 max-w-2xl text-muted">{text}</p>}
      </div>
      {action}
    </div>
  );
}

export const Skeleton = ({ className = "h-20" }: { className?: string }) => (
  <div aria-hidden className={`animate-pulse rounded-2xl bg-surface ${className}`} />
);

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-surface p-10 text-center">
      <p className="font-display text-xl font-semibold">{title}</p>
      {text && <p className="mx-auto mt-1.5 max-w-md text-sm text-muted">{text}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function ErrorPanel({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const { message, upgrade, requestId } = describeError(error);
  return (
    <div role="alert" className="flex flex-wrap items-start gap-3 rounded-2xl border border-contradicted bg-surface p-4 text-sm">
      <AlertTriangle size={18} aria-hidden className="mt-0.5 shrink-0 text-contradicted" />
      <div className="min-w-0 flex-1">
        <p>{message}</p>
        {requestId && <p className="mt-1 font-mono text-xs text-muted">Request ID: {requestId}</p>}
      </div>
      <div className="flex gap-2">
        {upgrade && <Link href="/usage" className={btn}>Upgrade plan</Link>}
        {onRetry && <button onClick={onRetry} className={btn2}>Retry</button>}
      </div>
    </div>
  );
}

/** Native <dialog>: focus trap, Esc to close and focus restore come from the browser. */
export function Dialog({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} onClose={onClose} aria-labelledby="dlg-title"
      className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-2xl border border-line bg-raised p-0 text-text backdrop:bg-black/50">
      {open && (
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 id="dlg-title" className="text-lg font-semibold">{title}</h2>
            <button onClick={onClose} aria-label="Close" className="grid size-9 place-items-center rounded-lg text-muted hover:text-text"><X size={18} /></button>
          </div>
          <div className="mt-3">{children}</div>
        </div>
      )}
    </dialog>
  );
}

export function ConfirmDialog({ open, title, text, confirmLabel, busy, onConfirm, onClose }: {
  open: boolean; title: string; text: string; confirmLabel: string; busy?: boolean; onConfirm: () => void; onClose: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} title={title}>
      <p className="text-sm text-muted">{text}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className={btn2}>Cancel</button>
        <button onClick={onConfirm} disabled={busy} className={btnDanger}>{busy ? "Working..." : confirmLabel}</button>
      </div>
    </Dialog>
  );
}

export function UsageMeter({ used, limit }: { used: number; limit: number | null }) {
  const pct = limit ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-mono">{used.toLocaleString()} / {limit === null ? "unlimited" : limit.toLocaleString()} claims</span>
        {limit !== null && <span className="text-muted">{pct}%</span>}
      </div>
      <div role="progressbar" aria-label="Claims used" aria-valuemin={0} aria-valuemax={limit ?? undefined} aria-valuenow={used}
        className="mt-2 h-2 overflow-hidden rounded-full bg-surface">
        <div className="h-full rounded-full" style={{ width: `${limit === null ? 0 : pct}%`, background: pct >= 90 ? "var(--v-contradicted)" : "var(--umber)" }} />
      </div>
    </div>
  );
}

export function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  return (
    <div className="flex items-center gap-2 text-xs text-muted" title="Confidence is supporting metadata, not a guarantee.">
      <div aria-hidden className="h-1.5 w-16 overflow-hidden rounded-full bg-surface"><div className="h-full bg-umber" style={{ width: `${pct}%` }} /></div>
      <span className="font-mono">{pct}%</span>
      <span className="sr-only">confidence</span>
      <span className="hidden sm:inline">{confidenceLabel(value)}</span>
    </div>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <Card>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold tabular-nums">{value}</p>
      {hint && <div className="mt-1 text-xs text-muted">{hint}</div>}
    </Card>
  );
}
