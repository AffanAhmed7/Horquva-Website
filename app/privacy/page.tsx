import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { Section } from "@/components/ui/Section";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Horquva collects through this website, including the Woba assistant, where it goes and when it's deleted.",
};

/** The whole policy in four lines, for anyone who reads nothing else. */
const promises = [
  { title: "No tracking", body: "No advertising cookies and no analytics, anywhere on the site." },
  { title: "Nothing sold", body: "We don't sell your details or pass them to marketers." },
  { title: "No mailing lists", body: "Sending an enquiry never signs you up for anything." },
  { title: "Chats don't linger", body: "Conversations with Woba are deleted after 24 hours." },
];

const heading = "mt-14 font-display text-[26px] font-normal leading-tight text-ink first:mt-0 md:text-[28px]";
const list = "mt-4 list-disc space-y-3 pl-5 marker:text-bronze";

export default function PrivacyPage() {
  return (
    <>
      {/* Opening: the title, then the four promises. */}
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
              This site collects very little, and we&apos;d rather show you exactly what than bury it in small print.
            </p>
          </Reveal>
        </div>
        <Reveal as="ul" stagger={0.1} className="mt-16 grid gap-4 sm:grid-cols-2 md:mt-24 lg:grid-cols-4">
          {promises.map((p) => (
            <li key={p.title} className="rounded-[1.25rem] bg-paper/[0.04] p-7 ring-1 ring-paper/10 md:p-8">
              <span aria-hidden className="block h-[11px] w-[11px] rounded-full bg-bronze" />
              <h2 className="mt-6 font-display text-[22px] leading-tight text-paper md:text-[24px]">{p.title}</h2>
              <p className="mt-3 text-[16px] leading-[1.6] text-stone">{p.body}</p>
            </li>
          ))}
        </Reveal>
      </Section>

      {/* The policy itself: one readable column. */}
      <Section innerClassName="py-24 md:py-32">
        <article className="mx-auto max-w-[40rem] text-[18px] leading-[1.7] text-ink-soft">
          <h2 className={heading}>What we collect</h2>
          <p className="mt-4">Only what you choose to send us, plus the bare minimum any website sees:</p>
          <ul className={list}>
            <li>
              <span className="text-ink">Your enquiry.</span> The name, email, company, service, budget and message you
              send through the contact form.
            </li>
            <li>
              <span className="text-ink">Your chat messages.</span> What you type to Woba, our assistant, and its
              replies.
            </li>
            <li>
              <span className="text-ink">One cookie, if you use the chat.</span> A random ID that links your messages
              into one conversation. It expires after 30 days.
            </li>
            <li>
              <span className="text-ink">Your IP address.</span> Our host sees it when a page loads. We also use it to
              count messages, so one visitor can&apos;t flood the site.
            </li>
          </ul>
          <p className="mt-4">
            Our fonts and images load from this website itself, so browsing it doesn&apos;t contact any other
            companies.
          </p>

          <h2 className={heading}>How Woba uses your messages</h2>
          <p className="mt-4">
            To write each answer, your message is sent to a trusted AI provider, which processes it only to write the
            answer and send it straight back. We keep the conversation for 24
            hours so Woba can follow it, and starting a new chat deletes it straight away.
          </p>
          <p className="mt-4">
            Please don&apos;t share passwords, payment details or anything sensitive in the chat. Woba can get things
            wrong, so check anything important, like pricing or timelines, with our team.
          </p>

          <h2 className={heading}>How long we keep it</h2>
          <ul className={list}>
            <li>Chat history: 24 hours.</li>
            <li>Message counts: 10 minutes.</li>
            <li>
              Enquiry emails: up to two years, sooner if you ask. If we work together, as long as the project and tax
              records need.
            </li>
          </ul>

          <h2 className={heading}>Your rights</h2>
          <p className="mt-4">
            You can ask what we hold about you, and ask us to correct or delete it. Email{" "}
            <a href={`mailto:${site.email}`} className="text-ink underline decoration-bronze underline-offset-4">
              {site.email}
            </a>{" "}
            and we&apos;ll reply within 30 days.
          </p>

          <p className="mt-16 border-t border-rule pt-6 text-[15px] text-stone">
            {site.legalName}, {site.city}. Last updated October 2026.
          </p>
        </article>
      </Section>
    </>
  );
}
