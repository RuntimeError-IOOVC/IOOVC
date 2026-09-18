import test from "node:test";
import assert from "node:assert/strict";
import { compileArgument } from "../js/compiler.js";

const SAMPLE =
  "Studies show that teenagers who use more social media report more depression. " +
  "Teenagers need real-world interaction to develop social skills. " +
  "Social media should be banned for teenagers.";

test("compiles the sample into claim, inference, premise and evidence", () => {
  const graph = compileArgument(SAMPLE);
  const kinds = (k) => graph.nodes.filter((n) => n.kind === k).length;
  assert.equal(kinds("claim"), 1);
  assert.equal(kinds("inference"), 1);
  assert.equal(kinds("premise"), 1);
  assert.equal(kinds("evidence"), 1);
  assert.ok(graph.edges.length >= 3, "nodes are wired together");
});

test("association evidence triggers ARG002, named study suppresses ARG004", () => {
  const graph = compileArgument(SAMPLE);
  const codes = graph.warnings.map((w) => w.code);
  assert.ok(codes.includes("ARG002"), "association reported, causation assumed");
  assert.ok(!codes.includes("ARG004"), "a study was named");
});

test("a bare claim with no evidence triggers ARG004", () => {
  const graph = compileArgument("Zoos should be banned.");
  const codes = graph.warnings.map((w) => w.code);
  assert.ok(codes.includes("ARG004"));
});

test("empty input produces an empty graph, not a crash", () => {
  const graph = compileArgument("   ");
  assert.equal(graph.nodes.length, 0);
  assert.equal(graph.warnings.length, 0);
});
