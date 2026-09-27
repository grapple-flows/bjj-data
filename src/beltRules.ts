// Synced from the Grapple Flows app (src/utils/beltRules.ts) by
// scripts/sync-from-app.mjs. Edit upstream and re-sync; see README.

// IBJJF belt promotion minimums, as pure data + functions.
//
// Source: IBJJF "General System of Graduation", June 2026 (v3.3),
// https://ibjjf.com/graduation-system. Article numbers are cited inline.
// When IBJJF publishes a new version, update GRADUATION_SOURCE and re-check
// every table here; test/beltRules.test.ts pins the key rules.
//
// Two counting rules drive everything:
// - Age is by birth year: "current year - birth year = age" (Art. 2.2.1). A
//   2008 birth counts as 18 for all of 2026, birthday or not.
// - Time at a belt counts from the day the belt was registered with IBJJF,
//   not the day it was tied on (Art. 3.2.1).
// These are minimums for IBJJF recognition. The professor decides when.

export const GRADUATION_SOURCE = {
  label: "IBJJF General System of Graduation, June 2026 (v3.3)",
  href: "https://ibjjf.com/graduation-system",
} as const;

export type AdultBelt = "white" | "blue" | "purple" | "brown" | "black";
/** Highest kids belt registered with IBJJF before blue. Orange is separate
 *  from grey/yellow because one purple-belt exception names it (Art. 3.1.3). */
export type KidsBackground = "none" | "grey-yellow" | "orange" | "green";

export const ADULT_BELTS: AdultBelt[] = ["white", "blue", "purple", "brown", "black"];

export const BELT_LABELS: Record<AdultBelt, string> = {
  white: "White",
  blue: "Blue",
  purple: "Purple",
  brown: "Brown",
  black: "Black",
};

/** Minimum age to receive each adult belt (Art. 2.1.2). Black is 19, or 18
 *  for an Adult World Champion at brown belt (June 2026 change). */
export const MIN_AGE: Record<AdultBelt, number> = {
  white: 0,
  blue: 16,
  purple: 16,
  brown: 18,
  black: 19,
};

/** Default minimum months at a belt before the next one, age 18+ (Art. 3.1.3). */
export const MIN_MONTHS_AT: Record<Exclude<AdultBelt, "black">, number> = {
  white: 0,
  blue: 24,
  purple: 18,
  brown: 12,
};

/** Black belt degrees (Art. 4.1.5): years since the previous degree. */
export const BLACK_DEGREES: Array<{ degree: number; label: string; yearsSincePrevious: number; totalYears: number; minAge?: number }> = [
  { degree: 1, label: "1st degree", yearsSincePrevious: 3, totalYears: 3 },
  { degree: 2, label: "2nd degree", yearsSincePrevious: 3, totalYears: 6 },
  { degree: 3, label: "3rd degree", yearsSincePrevious: 3, totalYears: 9 },
  { degree: 4, label: "4th degree", yearsSincePrevious: 5, totalYears: 14 },
  { degree: 5, label: "5th degree", yearsSincePrevious: 5, totalYears: 19 },
  { degree: 6, label: "6th degree", yearsSincePrevious: 5, totalYears: 24 },
  { degree: 7, label: "7th degree, red and black belt", yearsSincePrevious: 7, totalYears: 31, minAge: 49 },
  { degree: 8, label: "8th degree, red and white belt", yearsSincePrevious: 7, totalYears: 38, minAge: 56 },
  { degree: 9, label: "9th degree, red belt", yearsSincePrevious: 10, totalYears: 48, minAge: 66 },
];

export type YearMonth = { year: number; month: number }; // month 1-12

export type EligibilityInput = {
  birthYear: number;
  belt: AdultBelt;
  /** When the current belt (or black belt degree) was registered with IBJJF. */
  registered: YearMonth;
  /** Kids belts registered with IBJJF before blue. */
  kidsBackground?: KidsBackground;
  /** Blue belt was registered while a juvenile (16-17). Derived from the
   *  registration date when the current belt is blue. */
  juvenileBlue?: boolean;
  /** Adult World Champion at the current belt. */
  worldChampion?: boolean;
  /** Current black belt degree (0 = plain black belt). */
  blackDegree?: number;
};

export type Requirement = {
  label: string;
  detail: string;
  /** When this requirement is (or was) met. */
  metFrom: YearMonth;
};

export type Eligibility = {
  nextLabel: string;
  earliest: YearMonth;
  eligibleNow: boolean;
  requirements: Requirement[];
  notes: string[];
};

const addMonths = (ym: YearMonth, months: number): YearMonth => {
  const index = ym.year * 12 + (ym.month - 1) + months;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
};

const later = (a: YearMonth, b: YearMonth): YearMonth =>
  a.year * 12 + a.month >= b.year * 12 + b.month ? a : b;

const notAfter = (a: YearMonth, b: YearMonth) => a.year * 12 + a.month <= b.year * 12 + b.month;

export const ageInYear = (birthYear: number, year: number) => year - birthYear;

/** First month in which the athlete counts as `age` (January of that year). */
const ageReached = (birthYear: number, age: number): YearMonth => ({ year: birthYear + age, month: 1 });

const months = (n: number) =>
  n === 0 ? "no minimum" : `${n / 12} ${n === 12 ? "year" : "years"}`;

/** Registered at age 16 or 17 (by birth year), i.e. as a juvenile. */
export const registeredAsJuvenile = (birthYear: number, registered: YearMonth) => {
  const age = ageInYear(birthYear, registered.year);
  return age === 16 || age === 17;
};

/** Minimum months at the current colored belt, applying the IBJJF exceptions
 *  (Art. 3.1.3 b-e). */
