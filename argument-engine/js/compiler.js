// Offline heuristic compiler: plain-text argument -> typed reasoning graph.
// Deterministic by design so the full destroy/steelman loop works with zero
// network access. The optional LLM backend mirrors this exact output shape.

import { runDiagnostics } from "./diagnostics.js";

const CUES = {
  evidence: /(stud(y|ies)|research|data|survey|report|statistics|according to|evidence)/i,
  normative: /\b(should|must|ought to|needs? to|have to)\b/i,
};

export function splitSentences(text) {
  const hits = text
    .replace(/\s+/g, " ")
    .match(/[^.!?]+[.!?]+["']?\s?/g);
  if (hits) return hits.map((s) => s.trim()).filter(Boolean);
  return text.trim() ? [text.trim()] : [];
}

let counter = 0;
const nid = () => `n${counter++}`;

export function compileArgument(source) {
  counter = 0;
  const sentences = splitSentences(source ?? "");
  if (sentences.length === 0) {
    return { nodes: [], edges: [], warnings: [], empty: true };
  }

  const claimText = sentences.find((s) => CUES.normative.test(s)) ?? sentences.at(-1);
  const rest = sentences.filter((s) => s !== claimText);
  const evidenceTexts = rest.filter((s) => CUES.evidence.test(s));
  const premiseTexts = rest.filter((s) => !CUES.evidence.test(s));

  const claim = { id: nid(), kind: "claim", label: "CLAIM", text: claimText };
  const inference = {
    id: nid(),
    kind: "inference",
    label: "INFERENCE",
    text: "If these premises hold, the claim follows",
  };
  const premises = premiseTexts.map((text) => ({
    id: nid(), kind: "premise", label: "PREMISE", text,
  }));
  const evidence = evidenceTexts.map((text) => ({
    id: nid(), kind: "evidence", label: "EVIDENCE", text,
  }));

  // Display order is top-down: claim <- inference <- premises <- evidence.
  const nodes = [claim, inference, ...premises, ...evidence];

  const edges = [{ from: inference.id, to: claim.id, kind: "proves" }];
  for (const p of premises) edges.push({ from: p.id, to: inference.id, kind: "supports" });
  if (premises.length && evidence.length) {
    for (const e of evidence) edges.push({ from: e.id, to: premises[0].id, kind: "grounds" });
  } else if (!premises.length) {
    for (const e of evidence) edges.push({ from: e.id, to: inference.id, kind: "grounds" });
  }

  const graph = { nodes, edges, warnings: [] };
  graph.warnings = runDiagnostics(graph);
  return graph;
}
