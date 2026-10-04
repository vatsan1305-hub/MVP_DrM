// Copy transcribed verbatim from content.md (the only source of copy).
// Section numbers match content.md. Do not add or reword copy here —
// change content.md first, then mirror it in this file.

export type Faq = { q: string; a: string };

export type Img = { src: string; alt: string; width: number; height: number };

const images = {
  portrait: {
    src: "/images/dr-madhurima-portrait.webp",
    alt: "Dr. P. Madhurima Reddy, psychologist, at La Winspire in Kokapet, Hyderabad",
    width: 853,
    height: 947,
  },
  full: {
    src: "/images/dr-madhurima-full.webp",
    alt: "Dr. P. Madhurima Reddy, founder of La Winspire",
    width: 410,
    height: 600,
  },
  award: {
    src: "/images/zee-telugu-award-2025.webp",
    alt: "Dr. P. Madhurima Reddy receiving the Zee Telugu News Achievers Award 2025",
    width: 573,
    height: 573,
  },
  workshop: {
    src: "/images/workshop-group.webp",
    alt: "Dr. P. Madhurima Reddy leading a group workshop",
    width: 1600,
    height: 1067,
  },
  awakening: {
    src: "/images/book-the-awakening.webp",
    alt: "Cover of The Awakening by Dr. P. Madhurima Reddy",
    width: 328,
    height: 522,
  },
  emotionalMastery: {
    src: "/images/book-emotional-mastery.webp",
    alt: "Cover of Emotional Mastery by Dr. P. Madhurima Reddy",
    width: 328,
    height: 522,
  },
} satisfies Record<string, Img>;

// §0 Footer
export const footer = {
  tagline: "La Winspire · Couple, family & individual therapy · Kokapet, Hyderabad",
  sessions: "Sessions in person (Kokapet) and online",
  safety:
    "Not an emergency service. If you are in crisis, call Tele-MANAS on 14416 (free, 24×7).",
  copyright: "© 2026 La Winspire International Training & Solutions LLP",
};

// §1 Home
export const home = {
  seo: {
    title: "Couple Therapy in Hyderabad | Dr. P. Madhurima Reddy — La Winspire",
    description:
      "Couple, pre-marital and individual therapy in Kokapet, Hyderabad with Dr. P. Madhurima Reddy — psychologist and author, 28 years in practice. In person or online.",
  },
  hero: {
    eyebrow: "Psychologist · Author · Kokapet, Hyderabad",
    h1: "Couple Therapy in Hyderabad",
    subhead: "Relationships are learned. So is finding your way back.",
    body: "For 28 years, I've sat with couples at the moments that matter — before the wedding, after the distance, and everywhere in between. I'm Dr. P. Madhurima Reddy, and I'd like to help you understand what's happening between you, and what you can do about it.",
    cta: "Book a consultation",
    secondary: "Meet Dr. Madhurima →",
    image: images.portrait,
  },
  trust: [
    "28 years in practice",
    "Zee Telugu News Achievers Award 2025 — Health & Wellness",
    "Author of two books",
  ],
  couple: {
    h2: "When two people stop understanding each other",
    answer:
      "Couple therapy is a structured space where both partners talk, listen and understand the patterns between them — with a psychologist guiding the conversation.",
    body: "Most couples who come to me aren't in crisis. They're tired. The same argument keeps returning in a new form, or the closeness that used to be easy now takes effort. Therapy gives you a place to slow that down, see it clearly, and choose differently.",
    cards: [
      {
        title: "Pre-marital counselling",
        body: "Before the wedding: expectations, families, money, conflict. The conversations that are easier to have now than later.",
      },
      {
        title: "Marriage counselling",
        body: "For couples who want to rebuild trust, communication or closeness — whether you've been married two years or twenty.",
      },
    ],
    cta: "Book a couple consultation",
  },
  other: {
    h2: "Beyond couple therapy",
    cards: [
      {
        title: "Individual counselling",
        body: "Support for stress, anxiety, life transitions and the patterns you'd like to understand in yourself.",
      },
      {
        title: "Life coaching",
        body: "Goal-focused sessions for clarity, confidence and direction. Kept separate from therapy.",
      },
      {
        title: "Corporate wellness",
        body: "Workshops and talks for teams and HR leaders on stress, communication and emotional intelligence.",
      },
    ],
  },
  about: {
    h2: "Meet Dr. P. Madhurima Reddy",
    body: "I've spent 28 years teaching, counselling and coaching — first as a trainer, then as a psychologist. I founded La Winspire in Hyderabad to bring that work under one roof: therapy for couples and individuals, coaching for people ready to grow, and programmes for organisations. I write, I teach, and I still believe the most important work happens in a quiet room, one honest conversation at a time.",
    image: images.full,
  },
  recognition: {
    h2: "Recognised for work in health & wellness",
    // [CONFIRM wording] — content.md §4.2
    body: "In 2025, Dr. Madhurima received the Zee Telugu News Achievers Award in the Health & Wellness category, presented by former Vice President of India Shri M. Venkaiah Naidu.",
    image: images.award,
  },
  workshops: {
    h2: "Learning together",
    body: "Alongside one-to-one work, I run group workshops on communication, emotional mastery and wellbeing — for organisations, colleges and communities.",
    image: images.workshop,
  },
  books: {
    h2: "From the author",
    body: "Two books, written from years of practice — one on the power of belief and intention, one on understanding and mastering your emotions.",
    covers: [images.awakening, images.emotionalMastery],
    link: "Visit the Author's Shelf →",
  },
  faq: [
    {
      q: "What is couple therapy?",
      a: "Couple therapy is guided conversation between partners and a psychologist, focused on understanding recurring patterns and building healthier ways of communicating.",
    },
    {
      q: "Do we need to be in crisis to see a couple therapist?",
      a: "No. Many couples come to strengthen communication, prepare for marriage, or work through a phase that feels stuck — long before anything feels like a crisis.",
    },
    {
      q: "What happens in pre-marital counselling?",
      a: "Partners explore expectations around family, money, roles and conflict before marriage, so they enter it with clearer understanding of each other.",
    },
    {
      q: "Are sessions available online?",
      a: "Yes. Sessions are available in person at Kokapet, Hyderabad, and online by video for clients across India and abroad.",
    },
    {
      q: "Is what I share kept confidential?",
      a: "Yes. Sessions are private and confidential, conducted within professional ethical guidelines for psychologists in India.",
    },
  ] satisfies Faq[],
  closing: {
    h2: "Start with one conversation",
    body: "Call, message or email — we'll find a time that works for you.",
    cta: "Book a consultation",
  },
};

