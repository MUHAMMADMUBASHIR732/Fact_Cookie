// Form field with a leading icon, focus glow, inline error and (for passwords) a show/hide button.
"use client";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { useState, type ChangeEvent, type CSSProperties } from "react";

interface Props {
  name: string; label: string; icon: LucideIcon; type?: string; error?: string; autoComplete?: string;
  delay?: number; value?: string; onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function AuthField({ name, label, icon: Icon, type = "text", error, autoComplete, delay = 0, value, onChange }: Props) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="rise" style={{ "--d": `${delay}ms` } as CSSProperties}>
      <label htmlFor={name} className="text-sm font-medium">{label}</label>
      <div className="group relative mt-1.5">
        <Icon size={17} aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted transition-colors group-focus-within:text-umber dark:group-focus-within:text-sand" />
        <input id={name} name={name} type={isPassword && show ? "text" : type} autoComplete={autoComplete}
          value={value} onChange={onChange} aria-invalid={!!error}
          className={`w-full rounded-xl border bg-bg py-3 pl-11 text-[0.95rem] outline-none transition focus:border-umber focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--umber)_14%,transparent)] ${isPassword ? "pr-11" : "pr-4"} ${error ? "border-contradicted" : "border-line"}`} />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-2.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted transition hover:text-text">
            {show ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>
      {error && <span role="alert" className="mt-1 block text-xs text-contradicted">{error}</span>}
    </div>
  );
}
