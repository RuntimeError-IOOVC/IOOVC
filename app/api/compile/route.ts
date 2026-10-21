import { z } from "zod";

import { chatJSON } from "@/lib/llm";
import { normaliseArgument } from "@/lib/normalize";

const DiagnosticSchema = z.object({
  code: z.string(),
  issue: z.string(),
  explanation: z.string(),
  severity: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

const ArgumentNodeSchema = z.object({
  id: z.string(),
  type: z.enum([
    "evidence",
    "premise",
    "inference",
    "conclusion",
  ]),
  text: z.string(),
  diagnostic: DiagnosticSchema.nullable(),
});

const ArgumentEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  relation: z.enum([
    "supports",
    "depends_on",
    "contradicts",
  ]),
});

const ArgumentSchema = z.object({
  source: z.string(),
  nodes: z.array(ArgumentNodeSchema),
  edges: z.array(ArgumentEdgeSchema),
});

const argumentJsonSchema = {
  type: "object",

  properties: {
    source: {
      type: "string",
    },

    nodes: {
      type: "array",

      items: {
        type: "object",

        properties: {
          id: {
            type: "string",
          },

          type: {
            type: "string",
            enum: [
              "evidence",
              "premise",
              "inference",
              "conclusion",
            ],
          },

          text: {
            type: "string",
          },

          diagnostic: {
            anyOf: [
              {
                type: "object",

                properties: {
                  code: {
                    type: "string",
                  },

                  issue: {
                    type: "string",
                  },

                  explanation: {
                    type: "string",
                  },

                  severity: {
                    type: "string",
                    enum: [
                      "LOW",
                      "MEDIUM",
                      "HIGH",
                    ],
                  },
                },

                required: [
                  "code",
                  "issue",
                  "explanation",
                  "severity",
                ],
              },

              {
                type: "null",
              },
            ],
          },
        },

        required: [
          "id",
          "type",
          "text",
          "diagnostic",
        ],
      },
    },

    edges: {
      type: "array",

      items: {
        type: "object",

        properties: {
          id: {
            type: "string",
          },

          source: {
            type: "string",
          },

          target: {
            type: "string",
          },

          relation: {
            type: "string",
            enum: [
              "supports",
              "depends_on",
              "contradicts",
            ],
          },
        },

        required: [
          "id",
          "source",
          "target",
          "relation",
        ],
      },
    },
  },

  required: [
    "source",
    "nodes",
    "edges",
  ],
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const argumentText = body.argument;

    if (
      typeof argumentText !== "string" ||
      argumentText.trim().length === 0
    ) {
      return Response.json(
        {
          error: "Argument text is required.",
        },
        {
          status: 400,
        }
      );
    }

    const rawResult = (await chatJSON({
      system: `You are the compiler inside Argument Engine,
a debugger for human reasoning.

Convert the user's argument into the SMALLEST faithful
reasoning graph.

Do not agree or disagree with the user.
Do not improve the argument.
Do not invent evidence.

NODE TYPES

evidence:
Use ONLY when the user explicitly gives empirical or factual
support such as:
- a statistic
- a study
- observed data
- a concrete example
- a quotation
- a factual source

A reason is NOT automatically evidence.

premise:
A claim or reason the user relies on to support the conclusion.

inference:
A reasoning bridge required to move from one or more
premises or evidence nodes toward another claim.

Create an inference node when the conclusion requires
an unstated assumption, normative principle, causal step,
generalization, scope expansion, or other logical bridge.

An inference node should answer:

"What must be true for these premises to support
the next claim?"

Do NOT create an inference node merely to rephrase
a premise or conclusion.

conclusion:
The main claim the user is trying to establish.

DIAGNOSTICS

ARG001 — Unsupported Assumption
ARG002 — Correlation → Causation
ARG003 — Ambiguous Definition
ARG004 — Evidence Required
ARG007 — Burden Shift

CRITICAL NON-DUPLICATION RULES

1. Every distinct idea should normally appear ONCE.

2. Never create both an evidence node and a premise node
   containing substantially the same claim.

3. Never repeat the conclusion inside another node.

BAD:

Premise:
"Students need recordings, so lectures should be recorded."

Conclusion:
"Lectures should be recorded."

GOOD:

Premise:
"Students need access to recordings."

Conclusion:
"Lectures should be recorded."

4. If the user gives three independent reasons,
   normally create three premise nodes pointing toward
   the conclusion.

5. Do not invent intermediate nodes unless they express
   a genuinely missing reasoning step.

6. Prefer fewer nodes.
   A simple argument may need only 2–5 nodes.

7. One sentence may contain multiple distinct claims,
   but do not split it unless each claim plays a different
   logical role.

8. Evidence must be explicitly present in the user's text.
   Do not convert ordinary reasons into evidence merely
   because they sound factual.

9. Every node should contribute something unique to the graph.

10. Every edge must reference valid node IDs.

11. Use IDs like:
    premise-1
    premise-2
    inference-1
    evidence-1
    conclusion-1

12. Use edge IDs like:
    edge-1
    edge-2

13. If a node has no clear reasoning weakness,
    diagnostic must be null.

14. Diagnostics must identify a reasoning problem,
    not merely express disagreement.

15. source must preserve the original user argument.

INFERENCE RULES

1. Before connecting premises directly to a conclusion,
   ask whether an unstated reasoning bridge is required.

2. If the premises provide reasons but do not logically
   entail the conclusion, create an inference node.

3. Diagnostics should preferably attach to the inference
   where the reasoning weakness occurs.

4. A premise can be reasonable while the inference made
   from it is weak.

5. Pay special attention to:
   - descriptive claim -> normative conclusion
   - some -> all
   - correlation -> causation
   - one example -> general rule
   - benefit -> obligation
   - possibility -> certainty
   - absence of proof -> proof of absence

6. If such a bridge is unsupported, attach the appropriate
   diagnostic to the inference node.

EXAMPLE

Input:

"Schools should start later because teenagers need more sleep
and tired students find it harder to concentrate."

Good graph:

premise-1:
"Teenagers need more sleep."

premise-2:
"Tired students find it harder to concentrate."

conclusion-1:
"Schools should start later."

Do NOT duplicate those premises as evidence.
Do NOT create another node saying
"Therefore schools should start later."

EXAMPLE

Input:

"Recordings help students revise and allow absent students
to catch up. Therefore all university lectures should
be recorded."

Better graph:

premise-1:
"Recordings help students revise."

premise-2:
"Recordings allow absent students to catch up."

inference-1:
"Because recordings provide these benefits,
universities should provide them for all lectures."

diagnostic:
ARG001 - Unsupported Assumption

conclusion-1:
"All university lectures should be recorded."

Edges:

premise-1 -> inference-1
premise-2 -> inference-1
inference-1 -> conclusion-1
`,
      user: argumentText,
      schema: argumentJsonSchema,
      schemaName: "argument",
      validate: (value) =>
        ArgumentSchema.safeParse(
          normaliseArgument(value)
        ).success,
    }));

    const parsedJson = normaliseArgument(rawResult) as {
      source: string;
      nodes: {
        id: string;
        type: string;
        text: string;
        diagnostic: null | {
          code: string;
          issue: string;
          explanation: string;
          severity: "LOW" | "MEDIUM" | "HIGH";
        };
      }[];
      edges: {
        id: string;
        source: string;
        target: string;
        relation: string;
      }[];
    };

    // Force source to exactly match user input.
    parsedJson.source = argumentText;

    // Compiler safeguard:
// inference nodes represent unstated reasoning bridges.
// If the model creates one but fails to diagnose it,
// mark it as an unsupported assumption.
parsedJson.nodes = parsedJson.nodes.map(
  (node: {
    id: string;
    type: string;
    text: string;
    diagnostic: null | {
      code: string;
      issue: string;
      explanation: string;
      severity: "LOW" | "MEDIUM" | "HIGH";
    };
  }) => {
    if (
      node.type === "inference" &&
      node.diagnostic === null
    ) {
      return {
        ...node,

        diagnostic: {
          code: "ARG001",
          issue: "Unsupported Assumption",
          explanation:
            "This reasoning bridge is not explicitly established by the supplied premises.",
          severity: "MEDIUM",
        },
      };
    }

    return node;
  }
);

    const result = ArgumentSchema.safeParse(parsedJson);

    if (!result.success) {
      console.error(
        "SCHEMA ERROR:",
        result.error
      );

      throw new Error(
        "Model returned JSON that does not match the Argument schema."
      );
    }

    return Response.json(result.data);
  } catch (error) {
    console.error(
      "FULL ERROR:",
      error
    );

    return Response.json(
      {
        error: "Compilation failed.",

        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}