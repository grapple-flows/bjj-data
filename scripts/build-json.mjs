#!/usr/bin/env node
// Writes data/*.json from the compiled TypeScript (dist/datasets.js).
// Run through `npm run build`, which compiles first. Never edit data/ by hand.

import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { buildDatasets } = await import(pathToFileURL(join(root, "dist", "datasets.js")).href);

const dataDir = join(root, "data");
rmSync(dataDir, { recursive: true, force: true });

const files = buildDatasets();
for (const [path, value] of Object.entries(files)) {
  const out = join(dataDir, path);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(value, null, 2) + "\n");
}
console.log(`wrote ${Object.keys(files).length} files to data/`);
