import { describe, expect, it } from "vitest";
import {
  ADCC_RULES,
  GI_RULES,
  IBJJF_RULES,
  NAGA_GI_RULES,
  NAGA_NOGI_RULES,
  adccColumn,
  giColumn,
  ibjjfColumn,
  ibjjfJumpingGuard,
  nagaColumn,
  resolveCell,
  type Ruleset,
} from "../src/rulesets.js";

const cell = (ruleset: Ruleset, id: string, column: number) => {
  const row = ruleset.rows.find((r) => r.id === id);
  if (!row) throw new Error(`${ruleset.name}: no row ${id}`);
  return row.cells[column];
};

describe("ruleset shape", () => {
  it("every row has one cell per column and notes for conditional cells", () => {
    for (const ruleset of [IBJJF_RULES, ADCC_RULES, NAGA_NOGI_RULES, NAGA_GI_RULES, GI_RULES]) {
      for (const row of ruleset.rows) {
        expect(row.cells, `${ruleset.name} ${row.id}`).toHaveLength(ruleset.columns.length);
        if (row.cells.includes("C")) expect(row.note, `${ruleset.name} ${row.id}`).toBeTruthy();
      }
    }
  });

  it("IBJJF has all 26 rows of its table plus jumping guard", () => {
    expect(IBJJF_RULES.rows).toHaveLength(27);
  });
});

describe("IBJJF (Rules Book v6.1)", () => {
  it("heel hooks and reaping are adult brown/black no-gi only, not masters", () => {
    const adultNogi = ibjjfColumn({ age: "adult", belt: "black", uniform: "nogi" });
    const masterNogi = ibjjfColumn({ age: "master", belt: "black", uniform: "nogi" });
    const adultGi = ibjjfColumn({ age: "adult", belt: "brown", uniform: "gi" });
    expect(cell(IBJJF_RULES, "heel-hook", adultNogi)).toBe("Y");
    expect(cell(IBJJF_RULES, "knee-reaping", adultNogi)).toBe("Y");
    expect(cell(IBJJF_RULES, "heel-hook", masterNogi)).toBe("N");
    expect(cell(IBJJF_RULES, "heel-hook", adultGi)).toBe("N");
    expect(cell(IBJJF_RULES, "knee-bar", masterNogi)).toBe("Y");
  });

  it("white belts and juveniles share a column: straight foot lock yes, wrist lock no", () => {
    const white = ibjjfColumn({ age: "adult", belt: "white", uniform: "gi" });
    const juvenileBlue = ibjjfColumn({ age: "16-17", belt: "blue", uniform: "gi" });
    expect(white).toBe(juvenileBlue);
    expect(cell(IBJJF_RULES, "straight-ankle-lock", white)).toBe("Y");
    expect(cell(IBJJF_RULES, "wrist-lock", white)).toBe("N");
  });

  it("blue and purple get wrist locks but not knee bars or toe holds", () => {
    const blue = ibjjfColumn({ age: "adult", belt: "blue", uniform: "nogi" });
    expect(cell(IBJJF_RULES, "wrist-lock", blue)).toBe("Y");
    expect(cell(IBJJF_RULES, "knee-bar", blue)).toBe("N");
    expect(cell(IBJJF_RULES, "toe-hold", blue)).toBe("N");
  });

  it("slams, spinal locks, and scissor takedowns are illegal everywhere", () => {
    for (const id of ["slam", "neck-crank", "scissor-takedown"]) {
      expect(IBJJF_RULES.rows.find((r) => r.id === id)?.cells.every((c) => c === "N")).toBe(true);
    }
  });

  it("jumping guard is a foul for white belts and under 15", () => {
    expect(ibjjfJumpingGuard({ age: "adult", belt: "white" })).toBe("N");
    expect(ibjjfJumpingGuard({ age: "16-17", belt: "blue" })).toBe("Y");
    expect(ibjjfJumpingGuard({ age: "4-12", belt: "white" })).toBe("N");
  });
});

describe("ADCC", () => {
  it("adult beginners may heel hook at the Opens; masters beginners may not", () => {
    expect(cell(ADCC_RULES, "heel-hook", adccColumn({ division: "adult", skill: "beginner" }))).toBe("Y");
    expect(cell(ADCC_RULES, "heel-hook", adccColumn({ division: "master", skill: "intermediate" }))).toBe("N");
    expect(cell(ADCC_RULES, "heel-hook", adccColumn({ division: "master", skill: "advanced" }))).toBe("Y");
    expect(cell(ADCC_RULES, "heel-hook", adccColumn({ division: "pro", skill: "advanced" }))).toBe("Y");
  });

  it("slams are illegal at every Opens division", () => {
    const row = ADCC_RULES.rows.find((r) => r.id === "slam")!;
    expect(row.cells.slice(0, 9).every((c) => c === "N")).toBe(true);
  });
});

describe("NAGA", () => {
  it("no-gi heel hooks need intermediate or above; gi heel hooks are always illegal", () => {
    expect(cell(NAGA_NOGI_RULES, "heel-hook", nagaColumn({ uniform: "nogi", age: "adult", belt: "white" }))).toBe("N");
    expect(cell(NAGA_NOGI_RULES, "heel-hook", nagaColumn({ uniform: "nogi", age: "adult", belt: "blue" }))).toBe("Y");
    expect(NAGA_GI_RULES.rows.find((r) => r.id === "heel-hook")?.cells.every((c) => c === "N")).toBe(true);
  });
});

describe("Grappling Industries", () => {
  it("brown and black heel hooks are no-gi only; purple no-gi counts as advanced", () => {
    const brown = giColumn({ age: "adult", belt: "brown", uniform: "gi" });
    const row = GI_RULES.rows.find((r) => r.id === "heel-hook")!;
    expect(resolveCell(GI_RULES, row, brown, "gi")).toBe("N");
    expect(resolveCell(GI_RULES, row, brown, "nogi")).toBe("Y");
    expect(giColumn({ age: "adult", belt: "purple", uniform: "nogi" })).toBe(3);
    expect(giColumn({ age: "adult", belt: "purple", uniform: "gi" })).toBe(2);
    expect(cell(GI_RULES, "knee-reaping", giColumn({ age: "adult", belt: "blue", uniform: "gi" }))).toBe("Y");
  });
});
