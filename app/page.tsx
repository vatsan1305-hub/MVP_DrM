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
import { btnPrimary, btnSecondary, container, linkMore, linkMoreOnDark, narrow, tile } from "@/lib/ui";

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

/** Split a headline into two balanced lines for the line-by-line reveal. */
function twoLines(text: string) {
  const words = text.split(" ");
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

export default function HomePage() {
  const { hero, trust, statement, couple, other, about, recognition, workshops, books, faq, faqHeading, closing } =
    home;
  const [featured, ...smaller] = other.cards;

  return (
    <>
      <JsonLd data={homeSchema} />

      {/* 1.1 Hero — centred text, portrait tile rising beneath it */}
      <section aria-labelledby="hero-heading" className="bg-bg" data-hero="">
        <div
          className={`${container} flex min-h-[calc(100svh-3.25rem-11rem)] flex-col items-center justify-center pt-14 pb-12 text-center md:min-h-[calc(100svh-3.25rem-9rem)] md:pt-16`}
        >
          <p className="eyebrow hero-after text-ink-2">{hero.eyebrow}</p>
          <h1 id="hero-heading" className="type-hero mt-6 md:mt-8">
            {twoLines(hero.h1).map((line, i) => (
              <span key={line} className="hero-line">
                {line}
                {i === 0 ? " " : null}
              </span>
            ))}
          </h1>
          <p className="type-lead hero-after mt-6 max-w-[34ch] text-ink-2 md:mt-8">{hero.subhead}</p>
          <div className="hero-after mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:mt-10">
            <a href={primaryCta.href} className={btnPrimary}>
              {hero.cta}
            </a>
            <a href="#about" className={linkMore}>
              {hero.secondary}
            </a>
          </div>
        </div>
        <div className={`${container} pb-16 md:pb-24`}>
          <div data-reveal="lift" className="mx-auto w-full max-w-[42rem]">
            <Img image={hero.image} priority className="mx-auto rounded-3xl" />
          </div>
        </div>
      </section>

      {/* 1.2 Trust line — one quiet row */}
      <section aria-label="At a glance" className="bg-bg pb-16 md:pb-24">
        <ul className={`${container} flex flex-col items-center gap-2 text-center text-[0.9375rem] text-ink-2 md:flex-row md:justify-center md:gap-0`}>
          {trust.map((t, i) => (
            <li key={t} className="flex items-center">
              {i > 0 ? (
                <span aria-hidden="true" className="mx-5 hidden h-1 w-1 rounded-full bg-line md:inline-block" />
              ) : null}
              {t}
            </li>
          ))}
        </ul>
      </section>

      {/* 1.3 Statement band (dark) */}
      <section className="on-dark flex min-h-[80svh] items-center py-24 md:py-32">
        <p className={`${container} type-statement mx-auto max-w-5xl text-center`}>
          <span data-reveal="" className="block">
            {statement[0]}
          </span>{" "}
          <span data-reveal="late" className="mt-2 block text-accent-soft">
            {statement[1]}
          </span>
        </p>
      </section>

      {/* 1.4 Couple therapy */}
      <Section tone="surface" labelledBy="couple-heading">
        <div className={`${container} text-center`}>
          <h2 id="couple-heading" data-reveal="" className="type-h2 mx-auto max-w-[18ch]">
            {couple.h2}
          </h2>
          <p data-reveal="" className="type-lead mx-auto mt-8 max-w-[40ch] text-ink-2">
            {couple.answer}
          </p>
        </div>
        <div className={`${container} mt-14 grid gap-5 md:mt-20 md:grid-cols-2 md:gap-6`}>
          {couple.cards.map((c) => (
            <article key={c.title} data-reveal="" className={`${tile} flex min-h-[16rem] flex-col bg-bg md:min-h-[20rem]`}>
              <h3 className="type-h2 max-w-[11ch] text-[clamp(2rem,3.4vw,3rem)]">{c.title}</h3>
              <p className="mt-auto max-w-[34ch] pt-8 text-ink-2">{c.body}</p>
            </article>
          ))}
        </div>
        <p className={`${container} mt-12 text-center`}>
          <a href={primaryCta.href} className={linkMore}>
            {couple.cta}
          </a>
        </p>
      </Section>

      {/* 1.5 Services bento */}
      <Section labelledBy="other-heading">
        <div className={container}>
          <h2 id="other-heading" data-reveal="" className="type-h2 text-center">
            {other.h2}
          </h2>
          <div className="mt-14 grid gap-5 md:mt-20 md:grid-cols-5 md:grid-rows-2 md:gap-6">
            <article
              data-reveal=""
              className={`${tile} flex flex-col justify-end border border-line bg-surface md:col-span-3 md:row-span-2 md:min-h-[32rem] md:p-14`}
            >
              <h3 className="type-h2 max-w-[12ch]">{featured.title}</h3>
              <p className="type-lead mt-6 max-w-[30ch] font-normal text-ink-2">{featured.body}</p>
            </article>
            {smaller.map((c) => (
              <article key={c.title} data-reveal="" className={`${tile} flex flex-col justify-end border border-line bg-surface md:col-span-2`}>
                <h3 className="type-h3">{c.title}</h3>
                <p className="mt-3 text-ink-2">{c.body}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>

      {/* 1.6 About — sticky scrollytelling on desktop, stacked on mobile */}
      <Section tone="surface" id="about" labelledBy="about-heading" className="md:py-0 lg:py-0">
        <div className={`${container} grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-24`}>
          <div className="md:py-28 lg:py-32">
            <div className="md:sticky md:top-[max(5rem,calc(50svh-18.75rem))]">
              <Img image={about.image} className="mx-auto rounded-3xl" />
            </div>
          </div>
          <div className="md:py-[12svh]">
            {about.beats.map((beat, i) => (
              <div key={beat} className="flex flex-col justify-center py-6 md:min-h-[76svh] md:py-0">
                <div data-reveal="">
                  {i === 0 ? (
                    <>
                      <h2 id="about-heading" className="type-h2">
                        {about.h2}
                      </h2>
                      <p className="type-lead mt-8 text-ink-2">{beat}</p>
                    </>
                  ) : i === about.beats.length - 1 ? (
                    <blockquote className="type-quote border-l-2 border-accent pl-6 md:pl-8">
                      <p>{beat}</p>
                    </blockquote>
                  ) : (
                    <p className="type-h2 text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold">{beat}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 1.7 Recognition + 1.8 Workshops — two-tile row */}
      <Section>
        <div className={`${container} grid gap-5 md:grid-cols-2 md:gap-6`}>
          <article data-reveal="" aria-labelledby="recognition-heading" className="flex flex-col rounded-3xl bg-surface p-4 md:p-5">
            <Img image={recognition.image} className="mx-auto aspect-[3/2] rounded-2xl object-cover" />
            <div className="flex flex-1 flex-col px-4 pt-7 pb-4 md:px-6 md:pt-9 md:pb-6">
              <h2 id="recognition-heading" className="type-h3">
                {recognition.h2}
              </h2>
              <p className="mt-3 text-ink-2">{recognition.caption}</p>
              <Todo>Award wording (category and presenter) awaits Dr M&rsquo;s confirmation.</Todo>
              <Todo>
                This image shows a TWELL Magazine / SIWAA cover, not the Zee Telugu award described in the alt text.
                Replace with the correct award photo.
              </Todo>
            </div>
          </article>
          <article data-reveal="" aria-labelledby="workshops-heading" className="flex flex-col rounded-3xl bg-surface p-4 md:p-5">
            <Img image={workshops.image} className="mx-auto aspect-[3/2] rounded-2xl object-cover" />
            <div className="px-4 pt-7 pb-4 md:px-6 md:pt-9 md:pb-6">
              <h2 id="workshops-heading" className="type-h3">
                {workshops.h2}
              </h2>
              <p className="mt-3 text-ink-2">{workshops.caption}</p>
            </div>
          </article>
        </div>
      </Section>

      {/* 1.9 Books (dark) */}
      <Section tone="dark" labelledBy="books-heading">
        <div className={`${container} text-center`}>
          <h2 id="books-heading" data-reveal="" className="type-h2">
            {books.h2}
          </h2>
          <p data-reveal="" className="type-lead mx-auto mt-6 max-w-[32ch] font-normal text-bg/80">
            {books.body}
          </p>
          <div className="mx-auto mt-14 grid max-w-[44rem] grid-cols-2 gap-5 sm:gap-10 md:mt-20">
            {books.covers.map((cover) => (
              <div key={cover.src} data-reveal="">
                <Img
                  image={cover}
                  className="mx-auto rounded-md shadow-[0_2px_6px_rgb(0_0_0/0.4),0_30px_60px_-20px_rgb(0_0_0/0.7)]"
                />
              </div>
            ))}
          </div>
          <p className="mt-14 md:mt-16">
            <Link href="/authors-shelf/" className={linkMoreOnDark}>
              {books.link}
            </Link>
          </p>
        </div>
      </Section>

      {/* 1.10 FAQ */}
      <Section tone="surface" labelledBy="faq-heading">
        <div className={narrow}>
          <h2 id="faq-heading" className="type-h2 mb-12 text-center md:mb-16">
            {faqHeading}
          </h2>
          <Faq items={faq} />
        </div>
      </Section>

      {/* 1.11 Closing CTA */}
      <Section labelledBy="closing-heading" className="md:py-36 lg:py-44">
        <div className={`${narrow} text-center`}>
          <h2 id="closing-heading" data-reveal="" className="type-statement font-sans font-semibold tracking-[-0.035em]">
            {closing.h2}
          </h2>
          <p className="type-lead mx-auto mt-8 max-w-[30ch] font-normal text-ink-2">{closing.body}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href={contact.phoneHref} className={`${btnPrimary} w-full sm:w-auto`}>
              {closing.buttons.call}
            </a>
            <a
              href={contact.whatsappHref}
              className={`${btnSecondary} w-full sm:w-auto`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {closing.buttons.whatsapp}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a href={contact.emailHref} className={`${btnSecondary} w-full sm:w-auto`}>
              {closing.buttons.email}
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
