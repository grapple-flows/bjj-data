#!/usr/bin/env node
// Refresh this package from a Grapple Flows app checkout.
//
//   node scripts/sync-from-app.mjs /path/to/grappleflows
//   npm run sync -- /path/to/grappleflows
//
// What it does (reads the app, never writes to it):
//   1. Copies src/utils/{weightClasses,rulesets,beltRules}.ts into src/ as-is,
//      with a "synced" header. These files must stay import-free.
//   2. Loads src/data/kbTaxonomy.ts and writes src/kbTaxonomy.data.ts with the
//      plain vocabulary only (slug, label, kind, category, aliases). Corpus
//      coverage counts and other app-only fields are dropped.
//   3. Loads src/data/{weightsSeo,rulesSeo,beltsSeo}.ts and writes
//      src/sources.ts from their `sources` and `checked` fields.
//
// Afterwards run `npm run build && npm test`, review `git diff`, and commit.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const appArg = process.argv[2];
if (!appArg) {
  console.error("Usage: node scripts/sync-from-app.mjs <path-to-grappleflows-checkout>");
  process.exit(1);
}
const app = resolve(appArg);

const COPIED = ["weightClasses", "rulesets", "beltRules"];
const inApp = (rel) => {
  const path = join(app, rel);
  if (!existsSync(path)) {
    console.error(`Not found: ${path}\nIs ${app} a Grapple Flows checkout?`);
    process.exit(1);
  }
  return path;
};

// ---- 1. Copy the three pure-data modules ----------------------------------
for (const name of COPIED) {
  const from = inApp(`src/utils/${name}.ts`);
  let text = readFileSync(from, "utf8");
  if (/^\s*import\s/m.test(text)) {
    console.error(`${from} has imports. This package must stay dependency-free; inline or drop them upstream first.`);
    process.exit(1);
  }
  // Point test references at this package's tests.
  text = text
    .replace(
      "src/utils/weightClasses.test.ts checks the page tables against these.",
      "test/weightClasses.test.ts pins the key lookups.",
    )
    .replace(/src\/utils\/(\w+)\.test\.ts/g, "test/$1.test.ts");
  const header =
    `// Synced from the Grapple Flows app (src/utils/${name}.ts) by\n` +
    `// scripts/sync-from-app.mjs. Edit upstream and re-sync; see README.\n\n`;
  writeFileSync(join(root, "src", `${name}.ts`), header + text);
  console.log(`copied   src/utils/${name}.ts -> src/${name}.ts`);
}

// ---- Load a TS module from the app (transpiled to a temp .mjs) --------------
const tmp = join(root, ".sync-tmp");
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });

async function loadTs(rel) {
  const source = readFileSync(inApp(rel), "utf8");
  if (/^\s*import\s(?!type\b)/m.test(source)) {
    throw new Error(`${rel} has runtime imports; sync can't load it standalone.`);
  }
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
    fileName: rel,
  });
  const out = join(tmp, rel.replace(/[\\/]/g, "_").replace(/\.ts$/, ".mjs"));
  writeFileSync(out, outputText);
  return import(pathToFileURL(out).href);
}

try {
  // ---- 2. Taxonomy vocabulary ----------------------------------------------
  const kb = await loadTs("src/data/kbTaxonomy.ts");
  const categories = kb.KB_CATEGORIES.map((c) => ({
    key: c.key,
    label: c.label,
    blurb: c.blurb,
    entries: c.entries.map((e) => ({ tag: e.tag, label: e.label, kind: e.kind })),
  }));
  const tags = new Set(categories.flatMap((c) => c.entries.map((e) => e.tag)));
  const aliases = {};
  for (const [from, to] of Object.entries(kb.KB_TAG_ALIASES)) {
    if (!tags.has(to)) {
      console.warn(`skipped  alias ${from} -> ${to}: target is not a taxonomy entry`);
      continue;
    }
    aliases[from] = to;
  }
  const taxonomy =
    `// Generated from the Grapple Flows app (src/data/kbTaxonomy.ts) by\n` +
    `// scripts/sync-from-app.mjs. Do not edit by hand.\n` +
    `// Only the vocabulary is copied: slugs, labels, kinds, categories, aliases.\n\n` +
    `import type { KbCategory } from "./kbTaxonomy.js";\n\n` +
    `export const KB_CATEGORIES: KbCategory[] = ${JSON.stringify(categories, null, 2)};\n\n` +
    `export const KB_TAG_ALIASES: Record<string, string> = ${JSON.stringify(aliases, null, 2)};\n`;
  writeFileSync(join(root, "src", "kbTaxonomy.data.ts"), taxonomy);
  console.log(`wrote    src/kbTaxonomy.data.ts (${tags.size} tags, ${Object.keys(aliases).length} aliases)`);

  // ---- 3. Source citations -------------------------------------------------
  const { WEIGHTS_SEO } = await loadTs("src/data/weightsSeo.ts");
  const { RULES_SEO } = await loadTs("src/data/rulesSeo.ts");
  const { BELTS_SEO } = await loadTs("src/data/beltsSeo.ts");
  const pick = (seo) => ({
    checked: seo.checked,
    sources: seo.sources.map((s) => ({ label: s.label, href: s.href })),
  });
  const sources = {
    weightClasses: pick(WEIGHTS_SEO),
    legalTechniques: pick(RULES_SEO),
    beltRequirements: pick(BELTS_SEO),
  };
  const sourcesTs =
    `// Generated from the Grapple Flows tool pages (src/data/*Seo.ts) by\n` +
    `// scripts/sync-from-app.mjs. Do not edit by hand.\n\n` +
    `export type Source = { label: string; href: string };\n` +
    `export type SourceSet = { checked: string; sources: Source[] };\n\n` +
    `/** Where each dataset comes from and when it was last checked against it. */\n` +
    `export const SOURCES: {\n  weightClasses: SourceSet;\n  legalTechniques: SourceSet;\n  beltRequirements: SourceSet;\n} = ${JSON.stringify(sources, null, 2)};\n`;
  writeFileSync(join(root, "src", "sources.ts"), sourcesTs);
  console.log("wrote    src/sources.ts");
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

let appCommit = "";
try {
  appCommit = execFileSync("git", ["-C", app, "rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim();
} catch {
  // Not a git checkout; fine.
}
console.log(`\nSynced from ${app}${appCommit ? ` @ ${appCommit}` : ""}.`);
console.log("Next: npm run build && npm test, then review git diff (src/ and data/).");
console.log("If the app's kbTaxonomy.ts helper functions changed, port them to src/kbTaxonomy.ts by hand.");
