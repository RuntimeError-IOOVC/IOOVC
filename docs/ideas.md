# Entry ideas for IOOVC 2026

A bank of project ideas shaped by the published criteria, plus the filter I use
to tell a strong entry from a weak one.

**Read the scoring before the ideas.** The committee's own words: _"the idea and
clarity add up to 7 of the 10 weight points"_ and _"a good idea explained badly
is scored as it was explained."_ Four people read, sign in to and test every
project by hand, one by one, after November 1. So:

- **C1 — The Idea (×4):** value proposition, edge, originality.
- **C2 — Clarity (×3):** whether all of that came across, to a stranger, fast.
- **C3 — How It Works (×2):** it does what the description promised, on the
  judge's machine, in English.
- **C4 — Polish (×1):** no bugs, no console errors, no accessibility or
  security holes.

This is the first edition — there are no past winners to reverse-engineer, and
the past-editions gallery gets filled by this edition's winners. Everything
below is designed against the criteria, not copied from anyone.

## The filter

An idea has to pass all six. If it fails one, it is not an entry — it is a
hobby project, which is fine, just not this.

1. **Can a stranger understand the value in the first screen, with no
   explanation from you?** C2 is worth ×3 and you will not be in the room.
2. **Is there a specific person with a painful, recurring job?** "Anyone who…"
   scores like "anyone".
3. **Does it do something a spreadsheet or a chatbot cannot already do?** If
   the honest answer is "it wraps an LLM call in a nice UI", C1 collapses.
4. **Does it produce an artifact?** A PDF, a CSV, a diff, a patch, a letter, a
   price. Artifacts are memorable; dashboards blur together.
5. **Does it work cold, with no data, no signup and no setup?** Four judges
   will open it with empty storage, possibly on a phone.
6. **Can you build and polish it before November 1?** C3 and C4 punish
   ambition that arrives unfinished.

**Structural advantage worth knowing:** ideas that need no account, no server
and no dataset are easier to demo and impossible to break in front of a judge.
Local-first ideas get a legible edge for free — _"nothing leaves your device"_
is a claim a judge can verify, and a sentence you can put on the first screen.

## The bank

|  #  | Idea                   | For                   | The edge, compressed                                | Effort    |
| :-: | ---------------------- | --------------------- | --------------------------------------------------- | --------- |
|  1  | **Repro**              | developers            | turns a bug report into a failing test              | 2–3 weeks |
|  2  | **Fixed, not flagged** | developers            | a URL in, an accessibility patch out                | ≈1 week   |
|  3  | **Shipcheck**          | IOOVC entrants        | audits a deployed app the way C3/C4 will            | ≈1 week   |
|  4  | **Deposit Defender**   | renters               | photo evidence → a defensible claim                 | ≈1 week   |
|  5  | **Scam Screen**        | everyone              | cites the exact sentences that give a scam away     | Weekend   |
|  6  | **Shoebox**            | freelancers, families | receipt OCR that never uploads anything             | ≈1 week   |
|  7  | **Clause Cost**        | anyone signing        | puts a dollar figure on the clauses that cost money | ≈1 week   |
|  8  | **Chaser**             | freelancers           | reminds, escalates and calculates legal interest    | ≈1 week   |
|  9  | **Plain Form**         | immigrants, carers    | dense official forms → what to bring                | ≈1 week   |
| 10  | **Wrong Answers Only** | students              | builds the next test from your own mistakes         | 2 weeks   |
| 11  | **Decision Log**       | anyone in meetings    | decisions with the sentence that produced them      | 2 weeks   |
| 12  | **City, Changed**      | residents             | open data, filtered to your street                  | ≈1 week   |

---

### 1 · Repro — a bug report becomes a failing test

**Pitch:** Paste a user's bug report and your repo; get a test that fails on the
bug, plus the smallest reproduction.
**Who / problem:** maintainers of small open-source projects triage vague
reports for hours.
**The edge:** every AI coding tool writes _fixes_. Fixes are unverifiable. A
failing test is a fact — it either reproduces or it doesn't. The output is a
checkable claim, which is exactly what a judge can evaluate in one click.
**Demo:** paste a real GitHub issue with a screenshot, run, watch a test file
appear and go red, then green with the suggested patch.
**Build:** the hard part is executing untrusted code safely — sandbox it, and
scope down to one language and one test runner.
**Watch out:** if the demo needs a paid API key on the judge's machine, it is
dead on arrival. Ship a recorded fallback or a free tier with a hard budget.

