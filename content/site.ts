import { services } from "./services";

export const site = {
  name: "Horquva",
  legalName: "Horquva LLC",
  city: "Karachi",
  country: "Pakistan",
  // TODO(content): confirm the enquiry inbox before launch.
  email: "hello@horquva.com",
  linkedin: "https://www.linkedin.com/company/horquva",
  url: "https://horquva.com",
  description:
    "Horquva builds AI-powered software, business automation, SaaS platforms, real-time apps and custom software. It's also building OBA Core, its own product.",
};

export const nav = [
  { href: "/services", label: "Services" },
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
