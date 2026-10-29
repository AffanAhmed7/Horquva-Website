export type Quote = { text: string; name: string; role: string; approved: boolean };

export type Client = {
  slug: "vin-sol" | "ruqaba" | "vintage";
  number: string;
  name: string;
  url: string;
  /** Link text for the client's site. */
  domain: string;
  location: string;
  industry: string;
  /** One sentence on the company, from facts on its own site. */
  about: string;
  /** What Horquva did. The verbs are exact: only claim what was confirmed. */
  did: string;
  services: string[];
  image?: { src: string; alt: string; caption: string };
  /** Drafted by us; shown only once the person quoted has approved it in writing. */
  quote?: Quote;
};

/**
 * The clients on the Work page, in the order shown. Every claim here was confirmed by the owner
 * on 2026-10-29 (see docs/superpowers/specs/2026-10-29-work-portfolio-design.md). We did not build
 * ruqaba.com or the Vintage site, and Kyvani is named but never linked.
 */
export const clients: Client[] = [
  {
    slug: "vin-sol",
    number: "01",
    name: "Vin-Sol",
    url: "https://www.vin-sol.com/",
    domain: "vin-sol.com",
    location: "Lahore, Pakistan",
    industry: "Digital marketing",
    about:
      "Vin-Sol is a digital marketing agency in Bahria Town, Lahore, covering web development, design, social media, Meta ads, video and SEO.",
    did: "We designed and built vin-sol.com, including the AI chat assistant visitors use to ask questions on the site. Behind the scenes, we automate parts of Vin-Sol's internal workflows.",
    services: ["Website design", "Website development", "AI chatbot", "Workflow automation"],
    image: {
      src: "/photos/work/vin-sol.webp",
      alt: "The vin-sol.com homepage",
      caption: "vin-sol.com, homepage, October 2026",
    },
    quote: {
      text: "Horquva designed and built our website and the AI assistant on it, and they automate a lot of our day-to-day work behind the scenes.",
      name: "To be confirmed",
      role: "To be confirmed",
      approved: false,
    },
  },
  {
    slug: "ruqaba",
    number: "02",
    name: "Ruqaba",
    url: "https://ruqaba.com/",
    domain: "ruqaba.com",
    location: "Dubai, UAE",
    industry: "Digital marketing",
    about:
      "Ruqaba is a digital marketing agency in Dubai, working on branding, social media, paid media, video and web for brands across the UAE.",
    did: "We build software for Ruqaba. That includes an HR and payroll system, built with Laravel and MySQL, that brings attendance, shift scheduling, and salary and incentive calculation into one place. We also built the Kyvani fashion e-commerce store, delivered through Ruqaba.",
    services: ["Custom software", "HR and payroll system", "E-commerce development"],
    quote: {
      text: "Horquva built our HR and payroll system and the Kyvani store for us. They're the team we go to when something technical needs building properly.",
      name: "Aurangzeb Khan",
      role: "General Manager",
      approved: false,
    },
  },
  {
    slug: "vintage",
    number: "03",
    name: "Vintage Claims Management",
    url: "https://vamgltd.co.uk/",
    domain: "vamgltd.co.uk",
    location: "London, UK",
    industry: "Claims management",
    about:
      "Vintage Claims Management handles not-at-fault accident claims in London, arranging replacement vehicles, repairs, storage and recovery.",
    did: "We took over the maintenance of Vintage's website and look after it on an ongoing basis.",
    services: ["Website maintenance and support"],
    image: {
      src: "/photos/work/vintage.webp",
      alt: "The vamgltd.co.uk homepage",
      caption: "vamgltd.co.uk, which we maintain. Homepage, October 2026",
    },
    quote: {
      text: "Horquva took over our website and keep it running. When we need something changed, it gets done.",
      name: "Mohammud Bin Zahir Minhas",
      role: "Director",
      approved: false,
    },
  },
];

export function visibleQuote(c: Client): Quote | undefined {
  return c.quote?.approved ? c.quote : undefined;
}
