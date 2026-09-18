# Argument Engine - MVP Scope (proposal)

Goal: something demo-able by November that survives a 90-second submission
video. Build the five features below, in this order, and refuse everything
else until they work.

## The five features

| # | Feature              | What the judge sees                                                     |
|---|----------------------|-------------------------------------------------------------------------|
| 1 | Argument compiler    | Paste text, get typed nodes (Claim / Inference / Premise / Evidence) with edges |
| 2 | Reasoning graph view | Centre-pane graph, breakpoint glyph on weak nodes, click to inspect     |
| 3 | Diagnostics engine   | ARG codes with severities in the console; v1 implements ARG001/002/004/010 |
| 4 | Destroy My Argument  | Minimum logical cut: critical node turns red, downstream chain collapses|
| 5 | Steelman             | Repair diff grafted onto the graph (+premise, narrowed claim, +evidence)|

## Analysis backends

- Default: offline heuristic compiler. Zero network, zero keys, demo-proof.
- Optional: local LLM through an OpenAI-compatible endpoint (LM Studio,
  Ollama). Configured in the UI, key never leaves the browser. Unreachable
  backend falls back to the heuristics with a console note.

## Deliberately out of scope

- Fallacy-labeller headline mode (fallacies are diagnostics, not the product)
- Accounts, backend server, cloud sync, share links
- Essay or "rewritten argument" generation
- Multi-argument workspaces or history beyond the current session
- Debate timers and speech tooling from the earlier scaffold
- Exports beyond a plain Markdown summary

## Risk register

- Risk: it reads as an LLM wrapper.
  Mitigation: fixed taxonomy, explicit graph model, and an offline engine
  that produces the full loop with no model at all.
- Risk: model latency or outage on demo day.
  Mitigation: record the video on the heuristic engine, or a warmed local
  model; never a remote API.
- Risk: scope creep into debate-platform features.
  Mitigation: the non-goals above are final until the five features ship.
