import { ArgumentData } from "./types";

export interface DestroyResult {
  nodeIds: string[];
  fullCollapse: boolean;
  cutSize: number;
  totalSupport: number;
  remainingSupport: number;
  impactCount: number;
  explanation: string;
}

function canReachConclusion(
  argument: ArgumentData,
  startId: string,
  removed: Set<string>
) {
  if (removed.has(startId)) return false;

  const conclusions = new Set(
    argument.nodes
      .filter((node) => node.type === "conclusion")
      .map((node) => node.id)
  );

  const adjacency = new Map<string, string[]>();

  argument.nodes.forEach((node) => {
    if (!removed.has(node.id)) {
      adjacency.set(node.id, []);
    }
  });

  argument.edges.forEach((edge) => {
    if (
      removed.has(edge.source) ||
      removed.has(edge.target)
    ) {
      return;
    }

    adjacency.get(edge.source)?.push(edge.target);
  });

  const visited = new Set<string>();
  const stack = [startId];

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (conclusions.has(current)) {
      return true;
    }

    if (visited.has(current)) continue;

    visited.add(current);

    const next = adjacency.get(current) ?? [];

    next.forEach((id) => {
      if (!visited.has(id)) {
        stack.push(id);
      }
    });
  }

  return false;
}

function supportingNodes(
  argument: ArgumentData,
  removed: Set<string>
) {
  return argument.nodes.filter(
    (node) =>
      node.type !== "conclusion" &&
      !removed.has(node.id) &&
      canReachConclusion(argument, node.id, removed)
  );
}

function combinations<T>(
  items: T[],
  size: number
): T[][] {
  if (size === 0) return [[]];
  if (items.length < size) return [];

  const result: T[][] = [];

  for (
    let index = 0;
    index <= items.length - size;
    index++
  ) {
    const head = items[index];

    const tails = combinations(
      items.slice(index + 1),
      size - 1
    );

    tails.forEach((tail) => {
      result.push([head, ...tail]);
    });
  }

  return result;
}

function nodePriority(
  argument: ArgumentData,
  nodeId: string
) {
  const node = argument.nodes.find(
    (item) => item.id === nodeId
  );

  if (!node) return 0;

  let score = 0;

  if (node.type === "inference") score += 30;
  if (node.type === "premise") score += 20;
  if (node.type === "evidence") score += 10;

  if (node.diagnostic?.severity === "HIGH") score += 6;
  if (node.diagnostic?.severity === "MEDIUM") score += 4;
  if (node.diagnostic?.severity === "LOW") score += 2;

  return score;
}

export function findMinimumLogicalCut(
  argument: ArgumentData
): DestroyResult | null {
  const baseline = supportingNodes(
    argument,
    new Set()
  );

  if (baseline.length === 0) {
    return null;
  }

  const candidates = baseline.map(
    (node) => node.id
  );

  const maximumCutSize = Math.min(
    3,
    candidates.length
  );

  for (
    let size = 1;
    size <= maximumCutSize;
    size++
  ) {
    const possibleCuts = combinations(
      candidates,
      size
    );

    const validCuts = possibleCuts.filter(
      (cut) => {
        const remaining = supportingNodes(
          argument,
          new Set(cut)
        );

        return remaining.length === 0;
      }
    );

    if (validCuts.length > 0) {
      validCuts.sort((a, b) => {
        const scoreA = a.reduce(
          (sum, id) =>
            sum + nodePriority(argument, id),
          0
        );

        const scoreB = b.reduce(
          (sum, id) =>
            sum + nodePriority(argument, id),
          0
        );

        return scoreB - scoreA;
      });

      const best = validCuts[0];

      return {
        nodeIds: best,
        fullCollapse: true,
        cutSize: best.length,
        totalSupport: baseline.length,
        remainingSupport: 0,
        impactCount: baseline.length,
        explanation:
          best.length === 1
            ? `Removing this node disconnects all ${baseline.length} supporting nodes from the conclusion.`
            : `Removing these ${best.length} nodes disconnects all supplied support from the conclusion.`,
      };
    }
  }

  let bestNodeId = candidates[0];
  let bestRemaining = baseline.length;

  candidates.forEach((candidateId) => {
    const remaining = supportingNodes(
      argument,
      new Set([candidateId])
    );

    if (remaining.length < bestRemaining) {
      bestRemaining = remaining.length;
      bestNodeId = candidateId;
    } else if (
      remaining.length === bestRemaining &&
      nodePriority(argument, candidateId) >
        nodePriority(argument, bestNodeId)
    ) {
      bestNodeId = candidateId;
    }
  });

  const impact =
    baseline.length - bestRemaining;

  return {
    nodeIds: [bestNodeId],
    fullCollapse: false,
    cutSize: 1,
    totalSupport: baseline.length,
    remainingSupport: bestRemaining,
    impactCount: impact,
    explanation: `No single point completely destroys the argument. This is the strongest attack: removing it breaks ${impact} of ${baseline.length} supporting nodes from the conclusion.`,
  };
}