import type { Metadata } from "next";
import Faq from "@/components/Faq";
import Img from "@/components/Img";
import JsonLd from "@/components/JsonLd";
import Section from "@/components/Section";
import { shelf } from "@/lib/content";
import { shelfSchema } from "@/lib/schema";
import { primaryCta, site } from "@/lib/site";
import { btnPrimary, btnPrimaryOnDark, container, linkMore, narrow } from "@/lib/ui";

const pageUrl = `${site.url}/authors-shelf/`;

export const metadata: Metadata = {
  title: { absolute: shelf.seo.title },
  description: shelf.seo.description,
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.brand,
    url: pageUrl,
    title: shelf.seo.title,
    description: shelf.seo.description,
    images: [
      {
        url: `${site.url}${shelf.awakening.image.src}`,
        width: shelf.awakening.image.width,
        height: shelf.awakening.image.height,
        alt: shelf.awakening.image.alt,
      },
    ],
  },
};

const coverLight = "mx-auto rounded-md shadow-[0_2px_6px_rgb(26_26_26/0.15),0_30px_60px_-24px_rgb(26_26_26/0.45)]";
const coverDark = "mx-auto rounded-md shadow-[0_2px_6px_rgb(0_0_0/0.4),0_30px_60px_-20px_rgb(0_0_0/0.7)]";
const book = "flex min-h-[calc(100svh-3.25rem)] items-center";

export default function AuthorsShelfPage() {
  const { intro, awakening, emotionalMastery: em, author, faq, faqHeading } = shelf;
  // "Title: Subtitle" — the subtitle is set smaller; the heading text is unchanged.
  const [emTitle, emSubtitle] = em.h2.split(": ");

  return (
    <>
      <JsonLd data={shelfSchema} />

      {/* 2.1 Intro — centred Fraunces H1 */}
      <section aria-labelledby="shelf-heading" className="bg-bg" data-hero="">
        <div className={`${container} flex min-h-[60svh] flex-col items-center justify-center py-20 text-center md:py-28`}>
          <h1 id="shelf-heading" className="type-hero max-w-[16ch] text-[clamp(3rem,6.5vw,6.5rem)]">
            {intro.h1}
          </h1>
          <p className="type-lead hero-after mt-8 max-w-[32ch] font-normal text-ink-2">{intro.body}</p>
        </div>
      </section>

      {/* 2.2 The Awakening — light */}
      <Section tone="surface" labelledBy="awakening-heading" className={book}>
        <article className={`${container} grid items-center gap-12 text-center md:grid-cols-2 md:gap-20 md:text-left`}>
          <div data-reveal="">
            <Img image={awakening.image} className={coverLight} />
          </div>
          <div data-reveal="">
            <h2 id="awakening-heading" className="type-h2">
              {awakening.h2}
            </h2>
            <p className="type-lead mx-auto mt-6 max-w-[34ch] font-normal text-ink-2 md:mx-0">{awakening.body}</p>
            <p className="mt-5 text-[1rem] text-ink-2">{awakening.detail}</p>
            <p className="mt-1 text-[1rem] text-ink-2 italic">{awakening.note}</p>
            <a href={awakening.url} className={`${btnPrimary} mt-9`} target="_blank" rel="noopener noreferrer">
              {awakening.cta}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </article>
      </Section>

      {/* 2.3 Emotional Mastery — dark */}
      <Section tone="dark" labelledBy="em-heading" className={book}>
        <article className={`${container} grid items-center gap-12 text-center md:grid-cols-2 md:gap-20 md:text-left`}>
          <div data-reveal="" className="md:order-2">
            <Img image={em.image} className={coverDark} />
          </div>
          <div data-reveal="">
            <h2 id="em-heading" className="type-h2">
              <span className="block">
                {emTitle}
                <span className="sr-only">:</span>
              </span>{" "}
              <span className="type-h3 mt-3 block font-medium text-bg/80">{emSubtitle}</span>
            </h2>
            <p className="type-lead mx-auto mt-6 max-w-[34ch] font-normal text-bg/80 md:mx-0">{em.body}</p>
            <h3 className="mt-9 text-[1rem] font-medium tracking-normal text-accent-soft">{em.learnHeading}</h3>
            <ul className="mx-auto mt-4 max-w-[34ch] space-y-2 text-left text-bg/80 md:mx-0">
              {em.learn.map((l) => (
                <li key={l} className="flex gap-4">
                  <span aria-hidden="true" className="mt-[0.8em] h-px w-4 shrink-0 bg-accent-soft" />
                  <span>{l}</span>
                </li>
              ))}
            </ul>
            <a href={em.url} className={`${btnPrimaryOnDark} mt-10`} target="_blank" rel="noopener noreferrer">
              {em.cta}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </article>
      </Section>

      {/* 2.4 Author note */}
      <Section tone="bg" labelledBy="author-heading">
        <div className={`${narrow} text-center`} data-reveal="">
          <h2 id="author-heading" className="type-h2">
            {author.h2}
          </h2>
          <p className="type-lead mt-8 font-normal text-ink-2">{author.body}</p>
          <p className="mt-10">
            <a href={primaryCta.href} className={linkMore}>
              {author.link}
            </a>
          </p>
        </div>
      </Section>

      {/* 2.5 FAQ */}
      <Section tone="surface" labelledBy="faq-heading">
        <div className={narrow}>
          <h2 id="faq-heading" className="type-h2 mb-12 text-center md:mb-16">
            {faqHeading}
          </h2>
          <Faq items={faq} />
        </div>
      </Section>
    </>
  );
}
