// Fact Cookie logo mark (shown as an app-icon tile so it works on light and dark) + wordmark.
import Image from "next/image";
import Link from "next/link";

export function Brand({ size = 40 }: { size?: number }) {
  return (
    <Link href="/" aria-label="Fact Cookie home" className="flex items-center gap-3">
      <Image src="/logo-mark.png" alt="" width={size} height={size} priority
        className="rounded-[28%] border border-line" />
      <span className="font-display text-xl font-semibold tracking-tight">Fact Cookie</span>
    </Link>
  );
}
