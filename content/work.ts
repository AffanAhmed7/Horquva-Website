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
  industry: string;
  /** One line under the name: the work in a sentence. */
  headline: string;
  /** What Horquva did. The verbs are exact: only claim what was confirmed. */
  did: string;
  /** What we did for them, each pointing at the service page it belongs to. */
  services: { name: string; service: ServiceSlug }[];
  /** Maintenance only: shown as a shorter entry, its details beside the main screens. */
  compact?: true;
  /** Concrete parts of the work, each a list of things you can see in the live product, with screens of it. */
  details: {
    title: string;
    items: string[];
    stack?: string[];
    screens?: Screen[];
    /** A smaller related part, shown under the screens. */
    note?: { title: string; items: string[] };
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
 * ruqaba.com or the Vintage site, and Kyvani is named but never linked. The details lists describe
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
    industry: "Digital marketing",
    headline: "A new website, an AI chat assistant and workflow automation for a Lahore marketing agency.",
    did: "We designed and built vin-sol.com, including the AI chat assistant visitors use to ask questions on the site. Behind the scenes, we automate parts of Vin-Sol's internal workflows.",
    services: [
      { name: "Website design", service: "web-software-development" },
      { name: "Website development", service: "web-software-development" },
      { name: "AI chatbot", service: "ai-automation" },
      { name: "Workflow automation", service: "ai-automation" },
    ],
    details: [
      {
        title: "The website",
        items: [
          "A multi-page site: home, services, portfolio, pricing, about and contact",
          "A section for each of Vin-Sol's six services, from web development to SEO",
          "WhatsApp one tap away on every page, as the main way to get in touch",
          "A link to leave a Google review, and analytics on every page",
        ],
        screens: [
          desktop("vin-sol-services", "The vin-sol.com services page", "Services"),
          desktop("vin-sol-portfolio", "The vin-sol.com portfolio page", "Portfolio"),
        ],
        note: {
          title: "The AI chat assistant",
          items: [
            "Opens in a pop-up from every page, and loads only when a visitor opens it",
            "Asks for the visitor's name and greets them by it",
            "Answers questions about Vin-Sol's services in plain language",
            "Lets visitors clear the conversation or start again",
          ],
        },
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
    industry: "Digital marketing",
    headline: "An HR and payroll system, and a fashion e-commerce store, built for a Dubai agency.",
    did: "We build software for Ruqaba. That includes an HR and payroll system, built with Laravel and MySQL, that brings attendance, shift scheduling, and salary and incentive calculation into one place. We also built the Kyvani fashion e-commerce store, delivered through Ruqaba.",
    services: [
      { name: "Custom software", service: "web-software-development" },
      { name: "HR and payroll system", service: "web-software-development" },
      { name: "E-commerce development", service: "business-ecommerce" },
    ],
    details: [
      {
        title: "Inside the HR system",
        items: [
          "A dashboard with today's attendance, absences and late arrivals, and attendance trends",
          "Employee records with department, designation, shift and salary type",
          "Shift scheduling for teams across several sites",
          "Monthly salary generation and incentive calculation",
          "Users, roles and permissions, and reports",
        ],
        stack: ["Laravel", "MySQL"],
        screens: [
          desktop("hrm-employee", "Adding an employee in the HR system", "HR system: employees", 717),
        ],
      },
      {
        title: "Inside the Kyvani store",
        items: [
          "A mobile-first storefront and collection pages",
          "Catalogue search, category filters and sorting",
          "Cart and checkout with integrated payments, accepted in Dubai and Pakistan",
          "Customer accounts",
          "Tracking for Meta ads and SEO",
        ],
        stack: ["Laravel"],
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
      text: "Horquva built our HR and payroll system and the Kyvani store for us. They're the team we go to when something technical needs building properly.",
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
    industry: "Claims management",
    headline: "Ongoing care for a London claims company's website.",
    did: "We took over the maintenance of Vintage's website and look after it on an ongoing basis.",
    services: [{ name: "Website maintenance and support", service: "integrations-infrastructure" }],
    compact: true,
    details: [
      {
        title: "The site we look after",
        items: [
          "Service pages for credit hire, repairs, storage and recovery",
          "A start-your-claim form",
          "About, team and contact pages",
        ],
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
