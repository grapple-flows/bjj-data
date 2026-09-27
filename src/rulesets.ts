// Synced from the Grapple Flows app (src/utils/rulesets.ts) by
// scripts/sync-from-app.mjs. Edit upstream and re-sync; see README.

// Which submissions and moves are legal, by organization and division.
// Pure data, read directly from each organization's own document (checked
// September 2026). Cells: "Y" legal, "N" illegal, "C" conditional (see note).
// test/rulesets.test.ts pins the most-searched cells.
//
// When a ruleset changes: update its `source`, its rows, and the tests.

export type Legality = "Y" | "N" | "C";

export type RuleRow = {
  /** Canonical technique id, shared across organizations where it lines up. */
  id: string;
  label: string;
  cells: Legality[];
  /** Explains "C" cells or adds context for the whole row. */
  note?: string;
};

export type Ruleset = {
  id: OrgId;
  name: string;
  short: string;
  source: { label: string; href: string };
  columns: Array<{ id: string; label: string }>;
  rows: RuleRow[];
  /** What happens when you use an illegal technique. */
  penalty: string;
};

export type OrgId = "ibjjf" | "adcc" | "naga" | "gi";

const Y: Legality = "Y";
const N: Legality = "N";
const C: Legality = "C";

// ---- IBJJF ------------------------------------------------------------------
// Rules Book v6.1 (June 2024), illegal techniques table p.29, knee reaping
// p.32; matches the "Technical fouls and illegal moves" poster v4.0.
export const IBJJF_RULES: Ruleset = {
  id: "ibjjf",
  name: "IBJJF",
  short: "IBJJF",
  source: {
    label: "IBJJF Rules Book v6.1 (June 2024)",
    href: "https://ibjjf.com/books-videos",
  },
  penalty:
    "Using a technique that is illegal for your division is a severe foul and means immediate disqualification (Art. 6.2.3).",
  columns: [
    { id: "a", label: "Ages 4 to 12" },
    { id: "b", label: "Ages 13 to 15" },
    { id: "c", label: "Ages 16 to 17 (all belts) and adult/master white belts" },
    { id: "d", label: "Adult and master blue and purple belts" },
    { id: "e", label: "Adult and master brown and black belts, except adult no-gi" },
    { id: "f", label: "Adult brown and black belts, no-gi" },
  ],
  rows: [
    { id: "leg-spread", label: "Submissions stretching the legs apart", cells: [N, Y, Y, Y, Y, Y] },
    { id: "choke-spinal-lock", label: "Choke with spinal lock", cells: [N, N, Y, Y, Y, Y] },
    { id: "straight-ankle-lock", label: "Straight foot lock", cells: [N, N, Y, Y, Y, Y] },
    { id: "ezekiel", label: "Ezekiel choke (forearm choke using the sleeve)", cells: [N, N, Y, Y, Y, Y] },
    { id: "guillotine", label: "Frontal guillotine choke", cells: [N, N, Y, Y, Y, Y] },
    { id: "omoplata", label: "Omoplata", cells: [N, N, Y, Y, Y, Y] },
    { id: "triangle", label: "Triangle pulling the head", cells: [N, N, Y, Y, Y, Y] },
    { id: "arm-triangle", label: "Arm triangle", cells: [N, N, Y, Y, Y, Y] },
    { id: "kidney-compression", label: "Compressing the kidneys or ribs with the legs in closed guard", cells: [N, N, N, Y, Y, Y] },
    { id: "wrist-lock", label: "Wrist lock", cells: [N, N, N, Y, Y, Y] },
    {
      id: "single-leg-head-outside",
      label: "Single leg takedown with the head outside",
      cells: [N, N, N, Y, Y, Y],
      note: "Prohibited but not penalized where illegal: the referee restarts the match standing (Art. 1.3.6).",
    },
    { id: "bicep-slicer", label: "Bicep slicer", cells: [N, N, N, N, Y, Y] },
    { id: "calf-slicer", label: "Calf slicer", cells: [N, N, N, N, Y, Y] },
    { id: "knee-bar", label: "Knee bar", cells: [N, N, N, N, Y, Y] },
    { id: "toe-hold", label: "Toe hold", cells: [N, N, N, N, Y, Y] },
    {
      id: "straight-ankle-lock-turning",
      label: "Straight foot lock turning toward the foot not under attack",
      cells: [N, N, N, N, Y, Y],
    },
    { id: "heel-hook", label: "Heel hook", cells: [N, N, N, N, N, Y] },
    { id: "knee-twisting", label: "Locks twisting the knees", cells: [N, N, N, N, N, Y] },
    {
      id: "knee-reaping",
      label: "Knee reaping",
      cells: [N, N, N, N, N, Y],
      note:
        "Reaping: the thigh is behind the opponent's leg, the calf crosses over the body above the knee, and the foot passes the opponent's midline, putting pressure on the knee from outside to inside. Nobody needs to be holding the foot.",
    },
    { id: "toe-hold-outward", label: "Toe hold with outward pressure on the foot", cells: [N, N, N, N, N, Y] },
    { id: "slam", label: "Slam", cells: [N, N, N, N, N, N] },
    {
      id: "neck-crank",
      label: "Spinal lock without a choke (neck cranks, twisters, can openers)",
      cells: [N, N, N, N, N, N],
      note: "The IBJJF table lists spinal locks without a choke. Neck cranks, twisters, and can openers aren't named, but that is the rule that covers them.",
    },
    { id: "scissor-takedown", label: "Scissor takedown (kani basami)", cells: [N, N, N, N, N, N] },
    { id: "finger-bending", label: "Bending the fingers backward", cells: [N, N, N, N, N, N] },
    {
      id: "belt-throw-head",
      label: "Throwing the opponent onto their head by the belt while defending a head-outside single leg",
      cells: [N, N, N, N, N, N],
    },
    { id: "suplex-head", label: "Suplex landing the opponent on the head or neck", cells: [N, N, N, N, N, N] },
    {
      id: "jumping-guard",
      label: "Jumping to closed guard",
      cells: [N, C, C, Y, Y, Y],
      note:
        "A serious foul for under-15 divisions and for white belts of any age (Art. 6.2.2). Juvenile blue and purple belts may jump guard. Check the event for 15-year-olds.",
    },
  ],
};

