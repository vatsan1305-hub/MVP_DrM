// Single source of contact details and site-level constants.
// Values come from content.md §0 — change them here, never inline.

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a public/ path with the GitHub Pages base path. */
export const asset = (path: string) => `${basePath}${path}`;

export const site = {
  brand: "La Winspire",
  legalName: "La Winspire International Training & Solutions LLP",
  person: "Dr. P. Madhurima Reddy",
  personShort: "Dr. Madhurima",
  jobTitle: "Psychologist",
  experience: "28 years",
  // Staging URL (GitHub Pages). Update when the production domain is live.
  url: "https://vatsan1305-hub.github.io/MVP_DrM",
  locale: "en_IN",
} as const;

export const contact = {
  phoneDisplay: "+91 91007 31594",
  phoneE164: "+919100731594",
  phoneHref: "tel:+919100731594",
  // [CONFIRM] number is on WhatsApp — content.md §5.1
  whatsappDisplay: "+91 91007 31594",
  whatsappHref: "https://wa.me/919100731594",
  email: "info@lawinspire.com",
  emailHref: "mailto:info@lawinspire.com",
  address: {
    street: "#77 Magadha Village, Kokapet",
    locality: "Hyderabad",
    region: "Telangana",
    postalCode: "500075",
    country: "IN",
    display: "#77 Magadha Village, Kokapet, Hyderabad, Telangana 500075",
  },
} as const;

export type NavItem = { label: string; href: string; tag?: string };

export const nav: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Author's Shelf", href: "/authors-shelf/" },
  { label: "Companion", href: "/companion/", tag: "Demo" },
  { label: "Contact", href: "#contact" },
];

export const primaryCta = { label: "Book a consultation", href: "#contact" } as const;

// ── Companion (demo) ─────────────────────────────────────────────────────────
// The AWS Lambda Function URL (see lambda/README.md). While it is still the
// placeholder, /companion/ shows a "being set up" state instead of the chat.
export const companionEndpoint: string = "REPLACE_WITH_LAMBDA_FUNCTION_URL";

/** False until companionEndpoint is a real https:// URL. */
export const companionReady = companionEndpoint.startsWith("https://");

export const companion = {
  /** Keep in step with MAX_USER_MESSAGES on the Lambda (the Lambda's value wins at runtime). */
  maxMessages: 10,
  maxChars: 1000,
  /** Character counter appears from this length. */
  counterFrom: 800,
  teleManasHref: "tel:14416",
  emergencyHref: "tel:112",
} as const;
