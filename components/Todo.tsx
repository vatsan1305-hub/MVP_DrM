"use client";

import { Suspense, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";

function ReviewOnly({ children }: { children: ReactNode }) {
  const review = useSearchParams().get("review") === "1";
  if (!review) return null;
  return (
    <p className="mt-4 border border-dashed border-accent bg-surface px-3 py-2 font-sans text-sm text-ink">
      <strong className="font-medium text-accent">TODO:</strong> {children}
    </p>
  );
}

/**
 * Staging-only marker for content gaps. Hidden by default; shown only when the
 * URL has ?review=1. Resolved client-side, so it is never in the static HTML.
 * Remove before launch.
 */
export default function Todo({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ReviewOnly>{children}</ReviewOnly>
    </Suspense>
  );
}
