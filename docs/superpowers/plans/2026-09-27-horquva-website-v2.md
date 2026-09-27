# Horquva Website v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Horquva services website described in the spec: a static Next.js site with 8 service pages, an OBA Core page and a working enquiry form.

**Architecture:** Next.js 16 App Router, every page statically generated from typed content modules in `content/`. One dynamic route, `POST /api/enquiry`, validates with a shared Zod schema and sends email through Resend. The visual system is Tailwind v4 theme tokens, with motion from GSAP/Lenis/Motion, all disabled under reduced motion.

**Tech Stack:** Next.js 16, React 19, TypeScript strict, Tailwind CSS 4, GSAP 3 (ScrollTrigger, SplitText), Lenis, Motion, Zod 4, React Hook Form, Resend, sharp, Vitest, Playwright, @axe-core/playwright.

**Spec:** `docs/superpowers/specs/2026-09-27-horquva-website-v2-design.md`

## Global Constraints

- No case studies, client logos, testimonials, "trusted by" rows or invented metrics (spec §1).
- Copy: sentence case; first person plural; banned words: unlock, empower, seamless, cutting-edge, leverage, revolutionise, transform your business, next-generation, supercharge (spec §2).
- Banned visual patterns: eyebrow labels, pill/glowing buttons, glassmorphism, purple/blue/violet gradients, gradient text, blobs, centred two-button hero, 3-col icon cards, emoji/sparkles, particles/beams/spotlights, logo marquees, AI imagery (spec §5.4).
- Tokens: paper `#F3EFE7`, ink `#15120F`, bronze `#A9825A`, bronze-deep `#5E3F2C`, stone `#857C72`, ink-soft `#4A433C`, rule `#DAD2C4`, rule-dark `#3A332D`.
- Font: Hanken Grotesk 400/500/600 via `next/font/google`. `border-radius: 0` on buttons and inputs.
- `prefers-reduced-motion: reduce` → no animation, native scroll.
- Every page statically generated; only `/api/enquiry` is dynamic.
- Photos: Unsplash/Pexels only, recorded in `content/image-credits.json`, graded by `scripts/grade-images.mjs`.

## Deviations from spec (approved by building)
- Next.js **16** (current stable) instead of 15.
- Service content lives in typed TS modules (`content/services.ts`) instead of MDX. Every service page shares one fixed structure, so structured data fits better and removes the MDX toolchain.

---

## File map

```
app/layout.tsx, globals.css, page.tsx, not-found.tsx, sitemap.ts, robots.ts
app/services/page.tsx, app/services/[slug]/page.tsx
app/oba-core/page.tsx, approach/page.tsx, team/page.tsx, careers/page.tsx, contact/page.tsx, privacy/page.tsx
app/api/enquiry/route.ts
components/layout/{SiteHeader,SiteFooter,MobileMenu}.tsx
components/ui/{Button,TextLink,Section,Photo,PageIntro}.tsx
components/motion/{SmoothScroll,RevealText,RevealImage,CursorImage}.tsx
components/home/{Hero,ServiceIndex,ProcessSteps,ObaTeaser,TeamStrip}.tsx
components/forms/EnquiryForm.tsx
components/oba/{QuestionStack,Roadmap}.tsx
content/{services,team,process,site}.ts, content/image-credits.json
lib/{enquiry-schema,rate-limit,send-enquiry,contrast}.ts
scripts/grade-images.mjs, scripts/fetch-photos.mjs, content/photo-manifest.json
tests/unit/*.test.ts, tests/e2e/*.spec.ts
```

---

### Task 1: Scaffold, tokens, test harness

**Files:** Create project via create-next-app; modify `app/globals.css`, `app/layout.tsx`; create `lib/contrast.ts`, `tests/unit/contrast.test.ts`, `vitest.config.ts`, `playwright.config.ts`.

**Produces:** Tailwind colour utilities `bg-paper text-ink text-bronze text-bronze-deep text-stone text-ink-soft border-rule border-rule-dark`; CSS var `--font-sans`; `contrastRatio(hexA: string, hexB: string): number`.

