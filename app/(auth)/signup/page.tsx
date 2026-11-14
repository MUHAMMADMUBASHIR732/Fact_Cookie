// Old address: send people to /register.
import { redirect } from "next/navigation";

export default function Page() {
  redirect("/register");
}
