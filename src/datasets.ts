// Shapes the TypeScript exports into the JSON files under data/.
// scripts/build-json.mjs writes whatever buildDatasets() returns, and
// test/json.test.ts checks the committed files still match it. Values come
// from the TS modules; this file only adds labels, grouping, and notes.

import * as W from "./weightClasses.js";
import * as R from "./rulesets.js";
import * as B from "./beltRules.js";
import { KB_CATEGORIES, KB_TAG_ALIASES } from "./kbTaxonomy.js";
import { SOURCES, type Source } from "./sources.js";

export const ATTRIBUTION = "Data from bjj-data by Grapple Flows (https://grappleflows.com)";
const REPOSITORY = "https://github.com/GrappleFlows/bjj-data";
const DISCLAIMER =
  "Rules change. Check the official rulebook for your event before competing. Not affiliated with IBJJF, ADCC, NAGA, or Grappling Industries.";

type Meta = {
  dataset: string;
  title: string;
  description: string;
  checked: string | null;
  sources: Source[];
  license: "CC-BY-4.0";
  licenseUrl: string;
  attribution: string;
  repository: string;
  disclaimer?: string;
};

const meta = (m: Pick<Meta, "dataset" | "title" | "description" | "checked" | "sources">, disclaimer = true): Meta => ({
  ...m,
  license: "CC-BY-4.0",
  licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
  attribution: ATTRIBUTION,
  repository: REPOSITORY,
  ...(disclaimer ? { disclaimer: DISCLAIMER } : {}),
});

// ---- Weight classes -----------------------------------------------------------

export type WeightTableMeta = {
  organization: "ibjjf" | "adcc";
  uniform: W.Uniform;
  sex: W.Sex;
  ageGroup: "adult-master" | "juvenile" | "juvenile-1" | "adult";
  /** Which events the table applies to, when it is narrower than "all". */
  events: string | null;
};

/** Every exported WeightTable, in display order, with how to file it. */
export const WEIGHT_TABLES: Array<{ table: W.WeightTable; meta: WeightTableMeta }> = [
  { table: W.IBJJF_GI_ADULT_MALE, meta: { organization: "ibjjf", uniform: "gi", sex: "male", ageGroup: "adult-master", events: null } },
  { table: W.IBJJF_GI_ADULT_FEMALE, meta: { organization: "ibjjf", uniform: "gi", sex: "female", ageGroup: "adult-master", events: null } },
  { table: W.IBJJF_GI_JUVENILE_MALE, meta: { organization: "ibjjf", uniform: "gi", sex: "male", ageGroup: "juvenile", events: null } },
  { table: W.IBJJF_GI_JUVENILE_FEMALE, meta: { organization: "ibjjf", uniform: "gi", sex: "female", ageGroup: "juvenile", events: null } },
  { table: W.IBJJF_NOGI_ADULT_MALE, meta: { organization: "ibjjf", uniform: "nogi", sex: "male", ageGroup: "adult-master", events: null } },
  { table: W.IBJJF_NOGI_ADULT_FEMALE, meta: { organization: "ibjjf", uniform: "nogi", sex: "female", ageGroup: "adult-master", events: null } },
  {
    table: W.IBJJF_NOGI_JUVENILE_MALE,
    meta: {
      organization: "ibjjf",
      uniform: "nogi",
      sex: "male",
      ageGroup: "juvenile",
      events: "Opens; also Juvenile 2 (age 17) at No-Gi Worlds, Pans, and Europeans",
    },
  },
  {
    table: W.IBJJF_NOGI_JUVENILE1_MALE_MAJORS,
    meta: { organization: "ibjjf", uniform: "nogi", sex: "male", ageGroup: "juvenile-1", events: "No-Gi Worlds, Pans, and Europeans (age 16)" },
  },
  { table: W.IBJJF_NOGI_JUVENILE_FEMALE, meta: { organization: "ibjjf", uniform: "nogi", sex: "female", ageGroup: "juvenile", events: null } },
  { table: W.ADCC_PRO_MALE, meta: { organization: "adcc", uniform: "nogi", sex: "male", ageGroup: "adult", events: "World Championship and Trials" } },
  { table: W.ADCC_PRO_FEMALE, meta: { organization: "adcc", uniform: "nogi", sex: "female", ageGroup: "adult", events: "World Championship and Trials" } },
  { table: W.ADCC_OPEN_MALE, meta: { organization: "adcc", uniform: "nogi", sex: "male", ageGroup: "adult-master", events: "Opens and other ADCC events" } },
  { table: W.ADCC_OPEN_FEMALE, meta: { organization: "adcc", uniform: "nogi", sex: "female", ageGroup: "adult-master", events: "Opens and other ADCC events" } },
];

const WEIGHT_NOTES = [
  "Limits are upper limits and inclusive: a weight exactly on the limit makes the class. null means no maximum.",
  "IBJJF prints its own pound limits, which are not conversions of the kilogram limits (64 kg is printed as 141.6 lb). Use the column for the unit you weigh in.",
  "IBJJF gi tables are weighed in the gi; no-gi tables in the no-gi uniform.",
  "The ADCC World Championship publishes kilogram limits only; lb is null there.",
  "IBJJF kids divisions (under 16) use event-specific charts and are not included.",
];

