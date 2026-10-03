import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Horquva collects through this website, including the Woba assistant, and how it is used.",
};

/** The whole policy in four lines, for anyone who reads nothing else. */
const atAGlance = [
  "No tracking cookies or analytics",
  "One cookie, and only if you use the chat",
  "Chat history deleted after 24 hours",
  "We never sell your details",
];

/** Who handles data for us, and the one thing each does with it. */
const processors = [
  { name: "Vercel", role: "Hosts the website" },
  { name: "Resend", role: "Delivers your enquiry to our inbox" },
  { name: "Groq and OpenRouter", role: "Write Woba's answers to your messages" },
  { name: "Upstash", role: "Stores chat history and the message counts that stop abuse" },
];

const retention = [
  { what: "Chat history", howLong: "24 hours" },
  { what: "Message counts used to stop abuse", howLong: "10 minutes" },
  {
    what: "Enquiry emails",
    howLong: "Up to two years",
    note: "Sooner if you ask us to delete them. Longer only if we work together and need the records for the project or for tax.",
  },
];

type Block = { id: string; title: string; paragraphs?: string[]; list?: "processors" | "retention" };

const blocks: Block[] = [
  {
    id: "what-we-collect",
    title: "What we collect",
    paragraphs: [
      "If you send an enquiry, we receive what you type into the form: your name, email address, company, the service you're interested in, your budget range and your message.",
      "If you chat with Woba, our assistant, we receive the messages you send it.",
      "Like any website, our host briefly sees technical details such as your IP address when your browser loads a page. We use your IP address for one other thing: counting how many messages and enquiries arrive from it, so one visitor can't flood the site.",
    ],
  },
  {
    id: "woba",
    title: "Woba, our assistant",
    paragraphs: [
      "Woba answers from our own published pages. To write each answer, your message is sent to an AI provider: Groq, or OpenRouter if Groq is unavailable. They process it under their own terms and send the answer straight back.",
      "So Woba can follow the conversation, we keep your last few messages and its replies for 24 hours, then they're deleted automatically. Starting a new chat clears them straight away. Please don't share passwords, payment details or anything else sensitive in the chat.",
      "Woba can get things wrong. Confirm anything important, such as pricing or timelines, with our team.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies",
    paragraphs: [
      "We set one cookie, and only if you use the chat. It holds a random ID that links your messages into one conversation, and it expires after 30 days. There are no advertising or tracking cookies, and no analytics.",
      "Our fonts and images are served from this website itself, so browsing it doesn't send requests to Google or other third parties.",
    ],
  },
  {
    id: "why",
    title: "Why we use it",
    paragraphs: [
      "To reply to your enquiry, answer your questions in the chat, run the project if we work together, and keep the site working and protected from abuse. We don't add you to a mailing list or use your messages to train AI models.",
    ],
  },
  { id: "who", title: "Who handles it for us", list: "processors" },
  { id: "how-long", title: "How long we keep it", list: "retention" },
  {
    id: "your-rights",
    title: "Your rights",
    paragraphs: [
      `You can ask us what we hold about you, ask us to correct it or ask us to delete it. Email ${site.email} and we'll respond within 30 days.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      {/* Opening. */}
      <Section
        tone="ink"
        className="relative isolate overflow-hidden"
        innerClassName="pt-32 pb-24 md:pt-44 md:pb-32"
        aria-labelledby="privacy-title"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[60vh] w-[90vw] -translate-x-1/2 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(169,130,90,0.22),transparent_75%)]"
        />
        <div className="text-center">
          <RevealText as="h1" id="privacy-title" className="text-hero mx-auto max-w-[16ch] text-paper">
            Privacy
          </RevealText>
          <Reveal delay={0.35}>
            <p className="mx-auto mt-8 max-w-2xl text-[18px] leading-[1.6] text-stone md:text-[20px]">
              What this website collects, what Woba does with your messages, and how long any of it is kept. In plain
              words, with nothing hidden in the small print.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* The short version. */}
      <Section innerClassName="pt-24 md:pt-32" aria-labelledby="glance-title">
        <RevealText as="h2" id="glance-title" className="text-title-light mx-auto max-w-[18ch] text-center">
          At a glance
        </RevealText>
        <Reveal
          as="ul"
          stagger={0.1}
          className="mt-14 grid gap-px overflow-hidden rounded-[1.25rem] bg-rule ring-1 ring-rule sm:grid-cols-2 md:mt-20 lg:grid-cols-4"
        >
          {atAGlance.map((t) => (
            <li key={t} className="bg-[#FBF9F5] p-8 font-display text-[20px] leading-snug md:text-[22px]">
              {t}
            </li>
          ))}
        </Reveal>
      </Section>

      {/* The full policy, with a sticky index beside it. */}
      <Section innerClassName="py-24 md:py-36" aria-labelledby="details-title">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-32">
              <RevealText as="h2" id="details-title" className="text-title-light">
                The details
              </RevealText>
              <nav aria-label="Privacy policy sections" className="mt-8 hidden md:block">
                <ul className="space-y-3 text-[16px]">
                  {blocks.map((b) => (
                    <li key={b.id}>
                      <a href={`#${b.id}`} className="text-ink-soft transition-colors hover:text-bronze-deep">
                        {b.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          <div className="md:col-span-7 md:col-start-6">
            {blocks.map((b) => (
              <section
                key={b.id}
                id={b.id}
                aria-labelledby={`${b.id}-title`}
                className="scroll-mt-32 border-t border-rule pb-14 pt-8 last:pb-0 md:pb-16"
              >
                <h3 id={`${b.id}-title`} className="font-display text-[30px] font-light leading-tight md:text-[38px]">
                  {b.title}
                </h3>

                {b.paragraphs?.map((p) => (
                  <p key={p} className="mt-5 max-w-xl text-[18px] leading-[1.6] text-ink-soft">
                    {p}
                  </p>
                ))}

                {b.list === "processors" && (
                  <>
                    <dl className="mt-6 divide-y divide-rule">
                      {processors.map((p) => (
                        <div key={p.name} className="grid gap-1 py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
                          <dt className="font-display text-[19px] text-ink">{p.name}</dt>
                          <dd className="text-[17px] leading-[1.6] text-ink-soft">{p.role}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-5 max-w-xl text-[17px] leading-[1.6] text-ink-soft">
                      Each handles data only as needed to provide its service to us.
                    </p>
                  </>
                )}

                {b.list === "retention" && (
                  <dl className="mt-6 divide-y divide-rule">
                    {retention.map((r) => (
                      <div key={r.what} className="grid gap-1 py-4 sm:grid-cols-[1fr_auto] sm:gap-6">
                        <dt className="text-[17px] leading-[1.6] text-ink-soft">
                          {r.what}
                          {r.note && <span className="mt-1 block text-[15px] text-stone">{r.note}</span>}
                        </dt>
                        <dd className="font-display text-[19px] text-bronze-deep sm:text-right">{r.howLong}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </section>
            ))}
          </div>
        </div>
      </Section>

      {/* The way to ask. */}
      <Section tone="ink" innerClassName="py-24 text-center md:py-32" aria-labelledby="questions-title">
        <RevealText as="h2" id="questions-title" className="text-title-light mx-auto max-w-[18ch] text-paper">
          Questions about your data?
        </RevealText>
        <Reveal delay={0.3} className="mt-10 flex flex-col items-center gap-5">
          <Button href={`mailto:${site.email}`} tone="ink">
            Email {site.email}
          </Button>
          <p className="text-[15px] text-stone">
            {site.legalName}, {site.city}. Last updated October 2026.
          </p>
        </Reveal>
      </Section>
    </>
  );
}
