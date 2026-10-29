# Work Portfolio Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a single `/work` page that names Horquva's three clients, links to their sites, and states exactly what Horquva did for each. Approved testimonials appear only once the person quoted has signed them off.

**Architecture:** The client data lives in `content/work.ts`. It's typed and holds every claim and quote draft, with an `approved` flag on each quote. `app/work/page.tsx` is a server component that renders that data with the existing `Section`, `Reveal*`, `Photo` and `TextLink` components. The client screenshots are captured once by a script run from the scratchpad and stored as WebP files in `public/photos/work/`.

**Tech Stack:** Next.js 16.3 (App Router), React 19, Tailwind 4, Vitest, Playwright (e2e and the one-off capture), sharp.

**Spec:** `docs/superpowers/specs/2026-10-29-work-portfolio-design.md`

## Global Constraints

- Before writing the page, read the relevant guides in `node_modules/next/dist/docs/` (AGENTS.md requires it; this Next.js differs from training data).
- The company name is "Horquva", never "Horquva Inc.".
- The claims in the spec's "Confirmed facts" table and "Page content" section must not change. Wording can be polished, but the verbs can't: "designed and built" is used only for vin-sol.com; "built" for the chatbot, the HR system and Kyvani; "maintain" for Vintage.
- The page never mentions: that we built ruqaba.com, the expense system, Rabeeya, a Vin-Sol tech stack, who the HR system is for, GIFCO, or any URL for Kyvani.
- The page contains no metrics, logos, filters or card grid, and uses no motion beyond the existing `Reveal`, `RevealText` and `RevealImage`.
- A quote renders only when `approved === true`. Every quote ships with `approved: false`.
- Screenshots go in `public/photos/work/`. **Deviation from the spec (`public/work/`):** `lib/legacy-wordpress.ts` only lets `/photos/` through, so files in `/work/...` would get a 410 from the proxy.
- No screenshot or Playwright *visual* runs of the Horquva site. The owner reviews it on :3200. The existing e2e specs and capturing *client* sites are fine.
- Copy must pass the existing banned-words regex in `tests/unit/content.test.ts`.

## Review Focus

- **A quote left at `approved: false`** must not appear anywhere in the rendered HTML. This is pinned by a unit test on `visibleQuote` (Task 1) and an e2e check (Task 3).
- **A claim that drifts into forbidden territory during copy polish** (e.g. "we built ruqaba.com", "GIFCO", "Rabeeya", "expense") must fail tests. This is pinned in Task 1.
- **The `/work` page or its images getting a 410 from the proxy.** Pinned in Task 3 via `isRetiredUrl`.
- **A client with no image yet** (Kyvani before its URL arrives) must render an empty ink frame without breaking the row. Pinned in Task 3 e2e (the Ruqaba row has a figure either way).
- **External links** must open in a new tab with `rel="noreferrer"` and point exactly at the three client domains. Pinned in Task 3 e2e.

---

### Task 1: Client content and its rules

**Files:**
- Create: `content/work.ts`
- Test: `tests/unit/work-content.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export type Quote = { text: string; name: string; role: string; approved: boolean };
  export type Client = {
    slug: "vin-sol" | "ruqaba" | "vintage";
    number: string;            // "01".."03"
    name: string;
    url: string;               // https://…
    domain: string;            // link text, e.g. "vin-sol.com"
    location: string;          // "Lahore, Pakistan"
    industry: string;          // "Digital marketing"
    about: string;
    did: string;
    services: string[];
    image?: { src: string; alt: string; caption: string };
    quote?: Quote;
  };
  export const clients: Client[];
  export function visibleQuote(c: Client): Quote | undefined; // quote only if approved
  ```