/** IBJJF column for a division. Heel hooks and reaping (column f) are adult
 *  only: master brown and black belts use column e even in no-gi. */
export function ibjjfColumn(input: { age: "4-12" | "13-15" | "16-17" | "adult" | "master"; belt: string; uniform: "gi" | "nogi" }): number {
  if (input.age === "4-12") return 0;
  if (input.age === "13-15") return 1;
  if (input.age === "16-17" || input.belt === "white") return 2;
  if (input.belt === "blue" || input.belt === "purple") return 3;
  return input.age === "adult" && input.uniform === "nogi" ? 5 : 4;
}

/** IBJJF jumping guard depends on belt as well as the column. */
export function ibjjfJumpingGuard(input: { age: "4-12" | "13-15" | "16-17" | "adult" | "master"; belt: string }): Legality {
  if (input.age === "4-12") return N;
  if (input.age === "13-15") return C;
  return input.belt === "white" ? N : Y;
}

// ---- ADCC ---------------------------------------------------------------------
// ADCC Opens "Legal techniques by division" grid (updated 20 Jul 2026) and
// the ADCC rules (24 Sep 2026) for the World Championship and Trials. No gi.
export const ADCC_RULES: Ruleset = {
  id: "adcc",
  name: "ADCC",
  short: "ADCC",
  source: {
    label: "ADCC rules and Opens legal techniques grid (2026)",
    href: "https://adcc-official.com/pages/adcc-rules",
  },
  penalty: "See the ADCC rules for how the referee penalizes fouls and illegal techniques.",
  columns: [
    { id: "kids", label: "Kids 12 and under" },
    { id: "t1314bi", label: "Teens 13 to 14, beginner and intermediate" },
    { id: "t1314a", label: "Teens 13 to 14, advanced" },
    { id: "t1517bi", label: "Teens 15 to 17, beginner and intermediate" },
    { id: "t1517a", label: "Teens 15 to 17, advanced" },
    { id: "adbi", label: "Adults, beginner and intermediate" },
    { id: "ada", label: "Adults, advanced" },
    { id: "mabi", label: "Masters, beginner and intermediate" },
    { id: "maa", label: "Masters, advanced" },
    { id: "pro", label: "World Championship and Trials" },
  ],
  rows: [
    { id: "ezekiel", label: "Ezekiel or punch choke", cells: [N, Y, Y, Y, Y, Y, Y, Y, Y, Y] },
    { id: "guillotine", label: "Standing guillotine", cells: [N, Y, Y, Y, Y, Y, Y, Y, Y, Y] },
    {
      id: "knee-reaping",
      label: "Knee reaping",
      cells: [N, C, C, C, C, Y, Y, Y, Y, Y],
      note:
        "At the Opens, teens 13 to 17 may reap only unlocked. Adults and masters may also reap locked, except from belly-down cross ashi. The World Championship allows any leg lock.",
    },
    { id: "straight-ankle-lock", label: "Straight ankle lock", cells: [N, N, N, N, Y, Y, Y, Y, Y, Y] },
    {
      id: "heel-hook",
      label: "Heel hook",
      cells: [N, N, N, N, N, Y, Y, N, Y, Y],
      note: "Adult beginners may heel hook at ADCC Opens. Masters beginners and intermediates may not.",
    },
    { id: "knee-bar", label: "Knee bar", cells: [N, N, N, N, N, Y, Y, Y, Y, Y] },
    { id: "toe-hold", label: "Toe hold, Aoki lock, Estima lock", cells: [N, N, N, N, N, Y, Y, Y, Y, Y] },
    { id: "calf-slicer", label: "Calf and bicep slicers", cells: [N, N, N, N, N, Y, Y, Y, Y, Y] },
    { id: "wrist-lock", label: "Wrist lock", cells: [N, N, N, N, N, Y, Y, Y, Y, Y] },
    {
      id: "neck-crank",
      label: "Neck crank, can opener, twister",
      cells: [N, N, N, N, N, C, C, C, C, C],
      note:
        "The Opens grid allows neck cranks \"except cervical\", can openers, and twisters for adults and masters. The World Championship rules allow can openers and twisters but ban neck cranks that trap both shoulders and push the neck down, like a full nelson.",
    },
    { id: "suplex", label: "Suplex (not onto the head)", cells: [N, N, N, N, N, Y, Y, Y, Y, Y] },
    { id: "jumping-guard", label: "Jumping to closed guard", cells: [N, N, N, N, N, Y, Y, N, N, C], note: "Not addressed in the World Championship rules." },
    { id: "scissor-takedown", label: "Scissor takedown (kani basami)", cells: [N, N, N, N, N, N, Y, N, N, C], note: "Not addressed in the World Championship rules." },
    {
      id: "slam",
      label: "Slam",
      cells: [N, N, N, N, N, N, N, N, N, C],
      note: "Illegal at every Opens division. At the World Championship a slam is only allowed while you are already locked in a submission, and you must stop if they let go.",
    },
    { id: "spike", label: "Spiking the opponent on the head", cells: [N, N, N, N, N, N, N, N, N, N] },
  ],
};