### 2 · Fixed, not flagged — an accessibility patch, not another report

**Pitch:** Give it a URL; get back the patch that fixes the accessibility
problems it found.
**Who / problem:** thousands of teams run an audit, read "312 issues", and fix
none of them.
**The edge:** every existing tool stops at detection. Remediation is the
valuable half and nobody automates it. Output a diff a developer can paste.
**Demo:** enter a URL, watch issues turn into a code diff, with the exact
before/after contrast ratio for each colour change.
**Build:** do four or five fix classes extremely well — missing labels, contrast,
heading order, focus traps — rather than all of WCAG adequately.
**Watch out:** never present an unattempted issue as fixed. "17 fixed · 9 need
a human" reads as competence; a silent gap reads as a bug.

### 3 · Shipcheck — the pre-submission audit

**Pitch:** Point it at your deployed app before submitting; it checks what the
IOOVC committee is about to check.
**Who / problem:** entrants who cannot tell whether their own project is about
to lose points on C3 and C4.
**The edge:** it is the only tool that scores _this_ competition's rules — the
English-interface requirement, missing test credentials, console noise, missing
error states, contrast. And the meta-joke lands: a project that audits entries
is judged by the same rubric it enforces.
**Demo:** enter a URL, get a report card with a screenshot per finding and an
"export as Markdown for your description" button.
**Build:** crawling in-browser is impossible, so run a tiny Node service, or
scope to what a bookmarklet or a pasted HTML source can see.
**Watch out:** if it scores a judge's own site harshly and wrongly, that is worse
than not building it. Every finding must show the evidence.

### 4 · Deposit Defender — evidence that survives a landlord

**Pitch:** Photograph the flat on move-in; get a timestamped condition report,
and a claim letter if the deposit comes back short.
**Who / problem:** renters lose deposits because memories and phones are not
evidence, and tenancy law is unreadable at the moment you need it.
**The edge:** it is not photo storage. It produces the two artifacts that
actually win: a room-by-room report the landlord can be asked to sign, and a
dispute letter citing the specific rule for the user's jurisdiction.
**Demo:** three photos → a signed-looking report PDF in under two minutes.
**Build:** photos, EXIF time and location, a PDF generator, and template letters
per jurisdiction — start with one country done properly.
**Watch out:** legal advice is a liability. Frame output as "a template based on
the published rules of X", never as advice, and show the source clause.

### 5 · Scam Screen — the sentence that gives it away

**Pitch:** Paste a job offer, rental listing or marketplace message; see the
exact sentences that match known scam patterns.
**Who / problem:** the people most exposed — first-job seekers, newcomers,
students renting a flat remotely — are the least equipped to spot it.
**The edge:** not a verdict from a black box. It highlights phrases, names the
pattern, and gives the one question that would prove it either way.
**Demo:** paste a too-good-to-be-true remote job; watch five sentences light up
with the pattern names; see the follow-up question it writes.
**Build:** a real pattern library is the whole product. Start with 30 patterns
you can defend, and use a model to explain, never to decide alone.
**Watch out:** false positives tell a scared user to abandon a legitimate offer.
Show confidence and always show the evidence behind a flag.

### 6 · Shoebox — receipt to ledger, entirely offline

**Pitch:** Drop a shoebox of receipts; get a categorised ledger, with nothing
leaving the device.
**Who / problem:** freelancers and families reconciling expenses for taxes, and
nobody wants to upload bank-level data to a startup.
**The edge:** local-first is verifiable. Open the network tab during the demo and
it stays empty. Recognition runs in the browser (WASM OCR) — a claim the judge
can test by disconnecting the Wi-Fi.
**Demo:** drag 20 receipts, watch them parse in front of you, export CSV in the
accountant's column layout.
**Build:** WASM OCR plus a category mapper that learns from corrections. The
hard part is a clean correction UI, which is also what makes it feel real.
**Watch out:** OCR that is right 80% of the time feels broken. Make fixing an
extracted total take one keystroke and it stops mattering.

### 7 · Clause Cost — the price of the fine print

**Pitch:** Paste a contract; see a number next to every clause that costs you
money — with the redline that fixes it.
**Who / problem:** freelancers, small suppliers and tenants sign away real money
because a contract is 14 pages of calm prose.
**The edge:** not a summary. A figure — this late-payment clause costs you
$412 on your last invoice — attached to the highlighted sentence, plus suggested
replacement wording to paste back.
**Demo:** paste a real (anonymised) services agreement; watch the money clauses
reorder by cost; copy the redline.
**Build:** rule extraction plus arithmetic the user can check. Show the working:
"30 days late × 1.5% monthly = $412".
**Watch out:** never invent a number. If the clause is ambiguous, say so and show
the range and the reason.

