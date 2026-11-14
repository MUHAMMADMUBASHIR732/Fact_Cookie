// /verifications/[id]
import { VerificationDetail } from "@/components/app/VerificationDetail";

export const metadata = { title: "Verification | Fact Cookie" };

export default function Page({ params }: { params: { id: string } }) {
  return <VerificationDetail id={params.id} />;
}
