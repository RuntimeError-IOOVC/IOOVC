# Argument Engine

**A debugger for human arguments.** IOOVC 2026 entry (Fjgiofjg).

> Humans debug code. Why don't we debug reasoning?

Argument Engine takes a plain-text argument, compiles it into a reasoning
graph, flags logical weaknesses with compiler-style diagnostics
(ARG001-ARG010), and can then attack the reasoning path (find the minimum
logical cut) or repair it (steelman).

    argument  -->  compile  -->  reasoning graph  -->  diagnostics
                                                     |-- destroy (attack)
                                                     +-- steelman (repair)

## Repository layout

    .
    ├── argument-engine/      # The entry: app + docs (see its own README)
    │   ├── SPEC.md           # Full product spec
    │   ├── MVP.md            # The five features and what we deliberately skip
    │   ├── index.html        # Four-pane debugger UI
    │   ├── css/  js/  tests/ # Zero-dependency static app + node --test suite
    │   └── package.json
    ├── ideas.md              # Idea bank: why a structural, no-signup tool won
    ├── Debate_Bedrock.md     # Original concept note
    └── debate-bedrock/       # SUPERSEDED scaffold (earlier concept), pending removal

## Quick start

    cd argument-engine
    python3 -m http.server 8000   # or: npx serve .

Open http://localhost:8000. Run the test suite with `npm test` (Node 18+,
no dependencies).

## Docs

- argument-engine/SPEC.md - identity, diagnostics taxonomy, UI language, demo story
- argument-engine/MVP.md - the five features, analysis backends, explicit non-goals