- [ ] Step 1: `npx create-next-app@latest . --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --turbopack` (into existing folder; keep `docs/`).
- [ ] Step 2: Install deps: `npm i gsap lenis motion zod react-hook-form @hookform/resolvers resend` and `npm i -D vitest @vitest/coverage-v8 @playwright/test @axe-core/playwright sharp`.
- [ ] Step 3: Write failing test `tests/unit/contrast.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { contrastRatio } from "@/lib/contrast";
const pairs: [string, string, number][] = [
  ["#15120F", "#F3EFE7", 4.5], // ink on paper
  ["#4A433C", "#F3EFE7", 4.5], // ink-soft on paper
  ["#5E3F2C", "#F3EFE7", 4.5], // bronze-deep on paper
  ["#F3EFE7", "#15120F", 4.5], // paper on ink
  ["#857C72", "#15120F", 4.5], // stone on ink
  ["#A9825A", "#15120F", 4.5], // bronze on ink
];
describe("token contrast", () => {
  it.each(pairs)("%s on %s ≥ %d", (fg, bg, min) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(min);
  });
  it("computes black on white as 21", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 1);
  });
});
```
- [ ] Step 4: `npx vitest run` → FAIL (module missing).
- [ ] Step 5: Implement `lib/contrast.ts` (WCAG relative luminance):
```ts
const lum = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export function contrastRatio(a: string, b: string): number {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}
```
- [ ] Step 6: `vitest.config.ts` with `@` alias and `include: ["tests/unit/**/*.test.ts"]`; `package.json` scripts: `"test": "vitest run"`, `"e2e": "playwright test"`. Run → PASS. If any pair fails, adjust only that token toward more contrast and update the spec table.
- [ ] Step 7: `globals.css`: `@import "tailwindcss"; @theme { --color-paper:#F3EFE7; --color-ink:#15120F; --color-bronze:#A9825A; --color-bronze-deep:#5E3F2C; --color-stone:#857C72; --color-ink-soft:#4A433C; --color-rule:#DAD2C4; --color-rule-dark:#3A332D; --font-sans: var(--font-hanken), ui-sans-serif, system-ui, sans-serif; }`, base body `bg-paper text-ink antialiased`, `::selection` bronze, `:focus-visible` 2px bronze outline offset 3px, reduced-motion rule forcing `scroll-behavior:auto`.
- [ ] Step 8: `layout.tsx` loads `Hanken_Grotesk({ subsets:["latin"], weight:["400","500","600"], variable:"--font-hanken" })`.
- [ ] Step 9: `playwright.config.ts`: `webServer: { command: "npm run build && npm run start -- -p 3100", port: 3100, reuseExistingServer: true, timeout: 240000 }`, projects chromium desktop + Pixel 7.
- [ ] Step 10: `npm run build` passes. Commit `chore: scaffold next app with tokens and test harness`.

### Task 2: Content layer

**Files:** Create `content/site.ts`, `content/services.ts`, `content/process.ts`, `content/team.ts`, `content/image-credits.json`; test `tests/unit/content.test.ts`.

**Produces:**
```ts
// content/services.ts
export type Service = {
  number: string; slug: string; name: string; summary: string; intro: string;
  photo: { src: string; alt: string };
  deliverables: string[]; scenarios: { title: string; body: string }[];
  process: { step: string; body: string }[]; stack: string[];
};
export const services: Service[];
export function getService(slug: string): Service | undefined;
export function nextService(slug: string): Service;
// content/site.ts
export const site: { name: string; legalName: string; city: string; email: string; linkedin: string; url: string };
export const enquiryServiceOptions: string[]; // 8 service names + "OBA Core" + "Not sure yet"
export const budgetOptions: string[];         // "Under $2k","$2k–5k","$5k–15k","$15k+","Not sure yet"
// content/team.ts
export type Person = { name: string; role: string; photo?: string; bio: string; linkedin?: string };
export const team: Person[];
```

