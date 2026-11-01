"use client";

import { Plus } from "lucide-react";
import { useId, useState } from "react";

/**
 * One answer open at a time; opening another closes the first. The answer slides
 * open by animating its grid row from 0 to its full height, which works in every
 * current browser (unlike animating <details>). A closed answer is inert, so it
 * is skipped by the keyboard and screen readers.
 */
export function FaqAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <ul className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        const buttonId = `${baseId}-q${i}`;
        const panelId = `${baseId}-a${i}`;
        return (
          <li
            key={item.question}
            className={`rounded-2xl border bg-surface transition-[border-color,box-shadow] duration-300 has-[button:focus-visible]:ring-2 has-[button:focus-visible]:ring-brand ${
              isOpen ? "border-transparent shadow-panel" : "border-line hover:border-ink/20"
            }`}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-h-16 w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left font-sans text-lg leading-snug font-medium focus-visible:outline-none md:px-6"
              >
                {item.question}
                <span
                  aria-hidden="true"
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors duration-300 ${
                    isOpen ? "bg-brand text-white" : "bg-mist text-ink"
                  }`}
                >
                  <Plus
                    className={`h-4 w-4 transition-transform duration-300 ease-out-expo motion-reduce:transition-none ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out-expo motion-reduce:transition-none ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-prose px-5 pb-5 text-ink-muted md:px-6">{item.answer}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
