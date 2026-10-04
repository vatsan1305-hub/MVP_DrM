import type { Metadata } from "next";
import Faq from "@/components/Faq";
import Img from "@/components/Img";
import JsonLd from "@/components/JsonLd";
import Section from "@/components/Section";
import { shelf } from "@/lib/content";
import { shelfSchema } from "@/lib/schema";
import { primaryCta, site } from "@/lib/site";
import { btnPrimary, container, textLink } from "@/lib/ui";

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

const cover = "shadow-[0_1px_2px_rgb(26_26_26/0.12),0_16px_40px_-16px_rgb(26_26_26/0.3)]";

export default function AuthorsShelfPage() {
  const { intro, awakening, emotionalMastery: em, author, faq } = shelf;

  return (
    <>
      <JsonLd data={shelfSchema} />

      {/* 2.1 Intro */}
      <section aria-labelledby="shelf-heading" className="bg-bg">
        <div className={`${container} py-14 md:py-24 lg:py-28`}>
          <div className="max-w-3xl">
            <h1 id="shelf-heading">{intro.h1}</h1>
            <p className="mt-7 text-ink-2 md:text-[1.1875rem]">{intro.body}</p>
          </div>
        </div>
      </section>

      {/* 2.2 The Awakening — cover left, text right */}
      <Section tone="surface" labelledBy="awakening-heading">
        <article className="grid items-center gap-10 md:grid-cols-[0.7fr_1.3fr] md:gap-16 lg:gap-24">
          <div className="md:order-2">
            <h2 id="awakening-heading">{awakening.h2}</h2>
            <p className="mt-6 text-ink-2">{awakening.body}</p>
            <p className="mt-4 text-[0.9375rem] text-ink-2 italic">{awakening.note}</p>
            <a href={awakening.url} className={`${btnPrimary} mt-8`} target="_blank" rel="noopener noreferrer">
              {awakening.cta}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
          <div className="mx-auto w-full max-w-[16rem] md:order-1 md:max-w-xs">
            <Img image={awakening.image} className={cover} />
          </div>
        </article>
      </Section>

      {/* 2.3 Emotional Mastery — text left, cover right */}
      <Section labelledBy="em-heading">
        <article className="grid items-center gap-10 md:grid-cols-[1.3fr_0.7fr] md:gap-16 lg:gap-24">
          <div>
            <h2 id="em-heading">{em.h2}</h2>
            <p className="mt-6 text-ink-2">{em.body}</p>
            <h3 className="mt-8 text-xl">{em.learnHeading}</h3>
            <ul className="mt-4 space-y-3">
              {em.learn.map((l) => (
                <li key={l} className="flex gap-4 text-ink-2">
                  <span aria-hidden="true" className="mt-[0.8em] h-px w-5 shrink-0 bg-accent" />
                  <span>{l}</span>
                </li>
              ))}
            </ul>
            <a href={em.url} className={`${btnPrimary} mt-9`} target="_blank" rel="noopener noreferrer">
              {em.cta}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
          <div className="mx-auto w-full max-w-[16rem] md:max-w-xs">
            <Img image={em.image} className={cover} />
          </div>
        </article>
      </Section>

      {/* 2.4 Author note */}
      <Section tone="surface" labelledBy="author-heading">
        <div className="max-w-3xl">
          <h2 id="author-heading">{author.h2}</h2>
          <p className="mt-6 text-ink-2">{author.body}</p>
          <p className="mt-8">
            <a href={primaryCta.href} className={textLink}>
              {author.link}
            </a>
          </p>
        </div>
      </Section>

      {/* 2.5 FAQ */}
      <Section labelledBy="faq-heading">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <h2 id="faq-heading">FAQ</h2>
          <Faq items={faq} />
        </div>
      </Section>
    </>
  );
}
