import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { PersonPhoto } from "@/components/ui/PersonPhoto";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { team } from "@/content/team";

export const metadata: Metadata = {
  title: "Team",
  description: "The people behind Horquva: engineering, product, operations, security and business development.",
};

export default function TeamPage() {
  return (
    <>
      <PageIntro
        title="The people doing the work"
        lead={
          <p>
            A small team across engineering, product, operations, security and business development. The people you
            meet at the start are the people who build your project.
          </p>
        }
      />
      <Section innerClassName="pb-28 md:pb-40">
        <ul className="grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((p) => (
            <li key={p.name}>
              <PersonPhoto person={p} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
              <h2 className="mt-5 text-[22px] leading-tight">{p.name}</h2>
              <p className="text-[15px] text-bronze-deep">{p.role}</p>
              <p className="mt-4 text-ink-soft">{p.bio}</p>
              {p.linkedin && (
                <p className="mt-4 text-[15px]">
                  <TextLink href={p.linkedin} external>
                    LinkedIn
                  </TextLink>
                </p>
              )}
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
