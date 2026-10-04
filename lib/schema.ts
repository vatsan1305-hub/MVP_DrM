// JSON-LD per content.md §3. FAQ entities are built from the same arrays the
// visible FAQ renders, so the text always matches exactly.
import { home, shelf, type Faq } from "@/lib/content";
import { contact, site } from "@/lib/site";

const ids = {
  org: `${site.url}/#organization`,
  service: `${site.url}/#service`,
  person: `${site.url}/#person`,
};

const address = {
  "@type": "PostalAddress",
  streetAddress: contact.address.street,
  addressLocality: contact.address.locality,
  addressRegion: contact.address.region,
  postalCode: contact.address.postalCode,
  addressCountry: contact.address.country,
};

const person = {
  "@type": "Person",
  "@id": ids.person,
  name: site.person,
  jobTitle: site.jobTitle,
  image: `${site.url}${home.hero.image.src}`,
  worksFor: { "@id": ids.org },
  award: home.trust[1],
  address,
};

const faqPage = (items: Faq[], url: string) => ({
  "@type": "FAQPage",
  "@id": `${url}#faq`,
  mainEntity: items.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ids.org,
      name: site.brand,
      legalName: site.legalName,
      url: `${site.url}/`,
      logo: `${site.url}/images/logo.webp`,
      email: contact.email,
      telephone: contact.phoneE164,
      address,
      founder: { "@id": ids.person },
    },
    {
      "@type": "ProfessionalService",
      "@id": ids.service,
      name: site.brand,
      url: `${site.url}/`,
      image: `${site.url}${home.hero.image.src}`,
      email: contact.email,
      telephone: contact.phoneE164,
      address,
      parentOrganization: { "@id": ids.org },
      employee: { "@id": ids.person },
    },
    person,
    faqPage(home.faq, `${site.url}/`),
  ],
};

const books = [shelf.awakening, shelf.emotionalMastery].map((b) => ({
  "@type": "Book",
  name: b.h2,
  author: { "@id": ids.person },
  url: b.url,
  image: `${site.url}${b.image.src}`,
}));

export const shelfSchema = {
  "@context": "https://schema.org",
  "@graph": [person, ...books, faqPage(shelf.faq, `${site.url}/authors-shelf/`)],
};
