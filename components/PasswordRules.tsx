// Strength bar (3 segments) and live checklist under the sign-up password field.
import { Check, Circle } from "lucide-react";
import { passwordRules } from "@/lib/utils/password";

export function PasswordRules({ value }: { value: string }) {
  const met = passwordRules.filter((r) => r.test(value)).length;
  const color = met === 3 ? "supported" : met === 2 ? "outdated" : "contradicted";
  return (
    <div className="rise" style={{ "--d": "260ms" } as React.CSSProperties}>
      <div className="flex gap-1.5" aria-hidden>
        {passwordRules.map((rule, i) => (
          <span key={rule.label} className="h-1 flex-1 rounded-full transition-colors duration-500"
            style={{ background: i < met ? `var(--v-${color})` : "var(--line)" }} />
        ))}
      </div>
      <ul className="mt-3 space-y-1 text-xs" aria-label="Password requirements">
        {passwordRules.map((rule) => {
          const ok = rule.test(value);
          return (
            <li key={rule.label} className={`flex items-center gap-2 transition-colors ${ok ? "text-supported" : "text-muted"}`}>
              {ok ? <Check size={14} aria-hidden /> : <Circle size={14} aria-hidden />}
              {rule.label}<span className="sr-only">{ok ? " (done)" : " (not yet)"}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