### 8 · Chaser — the invoice that collects itself

**Pitch:** For freelancers: it writes the reminder ladder, escalates the tone,
and calculates the interest the client legally owes.
**Who / problem:** unpaid invoices are the most common way a freelancer's month
goes wrong, and chasing is emotionally exhausting, so people delay it.
**The edge:** the interest, not the email. Anyone can generate a polite nudge;
almost nobody computes what is actually owed under the client's jurisdiction,
and a number changes the tone of the whole exchange.
**Demo:** enter one overdue invoice; get the three-message ladder, each dated,
with the running total owed.
**Build:** the ladder, the calendar, the interest rules for two or three
jurisdictions, and a tone control the user can see and adjust.
**Watch out:** escalation that reads as aggressive gets your user a cancelled
contract. Default to firm-but-warm and let them dial it up.

### 9 · Plain Form — what to bring, in your language

**Pitch:** Photograph a dense official form; get a plain-language checklist of
what you need and what each question is really asking.
**Who / problem:** immigrants, carers and first-time applicants facing
immigration, insurance and school paperwork in a second language.
**The edge:** it never paraphrases a requirement without showing the original
line beside it. Side-by-side, source-anchored, with "bring this document"
translated and the official wording untouched. Trust built into the UI.
**Demo:** one photo of a real form → a checklist of documents, each linked to the
paragraph it came from, in two languages.
**Build:** OCR, layout-aware field extraction, plain-language rewriting with
mandatory source anchors, plus a glossary of the region's official terms.
**Watch out:** a missed requirement means someone is turned away at a counter.
Say "check the official instructions" on every screen, and link to them.

### 10 · Wrong Answers Only — the next test comes from your mistakes

**Pitch:** Upload your past papers; get new practice problems aimed exactly at
the misconceptions your wrong answers reveal.
**Who / problem:** students who revise by re-reading what they already know and
re-sitting the same test paper.
**The edge:** **self-verification.** A generated question is only shown after a
solver independently agrees with the answer — the app refuses to serve a
question it cannot solve. That single rule is the difference between a study
tool users trust and one they abandon after the first wrong answer.
**Demo:** upload a marked test; see the misconceptions it diagnosed; generate a
new problem; hit "verify" and watch the solver confirm it.
**Build:** a narrow subject (one school maths syllabus) done perfectly beats a
broad one done loosely. The verifier is the product; build it first.
**Watch out:** a confidently wrong problem destroys trust instantly and is
exactly the kind of bug C4 punishes.

### 11 · Decision Log — what we actually decided, and who said it

**Pitch:** Record a meeting; get a decision log where every decision links to
the sentence that produced it.
**Who / problem:** decisions evaporate, and so does accountability for them.
**The edge:** not another transcript summariser. It extracts _decisions_,
_owners_ and _deadlines_, links each to the audio timestamp, and flags every
topic where nobody was assigned anything — the gap that causes the next meeting.
**Demo:** play 30 seconds, watch the timeline fill, click a decision, hear the
sentence. Then show the "unassigned" list.
**Build:** transcription in the browser (WASM) keeps it private and offline;
speaker labels are the fiddly part.
**Watch out:** consent. Make recording obvious and one-click to stop, and say
plainly what is stored and where.

### 12 · City, Changed — your street, this month

**Pitch:** What changed near you: permits, road closures, licences, works —
from open data, filtered to your street.
**Who / problem:** decisions that affect your daily life are published in
datasets nobody reads.
**The edge:** relevance, not data. Everyone can show a map; the product is the
digest — three things near you, with the date and what it means for you.
**Demo:** set an address, get the digest, and watch a pin expand into the source
document it came from.
**Build:** one city opened properly, offline-cached, with a backlink to every
source record. Local knowledge is your edge here — use the data you can read.
**Watch out:** empty results are normal. An honest "nothing near you this month"
beats padding the list with distant noise.

---

## Three wildcards

- **Shift Handover** — messy notes from a nursing, care or restaurant shift
  become a structured handover that flags what must not be missed. Vertical,
  unglamorous, and the people doing the job have no tooling at all.