const weightSources = (org: WeightTableMeta["organization"]) =>
  SOURCES.weightClasses.sources.filter((s) => s.label.toLowerCase().startsWith(org));

const unitsOf = (table: W.WeightTable) => (["kg", "lb"] as const).filter((u) => table.classes.some((c) => c[u] !== null));

const weightTableJson = ({ table, meta: m }: (typeof WEIGHT_TABLES)[number]) => ({
  id: table.id,
  label: table.label,
  ...m,
  units: unitsOf(table),
  classes: table.classes,
});

// ---- Legal techniques -----------------------------------------------------------

/** Every exported Ruleset with a unique file key (both NAGA tables use id "naga"). */
export const RULESETS: Array<{ key: string; uniform: "gi" | "nogi" | "both"; ruleset: R.Ruleset }> = [
  { key: "ibjjf", uniform: "both", ruleset: R.IBJJF_RULES },
  { key: "adcc", uniform: "nogi", ruleset: R.ADCC_RULES },
  { key: "naga-nogi", uniform: "nogi", ruleset: R.NAGA_NOGI_RULES },
  { key: "naga-gi", uniform: "gi", ruleset: R.NAGA_GI_RULES },
  { key: "grappling-industries", uniform: "both", ruleset: R.GI_RULES },
];

const LEGAL_NOTE_GENERAL =
  'Each row has one cell per column, in column order. "Y" legal, "N" illegal, "C" conditional: read the row note.';
const LEGAL_NOTES_BY_KEY: Record<string, string> = {
  ibjjf:
    "IBJJF jumping guard also depends on belt: illegal for white belts at any age and for under-15 divisions (ibjjfJumpingGuard in the npm package).",
  "grappling-industries":
    "Grappling Industries brown and black belts: heel hooks and scissor takedowns are legal in no-gi only (resolveCell in the npm package).",
};
const legalNotes = (key?: string) =>
  key ? [LEGAL_NOTE_GENERAL, ...(LEGAL_NOTES_BY_KEY[key] ? [LEGAL_NOTES_BY_KEY[key]] : [])] : [LEGAL_NOTE_GENERAL, ...Object.values(LEGAL_NOTES_BY_KEY)];

const rulesetJson = ({ key, uniform, ruleset }: (typeof RULESETS)[number]) => ({ key, uniform, ...ruleset });

// ---- Belt requirements ------------------------------------------------------------

const BASE = { birthYear: 1995, registered: { year: 2025, month: 1 } };
const JUVENILE = { birthYear: 2009, registered: { year: 2026, month: 1 } }; // counts as 17 in 2026

const TIME_SCENARIOS: Array<{ condition: string; input: B.EligibilityInput }> = [
  { condition: "standard", input: { ...BASE, belt: "blue" } },
  { condition: "kids-grey-or-yellow-before-blue", input: { ...BASE, belt: "blue", kidsBackground: "grey-yellow" } },
  { condition: "kids-orange-before-blue", input: { ...BASE, belt: "blue", kidsBackground: "orange" } },
  { condition: "kids-green-before-blue", input: { ...BASE, belt: "blue", kidsBackground: "green" } },
  { condition: "registered-as-juvenile", input: { ...JUVENILE, belt: "blue" } },
  { condition: "adult-world-champion-at-this-belt", input: { ...BASE, belt: "blue", worldChampion: true } },
  { condition: "standard", input: { ...BASE, belt: "purple" } },
  { condition: "blue-registered-as-juvenile", input: { ...BASE, belt: "purple", juvenileBlue: true } },
  { condition: "kids-orange-then-juvenile-blue", input: { ...BASE, belt: "purple", juvenileBlue: true, kidsBackground: "orange" } },
  { condition: "kids-green-then-juvenile-blue", input: { ...BASE, belt: "purple", juvenileBlue: true, kidsBackground: "green" } },
  { condition: "registered-as-juvenile", input: { ...JUVENILE, belt: "purple" } },
  { condition: "adult-world-champion-at-this-belt", input: { ...BASE, belt: "purple", worldChampion: true } },
  { condition: "standard", input: { ...BASE, belt: "brown" } },
  { condition: "adult-world-champion-at-this-belt", input: { ...BASE, belt: "brown", worldChampion: true } },
];

function blackBeltChampionAge(): number {
  const result = B.nextEligibility({ ...BASE, belt: "brown", worldChampion: true }, { year: 2026, month: 1 });
  const age = result.requirements.find((r) => r.label.startsWith("Age "));
  return Number(age?.label.slice(4));
}

// ---- Everything ---------------------------------------------------------------------

