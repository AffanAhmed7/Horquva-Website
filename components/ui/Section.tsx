import type { ReactNode } from "react";

type Props = {
  tone?: "paper" | "ink";
  id?: string;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
  "aria-labelledby"?: string;
};

export function Section({ tone = "paper", id, className = "", innerClassName = "", children, ...aria }: Props) {
  const toneCls = tone === "ink" ? "bg-ink text-paper" : "bg-paper text-ink";
  return (
    <section id={id} className={`${toneCls} ${className}`} data-tone={tone} {...aria}>
      <div className={`gutter mx-auto w-full max-w-[1440px] ${innerClassName}`}>{children}</div>
    </section>
  );
}