- **Heritage Walk** — point the phone at a building and get its story, assembled
  from open heritage records, with the source list shown. Gorgeous demo, strong
  local edge, and it composes well with idea 12.
- **The Honest Job Ad** — paste a bloated job description; get what the role
  actually is, the requirements that are red flags, and the three screening
  questions that would settle it.

## The graveyard

These lose points, whatever the execution quality:

- **Another to-do app, habit tracker or pomodoro timer.** C1 has nothing to
  reward, and judges have seen hundreds.
- **A chatbot over a document.** It is a wrapper, and C1 asks for edge.
- **"AI-powered X" where X is vague.** No person, no recurring job, no demo.
- **Anything that needs a login to show value.** If the judge cannot see the
  product in 20 seconds, C2 bleeds.
- **Anything whose demo depends on data you do not have.** Synthetic data in a
  demo is visible from orbit.
- **Crypto, gambling, and scraping that violates a site's terms.** The last one
  is a C4 security and ethics problem at the same time.
- **A platform with three user roles and an empty market.** Scope kills more
  entries than bad ideas do.

## Turn any idea into a C1 line

The template:

> **[Specific person]** wastes **[specific resource]** on **[recurring job]**;
> this does **[outcome, as an artifact]** using **[the surprising method]**.

Before → after, in the shape the description should be written:

| Weak                                               | Strong                                                                                                                                                                  |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "An AI tool that helps tenants with their deposit" | "Renters lose their deposit because photos are not evidence; this returns a timestamped condition report and a dispute letter citing your jurisdiction's rule."         |
| "A study app using AI"                             | "Students memorise the same test paper; this diagnoses the misconception behind each wrong answer and only serves practice problems a solver can independently verify." |
| "Accessibility checker with AI"                    | "Teams read '312 issues' and fix none; this returns the patch, not the report — a diff with the exact before/after contrast ratio for every colour change."             |

Notice that every strong line names a person, a wasted resource, an artifact and
a method. **Do not** put "AI", "agentic" or "LLM" in the pitch — the committee
knows it is a vibe coding olympiad; the tools are the medium, not the edge.
Keep the technology for the "How It Works" section, where it earns C3.

## A finished entry, end to end

Idea 5, written out the way it would actually be submitted — this is the shape
to copy, whatever the idea.

**The project description** (what the committee reads next to the demo):

> **Scam Screen** — paste a job offer, rental listing or marketplace message and
> see the exact sentences that give a scam away.
>
> People looking for their first job, a flat in a city they have not moved to
> yet, or a buyer for something they are selling are the most exposed to fraud
> and the least equipped to spot it. Generic warnings do not help; the message
> in front of them does.
>
> Scam Screen highlights the phrases in the text, names the pattern each one
> matches, and writes the single follow-up question that would settle it either
> way. It never says "this is a scam" without showing the sentence that made it
> say so.
>
> **Test account:** not required — the app opens directly on the paste box, and
> the sample messages are one click away. No signup, no upload of personal
> documents, nothing stored server-side.
>
> **How to test it in five minutes:** press "Try a real one" to load one of the
> eight anonymised messages. Watch the sentences highlight, open a pattern to
> read why it matched, then paste your own.
>
> Built solo. Interface in English; the pattern library also ships in Chinese.

**The five screens:** the paste box with the sample picker · the highlighted
result · the pattern explanation with its evidence · the follow-up question ·
the "what I collect about you: nothing" page.

**The 5-minute judge script:** opens it → clicks one sample → sees five
sentences light up → clicks one to read the pattern → reads the question it
wrote → tries their own message → finds the "11 patterns · 0 uploaded" line in
the footer.

**The self-score, honestly:** C1 strong (specific person, specific artifact, a
legible edge). C2 strong (the first screen is the product). C3 medium — the risk
is a false positive, so the demo must include one legitimate message that comes
back clean. C4 strong (no backend, nothing stored, keyboard-complete).

Notice what the description never does: it never says "AI". The value is in the
first sentence, the person is named in the second, and the limitation is
admitted in the third. That third sentence buys more trust than a feature list.

## Next step

Pick one. Then use [the starter kit](../README.md) sitting in this repo:

1. Put the C1 line in `scripts/site.config.js` as the tagline, before writing any
   feature code.
2. Write the description as if the reader is tired and has 40 other projects
   open — the committee's own framing.
3. Run the readiness audit at the end of the build; it is the same four criteria,
   weighted the same way.
4. Ship the artifact early and keep it working. A small, finished, explainable
   project outscores a large, almost-finished one every time.
