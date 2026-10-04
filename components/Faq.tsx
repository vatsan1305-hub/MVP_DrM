"use client";

import { useId, useState } from "react";
import type { Faq as FaqItem } from "@/lib/content";

/**
 * Accessible accordion with thin dividers and a + that rotates to ×.
 * Answers are always in the HTML (GEO capsule format: answer directly under
 * its question) and match the FAQPage JSON-LD exactly. Closed panels are
 * collapsed with grid rows and `invisible`, so they leave the tab order and
 * accessibility tree until opened.
 */
export default function Faq({ items }: { items: FaqItem[] }) {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="border-t border-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${baseId}-q${i}`;
        const panelId = `${baseId}-a${i}`;
        return (
          <div key={item.q} className="border-b border-line">
            <h3 className="text-[1.1875rem] tracking-[-0.015em] md:text-[1.375rem]">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors duration-150 ease-out hover:text-accent md:py-7"
              >
                <span>{item.q}</span>
                <span
                  aria-hidden="true"
                  className={`relative h-4 w-4 shrink-0 transition-transform duration-300 ease-out ${isOpen ? "rotate-45" : ""}`}
                >
                  <span className="absolute top-1/2 left-0 h-[1.5px] w-4 -translate-y-1/2 bg-current" />
                  <span className="absolute top-0 left-1/2 h-4 w-[1.5px] -translate-x-1/2 bg-current" />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className={`grid transition-[grid-template-rows,visibility] duration-300 ease-out ${isOpen ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p className="pr-10 pb-7 text-ink-2">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
