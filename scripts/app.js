/**
 * Page behaviour: theme, mobile navigation, config injection, deadline
 * countdown, the submission checklist and section reveals.
 *
 * Each block is independent and fails soft, so a broken feature never takes
 * the page down with it.
 */

import { site, categoryLabels } from "./site.config.js";
import { checklist, CHECKLIST_KEY } from "./checklist.data.js";
import { initAudit } from "./checker.js";
import { storage, pad } from "./ui.js";

const THEME_KEY = "ioovc-entry-theme";

/* --------------------------------------------------------------- config -- */

function applySite() {
  const strings = {
    projectName: site.projectName,
    tagline: site.tagline,
    summary: site.summary,
    author: site.author,
    version: site.version,
    categoryLabel: (categoryLabels[site.category] ?? categoryLabels.open).label,
  };

  for (const [key, value] of Object.entries(strings)) {
    for (const node of document.querySelectorAll(`[data-site="${key}"]`)) {
      node.textContent = value;
    }
  }

  const links = {
    repoUrl: site.repoUrl,
    issuesUrl: `${site.repoUrl.replace(/\/$/, "")}/issues`,
  };

  for (const [key, value] of Object.entries(links)) {
    for (const node of document.querySelectorAll(`[data-site-href="${key}"]`)) {
      node.href = value;
    }
  }

  document.title = `${site.projectName} — IOOVC 2026 entry`;
  for (const node of document.querySelectorAll('meta[property^="og:"]')) {
    if (node.getAttribute("property") === "og:title") {
      node.content = document.title;
    }
    if (node.getAttribute("property") === "og:description") {
      node.content = site.summary;
    }
  }
}

/* ---------------------------------------------------------------- theme -- */

function initTheme() {
  const button = document.querySelector("[data-theme-toggle]");
  if (!button) return;

  const prefersDark = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolved = () =>
    document.documentElement.dataset.theme ??
    (prefersDark() ? "dark" : "light");

  button.setAttribute("aria-pressed", String(resolved() === "dark"));

  button.addEventListener("click", () => {
    const next = resolved() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    storage.write(THEME_KEY, next);
    button.setAttribute("aria-pressed", String(next === "dark"));
  });
}

/* ------------------------------------------------------------------ nav -- */

function initNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    nav.dataset.open = String(open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () => setOpen(nav.dataset.open !== "true"));

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
}

/* ------------------------------------------------------------ countdown -- */

const COUNTDOWN_UNITS = [
  { key: "days", label: "days" },
  { key: "hours", label: "hours" },
  { key: "minutes", label: "minutes" },
  { key: "seconds", label: "seconds" },
];

function initCountdown() {
  const host = document.querySelector("[data-countdown]");
  if (!host) return;

  const note = document.querySelector("[data-countdown-note]");
  const target = new Date(site.deadlines.submission);

  host.replaceChildren();
  const cells = {};
  for (const unit of COUNTDOWN_UNITS) {
    const cell = document.createElement("div");
    cell.className = "countdown__cell";

    const value = document.createElement("span");
    value.className = "countdown__value";
    value.textContent = "--";

    const label = document.createElement("span");
    label.className = "countdown__label";
    label.textContent = unit.label;

    cell.append(value, label);
    host.append(cell);
    cells[unit.key] = value;
  }

  const tick = () => {
    const remaining = target.getTime() - Date.now();

    if (remaining <= 0) {
      host.dataset.expired = "true";
      for (const node of Object.values(cells)) node.textContent = "00";
      if (note) note.textContent = "The submission deadline has passed.";
      clearInterval(timer);
      return;
    }

    const totalSeconds = Math.floor(remaining / 1000);
    cells.days.textContent = String(Math.floor(totalSeconds / 86400));
    cells.hours.textContent = pad(Math.floor(totalSeconds / 3600) % 24);
    cells.minutes.textContent = pad(Math.floor(totalSeconds / 60) % 60);
    cells.seconds.textContent = pad(totalSeconds % 60);
  };

  let timer;
  tick();
  timer = setInterval(tick, 1000);
}

/* ------------------------------------------------------------ checklist -- */

function initChecklist() {
  const host = document.querySelector("[data-checklist]");
  if (!host) return;

  let saved = {};
  try {
    saved = JSON.parse(storage.read(CHECKLIST_KEY) ?? "{}") ?? {};
  } catch (error) {
    saved = {};
  }

  const persist = () => storage.write(CHECKLIST_KEY, JSON.stringify(saved));
  const fragment = document.createDocumentFragment();

  for (const item of checklist) {
    const li = document.createElement("li");

    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = item.id;
    input.checked = Boolean(saved[item.id]);
    input.addEventListener("change", () => {
      saved[item.id] = input.checked;
      persist();
    });

    const label = document.createElement("label");
    label.htmlFor = item.id;

    const strong = document.createElement("strong");
    strong.textContent = item.label;

    const hint = document.createElement("span");
    hint.className = "hint";
    hint.textContent = item.hint;

    label.append(strong, hint);
    li.append(input, label);
    fragment.append(li);
  }

  host.replaceChildren(fragment);
}

/* ------------------------------------------------------------- reveals --- */

function initReveal() {
  const targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !("IntersectionObserver" in window)) {
    for (const target of targets) target.classList.add("is-visible");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
  );

  for (const target of targets) observer.observe(target);
}

/* ----------------------------------------------------------------- boot -- */

function boot() {
  try {
    applySite();
  } catch (error) {
    console.warn("config", error);
  }

  for (const setup of [
    initTheme,
    initNav,
    initCountdown,
    initChecklist,
    initReveal,
    initAudit,
  ]) {
    try {
      setup();
    } catch (error) {
      console.warn(`${setup.name} failed`, error);
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
