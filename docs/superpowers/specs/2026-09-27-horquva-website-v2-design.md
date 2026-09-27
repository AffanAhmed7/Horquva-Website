# Horquva Website v2 — Design Spec

**Date:** 2026-09-27
**Status:** Approved 2026-09-27
**Amendments:** Next.js 16 (current stable) instead of 15; service content in typed TS modules instead of MDX.
**Supersedes:** `docs/PROPOSAL.md` (kept as discussion history)

---

## 1. Goal

Replace the single-product WordPress site (horquva.com, built around OBA Core) with a site that presents **Horquva LLC as an engineering services company** that is also building its own product, OBA Core.

### Facts the site must respect
- Horquva is an LLC with **no client engagements yet**. No case studies, client logos, testimonials, "trusted by" rows or invented metrics anywhere.
- Results team members produced at other employers (BizBuddy, Entropik Labs, FBR, Evercove) may appear **only as a line on that person's bio**, never as Horquva results.
- OBA Core is **in development**. Its page describes intended capability and says so. No product screenshots.
- Real team photos exist and will be used. All other imagery is licensed web photography (Section 6).

### Success criteria
1. A visitor understands within one screen that Horquva builds AI, automation, web and data systems for clients.
2. Every service has its own page describing what we build, typical projects, how we work and the stack.
3. The enquiry form delivers a valid submission to the company inbox. Invalid input is rejected with inline errors.
4. Nothing on the site matches the banned-pattern list (Section 5.4).
5. Lighthouse on mobile for `/`: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
6. Zero axe accessibility violations on every route.

---

## 2. Positioning and copy

**Primary headline:** "We build the software and AI systems businesses depend on."
**Supporting line:** "Horquva is an engineering company. We take on AI, automation, web and data work for clients, and we're building OBA Core, a product that shows organisations what a change will affect before they make it."

### Copy rules
- First person plural, plain, specific. Describe deliverables ("WhatsApp agents that take orders and write them into your POS").
- No numbers that Horquva hasn't earned.
- Banned words: unlock, empower, seamless, cutting-edge, leverage, revolutionise, transform your business, next-generation, supercharge.
- Sentence case for all headings and buttons.

---

## 3. Services

| # | Slug | Name | Summary |
|---|------|------|---------|
| 01 | `ai-agents` | AI agents and chat automation | WhatsApp, web and voice agents that take orders, answer support and work with your database |
| 02 | `knowledge-assistants` | Knowledge assistants | Assistants that answer questions from your documents, wikis and data, with sources |
| 03 | `document-vision-ai` | Document and vision AI | Data extraction from documents, computer vision, custom-trained models |
| 04 | `voice-ai` | Voice AI | Speech-to-text, text-to-speech and voice assistants, including Urdu and Roman Urdu |
| 05 | `automation-integrations` | Workflow automation and integrations | n8n and LangGraph automations, webhooks, POS / CRM / ERP integrations |
| 06 | `web-product-engineering` | Web and product engineering | SaaS platforms, dashboards, client portals, payments, real-time apps |
| 07 | `wordpress` | WordPress development | Custom themes and plugins, WooCommerce, speed and security fixes, headless WordPress |
| 08 | `data-analytics` | Data and analytics | Dashboards, KPI reporting, data cleaning and validation, data pipelines |

Each service page has the same structure:
1. Large photo + service name + two-sentence description
2. **What we build:** 4–6 concrete deliverables
3. **Typical projects:** 2–3 short written scenarios ("A restaurant group wants customers to order on WhatsApp…"). They are illustrative, and each page says so once.
4. **How we'd work on it:** discovery → prototype → build → support, adapted to the service
5. **Stack:** plain text list of tools (no logo wall)
6. Next service link + enquiry call-to-action

---

## 4. Information architecture

```
/                          Home
/services                  Services index
/services/[slug]           8 service pages
/oba-core                  OBA Core product page
/approach                  How we work
/team                      Team
/careers                   Careers (no open roles → "send us your CV" with email)
/contact                   Enquiry form (same component as home)
/privacy                   Privacy policy (form data handling)
404                        Custom not-found page
```

### Home page, top to bottom
1. **Header:** wordmark left, text links (Services, OBA Core, Approach, Team, Careers), "Start a project" square button right. On mobile, a full-screen menu.
2. **Opening (light):** very large left-aligned headline over ~9 of 12 columns. Supporting line offset right. One text link. A large graded photo below or right, full-bleed on mobile.
3. **Services index:** 8 full-width rows (number in bronze, name large). Hover reveals a one-line summary and a cursor-following photo. On touch devices, a small thumbnail sits inline. Each row links to its service page.
4. **How we work (dark):** four steps as short paragraphs + working terms ("Fixed scope and price before we start", "Weekly progress updates", "You own the code"). One wide graded photo.
5. **What we're building (light):** "What changed? / What does it affect? / What should we do?" set huge, one paragraph on OBA Core, link to `/oba-core`, photo of a complex organisation.
6. **Team:** real team photos, same crop and grade, name + role, link to `/team`.
7. **Start a project (dark):** enquiry form.
8. **Footer:** Horquva LLC, Karachi, email, LinkedIn, privacy link, © year.

