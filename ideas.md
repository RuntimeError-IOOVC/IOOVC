# Idea Bank — Choosing an IOOVC Entry That Scores

A bank of project ideas shaped by the published criteria, plus the filter I use
to tell a strong entry from a weak one.

**Read the scoring before the ideas.** The committee weighs the score as
`(4·C1 + 3·C2 + 2·C3 + 1·C4) / 10`: **C1 The Idea** (value proposition, edge,
originality) carries 4 of the 10 weight points, **C2 Clarity** carries 3,
**C3 How It Works** carries 2, and **C4 Polish** carries 1. Idea and clarity
together are 7 of the 10 points. Four people read, sign in to and test every
project by hand, one by one, after November 1 — so an idea explained badly is
scored as it was explained, and an idea that needs a signup or an approval
before the committee can even open it loses ground before they read a word.

## The Six-Question Filter

Before you commit to an idea, run it through these six questions. If it fails
two or more, keep looking.

1. Can you say what it does in one sentence a stranger understands in ten
   seconds, with no jargon?
2. Who is it for — a specific person or job, not "everyone" or "developers"?
3. What is the edge over the obvious no-code or off-the-shelf alternative?
4. Can you demo the core loop end to end in under five minutes with the test
   credentials you put in the description?
5. Does it depend on signup flows, backend infrastructure you do not control,
   or a third party's approval to work by November 1? No-signup, local-first
   projects have a structural advantage here: less to break, less to explain,
   and less surface area for C3 and C4 to fail on.
6. If a judge is mildly tired and has already opened forty other projects
   today, does yours still make sense on a re-read of the description alone?

## Twelve Ideas

Each idea has a one-line **C1 pitch** (what you would actually write in the
submission), its **edge**, a **five-minute demo** path, the **hard part** of
the build, and the **risk to watch**.

### Developer tools

**1. Diff Explainer** — turns any pasted git diff into a one-paragraph
changelog entry and three risk flags for reviewers.
- Edge: no repo connection, OAuth or signup — paste and go, fully client-side.
- Demo: paste the sample diff on the homepage, read the changelog, toggle risk
  sensitivity, check the mobile view.
- Hard part: risk-flag heuristics that catch something real instead of always
  saying "looks fine."
- Risk: a judge pastes an adversarial or huge diff and it chokes or stalls.

**2. Prompt Diff** — compares two prompt variants and predicts where their
outputs are likely to diverge, using sample completions instead of a live key.
- Edge: works with no API key, so a judge with no account can still test it.
- Demo: load a preset pair of prompts, read the divergence report.
- Hard part: making the divergence heuristic feel earned, not cosmetic.
- Risk: without a live model call it can read as a toy rather than a tool.

**3. Local API Mocker** — pastes an OpenAPI spec and spins up a working mock
REST API entirely in the browser, no server.
- Edge: nothing to deploy, nothing to sign into, works offline.
- Demo: paste a small spec, call the generated endpoints from the built-in
  console.
- Hard part: parsing real-world specs that do not perfectly follow the schema.
- Risk: a large or malformed spec breaks the parser mid-demo.

### Consumers

**4. Receipt Splitter** — photograph a shared receipt, OCR it, and split the
bill by item with tax and tip pro-rated automatically.
- Edge: no group accounts, no invite links — one photo, one shareable result.
- Demo: upload the sample receipt image, watch the itemized split appear.
- Hard part: OCR accuracy on crumpled or low-light receipts.
- Risk: receipts in scripts the OCR model was not tuned for.

**5. Packing Weight Checker** — builds a packing list against an airline's
baggage rules and flags overweight bags before you leave home.
- Edge: fully offline, no login, works from a static rules table you own.
- Demo: pick an airline, add items, watch the weight bar turn red.
- Hard part: keeping the baggage-rules dataset accurate across carriers.
- Risk: without a strong hook it can read as a spreadsheet, not a product.

**6. Study Sprint Planner** — turns an uploaded syllabus PDF into a
day-by-day revision calendar, exportable as an .ics file.
- Edge: one upload, one export, no account needed to use the result.
- Demo: upload the sample syllabus, generate and download the calendar.
- Hard part: parsing syllabus PDFs that are not structured consistently.
- Risk: the calendar export alone can feel thin without a second feature.

### Professional niches

**7. Contract Redline Summarizer** — paste a contract and get a
plain-language summary of the clauses that differ from a standard template.
- Edge: no document upload to a third party, everything stays in the browser.
- Demo: paste the sample contract, read the flagged clause list.
- Hard part: clause matching that is useful without being legal advice.
- Risk: needs a visible disclaimer or it invites the wrong expectations.

**8. Flight Delay Compensation Checker** — enter a flight number and date,
get an instant compensation estimate under the applicable rule set.
- Edge: instant answer, no account, no waiting on an airline's own portal.
- Demo: enter the sample flight, see the estimate and the rule it cites.
- Hard part: keeping the jurisdiction rules correct and current.
- Risk: depends on a flight-status data source staying reliable during judging.

