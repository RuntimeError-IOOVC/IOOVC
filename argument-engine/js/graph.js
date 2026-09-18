// Renders compiled graphs into the centre pane. Nodes are shown top-down
// (claim first, evidence last) with upward arrows, matching the debugger
// tree in the spec.

export function renderGraph(container, graph, { onSelect } = {}) {
  container.innerHTML = "";
  if (!graph.nodes.length) {
    const p = document.createElement("p");
    p.className = "placeholder";
    p.textContent = "Nothing compiled yet.";
    container.appendChild(p);
    return;
  }

  graph.nodes.forEach((node, index) => {
    const el = document.createElement("div");
    el.className = `node ${node.kind}`;
    if (node.patch) el.classList.add("patch");
    el.dataset.nodeId = node.id;
    el.tabIndex = 0;

    const kind = document.createElement("span");
    kind.className = "node-kind";
    kind.textContent = node.label;

    const warning = graph.warnings?.find((w) => w.nodeId === node.id);
    if (warning) {
      el.classList.add("warned");
      const flag = document.createElement("span");
      flag.className = "flag";
      flag.textContent = `  ! ${warning.code}`;
      kind.appendChild(flag);
    }

    const text = document.createElement("p");
    text.textContent = node.text;

    el.append(kind, text);
    el.addEventListener("click", () => onSelect?.(node.id));
    el.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelect?.(node.id);
      }
    });
    container.appendChild(el);

    if (index < graph.nodes.length - 1) {
      const connector = document.createElement("div");
      connector.className = "connector";
      connector.textContent = "^";
      connector.setAttribute("aria-hidden", "true");
      container.appendChild(connector);
    }
  });
}

export function applyCut(container, cut) {
  const cutEl = container.querySelector(`[data-node-id="${cut.node.id}"]`);
  cutEl?.classList.add("cut");
  for (const id of cut.cut) {
    container.querySelector(`[data-node-id="${id}"]`)?.classList.add("collapsed");
  }
}
