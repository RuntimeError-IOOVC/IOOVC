import test from "node:test";
import assert from "node:assert/strict";
import { runDiagnostics, summarize, CATALOG } from "../js/diagnostics.js";

function node(kind, text) {
  return { id: Math.random().toString(36).slice(2), kind, label: kind.toUpperCase(), text };
}

test("hedged assertions trigger ARG001", () => {
  const graph = {
    nodes: [
      node("claim", "We should stop homework."),
      node("premise", "Obviously homework is pointless."),
    ],
    edges: [],
  };
  const codes = runDiagnostics(graph).map((w) => w.code);
  assert.ok(codes.includes("ARG001"));
});

test("universal claims trigger ARG010", () => {
  const graph = {
    nodes: [node("claim", "Everyone should always avoid sugar.")],
    edges: [],
  };
  const codes = runDiagnostics(graph).map((w) => w.code);
  assert.ok(codes.includes("ARG010"));
});

test("summarize reports total plus severity breakdown", () => {
  const warnings = [
    { code: "ARG002", ...CATALOG.ARG002 },
    { code: "ARG004", ...CATALOG.ARG004 },
    { code: "ARG003", ...CATALOG.ARG003 },
  ];
  const summary = summarize(warnings);
  assert.match(summary, /3 warnings/);
  assert.match(summary, /1 critical/);
  assert.match(summary, /1 evidential/);
  assert.match(summary, /1 semantic/);
});
