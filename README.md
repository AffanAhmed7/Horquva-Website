# Horquva website

Marketing site for Horquva LLC: eight service pages, the OBA Core product page and an enquiry form.

Design and scope: `docs/superpowers/specs/2026-09-27-horquva-website-v2-design.md`

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

## Checks

```bash
npm test             # unit tests (content rules, enquiry schema and API)
npm run e2e          # builds, then runs page, accessibility and form tests in Playwright
npm run lint
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
