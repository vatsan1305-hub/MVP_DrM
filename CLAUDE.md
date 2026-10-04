# CLAUDE.md — project rules for La Winspire (MVP_DrM)

Read this before changing anything. These rules apply to every session.

## Content
- `content.md` is the ONLY source of copy, SEO metadata, alt text, FAQs and schema notes.
- Copy is mirrored verbatim in `lib/content.ts`; change `content.md` first, then mirror it.
- Never invent copy, claims, statistics, testimonials or credentials. If something is
  missing, render a visible `<Todo>` and list it in the PR description.
- Brand name is always **La Winspire** (never "Law Inspire" / "Lawinspire").
- Experience is always **28 years**.
- Contact details (phone, WhatsApp, email, address) live only in `lib/site.ts`.
- FAQ JSON-LD is generated from the same arrays as the visible FAQ — keep it that way so
  the text always matches exactly.

## Health-category rules
- No clinical claims or promised outcomes.
- No patient identifiers, stories or case details.
- No before/after content.
- No testimonials or reviews.
- No superlatives such as "best psychologist", "top therapist", "#1".
- Keep the Tele-MANAS safety line in the footer.

## STAGING PROTECTION — never remove
- Root layout metadata keeps `robots: { index: false, follow: false }` so every page
  outputs `<meta name="robots" content="noindex, nofollow">`.
- `public/robots.txt` stays exactly `User-agent: *` / `Disallow: /`.
- No sitemap.xml on staging.
- After every build: `grep -L 'noindex' $(find out -name '*.html')` must print nothing.
- Only a deliberate, human-approved production launch may change this.

## Design doctrine — apple.com-style storytelling, warm & premium, author-led
One idea per screen, big confident type, dramatic changes of scale, light/dark contrast,
scroll-driven storytelling, very little copy. Warm and premium — a therapist-author, not a
tech launch.
- Palette unchanged (Tailwind tokens in `app/globals.css`, nothing else):
  bg `#FAF9F5`, surface `#FFFFFF`, ink `#1A1A1A`, ink-2 `#4A4A4A`, accent `#B8501A`,
  accent-soft `#E9C9B2`, line `#D9D6CE`. No gradients, no bright primaries.
  Never put accent text on accent-soft (fails AA).
- Dark sections use ink `#1A1A1A` as background with bg `#FAF9F5` text. Accent stays
  `#B8501A` for fills; accent text on ink fails AA, so use accent-soft `#E9C9B2` for accent
  text on dark.
- Fonts (via next/font/google): Fraunces ONLY for the hero H1, the giant statement band and
  pull-quotes. Figtree for everything else, including H2/H3, nav and buttons. Figtree
  headings: weight 600, letter-spacing -0.02em to -0.03em, line-height 1.05–1.1.
- Type scale: hero H1 `clamp(3rem, 8vw, 8rem)`; statement band `clamp(2.5rem, 6vw, 6rem)`;
  section H2 `clamp(2.25rem, 4.5vw, 4rem)`; body 17–19px, never below 16px on mobile.
- Layout: one idea per screen. Centred hero. Vary section scale on purpose. Bento tile grids
  allowed. No sidebars, no stock-photo clichés, no icons-in-circles.
- Motion (restrained): scroll-linked fades/rises, one sticky scrollytelling section, hero
  headline reveal on load (line by line, ≤ 900ms total). Use CSS scroll-driven animations
  (`animation-timeline: view()`) with an IntersectionObserver fallback. No animation
  libraries, no parallax backgrounds, no scroll-jacking, no autoplay video. Everything must
  fully respect prefers-reduced-motion (static, fully visible content).
- Images: never render a photo larger than its native pixel width. Prefer framed, rounded
  (16–24px) image tiles over full-bleed until hi-res originals arrive.
- Mobile: full-screen overlay menu, accessible FAQ accordion, sticky bottom Call / WhatsApp /
  Email bar that appears only after the hero has scrolled past and never covers content.

## Accessibility & performance
- Semantic landmarks, one H1 per page, WCAG AA contrast, visible focus, full keyboard support.
- Every image: alt text from content.md, explicit width/height, `loading="lazy"` except the hero.
- Use `components/Img.tsx` (applies the base path); keep client JS minimal.

## Build / deploy
- Static export for GitHub Pages under base path `/MVP_DrM` (see `next.config.ts`).
- Internal links via `next/link`; public assets via `asset()` from `lib/site.ts`.
- Deploy: `.github/workflows/deploy.yml` on push to `main`.
