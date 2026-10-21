import { z } from "zod";

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

const ChangeSchema = z.object({
  type: z.enum([
    "ADDED_PREMISE",
    "EXPLICIT_ASSUMPTION",
    "NARROWED_CLAIM",
    "REPAIRED_INFERENCE",
    "EVIDENCE_REQUIREMENT",
  ]),
  description: z.string(),
});

const SteelmanSchema = z.object({
  repaired: ArgumentSchema,
  changes: z.array(ChangeSchema),
});

const jsonSchema = {
  type: "object",

  properties: {
    repaired: {
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
    },

    changes: {
      type: "array",

      items: {
        type: "object",

        properties: {
          type: {
            type: "string",
            enum: [
              "ADDED_PREMISE",
              "EXPLICIT_ASSUMPTION",
              "NARROWED_CLAIM",
              "REPAIRED_INFERENCE",
              "EVIDENCE_REQUIREMENT",
            ],
          },

          description: {
            type: "string",
          },
        },

        required: [
          "type",
          "description",
        ],
      },
    },
  },

  required: [
    "repaired",
    "changes",
  ],
};

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    if (!body.argument) {
      return Response.json(
        {
          error:
            "Argument is required.",
        },
        {
          status: 400,
        }
      );
    }

    const ollamaResponse =
      await fetch(
        "http://localhost:11434/api/chat",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            model:
              "qwen3:4b-instruct",

            stream: false,

            format: jsonSchema,

            options: {
              temperature: 0,
            },

            messages: [
              {
                role: "system",

                content: `
You are the Steelman Engine inside Argument Engine.

Your task is to create the strongest defensible version
of the user's argument while preserving its core position.

You are NOT trying to make the argument win at any cost.

You must repair reasoning quality.

You may:

- make hidden assumptions explicit
- add missing logical premises
- repair weak inference steps
- narrow an overbroad conclusion
- identify evidence that would be required

You MUST NOT:

- invent studies
- invent statistics
- invent quotations
- invent factual evidence
- change the argument into the opposite position
- create fake certainty

If factual support is missing, mark it as an evidence
requirement instead of fabricating evidence.

A steelmanned argument should ideally have a cleaner
logical path than the original.

NODE TYPES

evidence:
Only factual support actually supplied by the user.

premise:
A claim supporting another claim.

inference:
The reasoning bridge connecting support to another claim.

conclusion:
The final position being defended.

DIAGNOSTICS

ARG001 — Unsupported Assumption
ARG002 — Correlation → Causation
ARG003 — Ambiguous Definition
ARG004 — Evidence Required
ARG007 — Burden Shift

GRAPH RULES

1. Every node must contribute a unique idea.
2. Do not duplicate premises as evidence.
3. Do not repeat the conclusion inside another node.
4. Every edge must reference valid IDs.
5. Prefer a compact graph.
6. Explicitly repair the weakest reasoning step.
7. A repaired inference does not need a diagnostic
   if the repair actually resolves the weakness.
8. Missing factual evidence may still carry ARG004.
9. Preserve the user's core argumentative intent.

CHANGE REPORT

Return a short human-readable explanation for every change.

IMPORTANT:
"description" must be a complete English sentence describing
WHAT changed in this specific argument.

BAD:
{
  "type": "ADDED_PREMISE",
  "description": "ADDED_PREMISE"
}

BAD:
{
  "type": "REPAIRED_INFERENCE",
  "description": "REPAIRED_INFERENCE"
}

GOOD:
{
  "type": "ADDED_PREMISE",
  "description": "Added the premise that a policy response requires the harm to be sufficiently serious."
}

GOOD:
{
  "type": "NARROWED_CLAIM",
  "description": "Narrowed the conclusion from banning social media outright to restricting it when a causal harm is established."
}

Allowed change types:

ADDED_PREMISE
EXPLICIT_ASSUMPTION
NARROWED_CLAIM
REPAIRED_INFERENCE
EVIDENCE_REQUIREMENT

STYLE RULES FOR CHANGE DESCRIPTIONS

1. Maximum 20 words per description.
2. Do not begin the description with the change type.
3. Do not repeat labels such as "ADDED_PREMISE:".
4. Describe only the concrete change.
5. Use plain, concise English suitable for a debugger UI.

BAD:
"ADDED_PREMISE: Added the premise that a policy response..."

GOOD:
"Policy intervention now requires demonstrated causal harm."
                `,
              },

              {
                role: "user",

                content: `
ORIGINAL ARGUMENT:

${body.argument}

CURRENT COMPILED GRAPH:

${JSON.stringify(
  body.graph,
  null,
  2
)}
                `,
              },
            ],
          }),
        }
      );

    if (!ollamaResponse.ok) {
      throw new Error(
        `Ollama error ${ollamaResponse.status}`
      );
    }

    const ollamaData =
      await ollamaResponse.json();

    const rawContent =
      ollamaData.message?.content;

    if (!rawContent) {
      throw new Error(
        "Ollama returned no content."
      );
    }

    const parsed =
      JSON.parse(rawContent);

    const result =
      SteelmanSchema.safeParse(
        parsed
      );

    if (!result.success) {
      console.error(
        result.error
      );

      throw new Error(
        "Steelman output did not match schema."
      );
    }

    const fallbackDescriptions = {
  ADDED_PREMISE:
    "Added a missing supporting premise to make the reasoning more complete.",

  EXPLICIT_ASSUMPTION:
    "Made an unstated assumption explicit so it can be examined directly.",

  NARROWED_CLAIM:
    "Narrowed an overbroad claim to a version better supported by the argument.",

  REPAIRED_INFERENCE:
    "Rebuilt a weak reasoning step so the premises connect more clearly to the conclusion.",

  EVIDENCE_REQUIREMENT:
    "Identified factual support that would be required without inventing evidence.",
};

const cleanedChanges =
  result.data.changes.map(
    (change) => {
      let description =
        change.description.trim();

      const possiblePrefixes = [
        "ADDED_PREMISE:",
        "EXPLICIT_ASSUMPTION:",
        "NARROWED_CLAIM:",
        "REPAIRED_INFERENCE:",
        "EVIDENCE_REQUIREMENT:",
      ];

      for (const prefix of possiblePrefixes) {
        if (
          description
            .toUpperCase()
            .startsWith(prefix)
        ) {
          description = description
            .slice(prefix.length)
            .trim();
        }
      }

      const normalizedDescription =
        description
          .toUpperCase()
          .replaceAll(" ", "_");

      const looksBroken =
        normalizedDescription ===
          change.type ||
        description.length < 12;

      return {
        ...change,

        description: looksBroken
          ? fallbackDescriptions[
              change.type
            ]
          : description,
      };
    }
  );

return Response.json({
  ...result.data,
  changes: cleanedChanges,
});

    return Response.json(
      result.data
    );
  } catch (error) {
    console.error(
      "STEELMAN ERROR:",
      error
    );

    return Response.json(
      {
        error:
          "Steelman failed.",

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