// Synced from the Grapple Flows app (src/utils/weightClasses.ts) by
// scripts/sync-from-app.mjs. Edit upstream and re-sync; see README.

// IBJJF and ADCC weight classes and IBJJF age divisions, as pure data.
//
// Sources (checked September 2026):
// - IBJJF weight charts linked from 2026 event pages ("Weight Chart":
//   tabela-gi-kg/lbs-opens, tabela-nogi-kg/lbs-majors, tabela-nogi-kg/lbs-opens).
// - IBJJF Rule Book v6.1 (2024), Art. 1.1 age divisions.
// - ADCC "Weight classes, divisions and categories" (rev. 04 Apr 2026) and
//   2026 World Championship classes.
//
// IMPORTANT: IBJJF's pound limits are NOT conversions of its kilogram
// limits (64 kg prints as 141.6 lb, not 141.1). US events weigh in pounds.
// Keep both columns exactly as IBJJF prints them and look up the one that
// matches the unit the athlete weighs in. test/weightClasses.test.ts
// checks the page tables against these.

export type Sex = "male" | "female";
export type WeightUnit = "lb" | "kg";

/** One class: upper limits in kg and lb, or null for "no maximum". */
export type WeightClass = { name: string; kg: number | null; lb: number | null };
export type WeightTable = { id: string; label: string; classes: WeightClass[] };

const t = (name: string, kg: number | null, lb: number | null): WeightClass => ({ name, kg, lb });

// ---- IBJJF gi (weighed in the gi) ------------------------------------------
export const IBJJF_GI_ADULT_MALE: WeightTable = {
  id: "ibjjf-gi-adult-male",
  label: "IBJJF gi, adult and master, male",
  classes: [
    t("Rooster", 57.5, 127.0),
    t("Light Feather", 64.0, 141.6),
    t("Feather", 70.0, 154.6),
    t("Light", 76.0, 168.0),
    t("Middle", 82.3, 181.6),
    t("Medium Heavy", 88.3, 195.0),
    t("Heavy", 94.3, 208.0),
    t("Super Heavy", 100.5, 222.0),
    t("Ultra Heavy", null, null),
  ],
};

export const IBJJF_GI_ADULT_FEMALE: WeightTable = {
  id: "ibjjf-gi-adult-female",
  label: "IBJJF gi, adult and master, female",
  classes: [
    t("Rooster", 48.5, 107.0),
    t("Light Feather", 53.5, 118.0),
    t("Feather", 58.5, 129.0),
    t("Light", 64.0, 141.6),
    t("Middle", 69.0, 152.6),
    t("Medium Heavy", 74.0, 163.6),
    t("Heavy", 79.3, 175.0),
    t("Super Heavy", null, null),
  ],
};

export const IBJJF_GI_JUVENILE_MALE: WeightTable = {
  id: "ibjjf-gi-juvenile-male",
  label: "IBJJF gi, juvenile, male",
  classes: [
    t("Rooster", 53.5, 118.0),
    t("Light Feather", 58.5, 129.0),
    t("Feather", 64.0, 141.6),
    t("Light", 69.0, 152.6),
    t("Middle", 74.0, 163.6),
    t("Medium Heavy", 79.3, 175.0),
    t("Heavy", 84.3, 186.0),
    t("Super Heavy", 89.3, 197.0),
    t("Ultra Heavy", null, null),
  ],
};

export const IBJJF_GI_JUVENILE_FEMALE: WeightTable = {
  id: "ibjjf-gi-juvenile-female",
  label: "IBJJF gi, juvenile, female",
  classes: [
    t("Rooster", 44.3, 98.0),
    t("Light Feather", 48.3, 106.6),
    t("Feather", 52.5, 116.0),
    t("Light", 56.5, 125.0),
    t("Middle", 60.5, 133.6),
    t("Medium Heavy", 65.0, 143.6),
    t("Heavy", 69.0, 152.0),
    t("Super Heavy", null, null),
  ],
};

