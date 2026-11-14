// 500 / render error boundary.
"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <h1 className="text-3xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-muted">An unexpected error occurred.</p>
        {error.digest && <p className="mt-1 font-mono text-xs text-muted">Reference: {error.digest}</p>}
        <button onClick={reset} className="mt-6 rounded-full bg-umber px-5 py-3 text-sm font-medium text-on-umber">Try again</button>
      </div>
    </main>
  );
}
