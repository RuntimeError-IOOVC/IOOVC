# IOOVC - International Olympics of Vibe Coding 2026

Competition entry workspace for [IOOVC](https://ioovc.org).

## Repository layout

    .
    ├── debate-bedrock/     # The entry: Debate Bedrock (see its own README)
    │   ├── index.html
    │   ├── css/styles.css
    │   ├── js/             # app.js + testable logic modules (timer, formats, state)
    │   ├── tests/          # node --test, zero dependencies
    │   └── package.json
    ├── Debate_Bedrock.md   # Project specification for the entry
    └── ideas.md            # Idea bank: candidate entries and how the winner was picked

## The entry: Debate Bedrock

A local-first debate practice timer. Zero dependencies, no build step, no
accounts - everything lives in the browser's localStorage.

Quick start:

    cd debate-bedrock
    python3 -m http.server 8000   # or: npx serve .

Then open http://localhost:8000.

Run the tests:

    cd debate-bedrock
    npm test                      # node --test tests/ (Node 18+, no packages)

## Picking the idea

ideas.md scores each candidate against the published judging criteria with the
weights (4*C1 + 3*C2 + 2*C3 + 1*C4) / 10, and explains why a no-signup,
local-first tool has a structural advantage. Debate_Bedrock.md specifies the
chosen entry in detail.
