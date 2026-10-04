"use client";

import { useId, useState } from "react";
import type { Faq as FaqItem } from "@/lib/content";

/**
 * Accessible accordion. Answers are always in the HTML (GEO capsule format:
 * answer directly under its question) and match the FAQPage JSON-LD exactly.
 */
export default function Faq({ items }: { items: FaqItem[] }) {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="border-t border-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${baseId}-q${i}`;
        const panelId = `${baseId}-a${i}`;
        return (
          <article key={item.q} className="border-b border-line">
            <h3 className="text-xl md:text-[1.375rem]">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left transition-colors duration-150 ease-out hover:text-accent"
              >
                <span>{item.q}</span>
                <span aria-hidden="true" className="relative mt-2 h-4 w-4 shrink-0">
                  <span className="absolute top-1/2 left-0 h-0.5 w-4 -translate-y-1/2 bg-current" />
                  <span
                    className={`absolute top-0 left-1/2 h-4 w-0.5 -translate-x-1/2 bg-current transition-transform duration-150 ease-out ${isOpen ? "scale-y-0" : ""}`}
                  />
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={btnId} hidden={!isOpen}>
              <p className="max-w-3xl pb-7 text-ink-2">{item.a}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
