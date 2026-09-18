// Pure countdown timer with no DOM or timers of its own.
// The app drives it by calling tick() once per second, which keeps the
// maths trivially testable with node's built-in test runner.

export function createTimer(durationSeconds) {
  let duration = durationSeconds;
  let remaining = duration;
  let state = "ready"; // ready | running | paused | finished
  const listeners = new Set();

  function snapshot() {
    return { remaining, state, duration };
  }

  function emit() {
    const snap = snapshot();
    listeners.forEach((fn) => fn(snap));
  }

  return {
    start() {
      if (state === "ready" || state === "paused") {
        state = "running";
        emit();
      }
    },
    pause() {
      if (state === "running") {
        state = "paused";
        emit();
      }
    },
    tick() {
      if (state !== "running") return;
      if (remaining > 0) remaining -= 1;
      if (remaining === 0) state = "finished";
      emit();
    },
    reset(newDuration) {
      if (typeof newDuration === "number") duration = newDuration;
      remaining = duration;
      state = "ready";
      emit();
    },
    getState() {
      return snapshot();
    },
    onChange(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

export function formatClock(totalSeconds) {
  const sign = totalSeconds < 0 ? "-" : "";
  const abs = Math.abs(totalSeconds);
  const minutes = Math.floor(abs / 60);
  const seconds = abs % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return `${sign}${mm}:${ss}`;
}
