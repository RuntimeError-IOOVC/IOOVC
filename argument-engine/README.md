# Argument Engine

A debugger for human arguments. Zero dependencies, no build step.

    argument -> compile -> reasoning graph -> diagnostics -> destroy / steelman

Open the app, paste an argument, press COMPILE. The graph appears with
compiler-style warnings (ARG001-ARG010). DESTROY MY ARGUMENT finds the
minimum logical cut and collapses everything that depends on it. STEELMAN
grafts a repair diff onto the graph (added premises and required evidence).

## Quick start

Any static file server works:

    # Python (preinstalled on macOS/Linux)
    python3 -m http.server 8000

    # or Node
    npx --yes serve .

Then open http://localhost:8000.

Note: file:// will not work because the scripts are ES modules.

## Analysis backends

- Heuristic (offline): the default. Deterministic, needs nothing.
- Local LLM: point the app at an OpenAI-compatible endpoint (LM Studio,
  Ollama). Default base URL is http://localhost:1234/v1. If the backend is
  unreachable the app falls back to the heuristics and says so in the
  diagnostics console.

## Tests

    npm test

`node --test tests/`, plain Node 18+, nothing to install.

## Docs

- SPEC.md - product identity, diagnostics taxonomy, UI language, demo story
- MVP.md - the five features and the explicit non-goals
