/**
 * The audit's source of truth: the four official criteria, their weights and
 * the statements used to score them.
 *
 * The weights come from the published formula:
 *   Final Score = (4·C1 + 3·C2 + 2·C3 + 1·C4) / 10
 *
 * Each criterion has four statements worth 25 points each, so a criterion
 * scores 0–100 and the weighted total also lands on a 0–100 scale.
 *
 * @typedef {object} Criterion
 * @property {string} id        Short id used as the storage key.
 * @property {string} code      Official code shown in the UI (C1…C4).
 * @property {number} weight    Multiplier in the official formula.
 * @property {string} name      Official criterion name.
 * @property {string} blurb     One line explaining what the committee looks at.
 * @property {{id: string, label: string, hint: string}[]} statements
 */

/** @type {Criterion[]} */
export const criteria = [
  {
    id: "idea",
    code: "C1",
    weight: 4,
    name: "The Idea",
    blurb:
      "Value proposition, edge and originality. What weighs most in the score.",
    statements: [
      {
        id: "c1-problem",
        label:
          "The problem is stated in one sentence, for one identifiable person",
        hint: "“Freelancers who invoice abroad lose an afternoon a month to reconcile” beats “finance is hard”.",
      },
      {
        id: "c1-edge",
        label: "I can name the alternatives and say what this does differently",
        hint: "Two or three real competitors, and the specific thing you do that they do not.",
      },
      {
        id: "c1-original",
        label: "The core idea is not a reskin of a well-known product",
        hint: "If it is a known product, the originality has to live somewhere — say where.",
      },
      {
        id: "c1-value",
        label:
          "There is a concrete outcome a user gets in the first five minutes",
        hint: "Something they can see finished, not a promise of future value.",
      },
    ],
  },
  {
    id: "clarity",
    code: "C2",
    weight: 3,
    name: "Clarity",
    blurb:
      "Whether the idea, its value and its edge came across. A good idea explained badly is scored as it was explained.",
    statements: [
      {
        id: "c2-first-screen",
        label: "The first screen says what it is and what to do next",
        hint: "No scrolling required to understand the product.",
      },
      {
        id: "c2-vocabulary",
        label: "No internal jargon, no invented names, no acronyms to decode",
        hint: "Write for a reviewer who arrived 30 seconds ago.",
      },
      {
        id: "c2-description",
        label:
          "The project description covers idea, audience and how to test it",
        hint: "This is the text the committee reads next to the demo.",
      },
      {
        id: "c2-labels",
        label:
          "Every button and field label says exactly what happens when used",
        hint: "“Send invoice”, not “Submit” — the reviewer never has to guess.",
      },
    ],
  },
  {
    id: "works",
    code: "C3",
    weight: 2,
    name: "How It Works",
    blurb:
      "Whether what you promised actually works, with attention to UI/UX, smoothness and usability.",
    statements: [
      {
        id: "c3-happy-path",
        label: "The main flow works end to end on a fresh browser, no setup",
        hint: "Test in a private window with empty storage before every submission.",
      },
      {
        id: "c3-states",
        label: "Empty, loading and error states all exist and look deliberate",
        hint: "An empty screen with no message reads as a broken screen.",
      },
      {
        id: "c3-responsive",
        label: "It is usable on a phone, and the layout holds at 320px",
        hint: "The committee reviews on whatever device is at hand.",
      },
      {
        id: "c3-credentials",
        label:
          "If there is a login, a working test account is written in the access fields",
        hint: "Private field, seen only by the committee. Missing it costs score.",
      },
    ],
  },
  {
    id: "polish",
    code: "C4",
    weight: 1,
    name: "Polish",
    blurb:
      "Bugs, instability, accessibility and security problems. The fewer the issues, the higher the score.",
    statements: [
      {
        id: "c4-console",
        label: "The browser console is clean on every page",
        hint: "Silence it, even for warnings you consider harmless.",
      },
      {
        id: "c4-keyboard",
        label: "Everything is reachable and operable with the keyboard alone",
        hint: "Tab through it with the mouse on the floor. Focus must always be visible.",
      },
      {
        id: "c4-contrast",
        label: "Text passes contrast checks in both light and dark themes",
        hint: "4.5:1 for body text; anything below is a scored accessibility problem.",
      },
      {
        id: "c4-no-secrets",
        label: "No keys, tokens or personal data are shipped to the client",
        hint: "Search the built files for “key”, “secret” and “token” before pushing.",
      },
    ],
  },
];

/** Verdict bands, from best to worst. */
export const bands = [
  {
    min: 90,
    label: "Podium-ready",
    message:
      "Everything the committee looks for is in place. Spend the rest of the time on the idea, not the code.",
  },
  {
    min: 70,
    label: "Strong",
    message:
      "Solid entry. The unchecked items are the cheapest points still on the table.",
  },
  {
    min: 45,
    label: "Getting there",
    message:
      "The shape is right. Clear the clarity and reliability items before adding features.",
  },
  {
    min: 0,
    label: "Early",
    message:
      "Plenty of score is still unclaimed — start with the items about the idea and the first screen.",
  },
];

/** localStorage key. Bump the suffix if the statements ever change. */
export const STORAGE_KEY = "ioovc-entry-audit-v1";
