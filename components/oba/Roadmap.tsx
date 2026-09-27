const steps = [
  { title: "Build the picture", body: "Connect the systems the organisation already uses." },
  { title: "Find weak points", body: "One person owning too much, no backup, systems that are hard to replace." },
  { title: "See change effects", body: "When something changes, show what else is affected." },
  { title: "Test before acting", body: "Ask “what if?” and compare options safely." },
  { title: "Learn from results", body: "Record decisions and what actually happened." },
];

/** The five-stage roadmap drawn as a single line: horizontal on wide screens, vertical on narrow ones. */
export function Roadmap({ tone = "paper" }: { tone?: "paper" | "ink" }) {
  const ink = tone === "ink";
  return (
    <ol
      className={`relative grid gap-10 border-l pl-8 lg:grid-cols-5 lg:gap-8 lg:border-l-0 lg:border-t lg:pl-0 lg:pt-10 ${
        ink ? "border-rule-dark" : "border-rule"
      }`}
    >
      {steps.map((s) => (
        <li key={s.title} className="relative">
          <span
            aria-hidden
            className={`absolute -left-[37.5px] top-1.5 block h-2.5 w-2.5 rounded-full bg-bronze ring-4 lg:-top-[45.5px] lg:left-0 ${
              ink ? "ring-ink" : "ring-paper"
            }`}
          />
          <h3 className={`font-display text-[22px] leading-tight ${ink ? "text-paper" : ""}`}>{s.title}</h3>
          <p className={`mt-3 leading-[1.6] ${ink ? "text-stone" : "text-ink-soft"}`}>{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
