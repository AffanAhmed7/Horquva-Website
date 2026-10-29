export type Quote = { text: string; name: string; role: string; approved: boolean };

/** A screenshot. `label` names the page it shows, under gallery screens. */
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
  /** One sentence on the company, from facts on its own site. */
  about: string;
  /** What Horquva did. The verbs are exact: only claim what was confirmed. */
  did: string;
  services: string[];
  /** Concrete parts of the work, each a list of things you can see in the live product. */
  details: { title: string; items: string[]; stack?: string[] }[];
  showcase: {
    /** The panel colour behind the screens. */
    tone: "ink" | "bronze" | "sand";
    caption: string;
    main: Screen;
    /** A phone-sized view, overlapping the main screen. */
    phone?: Screen;
    /** A second desktop screen, overlapping the main one. */
    second?: Screen;
    /** Smaller screens shown in a row under the panel. */
    gallery?: Screen[];
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
const phone = (src: string, alt: string, label: string): Screen => ({
  src: `/photos/work/${src}.webp`,
  alt,
  label,
  width: 780,
  height: 1328,
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
    about:
      "Vin-Sol is a digital marketing agency in Bahria Town, Lahore, covering web development, design, social media, Meta ads, video and SEO.",
    did: "We designed and built vin-sol.com, including the AI chat assistant visitors use to ask questions on the site. Behind the scenes, we automate parts of Vin-Sol's internal workflows.",
    services: ["Website design", "Website development", "AI chatbot", "Workflow automation"],
    details: [
      {
        title: "What we built",
        items: [
          "A multi-page site: home, services, portfolio, pricing, about and contact",
          "A section for each of Vin-Sol's six services, from web development to SEO",
          "An AI chat assistant in a pop-up window, loaded only when a visitor opens it",
          "WhatsApp one tap away on every page, as the main way to get in touch",
          "A link to leave a Google review, and analytics on every page",
        ],
      },
    ],
    showcase: {
      tone: "ink",
      caption: "vin-sol.com on desktop and phone, October 2026",
      main: desktop("vin-sol", "The vin-sol.com homepage on desktop", "vin-sol.com"),
      phone: phone("vin-sol-mobile", "The vin-sol.com homepage on a phone", "vin-sol.com"),
      gallery: [
        desktop("vin-sol-services", "The vin-sol.com services page", "Services"),
        desktop("vin-sol-portfolio", "The vin-sol.com portfolio page", "Portfolio"),
        desktop("vin-sol-pricing", "The vin-sol.com pricing page", "Pricing"),
        desktop("vin-sol-about", "The vin-sol.com about page", "About"),
      ],
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
    about:
      "Ruqaba is a digital marketing agency in Dubai, working on branding, social media, paid media, video and web for brands across the UAE.",
    did: "We build software for Ruqaba. That includes an HR and payroll system, built with Laravel and MySQL, that brings attendance, shift scheduling, and salary and incentive calculation into one place. We also built the Kyvani fashion e-commerce store, delivered through Ruqaba.",
    services: ["Custom software", "HR and payroll system", "E-commerce development"],
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
      },
    ],
    showcase: {
      tone: "bronze",
      caption: "The HR system and the Kyvani store. Screens from Ruqaba's case studies.",
      main: desktop("hrm-dashboard", "The HR system's dashboard", "HR and payroll system", 717),
      second: desktop("kyvani-home", "The Kyvani store's homepage", "Kyvani store", 802),
      gallery: [
        desktop("hrm-employee", "Adding an employee in the HR system", "HR system: employees", 717),
        desktop("hrm-salary", "Salary management in the HR system", "HR system: salary", 717),
        desktop("kyvani-shop", "The Kyvani collection page with filters", "Kyvani: shop", 802),
        desktop("kyvani-account", "Signing in to a Kyvani customer account", "Kyvani: account", 802),
      ],
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
    about:
      "Vintage Claims Management handles not-at-fault accident claims in London, arranging replacement vehicles, repairs, storage and recovery.",
    did: "We took over the maintenance of Vintage's website and look after it on an ongoing basis.",
    services: ["Website maintenance and support"],
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
      tone: "sand",
      caption: "vamgltd.co.uk, which we maintain. October 2026",
      main: desktop("vintage", "The vamgltd.co.uk homepage on desktop", "vamgltd.co.uk"),
      phone: phone("vintage-mobile", "The vamgltd.co.uk homepage on a phone", "vamgltd.co.uk"),
      gallery: [
        desktop("vintage-credit-hire", "The vamgltd.co.uk credit hire page", "Credit hire"),
        desktop("vintage-claim", "The vamgltd.co.uk start-your-claim form", "Start your claim"),
        desktop("vintage-about", "The vamgltd.co.uk about page", "About"),
        desktop("vintage-contact", "The vamgltd.co.uk contact page", "Contact"),
      ],
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
  const { main, phone, second, gallery = [] } = c.showcase;
  return [main, phone, second, ...gallery].filter((s): s is Screen => Boolean(s));
}
