// signup page.
import { AuthForm } from "@/components/AuthForm";

export const metadata = { title: "Create account | Fact Cookie" };

export default function Page() {
  return <AuthForm mode="signup" />;
}
