/**
 * Everything about *you* lives here. Edit this file and the page updates —
 * no other file needs to change for a rename, a new URL or a different
 * category.
 *
 * @typedef {"open" | "university"} Category
 */

/** @type {{projectName: string, tagline: string, summary: string, author: string, category: Category, repoUrl: string, version: string, deadlines: {registration: string, submission: string, results: string, payment: string}}} */
export const site = {
  projectName: "Project Name",
  tagline: "One sentence about what this project does.",
  summary:
    "Two or three sentences on the problem, who it is for and why it is worth a committee's time. This is criterion C1 — the highest weight in the score — so write it before you write code.",
  author: "Your name",
  category: "open",

  repoUrl: "https://github.com/Fjgiofjg/IOOVC",
  version: "v1.0.0",

  /** Brasília time (UTC-03:00) is the official timezone of the olympiad. */
  deadlines: {
    registration: "2026-10-31T23:59:59-03:00",
    submission: "2026-11-01T23:59:59-03:00",
    results: "2026-12-25T00:00:00-03:00",
    payment: "2027-01-25T23:59:59-03:00",
  },
};

/** Labels derived from the category, so they can never drift apart. */
export const categoryLabels = {
  open: { label: "Open category", fee: "$60", firstPrize: "up to $50,000" },
  university: {
    label: "University category",
    fee: "$30",
    firstPrize: "up to $25,000",
  },
};
