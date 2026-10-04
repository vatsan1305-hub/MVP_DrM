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

## Design doctrine — warm-therapeutic, premium, author-led
- Palette (Tailwind tokens in `app/globals.css`, nothing else):
  bg `#FAF9F5`, surface `#FFFFFF`, ink `#1A1A1A`, ink-2 `#4A4A4A`, accent `#B8501A`,
  accent-soft `#E9C9B2`, line `#D9D6CE`. No gradients, no bright primaries.
  Never put accent text on accent-soft (fails AA).
- Fonts: Fraunces (headings, 400–600) and Figtree (body, 400/500) via next/font/google.
- Type: H1 48–72px desktop, H2 32–40px, body 17–19px (never < 16px mobile), line-height 1.6–1.7.
- Sections: 80–120px vertical padding on desktop; alternate bg / surface backgrounds.
- Editorial layout: alternating left/right text + image blocks. No sidebars, no stock-photo
  clichés, no icons-in-circles grids.
- Motion that whispers: CTA hover colour shift 150ms ease-out; one-direction fade-in on
  section entry (max 300ms, no bounce); respect prefers-reduced-motion. No parallax, no
  animated hero text, no animation libraries.
- Mobile: full-screen overlay menu, accessible FAQ accordion, sticky bottom Call / WhatsApp /
  Email bar.

## Accessibility & performance
- Semantic landmarks, one H1 per page, WCAG AA contrast, visible focus, full keyboard support.
- Every image: alt text from content.md, explicit width/height, `loading="lazy"` except the hero.
- Use `components/Img.tsx` (applies the base path); keep client JS minimal.

## Build / deploy
- Static export for GitHub Pages under base path `/MVP_DrM` (see `next.config.ts`).
- Internal links via `next/link`; public assets via `asset()` from `lib/site.ts`.
- Deploy: `.github/workflows/deploy.yml` on push to `main`.
