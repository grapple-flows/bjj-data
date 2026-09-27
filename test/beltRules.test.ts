import { describe, expect, it } from "vitest";
import { formatYearMonth, minMonthsAtBelt, nextEligibility } from "../src/beltRules.js";

const today = { year: 2026, month: 9 };

describe("IBJJF adult belt minimums (June 2026, v3.3)", () => {
  it("blue to purple takes 2 years for an adult", () => {
    const result = nextEligibility({ birthYear: 1995, belt: "blue", registered: { year: 2025, month: 3 } }, today);
    expect(result.nextLabel).toBe("Purple belt");
    expect(result.earliest).toEqual({ year: 2027, month: 3 });
    expect(result.eligibleNow).toBe(false);
  });

  it("purple to brown takes 1.5 years and age 18", () => {
    const result = nextEligibility({ birthYear: 1995, belt: "purple", registered: { year: 2025, month: 11 } }, today);
    expect(formatYearMonth(result.earliest)).toBe("May 2027");
  });

  it("brown to black takes 1 year and age 19", () => {
    const result = nextEligibility({ birthYear: 2008, belt: "brown", registered: { year: 2026, month: 1 } }, today);
    // Time is met January 2027, but age 19 (by birth year) is 2027 too.
    expect(result.earliest).toEqual({ year: 2027, month: 1 });
    const young = nextEligibility({ birthYear: 2009, belt: "brown", registered: { year: 2027, month: 1 } }, today);
    expect(young.earliest).toEqual({ year: 2028, month: 1 });
  });

  it("allows black at 18 only for an Adult World Champion at brown", () => {
    const champ = nextEligibility(
      { birthYear: 2008, belt: "brown", registered: { year: 2026, month: 2 }, worldChampion: true },
      today,
    );
    expect(champ.earliest).toEqual({ year: 2026, month: 2 });
    expect(champ.eligibleNow).toBe(true);
  });

  it("counts age by birth year, not birthday", () => {
    // Born any time in 2010: counts as 16 from January 2026.
    const result = nextEligibility({ birthYear: 2010, belt: "white", registered: { year: 2020, month: 5 } }, today);
    expect(result.earliest).toEqual({ year: 2026, month: 1 });
    expect(result.eligibleNow).toBe(true);
  });
});

describe("exceptions to minimum time (Art. 3.1.3)", () => {
  const base = { birthYear: 2000, registered: { year: 2025, month: 1 } };

  it("blue: 1 year after grey, yellow, or orange; none after green", () => {
    expect(minMonthsAtBelt({ ...base, belt: "blue", kidsBackground: "grey-yellow" }).months).toBe(12);
    expect(minMonthsAtBelt({ ...base, belt: "blue", kidsBackground: "orange" }).months).toBe(12);
    expect(minMonthsAtBelt({ ...base, belt: "blue", kidsBackground: "green" }).months).toBe(0);
  });

  it("blue registered as a juvenile has no minimum", () => {
    expect(minMonthsAtBelt({ birthYear: 2009, belt: "blue", registered: { year: 2026, month: 3 } }).months).toBe(0);
  });

  it("purple: 1 year after a juvenile blue, none after orange/green + juvenile blue", () => {
    expect(minMonthsAtBelt({ ...base, belt: "purple", juvenileBlue: true }).months).toBe(12);
    expect(minMonthsAtBelt({ ...base, belt: "purple", juvenileBlue: true, kidsBackground: "orange" }).months).toBe(0);
    expect(minMonthsAtBelt({ ...base, belt: "purple", juvenileBlue: true, kidsBackground: "grey-yellow" }).months).toBe(12);
    expect(minMonthsAtBelt({ ...base, belt: "purple" }).months).toBe(18);
  });

  it("world champions at a belt have no minimum time", () => {
    for (const belt of ["blue", "purple", "brown"] as const) {
      expect(minMonthsAtBelt({ ...base, belt, worldChampion: true }).months).toBe(0);
    }
  });
});

describe("black belt degrees (Art. 4.1.5)", () => {
  it("3 years to the 1st degree, 7 to red and black with age 49", () => {
    const first = nextEligibility({ birthYear: 1990, belt: "black", blackDegree: 0, registered: { year: 2024, month: 6 } }, today);
    expect(first.nextLabel).toBe("1st degree");
    expect(first.earliest).toEqual({ year: 2027, month: 6 });

    const coral = nextEligibility({ birthYear: 1980, belt: "black", blackDegree: 6, registered: { year: 2020, month: 1 } }, today);
    expect(coral.nextLabel).toBe("7th degree, red and black belt");
    // 7 years lands 2027, but age 49 is not reached until 2029.
    expect(coral.earliest).toEqual({ year: 2029, month: 1 });
  });
});
