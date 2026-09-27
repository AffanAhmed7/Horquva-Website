import { RevealText } from "@/components/motion/RevealText";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { PersonPhoto } from "@/components/ui/PersonPhoto";
import { team } from "@/content/team";

export function TeamStrip() {
  return (
    <Section innerClassName="pt-28 pb-24 md:pt-40 md:pb-36" aria-labelledby="team-title">
      <div className="flex flex-col items-center gap-6 text-center">
        <RevealText as="h2" id="team-title" className="text-title">
          The people doing the work
        </RevealText>
        <TextLink href="/team" className="text-[17px]">
          Meet the team
        </TextLink>
      </div>
      <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-16 md:grid-cols-4 md:gap-x-6">
        {/* A preview: the full team is on the team page. */}
        {team.slice(0, 4).map((p) => (
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
