// 404 page.
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="font-mono text-sm text-muted">404</p>
        <h1 className="mt-2 text-3xl font-semibold">Page not found</h1>
        <p className="mt-2 text-muted">That page doesn't exist or has moved.</p>
        <div className="mt-6 flex justify-center gap-3"><Link href="/dashboard" className="rounded-full bg-umber px-5 py-3 text-sm font-medium text-on-umber">Dashboard</Link>
          <Link href="/docs" className="rounded-full border border-line px-5 py-3 text-sm font-medium">Docs</Link></div>
      </div>
    </main>
  );
}
