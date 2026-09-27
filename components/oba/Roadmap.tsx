const steps = [
  { title: "Build the picture", body: "Connect the systems the organisation already uses." },
  { title: "Find weak points", body: "One person owning too much, no backup, systems that are hard to replace." },
  { title: "See change effects", body: "When something changes, show what else is affected." },
  { title: "Test before acting", body: "Ask “what if?” and compare options safely." },
  { title: "Learn from results", body: "Record decisions and what actually happened." },
];

/** The five-stage roadmap drawn as a single line: horizontal on wide screens, vertical on narrow ones. */
export function Roadmap() {
  return (
    <ol className="relative grid gap-10 border-l border-rule-dark pl-8 lg:grid-cols-5 lg:gap-8 lg:border-l-0 lg:border-t lg:pl-0 lg:pt-10">
      {steps.map((s, i) => (
        <li key={s.title} className="relative">
          <span
            aria-hidden
            className="absolute -left-[37px] top-1.5 block h-2 w-2 bg-bronze lg:-top-[45px] lg:left-0"
          />
          <p className="text-[15px] text-bronze tabular-nums">0{i + 1}</p>
          <h3 className="mt-2 text-[22px] leading-tight">{s.title}</h3>
          <p className="mt-3 text-stone">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