- [ ] Step 1: Failing test:
```ts
import { describe, it, expect } from "vitest";
import { services, getService, nextService } from "@/content/services";
import { enquiryServiceOptions } from "@/content/site";
const banned = /unlock|empower|seamless|cutting-edge|leverage|revolutioni[sz]e|transform your business|next-generation|supercharge/i;
describe("services content", () => {
  it("has 8 services numbered 01–08 in order", () => {
    expect(services.map((s) => s.number)).toEqual(["01","02","03","04","05","06","07","08"]);
  });
  it("has unique slugs and complete fields", () => {
    expect(new Set(services.map((s) => s.slug)).size).toBe(8);
    for (const s of services) {
      expect(s.deliverables.length).toBeGreaterThanOrEqual(4);
      expect(s.scenarios.length).toBeGreaterThanOrEqual(2);
      expect(s.process).toHaveLength(4);
      expect(s.stack.length).toBeGreaterThan(0);
      expect(s.photo.alt.length).toBeGreaterThan(0);
    }
  });
  it("contains no banned words", () => {
    expect(JSON.stringify(services)).not.toMatch(banned);
  });
  it("getService / nextService", () => {
    expect(getService("wordpress")?.number).toBe("07");
    expect(getService("nope")).toBeUndefined();
    expect(nextService("data-analytics").slug).toBe("ai-agents");
  });
  it("enquiry options include every service plus OBA Core and Not sure yet", () => {
    for (const s of services) expect(enquiryServiceOptions).toContain(s.name);
    expect(enquiryServiceOptions).toContain("OBA Core");
    expect(enquiryServiceOptions).toContain("Not sure yet");
  });
});
```
- [ ] Step 2: Run → FAIL.
- [ ] Step 3: Write content for all 8 services per spec §3 (slugs: ai-agents, knowledge-assistants, document-vision-ai, voice-ai, automation-integrations, web-product-engineering, wordpress, data-analytics). Photo `src` = `/photos/<slug>.jpg`. Team from current site + resumes (Natasha Khan, Kia Vang, Taha Omer Nadeem, Affan Ahmed, Muhammad Ibrahim Shaikh) with photo undefined until supplied. Process steps: Discover, Prototype, Build, Support.
- [ ] Step 4: Run → PASS. Commit `feat: add typed site content`.

### Task 3: Enquiry schema, rate limit, API route (TDD)

**Files:** Create `lib/enquiry-schema.ts`, `lib/rate-limit.ts`, `lib/send-enquiry.ts`, `app/api/enquiry/route.ts`; tests `tests/unit/enquiry-schema.test.ts`, `tests/unit/enquiry-route.test.ts`.

**Produces:**
```ts
export const enquirySchema: z.ZodObject<...>; // name, email, company?, service, budget, message, website (honeypot)
export type Enquiry = z.infer<typeof enquirySchema>;
export function createRateLimiter(opts: { limit: number; windowMs: number }): (key: string, now?: number) => boolean; // true = allowed
export async function sendEnquiry(e: Enquiry): Promise<void>; // throws on failure
// route: POST handles JSON (fetch) and form-urlencoded (no-JS); JSON → 200 {ok:true} | 400 {errors} | 429 | 502 ; form → 303 redirect /contact?sent=1 | ?error=1
```

