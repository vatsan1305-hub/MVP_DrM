import type { ReactNode } from "react";

/** Visible staging-only marker for content gaps. Remove before launch. */
export default function Todo({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 border border-dashed border-accent bg-surface px-3 py-2 font-sans text-sm text-ink">
      <strong className="font-medium text-accent">TODO:</strong> {children}
    </p>
  );
}
