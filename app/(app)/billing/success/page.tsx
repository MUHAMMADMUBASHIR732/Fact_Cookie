// Checkout success: refetch usage so the new plan shows.
"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useSession } from "@/components/app/Session";
import { btn, Card, PageHeader } from "@/components/ui/kit";

export default function Success() {
  const { reloadUsage, usage } = useSession();
  useEffect(() => { reloadUsage(); }, [reloadUsage]);
  return (
    <>
      <PageHeader title="Checkout complete" />
      <Card className="max-w-lg">
        <p className="text-sm">Thanks. {usage ? `Your plan: ${usage.plan_name}.` : "Updating your plan..."}</p>
        <Link href="/usage" className={`${btn} mt-5`}>View usage & billing</Link>
      </Card>
    </>
  );
}
