// Old playground route: the verifier now lives at /verify.
import { redirect } from "next/navigation";

export default function TryPage() {
  redirect("/verify");
}