export function adccColumn(input: { division: "kids" | "teens13" | "teens15" | "adult" | "master" | "pro"; skill: "beginner" | "intermediate" | "advanced" }): number {
  const advanced = input.skill === "advanced";
  switch (input.division) {
    case "kids":
      return 0;
    case "teens13":
      return advanced ? 2 : 1;
    case "teens15":
      return advanced ? 4 : 3;
    case "adult":
      return advanced ? 6 : 5;
    case "master":
      return advanced ? 8 : 7;
    default:
      return 9;
  }
}

// ---- NAGA ---------------------------------------------------------------------
// NAGA rules PDF (2023, file updated July 2024). No-gi and gi charts differ.
export const NAGA_NOGI_RULES: Ruleset = {
  id: "naga",
  name: "NAGA no-gi",
  short: "NAGA",
  source: { label: "NAGA rules (2023, updated July 2024)", href: "https://www.nagafighter.com/rules/" },
  penalty: "See the NAGA rules for how illegal techniques are penalized at your event.",
  columns: [
    { id: "kids", label: "Kids 13 and under" },
    { id: "teens", label: "Teens 14 to 17" },
    { id: "beg", label: "Adult novice and beginner (white belt)" },
    { id: "int", label: "Adult intermediate and expert (blue belt and up)" },
  ],
  rows: [
    { id: "heel-hook", label: "Heel hook", cells: [N, N, N, Y] },
    { id: "straight-ankle-lock", label: "Straight ankle lock", cells: [N, C, Y, Y], note: "Teens: no knee reaping on a straight ankle lock." },
    { id: "knee-reaping", label: "Knee reaping", cells: [N, C, Y, Y], note: "NAGA sets no reaping restriction for adults. Teens may not reap on a straight ankle lock." },
    { id: "knee-bar", label: "Knee bar", cells: [N, Y, Y, Y] },
    { id: "toe-hold", label: "Toe hold", cells: [N, N, Y, Y] },
    { id: "calf-slicer", label: "Calf and bicep slicers", cells: [N, N, Y, Y] },
    { id: "neck-crank", label: "Neck crank", cells: [N, N, Y, Y] },
    { id: "twister", label: "Twister and spinal locks", cells: [N, N, Y, Y] },
    { id: "wrist-lock", label: "Wrist lock", cells: [N, N, Y, Y], note: "Adult beginners must hold at least 3 fingers." },
    { id: "scissor-takedown", label: "Scissor takedown (kani basami)", cells: [N, N, C, C], note: "Legal for adults only if a hand is placed on the mat first." },
    { id: "jumping-guard", label: "Jumping guard", cells: [N, C, Y, Y], note: "Teens: expert division only." },
    { id: "slam", label: "Slam", cells: [N, N, N, N], note: "Slamming on a takedown or to escape a position or submission is illegal for everyone." },
  ],
};