- [ ] **Step 1: Write the failing tests** in `tests/unit/work-content.test.ts`:
  - `lists Vin-Sol, Ruqaba, Vintage in that order`: `clients.map(c => c.slug)` equals `["vin-sol","ruqaba","vintage"]`, and the numbers equal `["01","02","03"]`.
  - `links to the three live sites`: the urls equal `["https://www.vin-sol.com/","https://ruqaba.com/","https://vamgltd.co.uk/"]`.
  - `uses the exact verbs per client`: Vin-Sol's `did` matches `/designed and built vin-sol\.com/i`. Ruqaba's matches `/HR and payroll/` and `/Kyvani/`. Vintage's matches `/maintenance/i`, and none of `/designed|built/i`.
  - `never makes the claims ruled out`: `JSON.stringify(clients)` matches none of `/GIFCO|Rabeeya|expense|Horquva Inc/i`. `JSON.stringify(vinSol)` matches none of `/Laravel|PHP|React|Node|WordPress/i` (no stack for Vin-Sol). Kyvani appears with no URL (no `/kyvani\.[a-z]/i`). Ruqaba's `did` doesn't match `/ruqaba\.com/`.
  - `ships every quote unapproved`: every `c.quote?.approved` is `false`. The Ruqaba quote is by "Aurangzeb Khan", "General Manager". The Vintage quote is by "Mohammud Bin Zahir Minhas", "Director".
  - `visibleQuote hides drafts`: returns `undefined` for each client as shipped, and returns the quote for `{ ...clients[1], quote: { ...clients[1].quote!, approved: true } }`.
  - `keeps images in /photos/work/`: every `image.src` starts with `/photos/work/` and ends `.webp`, with non-empty `alt` and `caption`.
  - `contains no banned words`: import the banned regex pattern (copy it from `content.test.ts`) and check that `JSON.stringify(clients)` doesn't match it.

- [ ] **Step 2: Run** `npx vitest run tests/unit/work-content.test.ts`. Expected: FAIL (module not found).

- [ ] **Step 3: Implement `content/work.ts`.** Use the copy from the spec's "Page content" and "Testimonials" sections verbatim:
  - `about`, `did` and `services` per client.
  - `domain` values: `vin-sol.com`, `ruqaba.com`, `vamgltd.co.uk`.
  - Images:
    - Vin-Sol: `/photos/work/vin-sol.webp`, caption "vin-sol.com, homepage, October 2026"
    - Vintage: `/photos/work/vintage.webp`, caption "vamgltd.co.uk, which we maintain. Homepage, October 2026"
    - Ruqaba: leave `image` out until the Kyvani capture exists. Then use `/photos/work/kyvani.webp` with the caption "Kyvani fashion store, built by Horquva through Ruqaba".
  - Quotes: the three drafts, all `approved: false`. Vin-Sol's `name`/`role` are `"To be confirmed"` until the owner supplies them.
  - `visibleQuote` returns `c.quote?.approved ? c.quote : undefined`.

- [ ] **Step 4: Run** `npx vitest run tests/unit`. Expected: all pass.

- [ ] **Step 5: Commit** `feat: client content for the Work page` (with the Co-Authored-By trailer).

### Task 2: Client screenshots

**Files:**
- Create (not committed): `<scratchpad>/capture-work.mjs`
- Create: `public/photos/work/vin-sol.webp`, `public/photos/work/vintage.webp` (and `kyvani.webp` once the owner gives the URL)

**Interfaces:**
- Produces: the image files at the exact paths Task 1 references.

- [ ] **Step 1: Write `capture-work.mjs`** in the scratchpad. It takes `name=url` pairs as arguments and an output directory as the last argument.
  - Launch Playwright chromium at a 1440×900 viewport with `deviceScaleFactor: 1`.
  - `goto(url, { waitUntil: "networkidle" })`, then wait 1.5s so hero animations settle.
  - Screenshot the viewport as a PNG buffer.
  - Use `sharp` to resize to 1600×1000 (`fit: "cover", position: "top"`) and save as `webp({ quality: 82 })` to `<out>/<name>.webp`.
  - Import `playwright` and `sharp` with absolute paths to the project's `node_modules`, so the script runs from the scratchpad.
  - Don't dismiss cookie banners or chat popups by script. If one covers the hero, report it to the owner instead.

- [ ] **Step 2: Run** `node <scratchpad>/capture-work.mjs vin-sol=https://www.vin-sol.com/ vintage=https://vamgltd.co.uk/ E:/Professional/HORQUVA/Project/horquva-services-website/public/photos/work`. Expected: two `.webp` files, each 30–300 KB. Open each with the Read tool to check it shows the client's homepage hero, not an error, a 406 page or a bot check. If a site blocks the headless browser, **stop and ask the owner for a screenshot**. Don't work around it.

- [ ] **Step 3: Commit** `feat: homepage screenshots of Vin-Sol and Vintage for the Work page`.

### Task 3: The /work page and its wiring

**Files:**
- Create: `app/work/page.tsx`
- Modify: `content/site.ts` (add `"/work"` to `pages` after `"/"`; add `{ href: "/work", label: "Work" }` to `nav` after Services)
- Modify: `components/layout/SiteHeader.tsx:10` (add `"/work"` to `heroPages`)
- Test: `tests/unit/legacy-wordpress.test.ts`, `tests/e2e/pages.spec.ts`

**Interfaces:**
- Consumes: `clients` and `visibleQuote` from Task 1, and the images from Task 2.

