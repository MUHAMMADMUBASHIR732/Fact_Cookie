// Mock-provider checkout return path. No real payment occurs and no plan change is made.
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { btn, Card, PageHeader } from "@/components/ui/kit";

export default function MockCheckout() {
  const [plan, setPlan] = useState("");
  useEffect(() => setPlan(new URLSearchParams(window.location.search).get("plan") ?? ""), []);
  return (
    <>
      <PageHeader title="Mock checkout" />
      <Card className="max-w-lg">
        <p className="text-sm">You were redirected here by the mock billing provider{plan ? ` for the “${plan}” plan` : ""}.</p>
        <p className="mt-2 text-sm text-muted">No payment is taken, and the backend has no endpoint to simulate a plan change, so your plan stays the same. Configure Stripe on the backend for real checkout.</p>
        <Link href="/usage" className={`${btn} mt-5`}>Back to usage & billing</Link>
      </Card>
    </>
  );
}
