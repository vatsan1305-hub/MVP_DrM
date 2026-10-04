// Shared class strings so CTAs look and behave the same everywhere.
// Hover = 150ms ease-out colour shift, nothing more.

const pill =
  "inline-flex min-h-12 items-center justify-center rounded-full px-7 py-3 text-[1.0625rem] font-medium transition-colors duration-150 ease-out";

export const btnPrimary = `${pill} bg-accent text-surface hover:bg-ink`;

/** Primary pill for dark (ink) sections — hover flips to a light pill. */
export const btnPrimaryOnDark = `${pill} bg-accent text-surface hover:bg-bg hover:text-ink`;

export const btnSecondary = `${pill} border border-ink text-ink hover:bg-ink hover:text-bg`;

/** Apple-style "Learn more ›" link. */
export const linkMore =
  "inline-flex items-center text-[1.0625rem] font-medium text-accent underline-offset-4 transition-colors duration-150 ease-out hover:text-ink hover:underline md:text-[1.1875rem]";

/** "Learn more ›" on ink — accent-soft keeps AA contrast. */
export const linkMoreOnDark =
  "inline-flex items-center text-[1.0625rem] font-medium text-accent-soft underline-offset-4 transition-colors duration-150 ease-out hover:text-bg hover:underline md:text-[1.1875rem]";

export const textLink =
  "font-medium text-accent underline decoration-accent-soft decoration-2 underline-offset-4 transition-colors duration-150 ease-out hover:text-ink hover:decoration-ink";

export const container = "mx-auto w-full max-w-6xl px-5 sm:px-8";

/** Narrow centred column for statements, FAQ and closing copy. */
export const narrow = "mx-auto w-full max-w-[47.5rem] px-5 sm:px-8";

/** Rounded tile (bento / cards). */
export const tile = "rounded-3xl p-8 md:p-12";