- [ ] **Step 1: Write the failing tests.**
  - In `legacy-wordpress.test.ts`, use the file's existing `retired()` helper: `retired("/work")` and `retired("/photos/work/vin-sol.webp")` are both `false`.
  - In `pages.spec.ts`:
    - Add `"/work"` to `routes`.
    - Add a test `work page names each client and links out safely`. It goes to `/work` and checks:
      - the headings "Vin-Sol", "Ruqaba" and "Vintage Claims Management" are visible, in that order
      - links named "Visit vin-sol.com", "Visit ruqaba.com" and "Visit vamgltd.co.uk" have those `href`s, `target="_blank"` and `rel` containing `noreferrer`
      - the page text contains none of "Aurangzeb", "Minhas" or "To be confirmed" (the quotes are unapproved)
      - the main nav has a "Work" link to `/work`.

- [ ] **Step 2: Run** `npx vitest run tests/unit/legacy-wordpress.test.ts`. Expected: FAIL for `/work`, since it isn't in `pages` yet.

- [ ] **Step 3: Wire `content/site.ts` and `SiteHeader.tsx`** as listed under Files.

- [ ] **Step 4: Implement `app/work/page.tsx`.**
  - **Metadata:** title `"Work"`, description `"Who Horquva works with: Vin-Sol in Lahore, Ruqaba in Dubai and Vintage Claims Management in London, and what we've built and look after for each."`
  - **Opening:** copy the Team page's opening (ink `Section`, radial bronze glow, centred `RevealText as="h1"` with class `text-hero`, and the lead in a `Reveal`), using the spec's H1 "Who we work with" and its lead.
  - **Clients:** a paper `Section` with `aria-label="Clients"`. Each client is an `<article aria-labelledby={slug}>` separated by `border-t border-rule`, with `py-20 md:py-28`.
    - The inner grid is `md:grid-cols-12 gap-10`. A `<figure>` takes `md:col-span-7`: `RevealImage` › `Photo ratio="16/10"` with `className="rounded-[1.25rem] ring-1 ring-rule"`, plus a `<figcaption className="mt-3 text-[14px] text-stone">`. With no `image`, render `Photo` with no `src` and alt `"{name}"`, and no caption.
    - The text takes `md:col-span-5`, wrapped in `Reveal`, with:
      - a label line `{number} · {location} · {industry}` in `text-[14px] text-bronze-deep`
      - `<h2 id={slug} className="mt-3 font-display text-[34px] leading-tight md:text-[40px]">`
      - "Technology partner · Ongoing" in `text-[15px] text-stone`
      - "About them" (`h3`, `font-medium`) and the `about` paragraph
      - "What we did" (`h3`) and the `did` paragraph, both in `text-ink-soft`
      - a `<ul>` of services with the service-page bronze dot (`h-2 w-2 rounded-full bg-bronze`) and no hover sweep
      - `TextLink external` reading "Visit {domain}"
      - if `visibleQuote(c)` returns a quote: a `<figure>` with a `<blockquote className="border-l-2 border-bronze pl-4">` and a `<figcaption>` reading "{name}, {role}, {client name}".
    - Only the first client's `Photo` gets `priority`. `sizes` is `"(min-width: 768px) 58vw, 100vw"`.
  - **Closing:** copy the Team page's "Where to next" ink section with `onward = [{ href: "/contact", title: "Start a project", body: "Tell us what you're trying to do. We reply within two working days." }, { href: "/#services", title: "See our services", body: "What we build, and how we go about it." }]`.

- [ ] **Step 5: Run** `npx vitest run`, `npm run lint` and `npm run build`. Expected: all pass, and the build output lists `/work` as static.

- [ ] **Step 6: Run** `npx playwright test tests/e2e/pages.spec.ts -g "work"`. Expected: PASS, including the axe check for `/work` (no screenshots taken).

- [ ] **Step 7: Commit** `feat: Work page with Vin-Sol, Ruqaba and Vintage Claims Management` (with the Co-Authored-By trailer). Leave the AGENTS.md block alone if `next dev` re-adds it.

### Task 4 (when the owner supplies the Kyvani URL): Ruqaba visual

- [ ] Run the Task 2 script with `kyvani=<url>`. The URL is passed only on the command line and is never written into the repo.
- [ ] Add the Ruqaba `image` from Task 1 Step 3. Run `npx vitest run`. Commit `feat: Kyvani screenshot for the Ruqaba entry`.

### When quotes are approved

To publish a quote, set its `approved: true` (and fill in Vin-Sol's name and role) in `content/work.ts`, then update the `ships every quote unapproved` test so it lists the approved names. No page changes are needed.