**9. Lesson Plan Differentiator** — paste one lesson plan, get three versions
leveled for different reading ages.
- Edge: one input, three ready-to-use outputs, no template library to set up.
- Demo: paste the sample plan, compare the three leveled versions side by side.
- Hard part: leveling that changes vocabulary and pacing, not just word count.
- Risk: can look like generic text rewriting if the leveling logic is shallow.

### Civic data

**10. Transit Reliability Tracker** — turns a city's published on-time
performance data into a simple public scorecard.
- Edge: static data snapshot shipped with the project, no login, no backend.
- Demo: pick a line, see its on-time score and trend for the sample period.
- Hard part: cleaning a real public dataset that was not built to be tidy.
- Risk: the data goes stale and needs a visible "as of" date to stay honest.

**11. Local Budget Explainer** — turns a municipal budget PDF into a
searchable, plain-language breakdown of where the money goes.
- Edge: search-first interface, no dashboard login, works from one PDF.
- Demo: search "education" in the sample budget, see the plain-language line.
- Hard part: extracting tables reliably from budget PDFs with inconsistent
  formatting.
- Risk: can read as "just a dashboard" unless the plain-language layer is the
  visible star of the demo.

**12. FOI Request Drafter** — answer a few questions about what you want to
know, get a correctly formatted freedom-of-information request letter for
your jurisdiction.
- Edge: no legal template shopping, one guided flow to a usable letter.
- Demo: answer the sample questions, copy the generated letter.
- Hard part: jurisdiction-specific templates that are actually correct.
- Risk: can feel like a form generator unless the jurisdiction logic is the
  pitch, not an afterthought.

## Three Wildcards

- **Vibe Coding Session Replay** — record your own agentic coding session
  (prompts and diffs) and auto-generate a highlight reel of the idea
  evolving. Plays directly to the competition's own theme, which cuts both
  ways: memorable if it lands, forgettable if it is just a screen recording
  with captions.
- **Judge Simulator** — feed a project description into a tool that
  role-plays the four IOOVC criteria and returns a mock score before you
  submit. On-the-nose enough to catch attention, risky enough that it needs
  a genuinely useful scoring rationale, not a random number.
- **No-Signup Language Buddy** — a fully offline, local-model-powered
  conversation partner for practicing one specific language skill. One clear
  use case, no accounts, and a natural fit if you already work with local
  language models.

## The Graveyard — Ideas That Lose Points

- Another generic to-do list or habit tracker: no edge, C1 near zero before
  the judge even opens it.
- A wrapper around a chat model with a nicer interface and nothing else: the
  committee has already seen dozens of these.
- Anything that makes the judge create an account, verify an email, or wait
  for approval before they can see the product: this damages C3 before the
  idea is even visible.
- A dashboard full of charts with no clear "for whom": impressive to look at,
  unclear who would actually use it.
- A project that only works with your own personal data or API keys the
  judges do not have: it breaks the requirement to hand over working test
  credentials.

## From Idea to a One-Line C1 Pitch — Template

Template: **[action] + [specific input] → [specific output], in [time or
steps], with [the no-signup / local-first edge].**

- Weak: "An app that helps you manage your schedule."
  Strong: "Turn a messy syllabus PDF into a day-by-day revision calendar you
  can export to any calendar app — no login."
- Weak: "A tool for splitting bills."
  Strong: "Photograph one receipt and get an itemized split with tax and tip
  already pro-rated per person — no group signup."
- Weak: "A dashboard for city data."
  Strong: "Search one word and get the plain-language line item behind it in
  your city's budget — no account, no waiting."

## Worked Example — A Finished Entry

**Project:** Diff Explainer

**Submission description** (English interface, test credentials included as
required): "Diff Explainer turns any git diff into a one-paragraph changelog
and three risk flags for code reviewers. No login: paste a diff, get results
in under five seconds. Test: paste the sample diff shown on the homepage —
no credentials needed, everything runs client-side."

**Screens:** (1) the paste box on the homepage, (2) the generated changelog
with the three risk flags, (3) a settings panel for risk sensitivity.

**Judge script** — what happens in the committee's five minutes: open the
page, paste the sample diff, read the generated changelog, toggle risk
sensitivity and watch the flags update, check the layout on a narrow window,
done.

**Honest self-score:**

| Criterion | Weight | Score | Note |
|---|---|---|---|
| C1 The Idea | ×4 | 78/100 | A real, specific edge; not groundbreaking. |
| C2 Clarity | ×3 | 90/100 | One clear sentence; screenshots match the pitch. |
| C3 How It Works | ×2 | 85/100 | Works on first try; minor lag on huge diffs. |
| C4 Polish | ×1 | 70/100 | No accessibility pass done yet. |

Weighted total: `(4×78 + 3×90 + 2×85 + 1×70) / 10 = 82.2/100`.