import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";

export default function NotFound() {
  return (
    <Section innerClassName="pt-20 pb-32 md:pt-32 md:pb-48">
      <h1 className="text-display">Page not found</h1>
      <p className="mt-8 max-w-md text-[19px] text-ink-soft">
        The page you were looking for has moved or never existed.
      </p>
      <p className="mt-10 flex gap-8 text-[17px]">
        <TextLink href="/">Go to the home page</TextLink>
        <TextLink href="/#services">See our services</TextLink>
      </p>
    </Section>
  );
}
