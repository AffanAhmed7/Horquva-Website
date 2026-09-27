import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { Section } from "@/components/ui/Section";
import { site } from "@/content/site";
import credits from "@/content/image-credits.json";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Horquva collects through this website and how it is used.",
};

// TODO(content): draft policy. Confirm hosting, analytics and retention with the founders before launch.
const sections = [
  {
    title: "What we collect",
    body: "When you send an enquiry we receive the details you type into the form: your name, email address, company, the service you're interested in, your budget range and your message. We don't use tracking cookies or analytics on this site.",
  },
  {
    title: "Why we collect it",
    body: "Only to reply to your enquiry and, if we work together, to run the project. We don't sell your details or add you to a mailing list.",
  },
  {
    title: "Who processes it",
    body: "Enquiries are delivered to our inbox by Resend, an email delivery service. The site is hosted by Vercel. Both process data on our behalf and only as needed to provide their service.",
  },
  {
    title: "How long we keep it",
    body: "We keep enquiry emails for up to two years unless you ask us to delete them sooner, or longer if we go on to work together and the records are needed for the project or for tax purposes.",
  },
  {
    title: "Your rights",
    body: `You can ask us what we hold about you, ask us to correct it or ask us to delete it. Email ${site.email} and we'll respond within 30 days.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageIntro title="Privacy" lead={<p>What this website collects, and what we do with it.</p>} />
      <Section innerClassName="pb-28 md:pb-40">
        <div className="max-w-3xl space-y-12">
          {sections.map((s) => (
            <section key={s.title} className="border-t border-rule pt-6">
              <h2 className="text-[26px]">{s.title}</h2>
              <p className="mt-4 text-[18px] text-ink-soft">{s.body}</p>
            </section>
          ))}
          <section className="border-t border-rule pt-6">
            <h2 className="text-[26px]">Image credits</h2>
            <p className="mt-4 text-[18px] text-ink-soft">
              Photographs other than team portraits are from Unsplash, used under the Unsplash License.
            </p>
            <ul className="mt-6 space-y-2 text-[15px] text-ink-soft">
              {credits.map((c) => (
                <li key={c.slot}>
                  <a href={c.source} className="underline decoration-rule underline-offset-4 hover:decoration-bronze">
                    {c.photographer}
                  </a>
                </li>
              ))}
            </ul>
          </section>
          <p className="text-[15px] text-ink-soft">
            {site.legalName}, {site.city}. Last updated September 2026.
          </p>
        </div>
      </Section>
    </>
  );
}
