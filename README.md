# IOOVC 2026 — entry starter kit

A zero-dependency starting point for a project entered in the
[International Olympics of Vibe Coding 2026](https://ioovc.org), with the
olympiad's own judging formula built into the page as a working feature.

Plain **HTML, CSS and JavaScript** — no build step, no package manager, no
framework. Clone it, rename it, ship it to any static host.

[![No dependencies](https://img.shields.io/badge/dependencies-0-2f6b46)](#)
[![Static site](https://img.shields.io/badge/build%20step-none-a9781f)](#)
[![Deadline](https://img.shields.io/badge/project%20due-Nov%201%2C%202026-a5372b)](#the-rules-in-one-screen)

---

## Choosing what to build

See **[docs/ideas.md](docs/ideas.md)** for twelve entry ideas written against
the criteria, the six-question filter, the graveyard of ideas that lose points,
a template for turning any idea into a one-line C1 pitch, and a worked example
of a finished entry described end to end.

## Quick start

ES modules are blocked on `file://` by CORS, so use any static server. There is
no install step and there is nothing to compile.

```bash
# pick whichever you already have
python3 -m http.server 4173
npx --yes serve -l 4173 .
php -S localhost:4173
```

Then open <http://localhost:4173>. The page also degrades usefully if you just
double-click `index.html`: everything except the interactive JavaScript works.

## What is in here

```
index.html                 the page: hero, idea, audit, rules, checklist, timeline
styles/tokens.css          colour, type, spacing and radius tokens
styles/app.css             layout and components
scripts/site.config.js     ← your name, tagline, summary, links, category
scripts/checker.data.js    ← the 16 audit statements and the criterion weights
scripts/checklist.data.js  ← the 12 submission checks
scripts/checker.js         the readiness audit (scoring, meters, Markdown export)
scripts/app.js             theme, navigation, countdown, checklist memory
scripts/ui.js              shared helpers: toast, clipboard, safe storage
tests/formula.test.mjs     guards the weights and the scoring maths (node --test)
data/ioovc-2026.json       official facts as reference data for your own tooling
assets/favicon.svg         laurel star
docs/ideas.md              twelve entry ideas and the filter for choosing one
```

### Make it yours

1. **`scripts/site.config.js`** — project name, tagline, summary, author,
   category (`open` or `university`) and your repository URL. Every one of
   those appears in the page and in the `<title>`/Open Graph tags.
2. **The hero** — the tagline is scored under C1, so write it before the code.
3. **The audit** — open `scripts/checker.data.js` and reword the statements if
   your project is judged on something else. The weights stay as they are:
   they come from the official formula.
4. **`styles/tokens.css`** — re-skin the whole page from one file. Both light
   and dark themes are defined there, and the page follows the system
   preference until the visitor chooses one.
5. **Delete what you do not need.** The checklist section, the timeline or the
   audit can be removed from `index.html` without touching anything else.

## The readiness audit

A working feature, not a mock-up. Tick what is true about your project and it
scores itself with the committee's published weights:

```
Final score = ( 4·C1 + 3·C2 + 2·C3 + 1·C4 ) / 10
```

| Code | Criterion    | Weight | What the committee looks at                                        |
| ---- | ------------ | :----: | ------------------------------------------------------------------ |
| C1   | The Idea     |   ×4   | Value proposition, edge and originality — what weighs most         |
| C2   | Clarity      |   ×3   | Whether the idea, its value and its edge came across               |
| C3   | How It Works |   ×2   | Whether what you promised actually works, plus UI/UX and usability |
| C4   | Polish       |   ×1   | Bugs, instability, accessibility and security problems             |

Each criterion holds four statements worth 25 points each, so every criterion
scores 0–100 and the weighted total lands on 0–100 as well. Ticks are stored in
`localStorage`; **Copy Markdown** writes a summary you can paste straight into a
project description.

## Tests

The scoring maths is worth protecting, so it has tests — twelve of them, with
no dependencies and no DOM required:

```bash
node --test
```

They check the official weights against `data/ioovc-2026.json`, that each
criterion is worth 25 points per statement, and that the Markdown export agrees
with the score on screen. Edit the audit statements freely: if the weights
drift, the tests say so.

## The rules in one screen

Registration closes **October 31, 2026**; the project is due **November 1,
2026** (Brasília time). Winners are announced **December 25, 2026** and prizes
are paid by **January 25, 2027**.

|             | Open             | University                                    |
| ----------- | ---------------- | --------------------------------------------- |
| Fee         | $60              | $30                                           |
| First place | up to $50,000    | up to $25,000                                 |
| Who         | anyone, anywhere | enrolled students, proof required for judging |

Six conditions apply to every entry, and the audit statements are written to
catch exactly these:

1. The interface works in **English** (other languages may ship alongside it).
2. If there is a login, a working **test username and password** go in the
   dashboard's access fields — private, seen only by the committee.
3. The platform itself signs in with a **one-time code by email**; sessions last
   seven days.
4. Registering means accepting the **Official Rules and Privacy Policy**
   (GDPR/LGPD) and declaring you are 18 or over.
5. **University** entries need valid proof of enrollment to be judged — without
   it, no score and no refund.
6. **One registration per project**, solo or in a group of any size, new or
   started earlier. The same project can also enter the Brazilian edition,
   [OBVC](https://obvc.com.br), with a Portuguese interface.

> Verify the dates, fees, tiers and criteria against
> [ioovc.org](https://ioovc.org) before submitting — this repository is a
> starting point, not the official rulebook.

## Deploy it

Any static host will do. Nothing here needs a server runtime.

- **GitHub Pages** — push to `main`, then _Settings → Pages → Build and
  deployment → Deploy from a branch → `main` / `/ (root)`_. The site appears at
  `https://<user>.github.io/IOOVC/`.
- **Cloudflare Pages / Netlify** — connect the repository, leave the build
  command empty and set the output directory to `/`.
- **Vercel** — import the repository as a static project; no framework preset.

Confirm the deployed URL opens **without a build step and without a login**:
that is the first thing a reviewer checks.

## Accessibility and quality notes

The starter already handles the things C4 scores: labelled controls, a skip
link, visible focus rings, `aria-live` regions for status messages, a sticky
header that respects `scroll-padding`, layout that holds at 320px, and a
`prefers-reduced-motion` path that disables every transition. Both themes are
checked for contrast. Keep it that way as you build.

## License

MIT — see [LICENSE](LICENSE). Use it for your entry, fork it, strip it for
parts. The olympiad's name, prizes and dates belong to the IOOVC organisers.