- [ ] Step 1: Failing schema tests: valid object passes; missing name, bad email, service not in options, budget not in options, message < 20 chars, message > 5000 chars each fail with an error on that field; honeypot is accepted as any string (route decides).
- [ ] Step 2: Failing route tests (mock `@/lib/send-enquiry` with `vi.mock`): valid JSON → 200 and sendEnquiry called once; invalid → 400 with `errors.email`; honeypot filled → 200 and sendEnquiry NOT called; sendEnquiry throws → 502; 6th request from same `x-forwarded-for` within window → 429; urlencoded valid → 303 to `/contact?sent=1`.
- [ ] Step 3: Run → FAIL.
- [ ] Step 4: Implement:
```ts
// lib/enquiry-schema.ts
import { z } from "zod";
import { enquiryServiceOptions, budgetOptions } from "@/content/site";
export const enquirySchema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(120),
  email: z.string().trim().email("Enter a valid email address"),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  service: z.enum(enquiryServiceOptions as [string, ...string[]], { message: "Choose a service" }),
  budget: z.enum(budgetOptions as [string, ...string[]], { message: "Choose a budget range" }),
  message: z.string().trim().min(20, "Tell us a bit more (at least 20 characters)").max(5000, "Keep it under 5000 characters"),
  website: z.string().optional(),
});
export type Enquiry = z.infer<typeof enquirySchema>;
```
```ts
// lib/rate-limit.ts
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, number[]>();
  return (key: string, now = Date.now()) => {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= limit) { hits.set(key, recent); return false; }
    recent.push(now); hits.set(key, recent); return true;
  };
}
```
`lib/send-enquiry.ts` uses `new Resend(process.env.RESEND_API_KEY)` → `emails.send({ from: ENQUIRY_FROM_EMAIL, to: ENQUIRY_TO_EMAIL, replyTo: e.email, subject: \`New enquiry: ${e.service} — ${e.name}\`, text })`; throws if env missing or `error` returned.
Route: parse body by content-type; honeypot → success; `safeParse` → field errors via `z.flattenError(...).fieldErrors`; limiter `createRateLimiter({limit:5, windowMs:600000})` at module scope keyed by first `x-forwarded-for` IP; `export const runtime = "nodejs"`.
- [ ] Step 5: Run → PASS. Commit `feat: enquiry api with validation, honeypot and rate limit`.

### Task 4: Layout and UI primitives

**Files:** `components/ui/{Button,TextLink,Section,Photo,PageIntro}.tsx`, `components/layout/{SiteHeader,SiteFooter,MobileMenu}.tsx`, `app/layout.tsx`.

**Produces:**
- `<Button href? type? variant="solid"|"outline" tone="paper"|"ink">` square, min-h-11, px-6, text-[15px] font-medium; hover bg bronze-deep (paper) / bronze text-ink (ink).
- `<TextLink href tone?>` underline `decoration-bronze underline-offset-4 decoration-1 hover:decoration-2`.
- `<Section tone="paper"|"ink" id? className?>` full-bleed bg + inner `mx-auto max-w-[1440px] px-[clamp(1rem,4vw,3.5rem)]`.
- `<Photo src alt ratio priority?>` wraps next/image with `fill` + object-cover inside aspect box; renders ink block if `src` missing.
- `<PageIntro title lead? tone?>` large left-aligned h1 (RevealText) + lead offset to column 7.
- Header: wordmark text "HORQUVA" + logo mark (copy current `logo-mark.png` into `public/`), nav links, "Start a project" Button → `/contact`; sticky, hides on scroll down / shows on scroll up; MobileMenu full-screen ink panel with large links, `aria-expanded`, Escape closes, body scroll locked.
- Footer: ink section, big "Start a project" link, columns (Services list, Company links, Contact: email, LinkedIn, Karachi), bottom row "© {year} Horquva LLC" + Privacy.

- [ ] Steps: build components; temporary home page renders header/footer; `npm run build`; manual check in browser at 390px and 1440px; commit `feat: layout and ui primitives`.

### Task 5: Motion components

**Files:** `components/motion/{SmoothScroll,RevealText,RevealImage,CursorImage}.tsx`, `lib/use-reduced-motion.ts`.

