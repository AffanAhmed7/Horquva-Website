export type ProcessStep = { number: string; title: string; body: string };

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Discover",
    body: "We sit with the people who do the work, map how it runs today and agree on what success looks like. You get a written scope with a fixed price before anything is built.",
  },
  {
    number: "02",
    title: "Prototype",
    body: "A working version on your real data within the first weeks, so decisions are made on something you can use, not on slides.",
  },
  {
    number: "03",
    title: "Build",
    body: "We build it properly: tests, error handling, access control, monitoring. Weekly demos, and a shared board so you always know where things stand.",
  },
  {
    number: "04",
    title: "Support",
    body: "We launch with you, train your team and stay on to fix, tune and extend. Documentation and code are yours from day one.",
  },
];

export const workingTerms = [
  "Fixed scope and price before we start",
  "Weekly progress demos",
  "You own all the code and data",
  "One engineer accountable from start to finish",
];
