// Generated from the Grapple Flows app (src/data/kbTaxonomy.ts) by
// scripts/sync-from-app.mjs. Do not edit by hand.
// Only the vocabulary is copied: slugs, labels, kinds, categories, aliases.

import type { KbCategory } from "./kbTaxonomy.js";

export const KB_CATEGORIES: KbCategory[] = [
  {
    "key": "guards",
    "label": "Guards (bottom)",
    "blurb": "Playing off your back or seated.",
    "entries": [
      {
        "tag": "closed-guard",
        "label": "Closed guard",
        "kind": "position"
      },
      {
        "tag": "half-guard",
        "label": "Half guard",
        "kind": "position"
      },
      {
        "tag": "open-guard",
        "label": "Open guard",
        "kind": "position"
      },
      {
        "tag": "butterfly",
        "label": "Butterfly",
        "kind": "position"
      },
      {
        "tag": "dlr",
        "label": "De La Riva",
        "kind": "position"
      },
      {
        "tag": "rdlr",
        "label": "Reverse De La Riva",
        "kind": "position"
      },
      {
        "tag": "x-guard",
        "label": "X-guard",
        "kind": "position"
      },
      {
        "tag": "single-leg-x",
        "label": "Single-leg X",
        "kind": "position"
      },
      {
        "tag": "collar-sleeve",
        "label": "Collar sleeve",
        "kind": "position"
      },
      {
        "tag": "half-butterfly",
        "label": "Half butterfly",
        "kind": "position"
      },
      {
        "tag": "50-50",
        "label": "50/50",
        "kind": "position"
      },
      {
        "tag": "guard-retention",
        "label": "Guard retention",
        "kind": "position"
      }
    ]
  },
  {
    "key": "passing",
    "label": "Passing & top control",
    "blurb": "Getting past the legs and holding top.",
    "entries": [
      {
        "tag": "passing",
        "label": "Guard passing",
        "kind": "position"
      },
      {
        "tag": "pressure-passing",
        "label": "Pressure passing",
        "kind": "position"
      },
      {
        "tag": "stack-pass",
        "label": "Stack pass",
        "kind": "position"
      },
      {
        "tag": "leg-drag",
        "label": "Leg drag",
        "kind": "position"
      },
      {
        "tag": "side-control",
        "label": "Side control",
        "kind": "position"
      },
      {
        "tag": "mount",
        "label": "Mount",
        "kind": "position"
      },
      {
        "tag": "knee-on-belly",
        "label": "Knee on belly",
        "kind": "position"
      },
      {
        "tag": "back-control",
        "label": "Back control",
        "kind": "position"
      },
      {
        "tag": "back-take",
        "label": "Back takes",
        "kind": "position"
      },
      {
        "tag": "turtle",
        "label": "Turtle",
        "kind": "position"
      }
    ]
  },
  {
    "key": "standing",
    "label": "Takedowns & standing",
    "blurb": "Getting the fight to the ground.",
    "entries": [
      {
        "tag": "takedown",
        "label": "Takedowns",
        "kind": "position"
      },
      {
        "tag": "wrestling",
        "label": "Wrestling",
        "kind": "position"
      },
      {
        "tag": "judo",
        "label": "Judo & throws",
        "kind": "position"
      },
      {
        "tag": "standing",
        "label": "Standing",
        "kind": "position"
      },
      {
        "tag": "front-headlock",
        "label": "Front headlock",
        "kind": "position"
      }
    ]
  },
  {
    "key": "submissions",
    "label": "Submissions",
    "blurb": "Finishing the fight.",
    "entries": [
      {
        "tag": "armbar",
        "label": "Armbar",
        "kind": "submission"
      },
      {
        "tag": "chokes",
        "label": "Chokes",
        "kind": "submission"
      },
      {
        "tag": "triangle",
        "label": "Triangle",
        "kind": "submission"
      },
      {
        "tag": "kimura",
        "label": "Kimura",
        "kind": "submission"
      },
      {
        "tag": "leglocks",
        "label": "Leg locks",
        "kind": "submission"
      },
      {
        "tag": "omoplata",
        "label": "Omoplata",
        "kind": "submission"
      },
      {
        "tag": "wrist-lock",
        "label": "Wrist locks",
        "kind": "submission"
      }
    ]
  },
  {
    "key": "scrambles",
    "label": "Sweeps & scrambles",
    "blurb": "Reversing position and winning the scramble.",
    "entries": [
      {
        "tag": "sweep",
        "label": "Sweeps",
        "kind": "position"
      },
      {
        "tag": "berimbolo",
        "label": "Berimbolo",
        "kind": "position"
      },
      {
        "tag": "crab-ride",
        "label": "Crab ride",
        "kind": "position"
      }
    ]
  }
];

export const KB_TAG_ALIASES: Record<string, string> = {
  "de-la-riva": "dlr",
  "de-la-riva-guard": "dlr",
  "dlr-guard": "dlr",
  "reverse-de-la-riva": "rdlr",
  "reverse-dlr": "rdlr",
  "rdlr-guard": "rdlr",
  "single-leg-x-guard": "single-leg-x",
  "slx": "single-leg-x",
  "x-guard-guard": "x-guard",
  "guard-passing": "passing",
  "passing-guard": "passing",
  "pass": "passing",
  "pressure-pass": "pressure-passing",
  "stack": "stack-pass",
  "stack-passing": "stack-pass",
  "back-takes": "back-take",
  "take-the-back": "back-take",
  "taking-the-back": "back-take",
  "rear-mount": "back-control",
  "back-mount": "back-control",
  "cross-side": "side-control",
  "cross-body": "side-control",
  "side-mount": "side-control",
  "knee-on-stomach": "knee-on-belly",
  "knee-in-belly": "knee-on-belly",
  "half-guard-bottom": "half-guard",
  "half-guard-top": "half-guard",
  "open-guard-bottom": "open-guard",
  "fifty-fifty": "50-50",
  "triangle-choke": "triangle",
  "triangle-from-guard": "triangle",
  "heel-hook": "leglocks",
  "inside-heel-hook": "leglocks",
  "outside-heel-hook": "leglocks",
  "kneebar": "leglocks",
  "knee-bar": "leglocks",
  "toe-hold": "leglocks",
  "ankle-lock": "leglocks",
  "straight-ankle-lock": "leglocks",
  "leg-lock": "leglocks",
  "leg-locks": "leglocks",
  "leglock": "leglocks",
  "takedowns": "takedown",
  "judo-throw": "judo",
  "judo-throws": "judo"
};