export const NAGA_GI_RULES: Ruleset = {
  id: "naga",
  name: "NAGA gi",
  short: "NAGA",
  source: NAGA_NOGI_RULES.source,
  penalty: NAGA_NOGI_RULES.penalty,
  columns: [
    { id: "kids", label: "Kids 13 and under" },
    { id: "teens", label: "Teens 14 to 17" },
    { id: "white", label: "White belt" },
    { id: "blue", label: "Blue belt" },
    { id: "purple", label: "Purple belt" },
    { id: "bb", label: "Brown and black belt" },
  ],
  rows: [
    { id: "straight-ankle-lock", label: "Straight foot lock", cells: [N, Y, Y, Y, Y, Y] },
    { id: "wrist-lock", label: "Wrist lock", cells: [N, N, N, Y, Y, Y] },
    { id: "kidney-compression", label: "Rib or neck compression with the legs", cells: [N, N, N, Y, Y, Y] },
    { id: "knee-bar", label: "Knee bar", cells: [N, N, N, N, N, Y] },
    { id: "toe-hold", label: "Toe hold", cells: [N, N, N, N, N, Y] },
    { id: "calf-slicer", label: "Calf and bicep slicers", cells: [N, N, N, N, N, Y] },
    { id: "heel-hook", label: "Heel hook", cells: [N, N, N, N, N, N] },
    { id: "neck-crank", label: "Neck crank and twister", cells: [N, N, N, N, N, N] },
    { id: "scissor-takedown", label: "Scissor takedown (kani basami)", cells: [N, N, N, N, N, N] },
    { id: "slam", label: "Slam", cells: [N, N, N, N, N, N] },
    {
      id: "jumping-guard",
      label: "Jumping guard",
      cells: [N, C, C, Y, Y, Y],
      note: "Teens: expert division with flying submissions only. White belts: only against a higher belt.",
    },
    { id: "knee-reaping", label: "Knee reaping", cells: [N, C, C, C, C, C], note: "Not covered by NAGA's gi chart. NAGA says its gi divisions follow IBJJF rules, so expect reaping to be illegal." },
  ],
};

