// The committed data/*.json must equal what the TypeScript produces. If this
// fails, run `npm run build` and commit data/.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { ATTRIBUTION, RULESETS, WEIGHT_TABLES, buildDatasets } from "../src/datasets.js";
import * as W from "../src/weightClasses.js";
import * as R from "../src/rulesets.js";
import * as B from "../src/beltRules.js";
import { KB_CATEGORIES, KB_TAG_ALIASES } from "../src/kbTaxonomy.js";
import { SOURCES } from "../src/sources.js";

const dataDir = join(import.meta.dirname, "..", "data");
const read = (path: string) => JSON.parse(readFileSync(join(dataDir, path), "utf8"));
const listFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? listFiles(full) : [relative(dataDir, full)];
  });

// Round-trip through JSON so undefined fields compare the way they are stored.
const plain = <T>(value: T): T => JSON.parse(JSON.stringify(value));

describe("data/ matches the TypeScript", () => {
  const expected = buildDatasets();

  it("has exactly the generated files", () => {
    expect(existsSync(dataDir), "data/ is missing; run npm run build").toBe(true);
    expect(listFiles(dataDir).sort()).toEqual(Object.keys(expected).sort());
  });

  for (const [path, value] of Object.entries(expected)) {
    it(path, () => {
      expect(read(path)).toEqual(plain(value));
    });
  }
});

describe("JSON carries the TS values unchanged", () => {
  it("every exported weight table is published with identical classes", () => {
    const exported = Object.values(W).filter(
      (v): v is W.WeightTable => typeof v === "object" && v !== null && "classes" in v && "id" in v,
    );
    expect(WEIGHT_TABLES.map((t) => t.table.id).sort()).toEqual(exported.map((t) => t.id).sort());
    const combined = read("weight-classes.json");
    for (const table of exported) {
      expect(read(`weight-classes/${table.id}.json`).classes, table.id).toEqual(table.classes);
      expect(combined.tables.find((t: { id: string }) => t.id === table.id).classes, table.id).toEqual(table.classes);
    }
  });

  it("age divisions", () => {
    expect(read("ibjjf-age-divisions.json").divisions).toEqual(W.IBJJF_AGE_DIVISIONS);
  });

  it("every exported ruleset is published with identical rows and columns", () => {
    const exported = Object.values(R).filter(
      (v): v is R.Ruleset => typeof v === "object" && v !== null && "rows" in v && "columns" in v,
    );
    expect(RULESETS.map((r) => r.ruleset)).toEqual(expect.arrayContaining(exported));
    expect(RULESETS).toHaveLength(exported.length);
    for (const { key, ruleset } of RULESETS) {
      const file = read(`legal-techniques/${key}.json`);
      expect(file.rows).toEqual(plain(ruleset.rows));
      expect(file.columns).toEqual(ruleset.columns);
      expect(file.source).toEqual(ruleset.source);
    }
  });

  it("belt minimums and degrees", () => {
    const file = read("belt-requirements.json");
    for (const belt of file.belts) {
      expect(belt.minimumAge).toBe(B.MIN_AGE[belt.id as B.AdultBelt]);
      if (belt.id !== "black") expect(belt.minimumMonthsAtBelt).toBe(B.MIN_MONTHS_AT[belt.id as Exclude<B.AdultBelt, "black">]);
    }
    expect(file.belts.map((b: { id: string }) => b.id)).toEqual(B.ADULT_BELTS);
    expect(file.blackBeltDegrees).toEqual(plain(B.BLACK_DEGREES));
    expect(file.minimumAgeExceptions).toEqual([{ belt: "black", condition: "adult-world-champion-at-brown", minimumAge: 18 }]);
    expect(file.meta.sources).toEqual([{ ...B.GRADUATION_SOURCE }]);
  });

  it("taxonomy", () => {
    const file = read("taxonomy.json");
    expect(file.categories).toEqual(KB_CATEGORIES);
    expect(file.aliases).toEqual(KB_TAG_ALIASES);
  });

  it("every file cites sources and carries the attribution line", () => {
    for (const path of Object.keys(buildDatasets())) {
      if (path === "index.json") continue;
      const { meta } = read(path);
      expect(meta.attribution, path).toBe(ATTRIBUTION);
      expect(meta.license, path).toBe("CC-BY-4.0");
      expect(meta.sources.length, path).toBeGreaterThan(0);
    }
    expect(read("weight-classes.json").meta.sources).toEqual(SOURCES.weightClasses.sources);
  });
});
