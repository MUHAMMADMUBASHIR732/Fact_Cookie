// Verdict pill: icon + label + color, so meaning never depends on color alone.
import { Check, CircleHelp, Clock3, X } from "lucide-react";
import type { Verdict } from "@/data/types";

const verdicts = {
  supported: { label: "Supported", Icon: Check },
  outdated: { label: "Outdated", Icon: Clock3 },
  contradicted: { label: "Contradicted", Icon: X },
  unverifiable: { label: "Unverifiable", Icon: CircleHelp },
} as const;

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const { label, Icon } = verdicts[verdict];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium"
      style={{ color: `var(--v-${verdict})`, borderColor: `color-mix(in srgb, var(--v-${verdict}) 45%, transparent)` }}
    >
      <Icon size={13} strokeWidth={2.5} aria-hidden /> {label}
    </span>
  );
}
