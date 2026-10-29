type ServiceSlug = "ai-automation" | "web-software-development" | "business-ecommerce" | "integrations-infrastructure";

export type Quote = { text: string; name: string; role: string; approved: boolean };

/** A screenshot. `label` names the page it shows. */
export type Screen = { src: string; alt: string; width: number; height: number; label: string };

export type Client = {
  slug: "vin-sol" | "ruqaba" | "vintage";
  number: string;
  name: string;
  url: string;
  /** Link text for the client's site. */
  domain: string;
  location: string;
  /** What kind of business they are, shown with the city under the name. */
  kind: string;
  /** The work in one short line, used where space is tight (the homepage). */
  headline: string;
  /** Who they are and what Horquva did, as a short paragraph. The verbs are exact: only claim what was confirmed. */
  did: string;
  /** What we did for them, each pointing at the service page it belongs to. */
  services: { name: string; service: ServiceSlug }[];
  /** Maintenance only: shown as a shorter entry, its details beside the main screens. */
  compact?: true;
  /** Concrete parts of the work, told in a few sentences about what you can see in the live product, with screens of it. */
  details: {
    title: string;
    body: string;
    /** A short feature list, only where the part really is a set of features. */
    items?: string[];
    screens?: Screen[];
    /** The live product, when it has its own site. */
    link?: { url: string; domain: string };
  }[];
  showcase: {
    main: Screen;
    /** A phone-sized view, overlapping the main screen. */
    phone?: Screen;
    /** A second desktop screen, overlapping the main one. */
    second?: Screen;
  };
  /** Drafted by us; shown only once the person quoted has approved it in writing. */
  quote?: Quote;
};

const desktop = (src: string, alt: string, label: string, height = 1000): Screen => ({
  src: `/photos/work/${src}.webp`,
  alt,
  label,
  width: 1600,
  height,
});
const phone = (src: string, alt: string, label: string, height = 1328): Screen => ({
  src: `/photos/work/${src}.webp`,
  alt,
  label,
  width: 780,
  height,
});

/**
 * The clients on the Work page, in the order shown. Every claim here was confirmed by the owner
 * on 2026-10-29 (see docs/superpowers/specs/2026-10-29-work-portfolio-design.md). We did not build
 * ruqaba.com or the Vintage site; Kyvani is linked only from its own details. The details describe
 * only what can be seen in the live product. The HR screens come from Ruqaba's own case study,
 * cropped to drop the footer; the incentive screen is left out because it hints at who the system is for.
 */
