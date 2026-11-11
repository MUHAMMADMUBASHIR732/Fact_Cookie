// Scroll-driven walkthrough: text steps scroll past, the code window beside them stays and follows the active step.
"use client";
import { useEffect, useRef, useState } from "react";
import { CodeWindow } from "@/components/landing/CodeWindow";

export interface PipelineStep { title: string; text: string; file: string; code: string }

export function Pipeline({ steps }: { steps: PipelineStep[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.i))),
      { rootMargin: "-45% 0px -45% 0px" }
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.15fr]">
      <ol className="min-w-0">
        {steps.map((s, i) => (
          <li key={s.title} data-i={i} ref={(el) => { refs.current[i] = el; }}
            className={`flex min-w-0 flex-col justify-center border-l-2 py-8 pl-5 transition-all duration-500 sm:pl-7 lg:min-h-[58vh] lg:py-0 ${active === i ? "border-umber" : "border-line lg:opacity-45"}`}>
            <span className="text-sm font-medium text-muted">Step {i + 1}</span>
            <h3 className="mt-1 text-2xl font-semibold">{s.title}</h3>
            <p className="mt-2 max-w-md leading-relaxed text-muted">{s.text}</p>
            <div className="mt-5 min-w-0 lg:hidden"><CodeWindow tabs={[{ label: s.file, code: s.code }]} /></div>
          </li>
        ))}
      </ol>
      <div className="sticky top-28 hidden min-w-0 self-start lg:block">
        <CodeWindow tabs={[{ label: steps[active].file, code: steps[active].code }]} />
      </div>
    </div>
  );
}
