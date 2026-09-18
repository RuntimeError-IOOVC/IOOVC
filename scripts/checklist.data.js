/**
 * The submission checklist. Each item is something a reviewer can verify in
 * ten minutes. Storage keys are stable: renaming an id loses that tick, which
 * is a fair trade for keeping the wording honest.
 *
 * @typedef {object} ChecklistItem
 * @property {string} id
 * @property {string} label
 * @property {string} hint
 */

/** @type {ChecklistItem[]} */
export const checklist = [
  {
    id: "chk-english",
    label: "The whole interface is in English",
    hint: "Every screen, message, error and empty state — not just the landing page.",
  },
  {
    id: "chk-reachable",
    label: "The deployed URL opens without a build step and without login",
    hint: "A reviewer should never have to clone, install or sign in to see the product.",
  },
  {
    id: "chk-credentials",
    label:
      "Test credentials are in the dashboard's access fields, if the app has a login",
    hint: "They stay private and are seen only by the committee. Missing them costs score.",
  },
  {
    id: "chk-fresh-browser",
    label: "The whole flow was tested in a private window with empty storage",
    hint: "Empty state, first run, and a second run — three different experiences.",
  },
  {
    id: "chk-mobile",
    label: "It was checked on a narrow screen, at 320px and up",
    hint: "No horizontal scrollbars, no overlapping controls, no unreadable tables.",
  },
  {
    id: "chk-keyboard",
    label: "Every control is reachable by keyboard with a visible focus ring",
    hint: "Tab, Enter, Escape and Space, in both light and dark themes.",
  },
  {
    id: "chk-contrast",
    label: "Body text passes a 4.5:1 contrast check",
    hint: "Accessibility problems are scored under C4 — Polish.",
  },
  {
    id: "chk-console",
    label: "The console is clean on every route and on reload",
    hint: "Errors and warnings both count against the impression of stability.",
  },
  {
    id: "chk-failure",
    label: "There is a deliberate error state and an empty state",
    hint: "Show what happens when data is missing or the network fails.",
  },
  {
    id: "chk-secrets",
    label: "No keys, tokens or personal data ship in the client bundle",
    hint: "Anything in a static file is public. Move secrets server-side or remove them.",
  },
  {
    id: "chk-description",
    label:
      "The project description says what it is, for whom, and how to test it",
    hint: "Idea, audience, demo path, and everyone in the team listed.",
  },
  {
    id: "chk-submitted",
    label: "The final form is submitted before November 1, 2026",
    hint: "Registration closes October 31; the project is due the next day, Brasília time.",
  },
];

/** localStorage key for the checklist ticks. */
export const CHECKLIST_KEY = "ioovc-entry-checklist-v1";
