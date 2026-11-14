// Mock-provider billing portal return path.
import Link from "next/link";
import { btn, Card, PageHeader } from "@/components/ui/kit";

export default function MockPortal() {
  return (
    <>
      <PageHeader title="Billing portal" />
      <Card className="max-w-lg">
        <p className="text-sm text-muted">This is the mock billing portal. No payment methods or invoices are available because the backend does not expose them.</p>
        <Link href="/usage" className={`${btn} mt-5`}>Back to usage & billing</Link>
      </Card>
    </>
  );
}
