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
