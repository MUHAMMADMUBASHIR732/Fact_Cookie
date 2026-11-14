// Checkout canceled return path.
import Link from "next/link";
import { btn, Card, PageHeader } from "@/components/ui/kit";

export default function Cancel() {
  return (
    <>
      <PageHeader title="Checkout canceled" />
      <Card className="max-w-lg"><p className="text-sm text-muted">Nothing was changed. You can upgrade any time.</p><Link href="/usage" className={`${btn} mt-5`}>Back to usage & billing</Link></Card>
    </>
  );
}
