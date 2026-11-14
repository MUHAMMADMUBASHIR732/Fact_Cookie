// /status: API health check. No incident history: the backend has no incident API.
"use client";
import { PageHero } from "@/components/PageHero";
import { useAsync } from "@/hooks/useAsync";
import { getHealth } from "@/lib/api/account";
import { API_URL } from "@/lib/config";

export default function Status() {
  const { data, error, loading, reload } = useAsync(getHealth);
  return (
    <main>
      <PageHero title="Status" text="Live check of the Fact Cookie API." />
      <section className="mx-auto max-w-xl px-6 py-16">
        <div className="rounded-2xl border border-line bg-card p-6" aria-live="polite">
          <p className="flex items-center gap-3 font-medium">
            <span aria-hidden className="size-2.5 rounded-full" style={{ background: loading ? "var(--v-outdated)" : data?.status === "ok" ? "var(--v-supported)" : "var(--v-contradicted)" }} />
            {loading ? "Checking..." : data?.status === "ok" ? "API is up" : "API is unreachable"}
          </p>
          <p className="mt-2 break-all font-mono text-xs text-muted">{API_URL}</p>
          {error != null && <p className="mt-2 text-sm text-muted">The backend did not respond. If you use a tunnel URL, it changes whenever the tunnel restarts.</p>}
          <button onClick={reload} className="mt-4 text-sm underline underline-offset-4">Check again</button>
        </div>
      </section>
    </main>
  );
}
