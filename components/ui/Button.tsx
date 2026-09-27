import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Tone = "paper" | "ink";

const styles: Record<Tone, string> = {
  paper: "bg-ink text-paper hover:bg-bronze-deep",
  ink: "bg-paper text-ink hover:bg-bronze",
};

const base =
  "inline-flex min-h-11 items-center gap-3 px-6 text-[15px] font-medium tracking-[-0.01em] transition-colors duration-200";

type Props = { tone?: Tone; children: ReactNode; className?: string } & (
  | ({ href: string } & Omit<ComponentProps<typeof Link>, "href" | "className">)
  | ({ href?: undefined } & Omit<ComponentProps<"button">, "className">)
);

export function Button({ tone = "paper", className = "", children, ...rest }: Props) {
  const cls = `${base} ${styles[tone]} ${className}`;
  if (rest.href !== undefined) {
    return (
      <Link {...rest} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button {...rest} className={cls}>
      {children}
    </button>
  );
}
