# Work (portfolio) page: design

Date: 2026-10-29
Status: draft, awaiting approval

## Intent

A single `/work` page that shows prospective clients the real companies Horquva works with and exactly what Horquva did for each. The point is trust. Every claim on the page must match what Horquva actually delivered, so a prospect who visits a client's site, or asks the client, finds the page accurate.

Reference: entropiklabs.com/portfolio. We take its habit of stating plainly what was done for each client. We leave out its filter chips, inflated stats, "Featured" badges, logo walls and promotional tone.

## Goals

- Name three clients, link to their live sites and say in plain words what Horquva did for each.
- Present Horquva as each client's ongoing **technology partner**, which the owner has confirmed for all three.
- Fit the existing site: paper, ink and bronze colours, Hanken and Plus Jakarta fonts, a dark opening section, then plain sections below it.
- Work well on phones and desktops.

## Non-goals

- Detail pages for each client. It's one page only.
- Metrics or results. The owner has none to publish.
- Publishing any testimonial its named person hasn't approved (see Testimonials).
- Filters, tags or a tech logo strip.

## Anti-goals (failure even if it technically works)

- **Claiming anything not confirmed below.** In particular: Ruqaba's own website, Ruqaba's expense management system, the Rabeeya site, the design or build of the Vintage Claims site, any tech stack for Vin-Sol, or who the HRM system was built for.
- Showing a screenshot of a site Horquva didn't build in a way that implies we built it.
- A card grid, a sticky side index, or a page that looks like a design system showing off. The owner has rejected these on other pages.
- Using the name "Horquva Inc.". It's always "Horquva".
- Unnecessary motion. Use the site's existing Reveal behaviour only.

## Confirmed facts (from the owner, 2026-10-29)

| | Vin-Sol | Ruqaba | Vintage Claims Management |
|---|---|---|---|
| Site | vin-sol.com | ruqaba.com | vamgltd.co.uk |
| Where | Bahria Town, Lahore, Pakistan | Meydan, Dubai, UAE | Park Royal, London, UK |
| Their business (from their own site) | Digital marketing agency: web, design, social, Meta ads, video, SEO | Digital marketing agency: branding, social, paid media, video, web | Accident claims management: credit hire, repairs, storage, recovery (trading name of Vintage Car Hire Ltd) |
| Relationship | Direct client, ongoing, technology partner | Direct client, ongoing, technology partner | Direct client, ongoing, technology partner |
| Horquva's work | Designed and built the website. Built the AI chatbot on the site. Automated internal workflows (describe only generally). | Built the HRM and payroll system (Laravel, MySQL; attendance, shift scheduling, salary and incentive calculation, centralised HR operations). Built the Kyvani fashion e-commerce store, delivered through Ruqaba. | Took over ongoing maintenance and support of the website (describe only generally). The site was originally built by another studio. |
| Don't say | Tech stack; specifics of the workflows | That we built ruqaba.com; the expense system; Rabeeya; who the HRM system is for | That we designed or built the site; specifics of the maintenance |
| Name and link allowed | Yes | Yes | Yes |
| Quotes | Owner may supply later | Same | Same |
| Metrics | None | None | None |

## Page content (draft copy)

Copy is in Horquva's existing voice: short sentences, plain words, no superlatives. Final wording can be polished during the build, but the **claims must not change**.

### Opening (ink section, centred, matching Team / OBA Core)

- **H1:** "Who we work with"
- **Lead:** "We're the technology partner to businesses in Pakistan, the UAE and the UK. Here's what we've built for each of them, and what we look after."

### Client sections, in this order

Each section contains:
- **A small label:** number · city, country · industry
- **The company name** as a heading
- **A status line:** "Technology partner · Ongoing"
- **"About them":** one sentence describing the company, taken from facts on its own site
- **"What we did":** two or three sentences using exact verbs (*designed and built*, *built*, *maintain*)
- **A services list:** short plain bulleted items
- **A link** to the client's site, opening in a new tab
- **A visual** (see Visuals)
- **A quote**, only if one is supplied

**01 · Lahore, Pakistan · Digital marketing**
**Vin-Sol**
- About: "Vin-Sol is a digital marketing agency in Bahria Town, Lahore, covering web development, design, social media, Meta ads, video and SEO."
- What we did: "We designed and built vin-sol.com, including the AI chat assistant visitors use to ask questions on the site. Behind the scenes, we automate parts of Vin-Sol's internal workflows."
- Services: Website design · Website development · AI chatbot · Workflow automation
- Link: "Visit vin-sol.com"

**02 · Dubai, UAE · Digital marketing**
**Ruqaba**
- About: "Ruqaba is a digital marketing agency in Dubai, working on branding, social media, paid media, video and web for brands across the UAE."
- What we did: "We build software for Ruqaba. That includes an HR and payroll system, built with Laravel and MySQL, that brings attendance, shift scheduling, and salary and incentive calculation into one place. We also built the Kyvani fashion e-commerce store, delivered through Ruqaba." (Kyvani is named, not linked.)
- Services: Custom software · HR and payroll system · E-commerce development
- Link: "Visit ruqaba.com". The link text names the company's site and nothing suggests we built it.

**03 · London, UK · Claims management**
**Vintage Claims Management**
- About: "Vintage Claims Management handles not-at-fault accident claims in London, arranging replacement vehicles, repairs, storage and recovery."
- What we did: "We took over the maintenance of Vintage's website and look after it on an ongoing basis."
- Services: Website maintenance and support
- Link: "Visit vamgltd.co.uk"

