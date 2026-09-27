import { RevealText } from "@/components/motion/RevealText";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { PersonPhoto } from "@/components/ui/PersonPhoto";
import { team } from "@/content/team";

export function TeamStrip() {
  return (
    <Section innerClassName="pb-24 md:pb-36" aria-labelledby="team-title">
      <div className="flex flex-wrap items-end justify-between gap-6 border-t border-rule pt-12">
        <RevealText as="h2" id="team-title" className="text-title">
          The people doing the work
        </RevealText>
        <TextLink href="/team" className="text-[17px]">
          Meet the team
        </TextLink>
      </div>
      <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-16 md:grid-cols-4 md:gap-x-6">
        {team.map((p) => (
          <li key={p.name}>
            <PersonPhoto person={p} sizes="(min-width: 768px) 25vw, 50vw" />
            <p className="mt-4 text-[17px] font-medium">{p.name}</p>
            <p className="text-[15px] text-ink-soft">{p.role}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
