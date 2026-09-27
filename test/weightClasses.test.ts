import { describe, expect, it } from "vitest";
import {
  IBJJF_GI_ADULT_FEMALE,
  IBJJF_GI_ADULT_MALE,
  IBJJF_GI_JUVENILE_FEMALE,
  IBJJF_GI_JUVENILE_MALE,
  IBJJF_NOGI_ADULT_FEMALE,
  IBJJF_NOGI_ADULT_MALE,
  IBJJF_NOGI_JUVENILE_FEMALE,
  IBJJF_NOGI_JUVENILE_MALE,
  ADCC_PRO_MALE,
  findWeightClass,
  ibjjfAgeDivision,
  tableFor,
  type WeightTable,
} from "../src/weightClasses.js";

// The app checks its page tables against this data. Here the printed IBJJF
// values are pinned directly instead.
describe("printed IBJJF limits", () => {
  const limits = (table: WeightTable, unit: "kg" | "lb") => table.classes.map((c) => c[unit]);

  it("gi adult male, kg and lb as printed", () => {
    expect(limits(IBJJF_GI_ADULT_MALE, "kg")).toEqual([57.5, 64, 70, 76, 82.3, 88.3, 94.3, 100.5, null]);
    expect(limits(IBJJF_GI_ADULT_MALE, "lb")).toEqual([127, 141.6, 154.6, 168, 181.6, 195, 208, 222, null]);
  });

  it("no-gi adult female, lb as printed", () => {
    expect(limits(IBJJF_NOGI_ADULT_FEMALE, "lb")).toEqual([103, 114, 125, 136, 147, 158, 169, null]);
  });

  it("juvenile tables have the expected class counts", () => {
    expect(IBJJF_GI_JUVENILE_MALE.classes).toHaveLength(9);
    expect(IBJJF_GI_JUVENILE_FEMALE.classes).toHaveLength(8);
    expect(IBJJF_NOGI_JUVENILE_MALE.classes).toHaveLength(9);
    expect(IBJJF_NOGI_JUVENILE_FEMALE.classes).toHaveLength(8);
  });

  it("every table ends in an open-ended class and limits increase", () => {
    for (const table of [IBJJF_GI_ADULT_MALE, IBJJF_GI_ADULT_FEMALE, IBJJF_NOGI_ADULT_MALE, IBJJF_NOGI_ADULT_FEMALE, ADCC_PRO_MALE]) {
      const last = table.classes[table.classes.length - 1];
      expect(last.kg, table.id).toBeNull();
      const kg = table.classes.slice(0, -1).map((c) => c.kg as number);
      expect([...kg].sort((a, b) => a - b), table.id).toEqual(kg);
    }
  });
});

describe("findWeightClass", () => {
  it("uses the pound table as printed, limits inclusive", () => {
    expect(findWeightClass(IBJJF_GI_ADULT_MALE, 168, "lb")?.weightClass.name).toBe("Light");
    expect(findWeightClass(IBJJF_GI_ADULT_MALE, 168.1, "lb")?.weightClass.name).toBe("Middle");
    // 141.4 lb is under IBJJF's printed 141.6 even though 64 kg converts to 141.1.
    expect(findWeightClass(IBJJF_GI_ADULT_MALE, 141.4, "lb")?.weightClass.name).toBe("Light Feather");
    expect(findWeightClass(IBJJF_GI_ADULT_MALE, 300, "lb")?.weightClass.name).toBe("Ultra Heavy");
  });

  it("reports the margin and the next class up", () => {
    const result = findWeightClass(IBJJF_NOGI_ADULT_MALE, 160, "lb")!;
    expect(result.weightClass.name).toBe("Light");
    expect(result.margin).toBe(2.6);
    expect(result.next?.name).toBe("Middle");
  });

  it("converts pounds for the kilogram-only ADCC World Championship", () => {
    const result = findWeightClass(ADCC_PRO_MALE, 170, "lb")!;
    expect(result.converted).toBe(true);
    expect(result.weightClass.name).toBe("-88 kg");
  });

  it("rejects nonsense", () => {
    expect(findWeightClass(IBJJF_GI_ADULT_MALE, 0, "lb")).toBeNull();
    expect(findWeightClass(IBJJF_GI_ADULT_MALE, Number.NaN, "kg")).toBeNull();
  });
});

describe("ibjjfAgeDivision", () => {
  it("counts by birth year and lists younger divisions too", () => {
    const r = ibjjfAgeDivision(1990, 2026);
    expect(r.age).toBe(36);
    expect(r.division?.name).toBe("Master 2");
    expect(r.alsoEligible.map((d) => d.name)).toEqual(["Master 1", "Adult"]);
    expect(ibjjfAgeDivision(2009, 2026).division?.name).toBe("Juvenile 2");
    expect(ibjjfAgeDivision(2014, 2026).division?.name).toBe("Junior 3");
    expect(ibjjfAgeDivision(1960, 2026).division?.name).toBe("Master 7");
  });
});

describe("tableFor", () => {
  it("picks juvenile tables at 16 and 17 and offers the majors Juvenile 1 table", () => {
    expect(tableFor({ org: "ibjjf", sex: "female", uniform: "gi", age: 17 }).table).toBe(IBJJF_GI_JUVENILE_FEMALE);
    const nogi16 = tableFor({ org: "ibjjf", sex: "male", uniform: "nogi", age: 16 });
    expect(nogi16.table).toBe(IBJJF_NOGI_JUVENILE_MALE);
    expect(nogi16.alternate?.table.id).toBe("ibjjf-nogi-juvenile1-male-majors");
    expect(tableFor({ org: "ibjjf", sex: "male", uniform: "gi", age: 12 }).kidsNotice).toBe(true);
  });
});
