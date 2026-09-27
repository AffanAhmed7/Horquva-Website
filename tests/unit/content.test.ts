import { describe, it, expect } from "vitest";
import { services, getService, nextService } from "@/content/services";
import { enquiryServiceOptions, budgetOptions } from "@/content/site";
import { team } from "@/content/team";
import { processSteps } from "@/content/process";

const banned =
  /unlock|empower|seamless|cutting-edge|leverage|revolutioni[sz]e|transform your business|next-generation|supercharge/i;

describe("services content", () => {
  it("has 7 services numbered 01–07 in order", () => {
    expect(services.map((s) => s.number)).toEqual(["01", "02", "03", "04", "05", "06", "07"]);
  });

  it("has unique slugs and complete fields", () => {
    expect(new Set(services.map((s) => s.slug)).size).toBe(7);
    for (const s of services) {
      expect(s.items.length, s.slug).toBeGreaterThanOrEqual(6);
      expect(s.scenarios.length, s.slug).toBeGreaterThanOrEqual(2);
      expect(s.process, s.slug).toHaveLength(4);
      expect(s.stack.length, s.slug).toBeGreaterThan(0);
      expect(s.photo.alt.length, s.slug).toBeGreaterThan(0);
    }
  });

  it("contains no banned words anywhere in site copy", () => {
    expect(JSON.stringify({ services, team, processSteps })).not.toMatch(banned);
  });

  it("finds services by slug and wraps to the first after the last", () => {
    expect(getService("web-software-development")?.number).toBe("03");
    expect(getService("nope")).toBeUndefined();
    expect(nextService("consulting-optimisation").slug).toBe("ai-automation");
    expect(nextService("ai-automation").slug).toBe("ai-ml-computer-vision");
  });
});

describe("enquiry options", () => {
  it("include every service plus OBA Core and Not sure yet", () => {
    for (const s of services) expect(enquiryServiceOptions).toContain(s.name);
    expect(enquiryServiceOptions).toContain("OBA Core");
    expect(enquiryServiceOptions).toContain("Not sure yet");
  });

  it("offer five budget ranges", () => {
    expect(budgetOptions).toHaveLength(5);
  });
});

describe("process", () => {
  it("has the four steps in order", () => {
    expect(processSteps.map((p) => p.title)).toEqual(["Discover", "Prototype", "Build", "Support"]);
  });
});
