/**
 * Formula tests — no dependencies, no DOM. Run with:
 *
 *   node --test
 *
 * These guard the two things a careless edit breaks: the official weights and
 * the mapping between the criteria and each statement's point value.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { criteria, bands } from "../scripts/checker.data.js";
import { checklist } from "../scripts/checklist.data.js";

const baseline = JSON.parse(
  await readFile(new URL("../data/ioovc-2026.json", import.meta.url), "utf8"),
);

/** A stand-in for localStorage so the audit module can be imported in Node. */
function stubStorage(initial = {}) {
  const store = new Map(
    Object.entries(initial).map(([key, value]) => [key, JSON.stringify(value)]),
  );
  globalThis.localStorage = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
  };
  return store;
}

/** Fresh copy of the module, so each test sees its own storage state. */
async function auditWith(state) {
  stubStorage({ "ioovc-entry-audit-v1": state });
  const url = new URL("../scripts/checker.js", import.meta.url);
  return import(`${url.href}?case=${Math.random()}`);
}

test("the four criteria carry the official weights", () => {
  assert.deepEqual(
    criteria.map((c) => [c.code, c.weight]),
    [
      ["C1", 4],
      ["C2", 3],
      ["C3", 2],
      ["C4", 1],
    ],
  );
});

test("the weights match data/ioovc-2026.json", () => {
  const published = baseline.judging.criteria.map((c) => [c.code, c.weight]);
  const local = criteria.map((c) => [c.code, c.weight]);
  assert.deepEqual(local, published);
});

test("every criterion has four statements, so each point is worth 25", () => {
  for (const criterion of criteria) {
    assert.equal(criterion.statements.length, 4, `${criterion.code} statement count`);
    assert.equal(new Set(criterion.statements.map((s) => s.id)).size, 4, `${criterion.code} ids`);
  }
});

test("weights sum to 10, which is what makes the total a percentage", () => {
  const sum = criteria.reduce((total, c) => total + c.weight, 0);
  assert.equal(sum, 10);
});

test("no ticks scores zero", async () => {
  const { totalScore } = await auditWith({});
  assert.equal(totalScore(), 0);
});

test("every tick scores exactly 100", async () => {
  const all = Object.fromEntries(
    criteria.flatMap((c) => c.statements.map((s) => [s.id, true])),
  );
  const { totalScore } = await auditWith(all);
  assert.equal(totalScore(), 100);
});

test("C4 alone is worth 10 points, C1 alone is worth 40", async () => {
  const forCriterion = (criterion) =>
    Object.fromEntries(criterion.statements.map((s) => [s.id, true]));

  const c4 = criteria.find((c) => c.code === "C4");
  const c1 = criteria.find((c) => c.code === "C1");

  assert.equal((await auditWith(forCriterion(c4))).totalScore(), 10);
  assert.equal((await auditWith(forCriterion(c1))).totalScore(), 40);
});

test("one unchecked C1 statement costs ten points; one in C4 costs 2.5", async () => {
  const all = Object.fromEntries(
    criteria.flatMap((c) => c.statements.map((s) => [s.id, true])),
  );
  const c1 = criteria.find((c) => c.code === "C1");
  const c4 = criteria.find((c) => c.code === "C4");

  const withoutC1 = await auditWith({ ...all, [c1.statements[0].id]: false });
  const withoutC4 = await auditWith({ ...all, [c4.statements[0].id]: false });

  assert.equal(withoutC1.totalScore(), 90);
  assert.equal(withoutC4.totalScore(), 97.5);
});

test("the Markdown export reports the same score as the total", async () => {
  const all = Object.fromEntries(
    criteria.flatMap((c) => c.statements.map((s) => [s.id, true])),
  );
  const audit = await auditWith({ ...all, [criteria[3].statements[0].id]: false });
  const markdown = audit.toMarkdown();

  // 97.5 rounds up for display, but the raw total stays exact.
  assert.match(markdown, /\*\*Readiness: 98\/100 — Podium-ready\*\*/);
  assert.match(markdown, /### C1 · The Idea — 100% \(weight 4\)/);
  assert.match(markdown, /- \[ \] The browser console is clean on every page/);
  assert.match(markdown, /\(4·C1 \+ 3·C2 \+ 2·C3 \+ 1·C4\) \/ 10/);
});

test("bands are ordered from best to worst and cover zero", () => {
  const minimums = bands.map((band) => band.min);
  assert.deepEqual(minimums, [...minimums].sort((a, b) => b - a));
  assert.equal(bands.at(-1).min, 0);
});

test("checklist ids are unique and stable enough to store", () => {
  assert.equal(new Set(checklist.map((item) => item.id)).size, checklist.length);
  for (const item of checklist) {
    assert.match(item.id, /^chk-[a-z-]+$/);
  }
});

test("the published deadlines are in chronological order", () => {
  const { registration, submission, results, prizesPaid } = baseline.deadlines;
  const order = [registration, submission, results, prizesPaid].map((d) => Date.parse(d));
  assert.ok(order.every(Number.isFinite), "every deadline parses");
  assert.deepEqual(order, [...order].sort((a, b) => a - b));
});
