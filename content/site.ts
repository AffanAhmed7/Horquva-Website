import { services } from "./services";

export const site = {
  name: "Horquva",
  legalName: "Horquva LLC",
  city: "Karachi",
  country: "Pakistan",
  // TODO(content): confirm the enquiry inbox before launch.
  email: "hello@horquva.com",
  // From the footer of the previous horquva.com. Note the LinkedIn and Facebook handles end in "aa".
  linkedin: "https://www.linkedin.com/company/horquvaa/",
  instagram: "https://www.instagram.com/horquva/",
  facebook: "https://web.facebook.com/Horquvaa",
  url: "https://horquva.com",
  description:
    "Horquva builds AI-powered software, business automation, SaaS platforms, real-time apps and custom software. It's also building OBA Core, its own product.",
};

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