// ---- IBJJF no-gi (weighed in the no-gi uniform) ----------------------------
export const IBJJF_NOGI_ADULT_MALE: WeightTable = {
  id: "ibjjf-nogi-adult-male",
  label: "IBJJF no-gi, adult and master, male",
  classes: [
    t("Rooster", 55.5, 122.6),
    t("Light Feather", 61.5, 136.0),
    t("Feather", 67.5, 149.0),
    t("Light", 73.5, 162.6),
    t("Middle", 79.5, 175.6),
    t("Medium Heavy", 85.5, 188.6),
    t("Heavy", 91.5, 202.0),
    t("Super Heavy", 97.5, 215.0),
    t("Ultra Heavy", null, null),
  ],
};

export const IBJJF_NOGI_ADULT_FEMALE: WeightTable = {
  id: "ibjjf-nogi-adult-female",
  label: "IBJJF no-gi, adult and master, female",
  classes: [
    t("Rooster", 46.5, 103.0),
    t("Light Feather", 51.5, 114.0),
    t("Feather", 56.5, 125.0),
    t("Light", 61.5, 136.0),
    t("Middle", 66.5, 147.0),
    t("Medium Heavy", 71.5, 158.0),
    t("Heavy", 76.5, 169.0),
    t("Super Heavy", null, null),
  ],
};

/** Juvenile male at Opens; also Juvenile 2 (age 17) at the no-gi majors. */
export const IBJJF_NOGI_JUVENILE_MALE: WeightTable = {
  id: "ibjjf-nogi-juvenile-male",
  label: "IBJJF no-gi, juvenile, male",
  classes: [
    t("Rooster", 51.5, 114.0),
    t("Light Feather", 56.5, 125.0),
    t("Feather", 61.5, 136.0),
    t("Light", 66.5, 147.0),
    t("Middle", 71.5, 158.0),
    t("Medium Heavy", 76.5, 169.0),
    t("Heavy", 81.5, 180.0),
    t("Super Heavy", 86.5, 191.0),
    t("Ultra Heavy", null, null),
  ],
};

/** Juvenile 1 (age 16) male at the no-gi majors (Worlds, Pans, Europeans). */
export const IBJJF_NOGI_JUVENILE1_MALE_MAJORS: WeightTable = {
  id: "ibjjf-nogi-juvenile1-male-majors",
  label: "IBJJF no-gi majors, Juvenile 1, male",
  classes: [
    t("Rooster", 46.5, 103.0),
    t("Light Feather", 51.5, 114.0),
    t("Feather", 56.5, 125.0),
    t("Light", 61.5, 136.0),
    t("Middle", 66.5, 147.0),
    t("Medium Heavy", 71.5, 158.0),
    t("Heavy", 76.5, 169.0),
    t("Super Heavy", 81.5, 180.0),
    t("Ultra Heavy", null, null),
  ],
};

export const IBJJF_NOGI_JUVENILE_FEMALE: WeightTable = {
  id: "ibjjf-nogi-juvenile-female",
  label: "IBJJF no-gi, juvenile, female",
  classes: [
    t("Rooster", 42.5, 94.0),
    t("Light Feather", 46.5, 103.0),
    t("Feather", 50.5, 111.6),
    t("Light", 54.5, 120.6),
    t("Middle", 58.5, 129.0),
    t("Medium Heavy", 62.5, 138.0),
    t("Heavy", 66.5, 147.0),
    t("Super Heavy", null, null),
  ],
};

// ---- ADCC (no gi) -------------------------------------------------------------
const LB_PER_KG = 2.2046226218;

/** ADCC World Championship and Trials. Kilogram limits only. */
export const ADCC_PRO_MALE: WeightTable = {
  id: "adcc-pro-male",
  label: "ADCC World Championship, men",
  classes: [t("-66 kg", 65.9, null), t("-77 kg", 76.9, null), t("-88 kg", 87.9, null), t("-99 kg", 98.9, null), t("+99 kg", null, null)],
};

