import { describe, it, expect } from "vitest";
import { contrastRatio } from "@/lib/contrast";

const pairs: [string, string, string, number][] = [
  ["ink on paper", "#15120F", "#F3EFE7", 4.5],
  ["ink-soft on paper", "#4A433C", "#F3EFE7", 4.5],
  ["bronze-deep on paper", "#5E3F2C", "#F3EFE7", 4.5],
  ["paper on ink", "#F3EFE7", "#15120F", 4.5],
  ["stone on ink", "#857C72", "#15120F", 4.5],
  ["bronze on ink", "#A9825A", "#15120F", 4.5],
];

describe("token contrast", () => {
  it.each(pairs)("%s passes AA", (_label, fg, bg, min) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(min);
  });

  it("computes black on white as 21", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 1);
  });
});
