// Live checklist under the sign-up password field.
import { Check, Circle } from "lucide-react";
import { passwordRules } from "@/lib/utils/password";

export function PasswordRules({ value }: { value: string }) {
  return (
    <ul className="mt-2 space-y-1 text-xs" aria-label="Password requirements">
      {passwordRules.map((rule) => {
        const met = rule.test(value);
        return (
          <li key={rule.label} className={`flex items-center gap-2 transition-colors ${met ? "text-supported" : "text-muted"}`}>
            {met ? <Check size={14} aria-hidden /> : <Circle size={14} aria-hidden />}
            {rule.label}<span className="sr-only">{met ? " (done)" : " (not yet)"}</span>
          </li>
        );
      })}
    </ul>
  );
}
