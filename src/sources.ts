// Generated from the Grapple Flows tool pages (src/data/*Seo.ts) by
// scripts/sync-from-app.mjs. Do not edit by hand.

export type Source = { label: string; href: string };
export type SourceSet = { checked: string; sources: Source[] };

/** Where each dataset comes from and when it was last checked against it. */
export const SOURCES: {
  weightClasses: SourceSet;
  legalTechniques: SourceSet;
  beltRequirements: SourceSet;
} = {
  "weightClasses": {
    "checked": "September 2026",
    "sources": [
      {
        "label": "IBJJF event weight charts (2026 events)",
        "href": "https://ibjjf.com/events"
      },
      {
        "label": "IBJJF Rules Book v6.1 (June 2024)",
        "href": "https://ibjjf.com/books-videos"
      },
      {
        "label": "ADCC rules and weight classes (April 2026)",
        "href": "https://adcc-official.com/pages/adcc-rules"
      }
    ]
  },
  "legalTechniques": {
    "checked": "September 2026",
    "sources": [
      {
        "label": "IBJJF Rules Book v6.1 (June 2024)",
        "href": "https://ibjjf.com/books-videos"
      },
      {
        "label": "ADCC rules and Opens legal techniques grid (2026)",
        "href": "https://adcc-official.com/pages/adcc-rules"
      },
      {
        "label": "NAGA rules (2023, updated July 2024)",
        "href": "https://www.nagafighter.com/rules/"
      },
      {
        "label": "Grappling Industries rulebook (February 2026)",
        "href": "https://grapplingindustries.com/rules/"
      }
    ]
  },
  "beltRequirements": {
    "checked": "September 2026",
    "sources": [
      {
        "label": "IBJJF General System of Graduation, June 2026 (v3.3)",
        "href": "https://ibjjf.com/graduation-system"
      }
    ]
  }
};
