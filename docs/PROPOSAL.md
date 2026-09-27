# Horquva Website v2: Proposal (Draft)

**Goal:** Reposition Horquva from a single-product site (OBA Core) to an **AI engineering & services company**. OBA Core stays, but as proof of what we can build, not the whole story.

**Status:** Draft for discussion. Nothing is built yet.

---

## 1. Where the company actually is (facts the site must respect)

- Horquva is an **LLC**. It has **no client engagements yet**, so the site cannot show case studies, client logos, testimonials or "trusted by" claims.
- The only thing built so far is **OBA Core**, the product in development (see *Horquva_One_Pager.docx*).
- **Team photos** are available. **No product screenshots** for now.
- Results the team produced at other companies (BizBuddy, Entropik Labs) are **personal experience**, not Horquva work. They may appear on individual team bios only, never as company results.

## 2. Positioning

A new company that is honest about being new, and whose credibility comes from **the people** and **the product they are building**.

**Headline direction**
> **We build the software and AI systems that businesses depend on.**
> Horquva is an engineering company. We take on AI, automation, web and product work for clients, and we are building OBA Core, a product that shows organisations what a change will affect before they make it.

The two halves support each other: the services pay the bills and win trust, and OBA Core proves the team can do deep, serious work.

---

## 3. Service lines (from the tech-team resumes)

| # | Service | What we offer | Team experience behind it |
|---|---------|---------------|---------------------------|
| 1 | **AI Agents & Chat Automation** | WhatsApp, web and voice agents that take orders, answer support and work with your database | Production WhatsApp agents, tool-calling, multi-tenant systems |
| 2 | **Knowledge Assistants (RAG)** | Assistants that answer questions from a company's documents, wikis and data | Multimodal RAG over PDFs, repos, video and the web |
| 3 | **Document & Vision AI** | Data extraction from documents, computer vision, custom-trained models | OCR pipelines, fine-tuned vision models, medical imaging models |
| 4 | **Voice AI** | Speech-to-text, text-to-speech, voice assistants, including Urdu / Roman Urdu | Whisper pipelines, TTS data pipelines, hardware voice assistant |
| 5 | **Workflow Automation & Integrations** | n8n / LangGraph automations, webhooks, POS / CRM / ERP integrations | POS integrations, email-to-spreadsheet agents |
| 6 | **Web & Product Engineering** | SaaS platforms, dashboards, client portals, payments, real-time apps | Stripe Connect, role-based portals, real-time apps, job queues |
| 7 | **WordPress Development** | Custom themes and plugins, WooCommerce stores, speed and security fixes, headless WordPress | The current horquva.com runs on WordPress |
| 8 | **Data & Analytics** | Dashboards, KPI reporting, data cleaning and validation, data pipelines | KPI analytics engines, large taxation-dataset validation (FBR), Pandas / Streamlit dashboards |
| — | **OBA Core** (our product, not a service) | Shows how people, AI, systems, processes, knowledge and vendors are connected, and what a change will affect | In development |

Services pages describe **what we'd build and how we'd work**. They don't claim past client outcomes. The "team experience" column appears only as short lines on each person's bio.

---

## 4. Sitemap

```
/                     Home: positioning, services index, OBA Core, team, contact
/services             All services
/services/[slug]      One page per service (8): what it is, typical projects, how we work, stack
/oba-core             OBA Core: content from the one-pager, no screenshots
/approach             How we work (Discover → Prototype → Build → Support)
/team                 Team photos and short bios
/careers
/contact              Project enquiry form
```

**OBA Core page without screenshots:** built from typography and line diagrams using the one-pager's own structure:
- The three questions (*What changed? What does it affect? What should we do?*) set very large
- The five-step roadmap drawn as a simple numbered line
- The technology and healthcare examples as short written scenarios
- A clear note that the examples show intended capability

---

## 5. Visual direction: hybrid, and it must not look AI-generated

