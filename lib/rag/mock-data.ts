import type { RagSource } from "./types";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { processSteps } from "@/content/process";
import { team } from "@/content/team";

export interface KnowledgeDoc {
  id: string;
  title: string;
  url: string;
  section: string;
  content: string;
  keywords: string[];
}

/**
 * Curated knowledge base extracted directly from the site's content files.
 */
export const knowledgeDocs: KnowledgeDoc[] = [
  // Company Overview & Contact
  {
    id: "horquva-overview",
    title: `About ${site.legalName}`,
    url: "/approach",
    section: "Overview",
    content: `${site.name} (${site.legalName}) builds software, AI systems, and automations for businesses that can't afford downtime. We work in discovery, prototype, production build, and ongoing support phases. Located in ${site.city}, ${site.country}. Contact: ${site.email} or visit /contact.`,
    keywords: ["horquva", "about", "company", "who", "overview", "location", "email"],
  },
  {
    id: "horquva-contact",
    title: "Contact & Getting Started",
    url: "/contact",
    section: "Enquiries",
    content: `To start a project or get a consultation, reach out via the enquiry form at /contact or email us directly at ${site.email}. We review requirements, explore technical feasibility, and propose an initial prototype or scoped roadmap with fixed pricing within 1–2 business days.`,
    keywords: ["contact", "touch", "email", "hire", "start", "quote", "pricing", "cost", "timeline"],
  },
  // OBA Core Platform
  {
    id: "oba-core-platform",
    title: "OBA Core Platform",
    url: "/oba-core",
    section: "Product",
    content: `OBA Core is Horquva's platform for organizational intelligence and systems visibility. It answers three core operational questions: 1. What changed? 2. What does it affect? 3. What should we do? It works in 5 continuous steps: Connect (data sources), Map (dependencies & entity graphs), Understand (root cause analysis), Simulate (impact forecasting), and Act (automated interventions and alerts).`,
    keywords: ["oba", "oba core", "platform", "organizational", "simulate", "dependencies", "map", "connect", "understand", "act"],
  },
  // Process / Approach
  {
    id: "horquva-process",
    title: "How Projects Start & Work",
    url: "/approach",
    section: "Process",
    content: `Horquva's delivery methodology follows 4 distinct stages: ${processSteps
      .map((s) => `${s.number}. ${s.title}: ${s.body}`)
      .join(" ")}`,
    keywords: ["process", "start", "how it works", "methodology", "discover", "prototype", "build", "support", "steps", "stages"],
  },
  // Team
  {
    id: "horquva-team",
    title: "Horquva Engineering Team",
    url: "/team",
    section: "Team",
    content: `The Horquva engineering and leadership team includes: ${team
      .map((m) => `${m.name} (${m.role} - ${m.bio})`)
      .join("; ")}.`,
    keywords: ["team", "who", "people", "engineers", "leadership", "natasha", "kia", "taha", "affan", "ibrahim", "memoona", "hooriya"],
  },
  // Services
  ...services.map((svc) => ({
    id: `service-${svc.slug}`,
    title: `${svc.name} Service`,
    url: `/services/${svc.slug}`,
    section: "Services",
    content: `${svc.name}: ${svc.summary} Intro: ${svc.intro} Capabilities & Offerings: ${svc.items.join(
      ", ",
    )}. Real Scenarios & Problems Solved: ${svc.scenarios.map((s) => `${s.title}: ${s.body}`).join(" ")}. Tech Stack: ${svc.stack.join(", ")}.`,
    keywords: [
      svc.slug,
      ...svc.name.toLowerCase().split(/\s+/),
      ...svc.summary.toLowerCase().split(/\s+/),
      ...svc.items.flatMap((c) => c.toLowerCase().split(/\s+/)),
    ],
  })),
];

/**
 * Fast keyword & semantic-overlap search for local dev & fallback.
 */
export function mockSearchKnowledge(query: string, topK = 4): RagSource[] {
  const queryTokens = query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);

  const scored = knowledgeDocs.map((doc) => {
    let score = 0;
    const lowerContent = doc.content.toLowerCase();
    const lowerTitle = doc.title.toLowerCase();

    for (const token of queryTokens) {
      if (lowerTitle.includes(token)) score += 3.5;
      if (doc.keywords.some((kw) => kw.includes(token))) score += 2.0;
      if (lowerContent.includes(token)) score += 1.0;
    }

    return {
      id: doc.id,
      title: doc.title,
      url: doc.url,
      snippet: doc.content.slice(0, 260) + (doc.content.length > 260 ? "…" : ""),
      content: doc.content,
      score,
    };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter((s) => s.score > 0);
}
