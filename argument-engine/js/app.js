import { compileArgument } from "./compiler.js";
import { runDiagnostics, summarize } from "./diagnostics.js";
import { findMinimumCut, CUT_MESSAGE } from "./attack.js";
import { buildRepairs, applyRepairs } from "./repairs.js";
import { renderGraph, applyCut } from "./graph.js";
import { compileWithLLM } from "./llm.js";

const els = {
  source: document.querySelector("#source-input"),
  engine: document.querySelector("#engine-select"),
  llmConfig: document.querySelector("#llm-config"),
  llmBase: document.querySelector("#llm-base"),
  llmModel: document.querySelector("#llm-model"),
  compile: document.querySelector("#btn-compile"),
  destroy: document.querySelector("#btn-destroy"),
  steelman: document.querySelector("#btn-steelman"),
  graph: document.querySelector("#graph-pane"),
  inspector: document.querySelector("#inspector-pane"),
  summary: document.querySelector("#console-summary"),
  consoleList: document.querySelector("#console-list"),
  statusText: document.querySelector("#status-text"),
};

const state = { graph: null, cut: null, repaired: false };

function setStatus(message, cls = "") {
  els.statusText.innerHTML = "";
  const dot = document.createElement("span");
  dot.className = `dot ${cls}`;
  els.statusText.append(dot, message);
}

function log(code, severity, message) {
  const li = document.createElement("li");
  li.className = severity;
  li.textContent = code ? `${severity === "critical" ? "!" : "*"} ${code}  ${message}` : message;
  els.consoleList.appendChild(li);
}

function showNode(nodeId) {
  const node = state.graph?.nodes.find((n) => n.id === nodeId);
  if (!node) return;
  const warning = state.graph.warnings?.find((w) => w.nodeId === nodeId);
  els.inspector.innerHTML = "";
  els.inspector.className = "inspector-detail";

  const title = document.createElement("h3");
  title.textContent = node.label;
  const body = document.createElement("p");
  body.textContent = node.text;
  els.inspector.append(title, body);

  if (warning) {
    const code = document.createElement("p");
    code.innerHTML = "";
    const span = document.createElement("span");
    span.className = "code";
    span.textContent = `${warning.code} - ${warning.name}`;
    code.appendChild(span);

    const detail = document.createElement("p");
    detail.textContent = warning.detail;

    const required = document.createElement("p");
    required.className = "required";
    required.textContent = `REQUIRED TO CONTINUE -> ${warning.required}`;

    els.inspector.append(code, detail, required);
    log(warning.code, warning.severity, warning.name);
  }

  for (const el of els.graph.querySelectorAll(".node")) {
    el.classList.toggle("selected", el.dataset.nodeId === nodeId);
  }
}

async function onCompile() {
  const source = els.source.value.trim();
  if (!source) {
    setStatus("Idle - paste an argument and compile", "");
    return;
  }

  els.consoleList.innerHTML = "";
  state.cut = null;
  state.repaired = false;
  setStatus("Compiling...", "");

  if (els.engine.value === "llm") {
    try {
      const parsed = await compileWithLLM(source, {
        baseUrl: els.llmBase.value,
        model: els.llmModel.value,
      });
      parsed.warnings = runDiagnostics(parsed);
      state.graph = parsed;
      log(null, "ok", "Compiled with local LLM backend.");
    } catch (error) {
      state.graph = compileArgument(source);
      log(null, "evidential", `Local LLM unreachable (${error.message}); fell back to the offline heuristic engine.`);
    }
  } else {
    state.graph = compileArgument(source);
  }

  renderGraph(els.graph, state.graph, { onSelect: showNode });
  els.summary.textContent = summarize(state.graph.warnings);
  for (const w of state.graph.warnings) log(w.code, w.severity, w.name);
  if (!state.graph.warnings.length) log(null, "ok", "No breakpoints detected.");
  setStatus("Analysis Complete", "done");
  els.inspector.innerHTML = "<p class=\"placeholder\">Select a node to inspect it.</p>";
}

function onDestroy() {
  if (!state.graph || state.cut) return;
  const cut = findMinimumCut(state.graph);
  if (!cut) return;
  state.cut = cut;
  applyCut(els.graph, cut);
  log(null, "critical", `Critical failure point: ${cut.node.label} (${cut.node.id}).`);
  if (cut.seversClaim) log(null, "critical", CUT_MESSAGE);
  showNode(cut.node.id);
}

function onSteelman() {
  if (!state.graph || state.repaired) return;
  const repairs = buildRepairs(state.graph);
  if (!repairs.length) {
    log(null, "ok", "Nothing to repair: no diagnostics to translate into structure.");
    return;
  }
  state.graph = applyRepairs(state.graph, repairs);
  state.repaired = true;

  renderGraph(els.graph, state.graph, { onSelect: showNode });
  els.inspector.innerHTML = "";
  els.inspector.className = "inspector-detail";
  const heading = document.createElement("h3");
  heading.textContent = "Repair diff";
  els.inspector.appendChild(heading);
  for (const r of repairs) {
    const item = document.createElement("div");
    item.className = "diff-item";
    const b = document.createElement("b");
    b.textContent = r.type.toUpperCase().replace(/-/g, " ") + " ";
    item.append(b, document.createTextNode(r.text));
    els.inspector.appendChild(item);
  }
  log(null, "ok", `Steelman applied: ${repairs.length} structural patch${repairs.length === 1 ? "" : "es"} grafted onto the graph.`);
}

els.compile.addEventListener("click", onCompile);
els.destroy.addEventListener("click", onDestroy);
els.steelman.addEventListener("click", onSteelman);
els.engine.addEventListener("change", () => {
  els.llmConfig.hidden = els.engine.value !== "llm";
});