### OBA Core page
Built from `Horquva_One_Pager.docx`, no screenshots:
- Headline: "Before you change something important, know what it will affect."
- The three questions set very large.
- What it connects: people, AI, systems, processes, knowledge, vendors.
- Five-step roadmap as a numbered horizontal line (vertical on mobile): Build the picture → Find weak points → See change effects → Test before acting → Learn from results.
- Scenarios: technology companies and healthcare, then education and other sectors, as written examples.
- "What organisations get" list.
- Note: "Examples show the intended product capability. OBA Core is in development."
- CTA: "Talk to us about OBA Core" → enquiry form preset to OBA Core.

---

## 5. Visual design system

### 5.1 Colour tokens
| Token | Hex | Use |
|---|---|---|
| `paper` | `#F3EFE7` | Light section background |
| `ink` | `#15120F` | Text on light; dark section background |
| `bronze` | `#A9825A` | Service numbers, link underlines, focus rings on dark, small details. Never body text on paper |
| `bronze-deep` | `#5E3F2C` | Text links and accent text on paper |
| `stone` | `#857C72` | Secondary text on dark; inactive rows |
| `ink-soft` | `#4A433C` | Secondary text on paper |
| `rule` | `#DAD2C4` | Hairlines on paper |
| `rule-dark` | `#3A332D` | Hairlines on ink |

Every text/background pair used must pass WCAG AA (verified in tests, Section 9).

### 5.2 Typography
- **Hanken Grotesk** (400, 500, 600) via `next/font/google`, self-hosted by Next.
- Display: 500 weight, tracking −0.035em, line-height 0.95–1.0, fluid size `clamp(2.75rem, 7vw, 7.5rem)`.
- Headings: 500, tracking −0.02em.
- Body: 400, 17–18px, line-height 1.55, max 65ch.
- No mono labels, no uppercase tracking labels.

### 5.3 Components and shape
- Buttons: rectangular, `border-radius: 0`, solid ink on paper / paper on ink, 44px minimum height. Hover: background shifts to bronze-deep (light) or bronze (dark). One primary button per view.
- Text links: underline in bronze, 1px, offset 4px; the underline thickens on hover.
- Inputs: bottom border only, labels above, no rounded boxes.
- Layout: 12-column grid, generous margins (`clamp(1rem, 4vw, 3.5rem)`), asymmetric placement.

### 5.4 Banned patterns (checked in review)
Eyebrow labels above headings · pill or glowing buttons · glassmorphism · purple/blue/violet gradients · gradient text · blurred blobs / aurora backgrounds · centred hero with two buttons · three-column icon-card grids · emoji or sparkle icons · particles, beams, spotlight cards · logo marquees · AI-generated or robot/brain/hologram imagery.

**Approved exceptions (2026-09-27, requested by Horquva):** the sticky header frosts (backdrop blur) once scrolled, and its "Start a project" button is a translucent outlined button. The hero headline uses Bricolage Grotesque as a display face.

### 5.5 Motion
- Headlines: line-by-line reveal on first view (GSAP SplitText, 600ms, staggered 80ms).
- Photos: clip-path reveal on scroll (ScrollTrigger).
- Smooth scrolling (Lenis).
- Service rows: cursor-following image (Motion), fades in within 150ms.
- `prefers-reduced-motion: reduce` disables all of the above: content renders in its final state and scrolling is native.

---

## 6. Photography

### Sources and licensing
- Only **Unsplash** and **Pexels** (free commercial use). **Unsplash+** allowed if the company buys a licence.
- Each image is recorded in `content/image-credits.json`: file, source URL, photographer, licence. Credits are shown on `/privacy` (under an "Image credits" heading) as a courtesy.

### Selection rules
- Documentary subjects: working kitchens, warehouses, hospital corridors, paperwork and archives, microphones and studios, streets at dusk, control rooms, hands at whiteboards.
- Low, warm, natural light. Silhouettes and shadow are welcome (Palantir / Anduril tone).
- Rejected: robots, glowing brains, holograms, circuit faces, handshakes, people pointing at screens, staged laptop smiles, obvious AI renders.

### Consistent grade
`scripts/grade-images.mjs` (sharp) processes `assets/photos/raw/*` into `public/photos/*` so every photo matches:
1. Resize to max 2400px wide
2. Saturation × 0.78
3. Warm tint: shadows toward `#5E3F2C` at low strength
4. Slight black lift (levels) for a matte feel
5. Fine monochrome grain overlay (a pre-made grain PNG, soft-light, ~6%)
6. Output AVIF + WebP + JPEG fallback

