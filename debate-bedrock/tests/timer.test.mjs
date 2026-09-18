import test from "node:test";
import assert from "node:assert/strict";
import { createTimer, formatClock } from "../js/timer.js";

test("timer starts ready at full duration", () => {
  const timer = createTimer(300);
  const { remaining, state, duration } = timer.getState();
  assert.equal(remaining, 300);
  assert.equal(state, "ready");
  assert.equal(duration, 300);
});

test("tick only counts down while running", () => {
  const timer = createTimer(10);
  timer.tick();
  assert.equal(timer.getState().remaining, 10, "ready timer ignores ticks");
  timer.start();
  timer.tick();
  timer.tick();
  assert.equal(timer.getState().remaining, 8);
  timer.pause();
  timer.tick();
  assert.equal(timer.getState().remaining, 8, "paused timer ignores ticks");
});

test("timer finishes at zero, clamps, and cannot restart", () => {
  const timer = createTimer(1);
  timer.start();
  timer.tick();
  assert.equal(timer.getState().state, "finished");
  timer.tick();
  assert.equal(timer.getState().remaining, 0, "never goes below zero");
  timer.start();
  assert.equal(timer.getState().state, "finished", "finished is terminal");
});

test("reset restores duration and ready state", () => {
  const timer = createTimer(5);
  timer.start();
  timer.tick();
  timer.reset();
  assert.equal(timer.getState().remaining, 5);
  assert.equal(timer.getState().state, "ready");
  timer.reset(120);
  assert.equal(timer.getState().remaining, 120, "reset can swap duration");
});

test("formatClock pads minutes and seconds", () => {
  assert.equal(formatClock(480), "08:00");
  assert.equal(formatClock(65), "01:05");
  assert.equal(formatClock(0), "00:00");
  assert.equal(formatClock(-5), "-00:05");
});