**Decided:** hybrid layout (a light, editorial site with a few dark full-width sections).
**Rule:** nothing that reads as a template or AI output. The site should feel like it came from an engineering firm with taste, not from a prompt.

### Removed from the earlier draft
- 3D "intelligence network" hero
- Interactive demos on each service page (WhatsApp chat, RAG, X-ray slider, automation flow)
- WOBA assistant on the site
- Aceternity/Magic UI effects, React Three Fiber, React Flow, Lottie

### Banned patterns (the "AI website" look)
- Eyebrow labels above headings (small caps / mono tags like "OUR SERVICES")
- Pill-shaped buttons, glowing buttons, glassmorphism
- Purple/blue/violet gradients, gradient text, blurred colour blobs, "aurora" backgrounds
- Centred hero with a headline, one line of subtext and two buttons
- Three-column icon-card grids, sparkle icons, emoji bullets
- Floating particles, beams, spotlight cards, fake logo marquees
- Filler copy: "unlock", "empower", "seamless", "cutting-edge", "transform your business"

### What we do instead
- **Typography carries the design.** Large, tight, left-aligned headlines in one distinctive typeface, with long-form body text you can actually read. Hierarchy comes from size and whitespace, not labels.
- **Colour:** warm off-white paper, near-black ink, and **one accent taken from the Horquva logo mark**. Dark sections use deep ink, never navy or purple.
- **Controls:** rectangular buttons with square or 2px corners, plain text links with underlines, and arrows only where they mean "go".
- **Layout:** an asymmetric editorial grid. Services read like an index or table of contents (numbered rows that expand on hover), not as cards.
- **Real material, not decoration:** real team photos (treated consistently, e.g. same crop and tone) and simple technical line diagrams of how a system is wired. No stock photos, no AI images, no product screenshots for now.
- **Restrained motion:** headlines reveal line by line, images reveal with a clip mask, smooth scrolling, and precise hover states on list rows. Nothing moves unless it helps you read.
- **Copy:** plain, specific, first-person, describing concrete deliverables ("We build WhatsApp agents that take orders and write them straight into your POS"). No invented numbers.

### Libraries (trimmed)
| Purpose | Library |
|---------|---------|
| Framework | **Next.js 15 (App Router) + TypeScript** |
| Styling | Tailwind CSS v4 (custom design tokens, no stock component kit look) |
| Micro-interactions | Motion (Framer Motion) |
| Scroll/text reveals | GSAP + ScrollTrigger + SplitText |
| Smooth scroll | Lenis |
| Content | MDX for services and case studies |
| Forms | React Hook Form + Zod → Resend email / CRM webhook |
| Hosting | Vercel (or current host through static export) |

Performance: `prefers-reduced-motion` is respected, the site has no heavy 3D, and the Lighthouse target is ≥ 95.

---

## 6. Approaches

| | A. Next.js rebuild *(recommended)* | B. Keep WordPress, new theme | C. Astro + React islands |
|---|---|---|---|
| Design control | Full control over typography and motion | Limited: page builders push toward template looks | Full |
| Team fit | Team already ships Next.js / Framer Motion | PHP/WP skills needed | New tool for the team |
| Content editing | MDX in repo (can add Sanity/Payload later) | Easy WP admin | MDX |
| Performance | Very good | Usually heavy | Best |

**Recommendation: A.** The current WordPress install stays live until launch, then we switch DNS.

---

## 7. Open questions
1. ~~Stack~~ Decided: site built in Next.js; WordPress is offered as a service.
2. ~~Visual direction~~ Decided: hybrid, non-AI look (section 5).
3. ~~Case studies~~ Decided: none. No client work yet; past-employer results appear on personal bios only.
4. ~~More services~~ Decided: add Data & Analytics (8 services total).
5. ~~Primary CTA~~ Decided: project enquiry form (name, company, service, budget range, message), sent by email.
6. ~~Assets~~ Decided: team photos yes, product screenshots no.