Team photos go through the same script plus a consistent 4:5 crop.

---

## 7. Technical architecture

### Stack
- Next.js 16 (App Router) + TypeScript (strict)
- Tailwind CSS v4 with the tokens above as theme variables
- GSAP (+ ScrollTrigger, SplitText), Lenis, Motion
- Typed content modules (`content/*.ts`) for services, team and process
- Zod + React Hook Form for the enquiry form
- Resend for email delivery
- Vitest (unit), Playwright + @axe-core/playwright (e2e and accessibility), Lighthouse CI
- Hosting: Vercel. The current WordPress site stays live until DNS cutover.

### Folder structure
```
app/
  layout.tsx                 fonts, header, footer, Lenis provider
  page.tsx                   home
  services/page.tsx
  services/[slug]/page.tsx   generateStaticParams from content/services
  oba-core/page.tsx
  approach/page.tsx
  team/page.tsx
  careers/page.tsx
  contact/page.tsx
  privacy/page.tsx
  not-found.tsx
  api/enquiry/route.ts       POST handler
  sitemap.ts, robots.ts
components/
  layout/   SiteHeader, SiteFooter, MobileMenu
  ui/       Button, TextLink, Field, Select, Section (tone: paper|ink)
  motion/   RevealText, RevealImage, SmoothScroll, CursorImage
  home/     Hero, ServiceIndex, ProcessSteps, ObaTeaser, TeamStrip
  forms/    EnquiryForm
  oba/      QuestionStack, Roadmap
content/
  services/*.mdx             frontmatter: number, slug, name, summary, photo, deliverables[], stack[]
  team.ts                    name, role, photo, bio, linkedin
  image-credits.json
lib/
  enquiry-schema.ts          shared Zod schema (client + server)
  services.ts                load + sort service MDX
scripts/
  grade-images.mjs
assets/photos/raw/           ungraded originals (not served)
public/photos/               graded output
```

### Rendering
Every page is statically generated at build time. The only dynamic code is `POST /api/enquiry`.

### Enquiry flow
1. Fields: name (required), email (required, valid), company (optional), service (required: the 8 services + OBA Core + "Not sure yet"), budget (required: < $2k, $2–5k, $5–15k, $15k+, "Not sure"), message (required, 20–5000 chars), hidden honeypot `website`.
2. Client validates with the shared schema and shows inline errors per field.
3. Server re-validates with the same schema. It rejects with 400 plus field errors on bad input, and silently returns 200 when the honeypot is filled.
4. Basic rate limit: 5 submissions per IP per 10 minutes (in-memory per instance, enough at this traffic level). Over the limit returns 429 and the message "Too many attempts. Try again in a few minutes."
5. Sends via Resend to `ENQUIRY_TO_EMAIL` with reply-to set to the visitor's email.
6. Success: the form is replaced by a confirmation message. Resend failure: 502 and the message "Couldn't send your message. Email us directly at {address}."
7. Environment variables: `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL`, `ENQUIRY_FROM_EMAIL`.

### SEO
Per-page `metadata` (title, description, canonical), static Open Graph images per section, `sitemap.xml`, `robots.txt`, `Organization` JSON-LD in layout.

---

## 8. Error handling and edge cases
- Missing photo in content → the Section renders a solid ink block of the same aspect ratio, and the build logs a warning.
- Unknown service slug → 404 (`dynamicParams = false`).
- JS disabled → all content readable, form posts natively to `/api/enquiry`, and the route redirects to `/contact?sent=1` or `?error=1`.
- Reduced motion → Section 5.5.

---

## 9. Testing
- **Unit (Vitest):** enquiry schema (valid, each invalid field, honeypot), API route (400 / 200 / 429 / 502 with Resend mocked), service loader (8 services, sorted, required frontmatter present), colour contrast check over the token pairs.
- **E2E (Playwright):** every route returns 200 and renders its h1; mobile menu opens and closes; enquiry form shows inline errors on empty submit and shows confirmation on a successful mocked submit; OBA Core CTA presets the service field.
- **Accessibility:** axe on every route, zero violations.
- **Performance:** Lighthouse CI on `/` and one service page with the Section 1 thresholds.
- **Manual review:** banned-pattern checklist (5.4) and copy rules (2) before launch.

---

## 10. Content needed from Horquva before launch
- Team photos (originals) and final name, role, short bio and LinkedIn for each person
- Company email for enquiries and the footer
- Final approval of service copy and OBA Core wording
- Domain / DNS access for cutover

## 11. Out of scope for v1
Blog/insights, CMS, multi-language, live chat or AI assistant, 3D or WebGL, case studies (until real client work exists).
