import test from "node:test";
import assert from "node:assert/strict";
import { FORMATS, getFormat } from "../js/formats.js";

test("wsdc runs 6 main speeches then 2 replies, opposition reply first", () => {
  const { speeches } = FORMATS.wsdc;
  assert.equal(speeches.length, 8);
  assert.equal(speeches[0].side, "prop");
  assert.equal(speeches.at(-2).side, "opp");
  assert.equal(speeches.at(-1).side, "prop");
});

test("wsdc main speeches are 8 minutes, replies 4 with no POIs", () => {
  const { speeches } = FORMATS.wsdc;
  for (const speech of speeches.slice(0, 6)) assert.equal(speech.seconds, 480);
  for (const speech of speeches.slice(6)) {
    assert.equal(speech.seconds, 240);
    assert.equal(speech.poiWindow, null);
  }
});

test("every POI window sits strictly inside its speech", () => {
  for (const format of Object.values(FORMATS)) {
    for (const speech of format.speeches) {
      if (speech.poiWindow == null) continue;
      const [low, high] = speech.poiWindow;
      assert.ok(low > 0, "POIs never open at 0:00");
      assert.ok(low < high, "window is ordered");
      assert.ok(high < speech.seconds, "window closes before the speech ends");
    }
  }
});

test("getFormat falls back to wsdc for unknown ids", () => {
  assert.equal(getFormat("does-not-exist"), FORMATS.wsdc);
  assert.equal(getFormat("bp"), FORMATS.bp);
});