**Produces:**
- `useReducedMotion(): boolean` (matchMedia, SSR-safe default `true` until mounted to avoid flash of animation on reduced-motion users).
- `<SmoothScroll>` client provider: Lenis `{ lerp: 0.1 }` + `gsap.ticker` sync with ScrollTrigger; no-op under reduced motion.
- `<RevealText as="h1"|"h2"|"p" className>` GSAP SplitText by lines, lines masked, `yPercent:110→0`, 0.9s `power3.out`, stagger 0.08, on enter viewport once. Text is visible without JS (initial state set only in effect).
- `<RevealImage>` wraps children; `clipPath inset(12% 0 12% 0)→inset(0)` + scale 1.08→1 scrubbed on enter.
- `<CursorImage items activeIndex>` fixed-position image following pointer via Motion springs (`stiffness 300, damping 30`), 280×350, hidden on `(hover: none)`.

- [ ] Steps: implement; verify in browser that headline reveals and that with reduced-motion emulation content is static; commit `feat: motion primitives with reduced-motion support`.

### Task 6: Enquiry form + contact page

**Files:** `components/forms/EnquiryForm.tsx`, `app/contact/page.tsx`.

**Produces:** `<EnquiryForm defaultService?: string tone?: "paper"|"ink">`: RHF + zodResolver(enquirySchema); fields with bottom-border inputs, labels above, `aria-invalid` + `aria-describedby` error text; hidden honeypot (`tabIndex=-1`, `autoComplete=off`, visually hidden wrapper); native `action="/api/enquiry" method="post"` for no-JS; on JS submit fetch JSON, map 400 errors to fields, 429/502 messages per spec, success replaces form with "Thanks, {name}. We'll reply within two working days." Contact page reads `?service=`, `?sent=1`, `?error=1`.

- [ ] Steps: implement; manual submit with dev server (no Resend key → 502 message shows); commit `feat: enquiry form and contact page`.

### Task 7: Photography pipeline

**Files:** `content/photo-manifest.json` (slot → Unsplash/Pexels page URL + direct download URL + photographer + licence), `scripts/fetch-photos.mjs`, `scripts/grade-images.mjs`, `assets/grain.png` (generated by script), `content/image-credits.json`.

Slots: `hero`, `process`, `oba`, one per service slug (8), `approach`, `careers` = 13 photos.

- [ ] Step 1: Select photos on Unsplash/Pexels following spec §6 rules; record in manifest. **Get user approval before downloading.**
- [ ] Step 2: `fetch-photos.mjs` downloads manifest URLs into `assets/photos/raw/<slot>.jpg` and writes `image-credits.json`.
- [ ] Step 3: `grade-images.mjs` with sharp: resize ≤2400w; `modulate({ saturation: 0.78 })`; `linear(0.92, 14)` (black lift); tint shadows via composite of `#5E3F2C` layer at `blend: "soft-light"` opacity 0.18; composite generated grain (noise PNG, `soft-light`, ~6%); output `public/photos/<slot>.jpg` (q80, mozjpeg). next/image produces AVIF/WebP at request/build time, so the script only needs JPEG.
- [ ] Step 4: Run both; view outputs; commit `feat: licensed photography with consistent grade`.

### Task 8: Home page

**Files:** `components/home/{Hero,ServiceIndex,ProcessSteps,ObaTeaser,TeamStrip}.tsx`, `app/page.tsx`.

- [ ] Hero: `Section paper`; h1 RevealText spanning cols 1–10 (`text-[clamp(2.75rem,7vw,7.5rem)] leading-[0.95] tracking-[-0.035em] font-medium`); lead paragraph cols 7–11 below; TextLink "Start a project"; full-bleed Photo `hero` 16:7 (4:5 mobile) inside RevealImage.
- [ ] ServiceIndex: `<ol>` of 8 rows, `border-t border-rule`; row = bronze number, name `text-[clamp(1.75rem,4vw,3.5rem)]`, summary revealed on hover (grid-rows 0fr→1fr), arrow at right; CursorImage showing that service's photo; mobile shows 64px thumbnail inline.
- [ ] ProcessSteps: `Section ink`; heading "How we work"; 4 columns (1 on mobile) numbered steps from `content/process.ts`; terms list; wide Photo `process`.
- [ ] ObaTeaser: three questions stacked, each `text-[clamp(2.5rem,6vw,6rem)]`, third in bronze-deep; paragraph + TextLink `/oba-core`; Photo `oba` 4:5 right column.
- [ ] TeamStrip: grid of team members (photo 4:5 grayscale-warm via Photo; placeholder ink block with initials if photo missing), name + role; TextLink `/team`.
- [ ] Enquiry section: `Section ink` with heading "Start a project" and `<EnquiryForm tone="ink" />`.
- [ ] Verify in browser (desktop + mobile); commit `feat: home page`.

