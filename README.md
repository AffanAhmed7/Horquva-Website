# Horquva Website

Marketing site for Horquva Inc.: a home page with an interactive hero, eight service pages, the
OBA Core product tour, approach, team, careers and privacy pages, and an enquiry form that sends
email through Resend.

Design and scope: `docs/superpowers/specs/2026-09-27-horquva-website-v2-design.md`

## Stack

- [Next.js 16](https://nextjs.org) (App Router) with React 19 and TypeScript
- Tailwind CSS 4
- GSAP and Lenis for scroll and motion (loaded after hydration)
- React Hook Form and Zod for the enquiry form, Resend for delivery
- Vitest for unit tests, Playwright and axe-core for end-to-end and accessibility tests

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

## Checks

```bash
npm test             # unit tests (content rules, enquiry schema and API)
npm run e2e          # builds, then runs page, accessibility and form tests in Playwright
npm run lint
```

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home: hero, services, OBA Core teaser, contact |
| `/services`, `/services/[slug]` | Services index and one page per service |
| `/oba-core` | OBA Core product tour |
| `/approach` | How Horquva works |
| `/team` | Team |
| `/careers` | Careers |
| `/contact` | Enquiry form (posts to `/api/enquiry`) |
| `/privacy` | Privacy notice |

`sitemap.xml`, `robots.txt` and the Open Graph image are generated from `app/`.

## Project layout

```
app/          routes, layout, API handler, metadata
components/   UI components
content/      services, team, process and site copy as typed TypeScript
lib/          shared helpers (enquiry schema, email, utilities)
public/       graded photos and static assets
scripts/      photo fetch and grade scripts
tests/        unit (Vitest) and e2e (Playwright) tests
docs/         proposal, design spec and implementation plan
```

## Enquiry form

Copy `.env.example` to `.env.local` and fill in the Resend API key and addresses. Without them
the form shows "Couldn't send your message" with the email address as a fallback.

## Content

- Services, team, process and site details live in `content/*.ts`.
- A unit test fails if copy contains banned filler words (see `tests/unit/content.test.ts`).

## Photos

All non-team photos come from Unsplash and are listed in `content/photo-manifest.json`.

```bash
npm run photos:fetch   # download originals into assets/photos/raw (not committed)
npm run photos:grade   # apply the house grade into public/photos
```

Team portraits go in `assets/photos/team/` and are graded and cropped to 4:5 by the same script.
