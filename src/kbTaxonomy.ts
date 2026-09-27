// A small, practical vocabulary of BJJ positions and submissions: stable
// slugs, readable labels, the category each belongs to, and the synonyms
// people actually type.
//
// The data (KB_CATEGORIES, KB_TAG_ALIASES) lives in kbTaxonomy.data.ts and is
// generated from the Grapple Flows app by scripts/sync-from-app.mjs. The
// helpers below are ported by hand and keep the app's names.
//
// Some slugs are the short forms practitioners use ("dlr", "rdlr", "50-50").
// Some entries are families rather than single techniques ("chokes",
// "leglocks"), and several specific names alias onto them ("heel-hook",
// "knee-bar", "toe-hold" all resolve to "leglocks").

import { KB_CATEGORIES, KB_TAG_ALIASES } from "./kbTaxonomy.data.js";

export { KB_CATEGORIES, KB_TAG_ALIASES };

export type KbKind = "position" | "submission";

export interface KbEntry {
  /** Canonical slug. */
  tag: string;
  /** Human-facing name. */
  label: string;
  /** Position (including passes, takedowns, sweeps) or submission. */
  kind: KbKind;
}

export interface KbCategory {
  key: string;
  label: string;
  /** One-line description of the category. */
  blurb: string;
  entries: KbEntry[];
}

export const KB_ENTRIES: KbEntry[] = KB_CATEGORIES.flatMap((c) => c.entries);

const LABEL_BY_TAG = new Map<string, string>(KB_ENTRIES.map((e) => [e.tag, e.label]));

/** Tags whose kind is "submission". */
export const KB_SUBMISSION_TAGS: ReadonlySet<string> = new Set(
  KB_ENTRIES.filter((e) => e.kind === "submission").map((e) => e.tag),
);

/**
 * Canonicalize a raw label or slug:
 *   1. lower-case, fold whitespace and slashes to hyphens, strip other
 *      punctuation, collapse repeats ("50/50" -> "50-50",
 *      "De La Riva" -> "de-la-riva").
 *   2. resolve through KB_TAG_ALIASES ("de-la-riva" -> "dlr").
 *
 * Idempotent. Free text with no alias passes through as a clean slug.
 */
export function normalizeFocusTag(raw: string): string {
  const slug = (raw || "")
    .trim()
    .toLowerCase()
    .replace(/[\s/]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (!slug) return "";
  return KB_TAG_ALIASES[slug] ?? slug;
}

/** Human label for a slug. Known tags use their curated label; anything else
 *  is de-slugified ("lasso-sweep" -> "Lasso sweep"). */
export function labelForTag(tag: string): string {
  const known = LABEL_BY_TAG.get(tag);
  if (known) return known;
  const spaced = (tag || "").replace(/-/g, " ").trim();
  if (!spaced) return tag;
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** Whether a (normalized) tag is one of the taxonomy's entries. */
export function isKbTag(tag: string): boolean {
  return LABEL_BY_TAG.has(tag);
}

// ---- Grouped view-model (categories as picker groups) -----------------------

export interface TaxonomyOption {
  tag: string;
  label: string;
  /** Not set by this package; kept so the type matches the app's. */
  count?: number;
}

export interface TaxonomyGroup {
  label: string;
  options: TaxonomyOption[];
}

export function toOption(e: KbEntry): TaxonomyOption {
  return { tag: e.tag, label: e.label };
}

/** Picker groups from the categories, optionally filtered by kind.
 *  "position" yields every non-submission category; "submission" yields just
 *  the submissions. */
export function taxonomyGroups(kind?: KbKind): TaxonomyGroup[] {
  const cats = KB_CATEGORIES.filter((c) => {
    const catKind: KbKind = c.key === "submissions" ? "submission" : "position";
    return kind ? catKind === kind : true;
  });
  return cats.map((c) => ({
    label: c.label,
    options: c.entries.map(toOption),
  }));
}
