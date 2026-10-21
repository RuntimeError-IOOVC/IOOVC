import { ArgumentData } from "./types";

export const mockArgument: ArgumentData = {
  source:
    "Social media should be banned for teenagers because teenagers who use more social media report more depression.",

  nodes: [
    {
      id: "evidence-1",
      type: "evidence",
      text: "Teenagers who use more social media report more depression.",
      diagnostic: {
        code: "ARG004",
        issue: "Evidence Required",
        explanation:
          "The argument refers to a relationship, but no specific source or study has been provided.",
        severity: "MEDIUM",
      },
    },

    {
        id: "premise-1",
        type: "premise",
        text: "Teenagers' mental health should be protected from harmful influences.",
        diagnostic: {
            code: "ARG001",
            issue: "Unsupported Assumption",
            explanation:
                "The premise may be reasonable, but its role in justifying a ban still needs further support.",
            severity: "MEDIUM",
        },
    },

    {
      id: "inference-1",
      type: "inference",
      text: "Social media causes increased depression.",
      diagnostic: {
        code: "ARG002",
        issue: "Correlation → Causation",
        explanation:
          "The evidence shows an association, but the inference requires a causal relationship.",
        severity: "HIGH",
      },
    },

    {
      id: "conclusion-1",
      type: "conclusion",
      text: "Social media should be banned for teenagers.",
      diagnostic: {
        code: "ARG001",
        issue: "Unsupported Assumption",
        explanation:
          "Even if social media contributes to depression, the argument has not shown that banning it is the necessary or best response.",
        severity: "HIGH",
      },
    },
  ],

  edges: [
    {
        id: "edge-1",
        source: "evidence-1",
        target: "premise-1",
        relation: "supports",
    },
    {
        id: "edge-2",
        source: "premise-1",
        target: "inference-1",
        relation: "supports",
    },
    {
        id: "edge-3",
        source: "inference-1",
        target: "conclusion-1",
        relation: "supports",
    },
  ],

};