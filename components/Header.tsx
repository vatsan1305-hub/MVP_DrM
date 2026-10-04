"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { asset, nav, primaryCta, site } from "@/lib/site";
import { btnPrimary, container } from "@/lib/ui";

function NavLink({
  href,
  label,
  className,
  onClick,
  current,
}: {
  href: string;
  label: string;
  className: string;
  onClick?: () => void;
  current?: boolean;
}) {
  if (href.startsWith("#")) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick} aria-current={current ? "page" : undefined}>
      {label}
    </Link>
  );
}

/**
 * Logo. The source file also contains a badge on its right half, so the
 * wordmark area (x 30–288, y 12–158 of 627×232) is cropped with CSS.
 */
function Logo() {
  return (
    <span className="relative block aspect-[258/146] h-9 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset("/images/logo.webp")}
        alt={site.brand}
        width={627}
        height={232}
        loading="eager"
        className="absolute top-[-8.22%] left-[-11.63%] h-auto w-[243.02%] max-w-none"
      />
    </span>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Lock page scroll, trap focus and close on Escape while the overlay is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      Array.from(menuRef.current?.querySelectorAll<HTMLElement>("a, button") ?? []);
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const items = [toggleRef.current, ...focusables()].filter(Boolean) as HTMLElement[];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Close the overlay when the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const isCurrent = (href: string) => href === pathname || (href !== "/" && pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40">
      {/* Translucent bar. The blur lives on this layer, not the header, because
          backdrop-filter would make the full-screen menu below position
          relative to the header instead of the viewport. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 border-b border-line/80 bg-bg/72 backdrop-blur-[20px] backdrop-saturate-[1.8]"
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-surface focus:px-4 focus:py-2 focus:text-sm"
      >
        Skip to content
      </a>
      <div className={`${container} relative flex h-13 items-center justify-between gap-6`}>
        <Link href="/" aria-label={`${site.brand} — Home`} className="relative z-50 shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          <ul className="flex items-center gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <NavLink
                  {...item}
                  current={isCurrent(item.href)}
                  className="text-[0.875rem] text-ink underline-offset-[6px] transition-colors duration-150 ease-out hover:text-accent aria-[current=page]:underline aria-[current=page]:decoration-accent"
                />
              </li>
            ))}
          </ul>
          <a
            href={primaryCta.href}
            className="inline-flex min-h-8 items-center rounded-full bg-accent px-4 py-1 text-[0.875rem] font-medium text-surface transition-colors duration-150 ease-out hover:bg-ink"
          >
            {primaryCta.label}
          </a>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="relative z-50 -mr-2 inline-flex h-11 w-11 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => (open ? close() : setOpen(true))}
        >
          <span aria-hidden="true" className="relative block h-3.5 w-6">
            <span
              className={`absolute left-0 h-0.5 w-6 bg-ink transition-transform duration-150 ease-out ${open ? "top-1.5 rotate-45" : "top-0"}`}
            />
            <span
              className={`absolute left-0 h-0.5 w-6 bg-ink transition-transform duration-150 ease-out ${open ? "top-1.5 -rotate-45" : "top-3"}`}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="fixed inset-0 z-40 overflow-y-auto bg-bg pt-20 md:hidden"
      >
        <nav aria-label="Mobile" className={`${container} flex min-h-full flex-col pb-10`}>
          <ul className="border-t border-line">
            {nav.map((item) => (
              <li key={item.href} className="border-b border-line">
                <NavLink
                  {...item}
                  current={isCurrent(item.href)}
                  onClick={() => close(false)}
                  className="block py-5 text-[2rem] font-semibold tracking-[-0.025em] text-ink aria-[current=page]:text-accent"
                />
              </li>
            ))}
          </ul>
          <a href={primaryCta.href} onClick={() => close(false)} className={`${btnPrimary} mt-10 w-full`}>
            {primaryCta.label}
          </a>
        </nav>
      </div>
    </header>
  );
}