### Closing (ink section)

Two links in the same pattern as the end of the Team page: "Start a project" (/contact) and "See our services" (/#services). This is my call.

## How claims are attributed

- **Verbs are exact.** "Designed and built" is used only for Vin-Sol's site. "Built" is used for the chatbot, the HRM system and Kyvani. "Maintain" is used for Vintage. We never use vaguer words like "worked on" or "helped with" to stretch a claim.
- **Every client links to its live site**, so a prospect can check it.
- **Screenshots carry a caption** naming the site and the month captured, e.g. "vin-sol.com, homepage, October 2026". Where the site isn't fully our work, the caption says what our part is, e.g. "vamgltd.co.uk, which we maintain".
- **Company descriptions come only from each company's own public site.**
- **No numbers, logos or quotes** unless the owner supplies them.

## Layout

- On desktop, each client is one row on a 12-column grid. The visual takes about 7 columns and the text about 5. The side the image sits on stays the same for every client (image left) to keep things calm. This is my call; alternating sides is the alternative.
- On phones, the visual stacks above the text.
- Clients are separated by a thin rule (`border-rule`) and generous vertical space, all on a paper background. There are no cards.
- The text column reuses existing styles: a small `text-bronze-deep` label, a `font-display` heading, `text-ink-soft` body text, a plain list with the bronze dot used on service pages but without its hover sweep, and `TextLink external` for the site link.
- Motion uses only the existing `Reveal`, `RevealText` and `RevealImage` components.

## Visuals

- **Vin-Sol:** a desktop screenshot of the vin-sol.com homepage at 1440×900, top of the page, cropped to 16:10.
- **Vintage:** the same treatment for vamgltd.co.uk, captioned as a site we maintain.
- **Ruqaba:** ruqaba.com is **not** our work, so its homepage is not used. The visual is a desktop screenshot of the **Kyvani store** homepage, captioned "Kyvani fashion store, built by Horquva through Ruqaba". Kyvani is **named but not linked**: the URL is not used anywhere on the page or in the caption. The owner will supply the URL privately, only so the screenshot can be taken.
- **Capture:** the builder takes the three client screenshots with a one-off headless-browser script, run from the scratchpad and not committed. The owner approved using live-site screenshots and naming the clients. The "no Playwright runs" preference covers the Horquva site only. If the Kyvani URL hasn't arrived, the Ruqaba row ships temporarily with the empty ink frame that `Photo` already supports. `image` is optional in the data model for that case only.
- Screenshots are taken once, converted to WebP and stored in `public/work/`. They aren't live embeds. They sit in the existing `Photo` frame with `rounded-[1.25rem]` and a faint ring so a white site doesn't bleed into the paper background.

## Technical notes

- **Content:** `content/work.ts` exports a `Client[]` holding the slug, name, url, location, industry, about, did, services, `image?` (src, alt, caption) and `quote?` (text, name, role, approved). The page only renders this data.
- **Page:** `app/work/page.tsx`, a server component with metadata: title "Work", plus a description naming the three clients.
- **Wiring:**
  - Add `/work` to `pages` in `content/site.ts`. This updates the sitemap, and without it the 410 proxy would block the page.
  - Add `{ href: "/work", label: "Work" }` to `nav` after Services.
  - Add `/work` to `heroPages` in `SiteHeader.tsx`, because the page opens with an ink section.
  - Check that `MobileMenu` picks up the new nav item.
- **Docs:** read the relevant guide in `node_modules/next/dist/docs/` before writing the page, as AGENTS.md requires.
- **Checks:** `npm run lint`, `npm run build`, and confirm `/work` returns 200, not 410. Per the owner's preference, no screenshot or Playwright visual runs of the Horquva site: the owner reviews it on :3200 themselves.

## Left to the builder

- Exact spacing and type sizes, within the existing scale.
- Copy polish that doesn't change any claim.
- The image's `sizes` attribute and whether the first screenshot gets priority loading.

## Testimonials

Each quote is attributed to a named person at the client, using the name and role shown on the client's own site. **Horquva drafts the quote, the owner sends it to the person, and it is published only after that person approves it in writing.** No quote is published without approval.

In the data model, `quote` is `{ text, name, role, approved: boolean }`. The page renders a quote only when `approved` is `true`, so drafts can sit in `content/work.ts` without ever appearing on the page. Approved quotes appear at the bottom of the client's text column as a short blockquote (the bronze left rule used on OBA Core), followed by the person's name, role and company.

Drafts to send for approval (each person may rewrite theirs freely):

- **Ruqaba, Aurangzeb Khan, General Manager:** "Horquva built our HR and payroll system and the Kyvani store for us. They're the team we go to when something technical needs building properly."
- **Vintage Claims Management, Mohammud Bin Zahir Minhas, Director:** "Horquva took over our website and keep it running. When we need something changed, it gets done."
- **Vin-Sol, name and role to be supplied by the owner** (the site names nobody): "Horquva designed and built our website and the AI assistant on it, and they automate a lot of our day-to-day work behind the scenes."

## Owner inputs still to arrive

- The Kyvani store URL, for the screenshot only (never linked).
- A name and role at Vin-Sol for their quote.
- Written approval of each quote from the person it's attributed to.

## Builder's calls (made in the design, owner to check)

- H1 wording "Who we work with".
- Image on the left in every row, rather than alternating sides.
- The closing section with links to "Start a project" and "See our services".
- Vintage's description says the site was "originally built by another studio" only in this document. The page itself says just "We took over the maintenance", without naming GIFCO.
