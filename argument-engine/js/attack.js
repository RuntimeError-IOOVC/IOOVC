// Minimum logical cut: which single node, if it fails, severs the conclusion
// from everything underneath it? For the layered graphs the compiler emits
// this is whichever premise/inference's removal disconnects the most.

export function reachableFrom(graph, startId) {
  const seen = new Set([startId]);
  const queue = [startId];
  while (queue.length) {
    const id = queue.shift();
    for (const edge of graph.edges) {
      if (edge.from === id && !seen.has(edge.to)) {
        seen.add(edge.to);
        queue.push(edge.to);
      }
    }
  }
  seen.delete(startId);
  return seen;
}

export function findMinimumCut(graph) {
  const candidates = graph.nodes.filter(
    (n) => n.kind === "inference" || n.kind === "premise",
  );
  let best = null;
  for (const node of candidates) {
    const cut = reachableFrom(graph, node.id);
    const seversClaim = graph.nodes.some(
      (n) => n.kind === "claim" && cut.has(n.id),
    );
    const score = cut.size + (seversClaim ? 100 : 0);
    if (!best || score > best.score) {
      best = { node, cut, seversClaim, score };
    }
  }
  return best;
}

export const CUT_MESSAGE =
  "Destroying this inference disconnects the conclusion from all currently supplied evidence.";
