# MVP_DrM — La Winspire

Staging website for La Winspire (Dr. P. Madhurima Reddy). Next.js (App Router) +
TypeScript + Tailwind CSS, exported as a static site for GitHub Pages.

> **Staging:** every page is `noindex, nofollow` and `robots.txt` disallows everything.
> Do not remove this — see `CLAUDE.md`.

## Run locally

Requires Node 20.9+.

```bash
npm install
npm run dev        # http://localhost:3000/MVP_DrM/
npm run build      # static export to out/
npm run lint       # TypeScript check
```

To preview the export exactly as GitHub Pages serves it (under `/MVP_DrM/`):

```bash
mkdir -p /tmp/preview && ln -sfn "$PWD/out" /tmp/preview/MVP_DrM
python3 -m http.server 4173 -d /tmp/preview   # http://localhost:4173/MVP_DrM/
```

Verify staging protection after a build:

```bash
grep -L 'noindex' $(find out -name '*.html')   # must print nothing
cat out/robots.txt
```

## Project structure

```
app/
  layout.tsx            Root layout: fonts, noindex metadata, header/footer, mobile CTA bar
  page.tsx              Home (content.md §1)
  authors-shelf/page.tsx Author's Shelf (content.md §2)
  companion/page.tsx    Companion AI demo (content.md §3) — UI in components/Companion.tsx
  globals.css           Tailwind import, palette tokens, type scale, scroll-driven motion
components/
  Header.tsx            Logo, nav, CTA, mobile full-screen overlay menu (client)
  Footer.tsx            Contact details + Tele-MANAS safety line (id="contact")
  MobileCtaBar.tsx      Sticky Call / WhatsApp / Email bar (mobile only, shown after the hero)
  Faq.tsx               Accessible accordion (client)
  Reveal.tsx            IntersectionObserver fallback for scroll reveals (client)
  Section.tsx, Img.tsx, JsonLd.tsx, Todo.tsx
lib/
  site.ts               Contact details, nav, base-path helper — single source
  content.ts            Copy mirrored verbatim from content.md
  schema.ts             JSON-LD (Organization, ProfessionalService, Person, Book, FAQPage)
  ui.ts                 Shared button/link class strings
public/
  images/               WebP assets
  robots.txt            Disallow all (staging)
  llms.txt              Plain-text summary for LLMs
  .nojekyll
content.md              The only source of copy
CLAUDE.md               Rules for future sessions
.github/workflows/deploy.yml  Build + deploy to GitHub Pages on push to main
```

## Deployment

Push to `main` (or run the workflow manually). In the repo settings, set
**Pages → Source** to **GitHub Actions**. The site is served at
`https://vatsan1305-hub.github.io/MVP_DrM/`.

## Companion (AI demo)

`/companion/` is a static page that talks to a separate AWS Lambda (`lambda/index.mjs`,
pasted into the AWS console — see `lambda/README.md` for every setting). Until
`companionEndpoint` in `lib/site.ts` is set to the Function URL, the page shows a
"being set up" state.

```bash
npm run test:lambda       # Lambda handler tests (fetch mocked, no key needed)
npm run check:guardrails  # lambda system prompt == guardrails.md
npm run sync:guardrails   # copy guardrails.md into the lambda
```