export function nagaColumn(input: { uniform: "gi" | "nogi"; age: "kids" | "teens" | "adult"; belt: string }): number {
  if (input.age === "kids") return 0;
  if (input.age === "teens") return 1;
  if (input.uniform === "nogi") return input.belt === "white" ? 2 : 3;
  return input.belt === "white" ? 2 : input.belt === "blue" ? 3 : input.belt === "purple" ? 4 : 5;
}

// ---- Grappling Industries ------------------------------------------------------
// Rulebook 9 Feb 2026, "Allowable techniques" chart (p.21).
export const GI_RULES: Ruleset = {
  id: "gi",
  name: "Grappling Industries",
  short: "Grappling Industries",
  source: {
    label: "Grappling Industries rulebook (Feb 2026)",
    href: "https://grapplingindustries.com/rules/",
  },
  penalty: "Using a technique that is illegal at your level means disqualification (rule 9.6).",
  columns: [
    { id: "u18", label: "Under 18" },
    { id: "white", label: "White belt" },
    { id: "bp", label: "Blue belt, and purple belt in the gi" },
    { id: "pbb", label: "Purple belt in no-gi, brown and black belt" },
  ],
  rows: [
    { id: "ezekiel", label: "Ezekiel choke and gogoplata", cells: [N, Y, Y, Y] },
    { id: "kidney-compression", label: "Kidney compression and groin stretch", cells: [N, Y, Y, Y] },
    { id: "straight-ankle-lock", label: "Straight or rotational ankle lock", cells: [N, Y, Y, Y] },
    { id: "wrist-lock", label: "Wrist lock", cells: [N, Y, Y, Y] },
    { id: "guillotine", label: "Standing guillotine", cells: [N, Y, Y, Y] },
    { id: "jumping-guard", label: "Jumping attacks", cells: [N, N, Y, Y] },
    { id: "knee-bar", label: "Knee bar", cells: [N, N, Y, Y] },
    { id: "toe-hold", label: "Toe hold", cells: [N, N, Y, Y] },
    {
      id: "knee-reaping",
      label: "Knee reaping",
      cells: [N, N, Y, Y],
      note: "Below the legal level, the first reap without a submission is a penalty, and a second reap or a reap with a submission is a disqualification.",
    },
    { id: "calf-slicer", label: "Bicep and calf slicers", cells: [N, N, Y, Y] },
    { id: "neck-crank", label: "Neck and spinal cranks", cells: [N, N, N, Y] },
    { id: "heel-hook", label: "Heel hook and Z-lock", cells: [N, N, N, C], note: "No-gi only." },
    { id: "scissor-takedown", label: "Scissor takedown (kani basami)", cells: [N, N, N, C], note: "No-gi only." },
    { id: "slam", label: "Slam and attacks on the trachea", cells: [N, N, N, N], note: "A controlled suplex is not a slam. Spiking the head or neck is never allowed." },
  ],
};

export function giColumn(input: { age: "u18" | "adult"; belt: string; uniform: "gi" | "nogi" }): number {
  if (input.age === "u18") return 0;
  if (input.belt === "white") return 1;
  if (input.belt === "blue") return 2;
  if (input.belt === "purple") return input.uniform === "gi" ? 2 : 3;
  return 3;
}

/** Resolve a "C" cell where the division makes it definite. */
export function resolveCell(ruleset: Ruleset, row: RuleRow, column: number, uniform: "gi" | "nogi"): Legality {
  const cell = row.cells[column];
  // Grappling Industries brown/black: heel hooks and scissor takedowns are no-gi only.
  if (ruleset.id === "gi" && cell === "C" && (row.id === "heel-hook" || row.id === "scissor-takedown")) {
    return uniform === "nogi" ? "Y" : "N";
  }
  return cell;
}

export const LEGALITY_LABEL: Record<Legality, string> = { Y: "Legal", N: "Illegal", C: "Depends" };
