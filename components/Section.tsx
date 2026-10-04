import type { ReactNode } from "react";
import { container } from "@/lib/ui";

type Props = {
  children: ReactNode;
  tone?: "bg" | "surface";
  id?: string;
  labelledBy?: string;
  className?: string;
  reveal?: boolean;
};

/** Page section with the alternating background and editorial padding. */
export default function Section({
  children,
  tone = "bg",
  id,
  labelledBy,
  className = "",
  reveal = true,
}: Props) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`${tone === "surface" ? "bg-surface" : "bg-bg"} py-16 md:py-24 lg:py-28 ${className}`}
    >
      <div className={container} data-reveal={reveal ? "" : undefined}>
        {children}
      </div>
    </section>
  );
}
