import { describe, it, expect } from "vitest";

import {
  KB_CATEGORIES,
  KB_ENTRIES,
  KB_TAG_ALIASES,
  KB_SUBMISSION_TAGS,
  normalizeFocusTag,
  labelForTag,
  isKbTag,
  taxonomyGroups,
} from "../src/kbTaxonomy.js";

describe("kbTaxonomy vocabulary", () => {
  it("every tag is a clean single-token slug", () => {
    for (const e of KB_ENTRIES) {
      expect(e.tag).toMatch(/^[a-z0-9][a-z0-9-]*$/);
      expect(e.label.length).toBeGreaterThan(0);
    }
  });

  it("has no duplicate tags across categories", () => {
    const tags = KB_ENTRIES.map((e) => e.tag);
    expect(new Set(tags).size).toBe(tags.length);
  });

  it("every alias points at an entry and never remaps an entry", () => {
    for (const [from, to] of Object.entries(KB_TAG_ALIASES)) {
      expect(isKbTag(to), `alias ${from} -> ${to}: target is not an entry`).toBe(true);
      expect(isKbTag(from), `alias ${from} -> ${to}: source is itself an entry`).toBe(false);
    }
  });

  it("carries only vocabulary fields", () => {
    for (const e of KB_ENTRIES) expect(Object.keys(e).sort()).toEqual(["kind", "label", "tag"]);
  });

  it("submission routing points at real tags", () => {
    for (const t of KB_SUBMISSION_TAGS) expect(isKbTag(t)).toBe(true);
  });
});

describe("normalizeFocusTag", () => {
  it("folds the spelled-out guards onto the short slug", () => {
    expect(normalizeFocusTag("de la riva")).toBe("dlr");
    expect(normalizeFocusTag("De-La-Riva")).toBe("dlr");
    expect(normalizeFocusTag("reverse de la riva")).toBe("rdlr");
  });

  it("folds free-text submissions onto the canonical slug", () => {
    expect(normalizeFocusTag("triangle choke")).toBe("triangle");
    expect(normalizeFocusTag("heel hook")).toBe("leglocks");
    expect(normalizeFocusTag("Guard Passing")).toBe("passing");
  });

  it('normalizes punctuation ("50/50" -> "50-50")', () => {
    expect(normalizeFocusTag("50/50")).toBe("50-50");
  });

  it("passes clean free text through", () => {
    expect(normalizeFocusTag("lasso sweep")).toBe("lasso-sweep");
    expect(normalizeFocusTag("  ")).toBe("");
  });

  it("is idempotent", () => {
    for (const raw of ["de la riva", "triangle choke", "mount", "50/50"]) {
      const once = normalizeFocusTag(raw);
      expect(normalizeFocusTag(once)).toBe(once);
    }
  });
});

describe("labelForTag", () => {
  it("uses curated labels for known tags", () => {
    expect(labelForTag("dlr")).toBe("De La Riva");
    expect(labelForTag("single-leg-x")).toBe("Single-leg X");
  });

  it("de-slugifies unknown tags", () => {
    expect(labelForTag("lasso-sweep")).toBe("Lasso sweep");
  });
});

describe("taxonomyGroups", () => {
  it("splits positions from submissions", () => {
    const positions = taxonomyGroups("position");
    const submissions = taxonomyGroups("submission");
    expect(positions.length).toBe(KB_CATEGORIES.length - 1);
    expect(submissions.length).toBe(1);
    expect(submissions[0].options.every((o) => KB_SUBMISSION_TAGS.has(o.tag))).toBe(true);
  });

  it("covers every entry exactly once", () => {
    const flat = taxonomyGroups().flatMap((g) => g.options.map((o) => o.tag));
    expect(flat).toEqual(KB_ENTRIES.map((e) => e.tag));
  });
});
