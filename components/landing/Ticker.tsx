// Endless horizontal ticker. Two identical lists make the loop seamless; `reverse` runs it the other way.
export function Ticker({ items, reverse = false, mono = false }: { items: string[]; reverse?: boolean; mono?: boolean }) {
  return (
    <div className={`hmarquee flex w-max ${reverse ? "hmarquee-rev" : ""}`}>
      {[0, 1].map((n) => (
        <ul key={n} aria-hidden={n === 1} className="flex shrink-0 gap-12 pr-12">
          {items.map((t) => (
            <li key={t} className={mono ? "font-mono text-base text-umber dark:text-sand" : "font-display text-2xl text-muted"}>{t}</li>
          ))}
        </ul>
      ))}
    </div>
  );
}
