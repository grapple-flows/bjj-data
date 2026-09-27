# bjj-data

Brazilian jiu-jitsu reference data (weight classes, age divisions, legal techniques by ruleset, belt promotion requirements, and a position and submission vocabulary) as JSON files and a small, dependency-free TypeScript package.

Maintained by [Grapple Flows](https://grappleflows.com), and the same data behind its free [BJJ tools](https://grappleflows.com/tools).

## Datasets

| Dataset | File | Source | As of |
| --- | --- | --- | --- |
| IBJJF weight classes: gi and no-gi, adult/master and juvenile, male and female | [`data/weight-classes.json`](data/weight-classes.json), one file per table in [`data/weight-classes/`](data/weight-classes) | [IBJJF event weight charts](https://ibjjf.com/events) (2026 events) | Checked September 2026 |
| ADCC weight classes: World Championship and Trials, Opens | same files (`adcc-*`) | [ADCC rules and weight classes](https://adcc-official.com/pages/adcc-rules) (rev. 4 April 2026) | Checked September 2026 |
| IBJJF age divisions | [`data/ibjjf-age-divisions.json`](data/ibjjf-age-divisions.json) | [IBJJF Rules Book v6.1](https://ibjjf.com/books-videos), Art. 1.1 (June 2024) | Checked September 2026 |
| Legal techniques: IBJJF | [`data/legal-techniques/ibjjf.json`](data/legal-techniques/ibjjf.json) | [IBJJF Rules Book v6.1](https://ibjjf.com/books-videos) (June 2024) | Checked September 2026 |
| Legal techniques: ADCC | [`data/legal-techniques/adcc.json`](data/legal-techniques/adcc.json) | [ADCC rules and Opens legal techniques grid](https://adcc-official.com/pages/adcc-rules) (grid 20 July 2026, rules 24 September 2026) | Checked September 2026 |
| Legal techniques: NAGA gi and no-gi | [`data/legal-techniques/naga-gi.json`](data/legal-techniques/naga-gi.json), [`naga-nogi.json`](data/legal-techniques/naga-nogi.json) | [NAGA rules](https://www.nagafighter.com/rules/) (2023, file updated July 2024) | Checked September 2026 |
| Legal techniques: Grappling Industries | [`data/legal-techniques/grappling-industries.json`](data/legal-techniques/grappling-industries.json) | [Grappling Industries rulebook](https://grapplingindustries.com/rules/) (9 February 2026) | Checked September 2026 |
| All legal-technique tables in one file | [`data/legal-techniques.json`](data/legal-techniques.json) | as above | Checked September 2026 |
| IBJJF belt requirements: minimum age, minimum time at belt, exceptions, black belt degrees | [`data/belt-requirements.json`](data/belt-requirements.json) | [IBJJF General System of Graduation](https://ibjjf.com/graduation-system) v3.3 (June 2026) | Checked September 2026 |
| Positions and submissions vocabulary: slugs, labels, categories, aliases | [`data/taxonomy.json`](data/taxonomy.json) | Grapple Flows | Not tied to a rulebook |

[`data/index.json`](data/index.json) lists every file. Each file starts with a `meta` block holding its sources, the date it was last checked, the license, and the attribution line.

A few things worth knowing before you use the numbers:

- Weight limits are upper limits and inclusive. `null` means no maximum.
- IBJJF prints its own pound limits, and they are not conversions of the kilogram limits (64 kg is printed as 141.6 lb). Use the column for the unit the event weighs in.
- IBJJF age is the event year minus the birth year, whatever the birthday. Belt time counts from the date the belt was registered with IBJJF.
- Legal-technique cells are `"Y"` legal, `"N"` illegal, or `"C"` conditional. Every `"C"` row has a `note` that explains it.
- IBJJF kids weight charts (under 16) vary by event and are not included.

## Install

```sh
npm install bjj-data
```

The package is ESM only, has no runtime dependencies, and ships TypeScript types.

## Usage

### Weight classes

```js
import { tableFor, findWeightClass, ibjjfAgeDivision } from "bjj-data";

const { division } = ibjjfAgeDivision(1990, 2026); // Master 2

const { table } = tableFor({ org: "ibjjf", sex: "male", uniform: "gi", age: 36 });
const result = findWeightClass(table, 170, "lb");
// result.weightClass.name === "Middle", result.limit === 181.6,
// result.margin === 11.6, result.next.name === "Medium Heavy"
```

`org` is `"ibjjf"`, `"adcc-pro"` (World Championship and Trials), or `"adcc-open"`. Every table is also exported by name, for example `IBJJF_NOGI_ADULT_FEMALE` or `ADCC_OPEN_MALE`.

### Legal techniques

```js
import { IBJJF_RULES, ibjjfColumn, resolveCell, LEGALITY_LABEL } from "bjj-data";

const column = ibjjfColumn({ age: "adult", belt: "brown", uniform: "nogi" });
const heelHook = IBJJF_RULES.rows.find((row) => row.id === "heel-hook");
LEGALITY_LABEL[resolveCell(IBJJF_RULES, heelHook, column, "nogi")]; // "Legal"
```

Rulesets: `IBJJF_RULES`, `ADCC_RULES`, `NAGA_NOGI_RULES`, `NAGA_GI_RULES`, `GI_RULES` (Grappling Industries). Each has a column helper (`ibjjfColumn`, `adccColumn`, `nagaColumn`, `giColumn`) that maps a division to its column. Technique `id`s are shared across organizations where they line up, so `"heel-hook"` means the same thing in every table.

### Belt requirements

```js
import { nextEligibility, formatYearMonth } from "bjj-data";

const next = nextEligibility(
  { birthYear: 1995, belt: "blue", registered: { year: 2025, month: 3 } },
  { year: 2026, month: 9 },
);
next.nextLabel;                // "Purple belt"
formatYearMonth(next.earliest); // "March 2027"
next.requirements;             // each minimum, with the article it comes from
```

The raw tables are `MIN_AGE`, `MIN_MONTHS_AT`, and `BLACK_DEGREES`. `minMonthsAtBelt` applies the IBJJF exceptions (kids belts, juvenile registration, world champions).

### Positions and submissions vocabulary

```js
import { normalizeFocusTag, labelForTag, KB_CATEGORIES } from "bjj-data";

normalizeFocusTag("De La Riva guard"); // "dlr"
labelForTag("dlr");                    // "De La Riva"
```

### JSON without npm

Every file is available from jsDelivr:

```
https://cdn.jsdelivr.net/gh/GrappleFlows/bjj-data@main/data/<file>.json
```

For example:

```js
const res = await fetch("https://cdn.jsdelivr.net/gh/GrappleFlows/bjj-data@main/data/weight-classes/ibjjf-gi-adult-male.json");
const { classes } = await res.json();
```

Pin a tag instead of `@main` (for example `@v0.1.0`) if you need the data to stay fixed. From npm, the same files can be imported directly:

```js
import weights from "bjj-data/data/weight-classes.json" with { type: "json" };
```

## Attribution

The data is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). If you use it in an app, site, bracket tool, or article, please credit it with a link:

> Data from bjj-data by Grapple Flows (https://grappleflows.com)

Copy-paste HTML:

```html
<p>Data from <a href="https://github.com/GrappleFlows/bjj-data">bjj-data</a> by <a href="https://grappleflows.com">Grapple Flows</a>.</p>
```

Every JSON file also carries this line in `meta.attribution`.

## Maintained by Grapple Flows

Grapple Flows is a free BJJ flowchart app that turns voice notes and videos into visual maps of jiu-jitsu techniques, positions, and transitions you can study, edit, and share.

This data powers the free tools on grappleflows.com:

- [BJJ weight classes](https://grappleflows.com/bjj-weight-classes)
- [Legal techniques by belt and ruleset](https://grappleflows.com/bjj-legal-techniques)
- [IBJJF belt requirements](https://grappleflows.com/bjj-belt-requirements)

## Related

- [bjj-timer](https://github.com/GrappleFlows/bjj-timer): a BJJ round timer web component with IBJJF match times.
- [bjj-scoreboard](https://github.com/GrappleFlows/bjj-scoreboard): an IBJJF scoreboard web component with points, advantages, penalties, and tiebreaks.
- [bjj-bracket](https://github.com/GrappleFlows/bjj-bracket): a tournament bracket generator for single elimination, double elimination, and round robin.

## Corrections and updates

If a rulebook changes or a value is wrong, open an issue with a link to the official document and the page or article number.

The data is maintained in the Grapple Flows app and copied here with `scripts/sync-from-app.mjs`, so the tools on grappleflows.com and this package stay the same. To refresh from a checkout of the app:

```sh
npm run sync -- /path/to/grappleflows
npm run build   # compiles src/ and regenerates data/*.json
npm test        # includes a check that data/ matches src/
git diff        # review, then commit src/ and data/
```

The sync copies `weightClasses.ts`, `rulesets.ts`, and `beltRules.ts` as they are, writes the vocabulary from the app's `kbTaxonomy.ts` into `src/kbTaxonomy.data.ts` (slugs, labels, categories, and aliases only), and writes source citations into `src/sources.ts`. It only reads from the app checkout.

Files in `data/` are generated. Do not edit them by hand; `npm test` fails if they drift from `src/`.

## Disclaimer

Rules change, and events sometimes publish their own variations. Always check the official rulebook and the event page before competing or running an event. This project is not affiliated with or endorsed by the IBJJF, ADCC, NAGA, or Grappling Industries.

## License

- Code: [MIT](LICENSE)
- Data: [CC BY 4.0](DATA-LICENSE)

Copyright Grapple Flows.
