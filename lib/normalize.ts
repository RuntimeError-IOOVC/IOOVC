/**
 * Normalises loosely-structured model output into the exact shapes the
 * engine's Zod schemas expect.
 *
 * Different providers honour `response_format: json_schema` with different
 * fidelity. In the wild we have seen:
 *   - edges emitted as { id, from, to } instead of { id, source, target }
 *   - edges missing `relation`
 *   - diagnostic emitted as a plain string ("ARG002 - Correlation -> Causation")
 *   - diagnostic missing `severity`
 *
 * These repairs are structural only — no meaning is invented.
 */

export interface LooseDiagnostic {
  code: string;
  issue: string;
  explanation: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
}

const KNOWN_ISSUES: Record<string, string> = {
  ARG001: "Unsupported Assumption",
  ARG002: "Correlation → Causation",
  ARG003: "Ambiguous Definition",
  ARG004: "Evidence Required",
  ARG007: "Burden Shift",
};

function normaliseSeverity(
  value: unknown
): "LOW" | "MEDIUM" | "HIGH" {
  const text = String(value ?? "").toUpperCase();

  if (text.includes("HIGH")) return "HIGH";
  if (text.includes("MED")) return "MEDIUM";
  if (text.includes("LOW")) return "LOW";

  return "MEDIUM";
}

function normaliseDiagnostic(
  value: unknown
): LooseDiagnostic | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) return null;

    const match = trimmed.match(
      /^(ARG\d{3})\s*[-–—:.]?\s*(.*)$/i
    );

    if (!match) {
      return {
        code: "ARG001",
        issue: trimmed,
        explanation:
          "This reasoning step was flagged by the model without further detail.",
        severity: "MEDIUM",
      };
    }

    const code = match[1].toUpperCase();
    const issue =
      match[2].trim() ||
      KNOWN_ISSUES[code] ||
      "Reasoning Weakness";

    return {
      code,
      issue,
      explanation:
        "This reasoning step was flagged by the model without further detail.",
      severity: "MEDIUM",
    };
  }

  if (typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;

  const rawCode = String(
    record.code ?? record.diagnostic_code ?? "ARG001"
  ).toUpperCase();

  const codeMatch = rawCode.match(/ARG\d{3}/);

  const code = codeMatch
    ? codeMatch[0]
    : /^[A-Z]{2,6}$/.test(rawCode)
      ? rawCode
      : "ARG001";

  const issue =
    String(
      record.issue ?? record.title ?? record.name ?? ""
    ).trim() ||
    KNOWN_ISSUES[code] ||
    "Reasoning Weakness";

  const explanation =
    String(
      record.explanation ??
        record.description ??
        record.detail ??
        ""
    ).trim() ||
    "This reasoning step was flagged by the model without further detail.";

  return {
    code,
    issue,
    explanation,
    severity: normaliseSeverity(record.severity),
  };
}

function normaliseEdge(
  value: unknown,
  index: number
): Record<string, unknown> {
  const record = (value ?? {}) as Record<string, unknown>;

  const source =
    record.source ?? record.from ?? record.start ?? record.src;

  const target =
    record.target ?? record.to ?? record.end ?? record.dst;

  const relation =
    record.relation ??
    record.type ??
    (record.contradicts === true ? "contradicts" : "supports");

  const allowed = new Set([
    "supports",
    "depends_on",
    "contradicts",
  ]);

  return {
    id: String(record.id ?? `edge-${index + 1}`),
    source: String(source ?? ""),
    target: String(target ?? ""),
    relation: allowed.has(String(relation))
      ? String(relation)
      : "supports",
  };
}

function normaliseNode(
  value: unknown,
  index: number
): Record<string, unknown> {
  const record = (value ?? {}) as Record<string, unknown>;

  const allowed = new Set([
    "evidence",
    "premise",
    "inference",
    "conclusion",
  ]);

  const type = String(record.type ?? "premise");

  return {
    id: String(record.id ?? `node-${index + 1}`),
    type: allowed.has(type)
      ? type
      : "premise",
    text: String(record.text ?? ""),
    diagnostic: normaliseDiagnostic(record.diagnostic),
  };
}

/**
 * Repairs a compiled/repaired argument graph in place-ish (returns a new object).
 */
export function normaliseArgument(
  payload: unknown
): Record<string, unknown> {
  const record = (payload ?? {}) as Record<string, unknown>;

  const nodes = Array.isArray(record.nodes)
    ? record.nodes.map(normaliseNode)
    : [];

  const nodeIds = new Set(
    nodes.map((node) => node.id as string)
  );

  const edges = Array.isArray(record.edges)
    ? record.edges
        .map(normaliseEdge)
        .filter((edge) => {
          const source = edge.source as string;
          const target = edge.target as string;

          return (
            nodeIds.has(source) &&
            nodeIds.has(target) &&
            source !== target
          );
        })
    : [];

  return {
    source: String(record.source ?? ""),
    nodes,
    edges,
  };
}

/**
 * Repairs a steelman payload: { repaired, changes }.
 */
export function normaliseSteelman(
  payload: unknown
): Record<string, unknown> {
  const record = (payload ?? {}) as Record<string, unknown>;

  const repaired = normaliseArgument(record.repaired);

  const allowed = new Set([
    "ADDED_PREMISE",
    "EXPLICIT_ASSUMPTION",
    "NARROWED_CLAIM",
    "REPAIRED_INFERENCE",
    "EVIDENCE_REQUIREMENT",
  ]);

  const changes = Array.isArray(record.changes)
    ? record.changes.map((change) => {
        const item = (change ?? {}) as Record<string, unknown>;

        const type = String(item.type ?? "REPAIRED_INFERENCE");

        return {
          type: allowed.has(type)
            ? type
            : "REPAIRED_INFERENCE",
          description: String(item.description ?? "").trim(),
        };
      })
    : [];

  return {
    repaired,
    changes,
  };
}