export const clients: Client[] = [
  {
    slug: "vin-sol",
    number: "01",
    name: "Vin-Sol",
    url: "https://www.vin-sol.com/",
    domain: "vin-sol.com",
    location: "Lahore, Pakistan",
    kind: "Digital marketing agency",
    headline: "Their website, with an AI assistant built in, and automation behind the scenes.",
    did: "Vin-Sol is a marketing agency in Bahria Town, Lahore, covering web, design, social media, ads, video and SEO. We designed and built vin-sol.com, and the AI chat assistant visitors use to ask about their services. Behind the scenes, we also automate parts of how their team works.",
    services: [
      { name: "Website design", service: "web-software-development" },
      { name: "Website development", service: "web-software-development" },
      { name: "AI chatbot", service: "ai-automation" },
      { name: "Workflow automation", service: "ai-automation" },
    ],
    details: [
      {
        title: "The website",
        body: "The site runs from the homepage through services, portfolio, pricing, about and contact, with a section for each of Vin-Sol's six services. WhatsApp is one tap away on every page, and there's a link for clients to leave a Google review. The AI assistant opens from any page, asks the visitor's name, and answers questions about Vin-Sol's services in plain language.",
        screens: [
          desktop("vin-sol-services", "The vin-sol.com services page", "Services"),
          desktop("vin-sol-portfolio", "The vin-sol.com portfolio page", "Portfolio"),
        ],
      },
    ],
    showcase: {
      main: desktop("vin-sol", "The vin-sol.com homepage on desktop", "vin-sol.com"),
      phone: phone("vin-sol-services-mobile", "The vin-sol.com services page on a phone", "vin-sol.com", 1688),
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
    kind: "Digital marketing agency",
    headline: "An HR and payroll system, and the Kyvani fashion store.",
    did: "Ruqaba is a digital marketing agency in Dubai, and we build software for them. So far that's an HR and payroll system that brings attendance, shift scheduling, and salary and incentive calculation into one place, and the Kyvani fashion e-commerce store, which we built and delivered through Ruqaba.",
    services: [
      { name: "Custom software", service: "web-software-development" },
      { name: "HR and payroll system", service: "web-software-development" },
      { name: "E-commerce development", service: "business-ecommerce" },
    ],
    details: [
      {
        title: "The HR and payroll system",
        body: "Built with Laravel and MySQL. It opens on a dashboard of today's attendance, absences and late arrivals, with attendance trends over time.",
        items: [
          "Employee records with department, designation, shift and salary type",
          "Shift scheduling for teams across several sites",
          "Monthly salary generation and incentive calculation",
          "Users, roles and permissions, and reports",
        ],
        screens: [
          desktop("hrm-employee", "Adding an employee in the HR system", "HR system: employees", 717),
        ],
      },
      {
        title: "The Kyvani store",
        body: "A mobile-first fashion store, built with Laravel and live in Pakistan and the UAE. Shoppers can search and filter the catalogue, keep an account, and pay at checkout in either country, and tracking for Meta ads and SEO is built in.",
        link: { url: "https://www.kyvani.com/", domain: "kyvani.com" },
        screens: [
          desktop("kyvani-home", "The Kyvani store's homepage", "Kyvani: homepage", 802),
        ],
      },
    ],
    showcase: {
      main: desktop("hrm-dashboard", "The HR system's dashboard", "HR and payroll system", 717),
      second: desktop("kyvani-region", "Choosing a region on the Kyvani store, Pakistan or the UAE", "Kyvani store", 802),
    },
    quote: {
      text: "We've worked with Horquva on a few projects now, including our HR and payroll system and the Kyvani store. They're easy to work with and they actually deliver what they say they will.",
      name: "Aurangzeb Khan",
      role: "General Manager",
      approved: true,
    },
  },
  {
    slug: "vintage",
    number: "03",
    name: "Vintage Claims Management",
    url: "https://vamgltd.co.uk/",
    domain: "vamgltd.co.uk",
    location: "London, UK",
    kind: "Claims management company",
    headline: "We took over their website and keep it running.",
    did: "Vintage Claims Management handles not-at-fault accident claims in London, arranging replacement vehicles, repairs, storage and recovery. We took over the maintenance of their website and look after it on an ongoing basis.",
    services: [{ name: "Website maintenance and support", service: "integrations-infrastructure" }],
    compact: true,
    details: [
      {
        title: "The site we look after",
        body: "That covers the service pages for credit hire, repairs, storage and recovery, the start-your-claim form, and the about, team and contact pages.",
      },
    ],
    showcase: {
      main: desktop("vintage", "The vamgltd.co.uk homepage on desktop", "vamgltd.co.uk"),
      phone: phone("vintage-mobile", "The vamgltd.co.uk homepage on a phone", "vamgltd.co.uk"),
    },
    quote: {
      text: "Horquva took over our website and keep it running. When we need something changed, it gets done.",
      name: "Mohammud Bin Zahir Minhas",
      role: "Director",
      approved: true,
    },
  },
];

export function visibleQuote(c: Client): Quote | undefined {
  return c.quote?.approved ? c.quote : undefined;
}

/** Every screenshot a client's showcase uses. */
export function screensOf(c: Client): Screen[] {
  const { main, phone, second } = c.showcase;
  return [main, phone, second, ...c.details.flatMap((d) => d.screens ?? [])].filter((s): s is Screen => Boolean(s));
}