export const ADCC_PRO_FEMALE: WeightTable = {
  id: "adcc-pro-female",
  label: "ADCC World Championship, women",
  classes: [t("-55 kg", 55, null), t("-65 kg", 65, null), t("+65 kg", null, null)],
};

/** ADCC Opens and other events, adult and masters (rev. 04 Apr 2026). */
export const ADCC_OPEN_MALE: WeightTable = {
  id: "adcc-open-male",
  label: "ADCC Opens, adult and masters, men",
  classes: [
    t("-55 kg", 55, 121),
    t("-60 kg", 60, 132),
    t("-65 kg", 65, 143),
    t("-70 kg", 70, 154),
    t("-76 kg", 76, 168),
    t("-83 kg", 83, 183),
    t("-91 kg", 91, 201),
    t("-100 kg", 100, 220),
    t("+100 kg", null, null),
  ],
};

export const ADCC_OPEN_FEMALE: WeightTable = {
  id: "adcc-open-female",
  label: "ADCC Opens, adult and masters, women",
  classes: [
    t("-50 kg", 50, 110),
    t("-55 kg", 55, 121),
    t("-60 kg", 60, 132),
    t("-65 kg", 65, 143),
    t("-70 kg", 70, 154),
    t("-75 kg", 75, 165),
    t("-80 kg", 80, 176),
    t("+80 kg", null, null),
  ],
};

// ---- IBJJF age divisions (Rule Book v6.1, Art. 1.1) --------------------------

export type AgeDivision = { name: string; minAge: number; maxAge: number | null; group: "kids" | "juvenile" | "adult" | "master" };

/** Age = event year - birth year. Adult and master have no maximum age. */
export const IBJJF_AGE_DIVISIONS: AgeDivision[] = [
  { name: "Mighty Mite 1", minAge: 4, maxAge: 4, group: "kids" },
  { name: "Mighty Mite 2", minAge: 5, maxAge: 5, group: "kids" },
  { name: "Mighty Mite 3", minAge: 6, maxAge: 6, group: "kids" },
  { name: "Pee Wee 1", minAge: 7, maxAge: 7, group: "kids" },
  { name: "Pee Wee 2", minAge: 8, maxAge: 8, group: "kids" },
  { name: "Pee Wee 3", minAge: 9, maxAge: 9, group: "kids" },
  { name: "Junior 1", minAge: 10, maxAge: 10, group: "kids" },
  { name: "Junior 2", minAge: 11, maxAge: 11, group: "kids" },
  { name: "Junior 3", minAge: 12, maxAge: 12, group: "kids" },
  { name: "Teen 1", minAge: 13, maxAge: 13, group: "kids" },
  { name: "Teen 2", minAge: 14, maxAge: 14, group: "kids" },
  { name: "Teen 3", minAge: 15, maxAge: 15, group: "kids" },
  { name: "Juvenile 1", minAge: 16, maxAge: 16, group: "juvenile" },
  { name: "Juvenile 2", minAge: 17, maxAge: 17, group: "juvenile" },
  { name: "Adult", minAge: 18, maxAge: null, group: "adult" },
  { name: "Master 1", minAge: 30, maxAge: null, group: "master" },
  { name: "Master 2", minAge: 36, maxAge: null, group: "master" },
  { name: "Master 3", minAge: 41, maxAge: null, group: "master" },
  { name: "Master 4", minAge: 46, maxAge: null, group: "master" },
  { name: "Master 5", minAge: 51, maxAge: null, group: "master" },
  { name: "Master 6", minAge: 56, maxAge: null, group: "master" },
  { name: "Master 7", minAge: 61, maxAge: null, group: "master" },
];

export type AgeResult = {
  age: number;
  /** The oldest division the athlete fits: their "own" division. */
  division: AgeDivision | null;
  /** Other divisions they may also enter (younger masters and adult). */
  alsoEligible: AgeDivision[];
};

/** IBJJF age division for an event year. Masters may also enter younger
 *  master divisions and adult ("no maximum age ... but there is a minimum"). */