export function minMonthsAtBelt(input: EligibilityInput): { months: number; reason: string } {
  const kids = input.kidsBackground ?? "none";
  switch (input.belt) {
    case "white":
      return { months: 0, reason: "No minimum time at white belt." };
    case "blue": {
      const juvenileBlue = input.juvenileBlue ?? registeredAsJuvenile(input.birthYear, input.registered);
      if (input.worldChampion) return { months: 0, reason: "No minimum: Adult Blue Belt World Champion (Art. 3.1.3 e)." };
      if (juvenileBlue) return { months: 0, reason: "No minimum: blue belt registered as a juvenile, age 16-17 (Art. 3.1.3 d)." };
      if (kids === "green") return { months: 0, reason: "No minimum: previously registered as a green belt (Art. 3.1.3 c)." };
      if (kids === "grey-yellow" || kids === "orange")
        return { months: 12, reason: "1 year: previously registered as a grey, yellow, or orange belt (Art. 3.1.3 b)." };
      return { months: 24, reason: "The standard adult minimum (Art. 3.1.3 a)." };
    }
    case "purple": {
      const juvenilePurple = registeredAsJuvenile(input.birthYear, input.registered);
      if (input.worldChampion) return { months: 0, reason: "No minimum: Adult Purple Belt World Champion (Art. 3.1.3 e)." };
      if (juvenilePurple) return { months: 0, reason: "No minimum: purple belt registered as a juvenile, age 16-17 (Art. 3.1.3 d)." };
      if (input.juvenileBlue && (kids === "orange" || kids === "green"))
        return { months: 0, reason: "No minimum: orange or green belt, then juvenile blue belt (Art. 3.1.3 c)." };
      if (input.juvenileBlue) return { months: 12, reason: "1 year: blue belt was registered as a juvenile (Art. 3.1.3 b)." };
      return { months: 18, reason: "The standard adult minimum (Art. 3.1.3 a)." };
    }
    case "brown":
      if (input.worldChampion) return { months: 0, reason: "No minimum: Adult Brown Belt World Champion (Art. 3.1.3 b)." };
      return { months: 12, reason: "The standard adult minimum (Art. 3.1.3 a)." };
    default:
      return { months: 0, reason: "" };
  }
}

/** Earliest IBJJF-recognized date for the next belt or black belt degree. */
export function nextEligibility(input: EligibilityInput, today: YearMonth): Eligibility {
  const notes: string[] = [];

  if (input.belt === "black") {
    const current = Math.max(0, Math.min(8, Math.floor(input.blackDegree ?? 0)));
    const next = BLACK_DEGREES[current];
    const timeMet = addMonths(input.registered, next.yearsSincePrevious * 12);
    const requirements: Requirement[] = [
      {
        label: `${next.yearsSincePrevious} years since ${current === 0 ? "black belt" : BLACK_DEGREES[current - 1].label}`,
        detail: `Counted from the registration date (Art. 4.1.5). Only years with proven activity under IBJJF count (Art. 4.2).`,
        metFrom: timeMet,
      },
    ];
    let earliest = timeMet;
    if (next.minAge) {
      const ageMet = ageReached(input.birthYear, next.minAge);
      requirements.push({ label: `Age ${next.minAge}`, detail: "Minimum age for this belt (Art. 2.1.2).", metFrom: ageMet });
      earliest = later(earliest, ageMet);
    }
    notes.push("Degrees are awarded by a qualified professor. IBJJF only recognizes those that meet these minimums.");
    return { nextLabel: next.label, earliest, eligibleNow: notAfter(earliest, today), requirements, notes };
  }

  const order = ADULT_BELTS;
  const nextBelt = order[order.indexOf(input.belt) + 1];
  const requirements: Requirement[] = [];

  // Minimum age for the next belt.
  let minAge = MIN_AGE[nextBelt];
  if (nextBelt === "black" && input.worldChampion) {
    minAge = 18;
    notes.push("Black belt at 18 is allowed only for athletes who won the Adult World Championship at brown belt (June 2026 rule).");
  }
  const ageMet = ageReached(input.birthYear, minAge);
  requirements.push({
    label: `Age ${minAge}`,
    detail: `Minimum age for ${BELT_LABELS[nextBelt].toLowerCase()} belt, counted by birth year (Art. 2.1.2, 2.2.1).`,
    metFrom: ageMet,
  });

  // Minimum time at the current belt. A blue belt registered at 16-17 has
  // no minimum (Art. 3.1.2 and 3.1.3 d), which minMonthsAtBelt derives from
  // the registration date.
  const time = minMonthsAtBelt(input);
  const timeMet = addMonths(input.registered, time.months);
  requirements.push({
    label: time.months === 0 ? "Time at current belt" : `${months(time.months)} at ${BELT_LABELS[input.belt].toLowerCase()} belt`,
    detail: time.reason,
    metFrom: timeMet,
  });

  if (input.belt === "purple" && ageInYear(input.birthYear, today.year) < 18) {
    notes.push("A juvenile purple belt can only be promoted to brown in the adult division, from age 18 (Art. 3.1.2).");
  }

  const earliest = requirements.reduce((acc, r) => later(acc, r.metFrom), { year: 0, month: 1 } as YearMonth);
  notes.push("These are IBJJF minimums. Your professor decides when you are ready.");

  return {
    nextLabel: `${BELT_LABELS[nextBelt]} belt`,
    earliest,
    eligibleNow: notAfter(earliest, today),
    requirements,
    notes,
  };
}

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const formatYearMonth = (ym: YearMonth) => `${MONTH_NAMES[ym.month - 1]} ${ym.year}`;
