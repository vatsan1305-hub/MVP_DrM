import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  tone?: "bg" | "surface" | "dark";
  id?: string;
  labelledBy?: string;
  className?: string;
};

const tones = {
  bg: "bg-bg text-ink",
  surface: "bg-surface text-ink",
  dark: "on-dark",
} as const;

/** Full-width page section: background tone plus generous vertical padding. */
export default function Section({ children, tone = "bg", id, labelledBy, className = "" }: Props) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`${tones[tone]} py-20 md:py-28 lg:py-32 ${className}`}>
      {children}
    </section>
  );
}
