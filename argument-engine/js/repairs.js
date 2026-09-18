// Steelman = repair graph. Turn every diagnostic into a structural patch and
// graft it onto the graph, instead of emitting rewritten prose.

export function buildRepairs(graph) {
  const repairs = [];
  for (const warning of graph.warnings ?? []) {
    switch (warning.code) {
      case "ARG002":
        repairs.push({ type: "required-evidence", text: "Causal evidence linking exposure to the outcome" });
        repairs.push({ type: "added-premise", text: "A plausible causal mechanism, not just an association" });
        break;
      case "ARG004":
        repairs.push({ type: "required-evidence", text: "A named study, dataset or observation" });
        break;
      case "ARG001":
        repairs.push({ type: "removed-assumption", text: "Rewrite an asserted premise as a supported one" });
        break;
      case "ARG010":
        repairs.push({ type: "narrowed-claim", text: "Restrict the claim to the population and context the evidence covers" });
        break;
      default:
        break;
    }
  }
  const seen = new Set();
  return repairs.filter((r) => {
    const key = `${r.type}:${r.text}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function applyRepairs(graph, repairs) {
  const nodes = graph.nodes.map((n) => ({ ...n }));
  const edges = graph.edges.map((e) => ({ ...e }));
  const inference = nodes.find((n) => n.kind === "inference");
  let patch = 0;

  for (const repair of repairs) {
    if (repair.type === "added-premise") {
      const node = { id: `patch-p${patch++}`, kind: "premise", label: "PREMISE", text: repair.text, patch: true };
      nodes.push(node);
      if (inference) edges.push({ from: node.id, to: inference.id, kind: "supports" });
    }
    if (repair.type === "required-evidence") {
      const node = { id: `patch-e${patch++}`, kind: "evidence", label: "EVIDENCE", text: repair.text, patch: true };
      nodes.push(node);
      if (inference) edges.push({ from: node.id, to: inference.id, kind: "grounds" });
    }
    if (repair.type === "narrowed-claim") {
      const claim = nodes.find((n) => n.kind === "claim");
      if (claim) claim.text = `NARROWED: ${repair.text}. Original: ${claim.text}`;
    }
  }

  return { ...graph, nodes, edges, repairs, repaired: true };
}