export function ibjjfAgeDivision(birthYear: number, eventYear: number): AgeResult {
  const age = eventYear - birthYear;
  const fits = IBJJF_AGE_DIVISIONS.filter((d) => age >= d.minAge && (d.maxAge === null || age <= d.maxAge));
  const division = fits[fits.length - 1] ?? null;
  const alsoEligible = division && (division.group === "adult" || division.group === "master") ? fits.slice(0, -1).reverse() : [];
  return { age, division, alsoEligible };
}

// ---- Lookup ---------------------------------------------------------------------

export type Organization = "ibjjf" | "adcc-pro" | "adcc-open";
export type Uniform = "gi" | "nogi";

export type TableChoice = {
  table: WeightTable;
  /** Extra table to show alongside (IBJJF no-gi majors Juvenile 1). */
  alternate?: { table: WeightTable; when: string };
  /** Why kids get no table here. */
  kidsNotice?: boolean;
};

export function tableFor(input: { org: Organization; sex: Sex; uniform: Uniform; age: number | null }): TableChoice {
  const { org, sex, uniform, age } = input;
  if (org === "adcc-pro") return { table: sex === "male" ? ADCC_PRO_MALE : ADCC_PRO_FEMALE };
  if (org === "adcc-open") return { table: sex === "male" ? ADCC_OPEN_MALE : ADCC_OPEN_FEMALE };

  const juvenile = age === 16 || age === 17;
  const kids = age !== null && age < 16;
  if (uniform === "gi") {
    const table = juvenile
      ? sex === "male"
        ? IBJJF_GI_JUVENILE_MALE
        : IBJJF_GI_JUVENILE_FEMALE
      : sex === "male"
        ? IBJJF_GI_ADULT_MALE
        : IBJJF_GI_ADULT_FEMALE;
    return { table, kidsNotice: kids };
  }
  if (juvenile && sex === "male") {
    return {
      table: IBJJF_NOGI_JUVENILE_MALE,
      alternate:
        age === 16
          ? { table: IBJJF_NOGI_JUVENILE1_MALE_MAJORS, when: "At No-Gi Worlds, Pans, and Europeans, 16-year-olds (Juvenile 1) use a lighter table" }
          : undefined,
    };
  }
  const table = juvenile
    ? IBJJF_NOGI_JUVENILE_FEMALE
    : sex === "male"
      ? IBJJF_NOGI_ADULT_MALE
      : IBJJF_NOGI_ADULT_FEMALE;
  return { table, kidsNotice: kids };
}

export type ClassResult = {
  index: number;
  weightClass: WeightClass;
  /** Limit in the unit used for the lookup, or null for no maximum. */
  limit: number | null;
  /** How far under the limit (same unit). */
  margin: number | null;
  /** The next class up, if any. */
  next: WeightClass | null;
  /** True when the table has no column in the athlete's unit and the weight
   *  was converted (ADCC World Championship is kilograms only). */
  converted: boolean;
};

/** Upper limits are inclusive: a weight exactly on the limit makes the class. */
export function findWeightClass(table: WeightTable, weight: number, unit: WeightUnit): ClassResult | null {
  if (!Number.isFinite(weight) || weight <= 0) return null;
  const hasUnit = table.classes.some((c) => c[unit] !== null);
  const lookupUnit: WeightUnit = hasUnit ? unit : unit === "lb" ? "kg" : "lb";
  const value = hasUnit ? weight : unit === "lb" ? weight / LB_PER_KG : weight * LB_PER_KG;
  const index = table.classes.findIndex((c) => c[lookupUnit] === null || value <= (c[lookupUnit] as number) + 1e-9);
  if (index === -1) return null;
  const weightClass = table.classes[index];
  const limit = weightClass[lookupUnit];
  return {
    index,
    weightClass,
    limit,
    margin: limit === null ? null : Math.round((limit - value) * 10) / 10,
    next: table.classes[index + 1] ?? null,
    converted: !hasUnit,
  };
}

export const kgToLb = (kg: number) => kg * LB_PER_KG;
export const lbToKg = (lb: number) => lb / LB_PER_KG;
