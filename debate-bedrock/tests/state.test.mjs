import test from "node:test";
import assert from "node:assert/strict";
import { createStore } from "../js/state.js";

function fakeStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
  };
}

test("set merges updates and persists across store instances", () => {
  const storage = fakeStorage();
  const store = createStore("k", { a: 1, b: 2 }, storage);
  store.set({ b: 5 });
  assert.deepEqual(store.get(), { a: 1, b: 5 });

  const again = createStore("k", { a: 1, b: 2 }, storage);
  assert.deepEqual(again.get(), { a: 1, b: 5 });
});

test("corrupt payload falls back to defaults instead of throwing", () => {
  const storage = fakeStorage();
  storage.setItem("k", "not json {{{");
  const store = createStore("k", { a: 1 }, storage);
  assert.deepEqual(store.get(), { a: 1 });
});

test("onChange listeners fire on set and can unsubscribe", () => {
  const store = createStore("k", { n: 0 }, fakeStorage());
  const seen = [];
  const off = store.onChange((snap) => seen.push(snap.n));
  store.set({ n: 1 });
  off();
  store.set({ n: 2 });
  assert.deepEqual(seen, [1]);
});