// §2 Author's Shelf
export const shelf = {
  seo: {
    title: "Books by Dr. P. Madhurima Reddy | La Winspire",
    description:
      "The Awakening and Emotional Mastery — books by Hyderabad psychologist and author Dr. P. Madhurima Reddy, drawn from 28 years of practice.",
  },
  intro: {
    h1: "Books by Dr. P. Madhurima Reddy",
    body: "Writing lets me reach people I'll never sit across from. Both books come from the same place as my practice — years of listening to people describe what holds them back, and what finally helped them move.",
  },
  awakening: {
    h2: "The Awakening",
    image: images.awakening,
    body: "Part personal story, part practical guide. The first half traces my own journey into the Law of Attraction; the second turns it into a working method for health, career, prosperity and happiness. Eleven chapters, around 280 pages.",
    note: "A coaching and self-development title — not a therapy book.",
    cta: "Buy on Amazon →",
    url: "https://www.amazon.in/Awakening-Dr-P-Madhurima-Reddy-ebook/dp/B0BPXSC18M/ref=tmm_kin_swatch_0",
  },
  emotionalMastery: {
    h2: "Emotional Mastery: Master Yourself to Master the World",
    image: images.emotionalMastery,
    body: "A practical guide to emotional intelligence — how emotions work, why they matter, and how to work with them instead of against them.",
    learnHeading: "What you'll learn:",
    learn: [
      "How emotions work, and why they take over",
      "Regulating anger and anxiety",
      "Building empathy and stronger relationships",
      "Using emotional intelligence at work and in leadership",
    ],
    cta: "Buy on Amazon →",
    url: "https://www.amazon.in/dp/B0CSZ3R7SK?bestFormat=true",
  },
  author: {
    h2: "About the author",
    body: "Dr. P. Madhurima Reddy is a psychologist with 28 years in practice and the founder of La Winspire in Kokapet, Hyderabad. She works with couples, individuals and organisations, and received the Zee Telugu News Achievers Award 2025 for Health & Wellness.",
    link: "Book a consultation",
  },
  faq: [
    {
      q: "Where can I buy Dr. Madhurima's books?",
      // [CONFIRM formats] — content.md §4.3
      a: "Both books are available on Amazon India, in print and Kindle editions.",
    },
    {
      q: "Which book should I read first?",
      a: "Start with Emotional Mastery if you want practical tools for everyday emotions; start with The Awakening if you're drawn to mindset and intention.",
    },
    {
      q: "Does Dr. Madhurima run workshops based on her books?",
      a: "Yes. Emotional Mastery themes run through her workshops for organisations, colleges and community groups.",
    },
  ] satisfies Faq[],
};
