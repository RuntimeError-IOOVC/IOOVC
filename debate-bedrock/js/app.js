import { createTimer, formatClock } from "./timer.js";
import { FORMATS, getFormat } from "./formats.js";
import { createStore } from "./state.js";

const STORE_KEY = "debate-bedrock:v1";

const store = createStore(STORE_KEY, {
  motion: "",
  formatId: "wsdc",
  speechIndex: 0,
});

const els = {
  motion: document.querySelector("#motion-input"),
  format: document.querySelector("#format-select"),
  clock: document.querySelector("#clock"),
  speechLabel: document.querySelector("#speech-label"),
  poiBadge: document.querySelector("#poi-badge"),
  progress: document.querySelector("#timer-progress"),
  status: document.querySelector("#timer-status"),
  sequence: document.querySelector("#sequence-list"),
  prev: document.querySelector("#btn-prev"),
  next: document.querySelector("#btn-next"),
  start: document.querySelector("#btn-start"),
  reset: document.querySelector("#btn-reset"),
};

let speeches = getFormat(store.get().formatId).speeches;
let timer = null;

function clampIndex(index) {
  return Math.min(Math.max(index, 0), speeches.length - 1);
}

function currentSpeech() {
  return speeches[clampIndex(store.get().speechIndex)];
}

function rebuildTimer() {
  timer = createTimer(currentSpeech().seconds);
  timer.onChange(renderTimer);
  renderTimer(timer.getState());
}

function setText(el, text) {
  if (el.textContent !== text) el.textContent = text;
}

function renderSequence() {
  els.sequence.innerHTML = "";
  const active = clampIndex(store.get().speechIndex);
  speeches.forEach((speech, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${speech.label} - ${formatClock(speech.seconds)}`;
    if (i === active) {
      li.classList.add("is-current");
      li.setAttribute("aria-current", "step");
    }
    els.sequence.appendChild(li);
  });
}

function renderTimer({ remaining, state, duration }) {
  els.clock.textContent = formatClock(remaining);

  const percent = duration > 0 ? (remaining / duration) * 100 : 0;
  els.progress.style.setProperty("--progress", `${percent}%`);
  els.progress.setAttribute("aria-valuenow", String(Math.round(percent)));

  const speech = currentSpeech();
  setText(els.speechLabel, speech.label);

  const poiOpen =
    speech.poiWindow != null &&
    remaining >= speech.poiWindow[0] &&
    remaining <= speech.poiWindow[1];
  els.poiBadge.dataset.open = String(poiOpen);
  setText(
    els.poiBadge,
    speech.poiWindow == null
      ? "No POIs in reply speeches"
      : poiOpen
        ? "POIs open"
        : "Protected time",
  );

  setText(
    els.status,
    state === "finished"
      ? "Time is up."
      : state === "running"
        ? "Running"
        : state === "paused"
          ? "Paused"
          : "Ready",
  );
  setText(els.start, state === "running" ? "Pause" : "Start");
}

function step(delta) {
  const nextIndex = clampIndex(store.get().speechIndex + delta);
  store.set({ speechIndex: nextIndex });
  rebuildTimer();
  renderSequence();
}

els.start.addEventListener("click", () => {
  if (timer.getState().state === "running") timer.pause();
  else timer.start();
});
els.reset.addEventListener("click", () => timer.reset());
els.next.addEventListener("click", () => step(1));
els.prev.addEventListener("click", () => step(-1));

els.format.addEventListener("change", () => {
  store.set({ formatId: els.format.value, speechIndex: 0 });
  speeches = getFormat(els.format.value).speeches;
  rebuildTimer();
  renderSequence();
});

els.motion.addEventListener("input", () => {
  store.set({ motion: els.motion.value });
});

document.addEventListener("keydown", (event) => {
  const tag = document.activeElement?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
  if (event.code === "Space") {
    event.preventDefault();
    els.start.click();
  }
  if (event.key === "n") els.next.click();
  if (event.key === "r") els.reset.click();
});

// Drive the simple tick-based timer once per second.
setInterval(() => timer.tick(), 1000);

// Initialise UI from persisted state.
for (const [id, format] of Object.entries(FORMATS)) {
  const option = document.createElement("option");
  option.value = id;
  option.textContent = format.name;
  els.format.appendChild(option);
}
els.format.value = store.get().formatId;
els.motion.value = store.get().motion;
rebuildTimer();
renderSequence();
