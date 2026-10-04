import type { Metadata } from "next";
import Link from "next/link";
import Faq from "@/components/Faq";
import Img from "@/components/Img";
import JsonLd from "@/components/JsonLd";
import Section from "@/components/Section";
import Todo from "@/components/Todo";
import { home } from "@/lib/content";
import { homeSchema } from "@/lib/schema";
import { contact, primaryCta, site } from "@/lib/site";
import { btnPrimary, btnSecondary, container, textLink } from "@/lib/ui";

const pageUrl = `${site.url}/`;

export const metadata: Metadata = {
  title: { absolute: home.seo.title },
  description: home.seo.description,
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.brand,
    url: pageUrl,
    title: home.seo.title,
    description: home.seo.description,
    images: [{ url: `${site.url}${home.hero.image.src}`, width: 853, height: 947, alt: home.hero.image.alt }],
  },
};

const eyebrow = "text-sm font-medium tracking-[0.08em] text-ink-2 uppercase";

export default function HomePage() {
  const { hero, trust, couple, other, about, recognition, workshops, books, faq, closing } = home;

  return (
    <>
      <JsonLd data={homeSchema} />

      {/* 1.1 Hero — text left, portrait right; stacked text-first on mobile */}
      <section aria-labelledby="hero-heading" className="bg-bg">
        <div className={`${container} grid items-center gap-10 py-12 md:grid-cols-[1.1fr_0.9fr] md:gap-14 md:py-20 lg:gap-20 lg:py-24`}>
          <div>
            <p className={eyebrow}>{hero.eyebrow}</p>
            <h1 id="hero-heading" className="mt-5">
              {hero.h1}
            </h1>
            <p className="mt-6 font-serif text-2xl leading-snug text-ink italic md:text-[1.75rem]">{hero.subhead}</p>
            <p className="mt-6 max-w-xl text-ink-2">{hero.body}</p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
              <a href={primaryCta.href} className={btnPrimary}>
                {hero.cta}
              </a>
              <a href="#about" className={textLink}>
                {hero.secondary}
              </a>
            </div>
          </div>
          <div className="mx-auto w-full max-w-md md:max-w-none">
            <Img image={hero.image} priority className="rounded-[2px]" />
          </div>
        </div>
      </section>

      {/* 1.2 Trust strip */}
      <section aria-label="At a glance" className="border-y border-line bg-surface">
        <ul className={`${container} grid divide-y divide-line py-2 md:grid-cols-3 md:divide-x md:divide-y-0 md:py-10`}>
          {trust.map((t) => (
            <li key={t} className="py-5 text-center font-serif text-lg leading-snug text-ink md:px-8 md:py-0 md:text-xl">
              {t}
            </li>
          ))}
        </ul>
      </section>

      {/* 1.3 Couple therapy (featured) */}
      <Section labelledBy="couple-heading">
        <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:gap-16">
          <div>
            <h2 id="couple-heading">{couple.h2}</h2>
          </div>
          <div>
            <p className="border-l-2 border-accent pl-5 font-serif text-xl leading-relaxed text-ink md:text-[1.375rem]">
              {couple.answer}
            </p>
            <p className="mt-6 text-ink-2">{couple.body}</p>
          </div>
        </div>
        <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2 md:gap-8">
          {couple.cards.map((c) => (
            <article key={c.title} className="border-t-2 border-accent-soft bg-surface p-7 md:p-9">
              <h3>{c.title}</h3>
              <p className="mt-3 text-ink-2">{c.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-12">
          <a href={primaryCta.href} className={btnPrimary}>
            {couple.cta}
          </a>
        </div>
      </Section>

      {/* 1.4 Other ways I work */}
      <Section tone="surface" labelledBy="other-heading">
        <h2 id="other-heading">{other.h2}</h2>
        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-3 md:gap-10">
          {other.cards.map((c) => (
            <article key={c.title} className="border-t border-line pt-6">
              <h3>{c.title}</h3>
              <p className="mt-3 text-ink-2">{c.body}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* 1.5 About — image left, text right */}
      <Section id="about" labelledBy="about-heading">
        <div className="grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16 lg:gap-24">
          <div className="md:order-2">
            <h2 id="about-heading">{about.h2}</h2>
            <p className="mt-6 text-ink-2">{about.body}</p>
          </div>
          <div className="mx-auto w-full max-w-sm md:order-1 md:max-w-none">
            <Img image={about.image} />
          </div>
        </div>
      </Section>

      {/* 1.6 Recognition — text left, image right */}
      <Section tone="surface" labelledBy="recognition-heading">
        <div className="grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr] md:gap-16 lg:gap-24">
          <div>
            <h2 id="recognition-heading">{recognition.h2}</h2>
            <p className="mt-6 text-ink-2">{recognition.body}</p>
            <Todo>Award wording (category and presenter) awaits Dr M&rsquo;s confirmation.</Todo>
          </div>
          <div className="mx-auto w-full max-w-sm md:max-w-none">
            <Img image={recognition.image} />
            <Todo>
              This image shows a TWELL Magazine / SIWAA cover, not the Zee Telugu award described in the alt
              text. Replace with the correct award photo.
            </Todo>
          </div>
        </div>
      </Section>

      {/* 1.7 Workshops — image left, text right */}
      <Section labelledBy="workshops-heading">
        <div className="grid items-center gap-10 md:grid-cols-[1.25fr_0.75fr] md:gap-16 lg:gap-20">
          <div className="md:order-2">
            <h2 id="workshops-heading">{workshops.h2}</h2>
            <p className="mt-6 text-ink-2">{workshops.body}</p>
          </div>
          <div className="md:order-1">
            <Img image={workshops.image} />
          </div>
        </div>
      </Section>

      {/* 1.8 Books teaser — text left, covers right */}
      <Section tone="surface" labelledBy="books-heading">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
          <div>
            <h2 id="books-heading">{books.h2}</h2>
            <p className="mt-6 text-ink-2">{books.body}</p>
            <p className="mt-8">
              <Link href="/authors-shelf/" className={textLink}>
                {books.link}
              </Link>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-5 sm:gap-8">
            {books.covers.map((cover, i) => (
              <div key={cover.src} className={i === 1 ? "mt-10" : ""}>
                <Img image={cover} className="shadow-[0_1px_2px_rgb(26_26_26/0.12),0_12px_32px_-12px_rgb(26_26_26/0.25)]" />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 1.9 FAQ */}
      <Section labelledBy="faq-heading">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <h2 id="faq-heading">FAQ</h2>
          <Faq items={faq} />
        </div>
      </Section>

      {/* 1.10 Closing CTA */}
      <Section tone="surface" labelledBy="closing-heading">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="closing-heading">{closing.h2}</h2>
          <p className="mt-5 text-ink-2">{closing.body}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
            <a href={primaryCta.href} className={btnPrimary}>
              {closing.cta}
            </a>
            <a href={contact.phoneHref} className={btnSecondary}>
              Call
            </a>
            <a href={contact.whatsappHref} className={btnSecondary} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <a href={contact.emailHref} className={btnSecondary}>
              Email
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
