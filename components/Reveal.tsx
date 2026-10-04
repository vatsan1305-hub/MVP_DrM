"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Fallback for browsers without CSS scroll-driven animations: adds
 * `is-visible` to [data-reveal] elements as they enter the viewport.
 * Where `animation-timeline: view()` is supported, CSS does the work.
 */
export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (CSS.supports?.("animation-timeline: view()")) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