/** Relative path under data/ -> JSON value. */
export function buildDatasets(): Record<string, unknown> {
  const files: Record<string, unknown> = {};

  // Weight classes: one combined file and one file per table.
  files["weight-classes.json"] = {
    meta: meta({
      dataset: "weight-classes",
      title: "IBJJF and ADCC weight classes",
      description: "Weight class upper limits in kg and lb, per organization, uniform, sex, and age group.",
      ...SOURCES.weightClasses,
    }),
    notes: WEIGHT_NOTES,
    tables: WEIGHT_TABLES.map(weightTableJson),
  };
  for (const entry of WEIGHT_TABLES) {
    files[`weight-classes/${entry.table.id}.json`] = {
      meta: meta({
        dataset: `weight-classes/${entry.table.id}`,
        title: entry.table.label,
        description: `Weight class upper limits: ${entry.table.label}.`,
        checked: SOURCES.weightClasses.checked,
        sources: weightSources(entry.meta.organization),
      }),
      notes: WEIGHT_NOTES,
      ...weightTableJson(entry),
    };
  }

  files["ibjjf-age-divisions.json"] = {
    meta: meta({
      dataset: "ibjjf-age-divisions",
      title: "IBJJF age divisions",
      description: "IBJJF age divisions by minimum and maximum age.",
      checked: SOURCES.weightClasses.checked,
      sources: weightSources("ibjjf"),
    }),
    notes: [
      "Age is the event year minus the birth year, whatever the birthday.",
      "Adult and master divisions have no maximum age (maxAge null). Masters may also enter younger master divisions and adult.",
    ],
    divisions: W.IBJJF_AGE_DIVISIONS,
  };

  // Legal techniques.
  files["legal-techniques.json"] = {
    meta: meta({
      dataset: "legal-techniques",
      title: "Legal techniques by ruleset and division",
      description: "Which submissions and moves are legal, by organization, age group, belt or skill level, and gi or no-gi.",
      ...SOURCES.legalTechniques,
    }),
    legend: R.LEGALITY_LABEL,
    notes: legalNotes(),
    rulesets: RULESETS.map(rulesetJson),
  };
  for (const entry of RULESETS) {
    files[`legal-techniques/${entry.key}.json`] = {
      meta: meta({
        dataset: `legal-techniques/${entry.key}`,
        title: `Legal techniques: ${entry.ruleset.name}`,
        description: `Which submissions and moves are legal under ${entry.ruleset.name} rules, by division.`,
        checked: SOURCES.legalTechniques.checked,
        sources: [entry.ruleset.source],
      }),
      legend: R.LEGALITY_LABEL,
      notes: legalNotes(entry.key),
      ...rulesetJson(entry),
    };
  }

  // Belt requirements.
  files["belt-requirements.json"] = {
    meta: meta({
      dataset: "belt-requirements",
      title: "IBJJF belt requirements",
      description: "IBJJF minimum age and minimum time at each adult belt, the exceptions, and black belt degree times.",
      ...SOURCES.beltRequirements,
    }),
    notes: [
      "Age counts by birth year: current year minus birth year (Art. 2.2.1).",
      "Time at a belt counts from the day the belt was registered with IBJJF, not the day it was tied on (Art. 3.2.1).",
      "These are minimums for IBJJF recognition. The professor decides when.",
    ],
    belts: B.ADULT_BELTS.map((belt) => ({
      id: belt,
      label: B.BELT_LABELS[belt],
      minimumAge: B.MIN_AGE[belt],
      minimumMonthsAtBelt: belt === "black" ? null : B.MIN_MONTHS_AT[belt],
    })),
    minimumAgeExceptions: [
      { belt: "black", condition: "adult-world-champion-at-brown", minimumAge: blackBeltChampionAge() },
    ],
    minimumTimeRules: TIME_SCENARIOS.map(({ condition, input }) => {
      const { months, reason } = B.minMonthsAtBelt(input);
      return { belt: input.belt, condition, minimumMonths: months, reason };
    }),
    blackBeltDegrees: B.BLACK_DEGREES,
  };

  // Taxonomy.
  files["taxonomy.json"] = {
    meta: meta(
      {
        dataset: "taxonomy",
        title: "BJJ positions and submissions vocabulary",
        description: "Slugs, labels, and categories for common BJJ positions and submissions, plus synonyms that map onto them.",
        checked: null,
        sources: [{ label: "Grapple Flows", href: "https://grappleflows.com" }],
      },
      false,
    ),
    notes: [
      "Normalize free text by lower-casing, turning spaces and slashes into hyphens, dropping other punctuation, then looking up aliases (normalizeFocusTag in the npm package).",
      'Some entries are families ("chokes", "leglocks"); specific names like "heel-hook" alias onto them.',
    ],
    categories: KB_CATEGORIES,
    aliases: KB_TAG_ALIASES,
  };

  // Manifest.
  files["index.json"] = {
    name: "bjj-data",
    attribution: ATTRIBUTION,
    license: "CC-BY-4.0",
    repository: REPOSITORY,
    files: Object.entries(files).map(([path, value]) => {
      const m = (value as { meta: Meta }).meta;
      return { path, title: m.title, checked: m.checked };
    }),
  };

  return files;
}
