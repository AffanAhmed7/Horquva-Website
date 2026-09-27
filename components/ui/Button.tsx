import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Tone = "paper" | "ink";
type Variant = "solid" | "glass";

// Keyed by the background the button sits on.
const styles: Record<Variant, Record<Tone, string>> = {
  solid: {
    paper: "bg-ink text-paper hover:bg-bronze-deep",
    ink: "bg-paper text-ink hover:bg-bronze",
  },
  // See-through with a faint tint and hairline edge, for use over photos and blurred bars.
  glass: {
    paper: "bg-ink/[0.03] text-ink ring-1 ring-inset ring-ink/20 hover:bg-ink/[0.08]",
    ink: "bg-paper/[0.04] text-paper ring-1 ring-inset ring-paper/25 backdrop-blur-sm hover:bg-paper/[0.12]",
  },
};

const base =
  "inline-flex min-h-11 items-center gap-3 px-6 text-[15px] font-medium tracking-[-0.01em] transition-[background-color,color,box-shadow] duration-200";

type Props = { tone?: Tone; variant?: Variant; children: ReactNode; className?: string } & (
  | ({ href: string } & Omit<ComponentProps<typeof Link>, "href" | "className">)
  | ({ href?: undefined } & Omit<ComponentProps<"button">, "className">)
);

export function Button({ tone = "paper", variant = "solid", className = "", children, ...rest }: Props) {
  const cls = `${base} ${styles[variant][tone]} ${className}`;
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
