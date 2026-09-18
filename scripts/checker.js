/**
 * The readiness audit: renders the criteria, scores them with the official
 * weights and remembers the ticks.
 *
 * Score = Σ(criterionScore × weight) / Σ(weight × 100) × 100
 * With the IOOVC weights (4, 3, 2, 1) that is exactly the published formula
 * (4·C1 + 3·C2 + 2·C3 + 1·C4) / 10, expressed as a percentage.
 */

import { criteria, bands, STORAGE_KEY } from "./checker.data.js";
import { showToast, copyText, storage } from "./ui.js";

/** @returns {Record<string, boolean>} */
function loadState() {
  const raw = storage.read(STORAGE_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    return {};
  }
}

const state = loadState();

function save() {
  storage.write(STORAGE_KEY, JSON.stringify(state));
}

/** Percentage of statements ticked inside one criterion. */
function criterionScore(criterion) {
  const total = criterion.statements.length;
  const checked = criterion.statements.filter((s) => state[s.id]).length;
  return (checked / total) * 100;
}

/** Weighted total on a 0–100 scale. */
export function totalScore() {
  const weightSum = criteria.reduce((sum, c) => sum + c.weight, 0);
  const weighted = criteria.reduce(
    (sum, c) => sum + criterionScore(c) * c.weight,
    0,
  );
  return weighted / weightSum;
}

function bandFor(score) {
  return bands.find((band) => score >= band.min) ?? bands.at(-1);
}

/* ---------------------------------------------------------------- render -- */

/** Builds one checkbox row. Uses a real <input> so the keyboard just works. */
function statementRow(statement) {
  const li = document.createElement("li");

  const input = document.createElement("input");
  input.type = "checkbox";
  input.id = statement.id;
  input.checked = Boolean(state[statement.id]);

  const label = document.createElement("label");
  label.htmlFor = statement.id;
  label.textContent = statement.label;

  const hint = document.createElement("span");
  hint.className = "hint";
  hint.textContent = statement.hint;
  label.append(hint);

  input.addEventListener("change", () => {
    state[statement.id] = input.checked;
    save();
    update();
  });

  li.append(input, label);
  return li;
}

function criterionCard(criterion) {
  const card = document.createElement("article");
  card.className = "criterion";

  const head = document.createElement("header");
  head.className = "criterion__head";

  const title = document.createElement("h3");
  title.textContent = `${criterion.code} · ${criterion.name}`;

  const weight = document.createElement("span");
  weight.className = "tag";
  weight.textContent = `weight ${criterion.weight}`;

  const blurb = document.createElement("p");
  blurb.textContent = criterion.blurb;

  head.append(title, weight, blurb);

  const list = document.createElement("ul");
  list.className = "field-list";
  for (const statement of criterion.statements) {
    list.append(statementRow(statement));
  }

  card.append(head, list);
  return card;
}

function renderMeters(host) {
  host.replaceChildren();
  for (const criterion of criteria) {
    const item = document.createElement("li");
    item.className = "meter";

    const top = document.createElement("div");
    top.className = "meter__top";

    const name = document.createElement("span");
    name.className = "meter__name";
    name.textContent = `${criterion.code} ${criterion.name}`;

    const value = document.createElement("span");
    value.className = "meter__weight";
    value.dataset.meterValue = criterion.id;

    top.append(name, value);

    const bar = document.createElement("div");
    bar.className = "meter__bar";
    bar.setAttribute("role", "progressbar");
    bar.setAttribute("aria-label", `${criterion.name} readiness`);
    bar.setAttribute("aria-valuemin", "0");
    bar.setAttribute("aria-valuemax", "100");

    const fill = document.createElement("span");
    fill.className = "meter__fill";
    fill.dataset.meterFill = criterion.id;

    bar.append(fill);
    item.append(top, bar);
    host.append(item);
  }
}

/* ----------------------------------------------------------------- score -- */

const ARC_LENGTH = 100; // viewBox path length is normalised by pathLength=100

function update() {
  const score = totalScore();
  const rounded = Math.round(score);
  const band = bandFor(rounded);

  const arc = document.querySelector("[data-score-arc]");
  if (arc) {
    arc.setAttribute("stroke-dashoffset", String(ARC_LENGTH - score));
    arc.style.stroke =
      rounded >= 70
        ? "var(--ok)"
        : rounded >= 45
          ? "var(--accent)"
          : "var(--bad)";
  }

  const value = document.querySelector("[data-score-value]");
  if (value) value.textContent = String(rounded);

  const bandEl = document.querySelector("[data-score-band]");
  if (bandEl) bandEl.textContent = `${band.label} — ${band.message}`;

  for (const criterion of criteria) {
    const criterionValue = criterionScore(criterion);
    const label = document.querySelector(
      `[data-meter-value="${criterion.id}"]`,
    );
    const fill = document.querySelector(`[data-meter-fill="${criterion.id}"]`);
    if (label)
      label.textContent = `${Math.round(criterionValue)}% · ×${criterion.weight}`;
    if (fill) {
      fill.style.width = `${criterionValue}%`;
      fill.parentElement.setAttribute(
        "aria-valuenow",
        String(Math.round(criterionValue)),
      );
    }
  }
}

/* ----------------------------------------------------------------- export -- */

/** A Markdown block that can be pasted straight into a project description. */
export function toMarkdown() {
  const score = Math.round(totalScore());
  const band = bandFor(score);
  const lines = [`**Readiness: ${score}/100 — ${band.label}**`, ""];

  for (const criterion of criteria) {
    const value = Math.round(criterionScore(criterion));
    lines.push(
      `### ${criterion.code} · ${criterion.name} — ${value}% (weight ${criterion.weight})`,
    );
    for (const statement of criterion.statements) {
      lines.push(`- [${state[statement.id] ? "x" : " "}] ${statement.label}`);
    }
    lines.push("");
  }

  lines.push(
    "_Scored with the IOOVC formula: (4·C1 + 3·C2 + 2·C3 + 1·C4) / 10._",
  );
  return lines.join("\n");
}

/* ------------------------------------------------------------------ init -- */

export function initAudit() {
  const host = document.querySelector("[data-audit]");
  if (!host) return;

  const meters = document.querySelector("[data-meters]");
  if (meters) renderMeters(meters);

  const fragment = document.createDocumentFragment();
  for (const criterion of criteria) {
    fragment.append(criterionCard(criterion));
  }
  host.replaceChildren(fragment);

  const exportButton = document.querySelector("[data-audit-export]");
  exportButton?.addEventListener("click", async () => {
    const markdown = toMarkdown();
    const output = document.querySelector("[data-audit-output]");

    if (output) {
      output.hidden = false;
      output.textContent = markdown;
    }

    const ok = await copyText(markdown);
    showToast(ok ? "Summary copied to the clipboard" : "Summary shown below");
  });

  const resetButton = document.querySelector("[data-audit-reset]");
  resetButton?.addEventListener("click", () => {
    for (const key of Object.keys(state)) delete state[key];
    save();
    for (const input of host.querySelectorAll("input[type=checkbox]")) {
      input.checked = false;
    }
    const output = document.querySelector("[data-audit-output]");
    if (output) {
      output.hidden = true;
      output.textContent = "";
    }
    update();
    showToast("Audit reset");
  });

  update();
}
