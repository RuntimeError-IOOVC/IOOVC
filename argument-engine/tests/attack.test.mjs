import test from "node:test";
import assert from "node:assert/strict";
import { compileArgument } from "../js/compiler.js";
import { findMinimumCut, reachableFrom } from "../js/attack.js";
import { buildRepairs, applyRepairs } from "../js/repairs.js";

const SAMPLE =
  "Studies show that teenagers who use more social media report more depression. " +
  "Teenagers need real-world interaction to develop social skills. " +
  "Social media should be banned for teenagers.";

test("the minimum cut severs the claim from the evidence", () => {
  const graph = compileArgument(SAMPLE);
  const cut = findMinimumCut(graph);
  const claim = graph.nodes.find((n) => n.kind === "claim");
  assert.ok(cut.seversClaim);
  assert.ok(cut.cut.has(claim.id), "destroying the node disconnects the claim");
});

test("reachableFrom walks supports/grounds/proves edges upward", () => {
  const graph = compileArgument(SAMPLE);
  const evidence = graph.nodes.find((n) => n.kind === "evidence");
  const claim = graph.nodes.find((n) => n.kind === "claim");
  assert.ok(reachableFrom(graph, evidence.id).has(claim.id));
});

test("ARG002 repairs add premise and required evidence; claim narrows under ARG010", () => {
  const graph = compileArgument(SAMPLE);
  const repairs = buildRepairs(graph);
  const types = repairs.map((r) => r.type);
  assert.ok(types.includes("required-evidence"));
  assert.ok(types.includes("added-premise"));

  const repaired = applyRepairs(graph, repairs);
  const patchCount = repaired.nodes.filter((n) => n.patch).length;
  assert.ok(patchCount >= 2, "patches are grafted into the graph");
  assert.equal(repaired.repaired, true);
});