### Task 9: Services index and service pages

**Files:** `app/services/page.tsx`, `app/services/[slug]/page.tsx`.

- [ ] Index: PageIntro "Services" + reuse ServiceIndex.
- [ ] Detail: `generateStaticParams` from services; `export const dynamicParams = false`; `generateMetadata` title `${name} | Horquva`; layout per spec §3 (photo hero, What we build list in 2 cols with rules, Typical projects with note "Examples of the kind of work we take on.", How we'd work 4 steps, Stack as comma list, next-service large link, enquiry CTA linking `/contact?service=<name>`).
- [ ] `params` is a Promise in Next 16: `const { slug } = await params`.
- [ ] Verify all 8 pages build; commit `feat: service pages`.

### Task 10: OBA Core page

**Files:** `components/oba/{QuestionStack,Roadmap}.tsx`, `app/oba-core/page.tsx`.

- [ ] Content per spec §4 from one-pager; Roadmap horizontal 5-step line with bronze nodes (vertical on mobile); scenarios as two-column text blocks; "What organisations get" list; note on intended capability; CTA `/contact?service=OBA%20Core`.
- [ ] Commit `feat: oba core page`.

### Task 11: Remaining pages

**Files:** `app/approach/page.tsx`, `app/team/page.tsx`, `app/careers/page.tsx`, `app/privacy/page.tsx`, `app/not-found.tsx`.

- [ ] Approach: PageIntro, 4 steps in depth, working terms, photo `approach`.
- [ ] Team: all people with bios (past-employer results only in individual bios), LinkedIn links.
- [ ] Careers: "No open roles right now. If you'd like to work with us, send your CV to {email}." + photo `careers`.
- [ ] Privacy: what the form collects, why, Resend as processor, retention, contact; "Image credits" list from `image-credits.json`.
- [ ] 404: large "Page not found" + links home/services.
- [ ] Commit `feat: approach, team, careers, privacy and 404 pages`.

### Task 12: SEO

**Files:** `app/sitemap.ts`, `app/robots.ts`, metadata in `app/layout.tsx` (`metadataBase`, title template `%s | Horquva`, OG defaults), `app/opengraph-image.tsx` (ImageResponse: paper bg, ink headline, bronze mark), Organization JSON-LD script in layout.

- [ ] Commit `feat: seo metadata, sitemap, robots, og image`.

### Task 13: E2E, accessibility and performance verification

**Files:** `tests/e2e/pages.spec.ts`, `tests/e2e/enquiry.spec.ts`.

- [ ] pages.spec: for each route in `["/","/services",...8 slugs,"/oba-core","/approach","/team","/careers","/contact","/privacy"]`: status 200, one `h1` visible, `AxeBuilder` → `violations` equals `[]`; `/services/nope` → 404; mobile: menu button opens dialog, Escape closes.
- [ ] enquiry.spec: `page.route("**/api/enquiry", …)` to mock; empty submit shows ≥4 field errors and makes no request; valid submit shows confirmation; `/contact?service=OBA%20Core` preselects OBA Core.
- [ ] Run `npm test && npm run e2e`; all pass.
- [ ] Lighthouse (mobile) on `/` via `npx lighthouse http://localhost:3100 --preset=perf --form-factor=mobile` plus the full categories; record scores; fix until spec §1 thresholds met.
- [ ] Banned-pattern review: grep for `rounded-full`, `gradient`, `backdrop-blur`, `uppercase tracking` in components → none (except the round logo mark if any).
- [ ] Commit `test: e2e, accessibility and performance checks`.
