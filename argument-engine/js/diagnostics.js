// Compiler-style diagnostic catalog. severity: "critical" | "evidential" | "semantic".
// Every warning carries a REQUIRED TO CONTINUE line: what the argument would
// need in order to proceed past the breakpoint.

export const CATALOG = {
  ARG001: {
    name: "Unsupported Assumption",
    severity: "critical",
    detail: "A premise asserts something the argument never supports. It is doing load-bearing work as a bare assumption.",
    required: "Support for this premise, or an explicit acknowledgement that it is an assumption.",
  },
  ARG002: {
    name: "Correlation != Causation",
    severity: "critical",
    detail: "This premise establishes an association. The inference requires a causal relationship.",
    required: "Evidence that one factor causes the observed change in the other.",
  },
  ARG003: {
    name: "Ambiguous Definition",
    severity: "semantic",
    detail: "A key term is used loosely; the argument changes meaning depending on the reading.",
    required: "A precise definition of the key term.",
  },
  ARG004: {
    name: "Missing Evidence",
    severity: "evidential",
    detail: "The argument asserts facts with no evidence trail: no study, dataset or observation is named.",
    required: "A named study, dataset or observation.",
  },
  ARG005: {
    name: "Alternative Explanation",
    severity: "evidential",
    detail: "The stated evidence is compatible with a different cause the argument never rules out.",
    required: "Reasons why rival explanations fail.",
  },
  ARG006: {
    name: "Circular Reasoning",
    severity: "critical",
    detail: "A premise restates the conclusion in different words, so the argument points back at itself.",
    required: "Independent support for the premise.",
  },
  ARG007: {
    name: "Burden Shift",
    severity: "semantic",
    detail: "The argument asks the other side to prove it wrong instead of proving itself right.",
    required: "Positive evidence for the claim.",
  },
  ARG008: {
    name: "False Dichotomy",
    severity: "critical",
    detail: "Two options are presented as the only possibilities when more exist.",
    required: "Justification that no third option exists.",
  },
  ARG009: {
    name: "Non Sequitur",
    severity: "critical",
    detail: "The conclusion does not follow from the premises even if every premise is true.",
    required: "An inference step that actually connects premise to conclusion.",
  },
  ARG010: {
    name: "Scope Leap",
    severity: "critical",
    detail: "The conclusion generalises further than the evidence: different population, context or scale.",
    required: "Evidence covering the widened scope, or a narrower claim.",
  },
};

const ASSOCIATION = /(associat|correlat|link|report more|tend to|more likely)/i;
const ASSERTION = /\b(obviously|clearly|everyone knows|of course|needless to say)\b/i;
const SCOPE_LEAP = /\b(everyone|no one|all people|always|never|society as a whole)\b/i;

export function runDiagnostics(graph) {
  const warnings = [];
  const byKind = (kind) => graph.nodes.filter((n) => n.kind === kind);
  const claim = byKind("claim")[0];
  const inference = byKind("inference")[0];
  const evidence = byKind("evidence");
  const premises = byKind("premise");

  if (evidence.length === 0) warnings.push(make("ARG004", claim?.id));
  if (evidence.some((n) => ASSOCIATION.test(n.text))) {
    warnings.push(make("ARG002", inference?.id ?? claim?.id));
  }
  for (const p of premises) {
    if (ASSERTION.test(p.text)) warnings.push(make("ARG001", p.id));
  }
  if (claim && SCOPE_LEAP.test(claim.text)) warnings.push(make("ARG010", claim.id));

  return warnings;
}

function make(code, nodeId) {
  return { code, nodeId, ...CATALOG[code] };
}

export function summarize(warnings) {
  const counts = { critical: 0, evidential: 0, semantic: 0 };
  for (const w of warnings) counts[w.severity] = (counts[w.severity] ?? 0) + 1;
  const parts = Object.entries(counts)
    .filter(([, n]) => n > 0)
    .map(([k, n]) => `${n} ${k}`)
    .join(" / ");
  return `Argument compiled with ${warnings.length} warning${warnings.length === 1 ? "" : "s"}.${warnings.length ? " " + parts : ""}`;
}
