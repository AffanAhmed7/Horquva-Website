import { services } from "./services";

export const site = {
  name: "Horquva",
  city: "Karachi",
  country: "Pakistan",
  email: "team@horquva.com",
  // From the footer of the previous horquva.com. Note the LinkedIn and Facebook handles end in "aa".
  linkedin: "https://www.linkedin.com/company/horquvaa/",
  instagram: "https://www.instagram.com/horquva/",
  facebook: "https://web.facebook.com/Horquvaa",
  url: "https://horquva.com",
  /** Footer statement. The meta description below stays service-led for search. */
  tagline:
    "A platform for seeing the relationships behind critical work.",
  description:
    "Horquva builds AI-powered software, business automation, SaaS platforms, real-time apps and custom software. It's also building OBA Core, its own product.",
};

/**
 * Every page on the site, apart from the service pages (/services/<slug>). The sitemap lists
 * these, and proxy.ts answers any address that isn't one of them with 410 Gone, which is how
 * the old WordPress site's pages are cleared from search results. Add new pages here.
 */
export const pages = ["/", "/oba-core", "/approach", "/team", "/careers", "/contact", "/privacy"];

export const nav = [
  // Jumps to the service cards on the home page; stays highlighted on each service's own page.
  { href: "/#services", label: "Services", activePrefix: "/services" },
  { href: "/oba-core", label: "OBA Core" },
  { href: "/approach", label: "Approach" },
  { href: "/team", label: "Team" },
  { href: "/careers", label: "Careers" },
];

export const enquiryServiceOptions: string[] = [
  ...services.map((s) => s.name),
  "OBA Core",
  "Not sure yet",
];

export const budgetOptions: string[] = [
  "Under $2k",
  "$2k–5k",
  "$5k–15k",
  "$15k+",
  "Not sure yet",
];
