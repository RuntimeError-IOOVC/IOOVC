/**
 * LLM provider layer.
 *
 * Two supported providers:
 *   - ollama    (local, default when OPENROUTER_API_KEY is absent)
 *   - openrouter (https://openrouter.ai/api/v1, OpenAI-compatible)
 *
 * Configuration (env):
 *   LLM_PROVIDER       "openrouter" | "ollama"  (auto-detected if unset)
 *   OPENROUTER_API_KEY sk-or-...
 *   OPENROUTER_MODEL   e.g. minimax/minimax-m3.1-flash:free
 *   OPENROUTER_BASE_URL (optional override)
 *   OLLAMA_MODEL       e.g. qwen3:4b-instruct
 *   OLLAMA_BASE_URL    (optional override)
 */

export type LLMProvider = "ollama" | "openrouter";

export interface ChatJSONOptions {
  system: string;
  user: string;
  schema: Record<string, unknown>;
  schemaName?: string;
  temperature?: number;
  maxTokens?: number;
  /**
   * Optional validator. When provided, a response that fails validation is
   * rejected and the next candidate model is tried.
   */
  validate?: (value: unknown) => boolean;
}

export function resolveProvider(): LLMProvider {
  const explicit = (process.env.LLM_PROVIDER || "").trim().toLowerCase();

  if (explicit === "openrouter" || explicit === "ollama") {
    return explicit;
  }

  if (process.env.OPENROUTER_API_KEY) {
    return "openrouter";
  }

  return "ollama";
}

function openRouterKey(): string {
  const key = (process.env.OPENROUTER_API_KEY || "").trim();

  if (!key) {
    throw new Error(
      "OPENROUTER_API_KEY is not set. Add it to .env.local (see .env.example)."
    );
  }

  return key;
}

/**
 * JSON Schema subset that every OpenAI-style provider accepts:
 * every property listed in `required`, no additional properties.
 * The engine's own schemas already declare all required fields, so this
 * mostly just adds `additionalProperties: false` and normalises enums.
 */
function toStrictSchema(
  schema: Record<string, unknown>
): Record<string, unknown> {
  if (Array.isArray(schema)) {
    return schema.map((item) =>
      toStrictSchema(item as Record<string, unknown>)
    ) as unknown as Record<string, unknown>;
  }

  if (typeof schema !== "object" || schema === null) {
    return schema;
  }

  const source = schema as Record<string, unknown>;

  if (source.anyOf && Array.isArray(source.anyOf)) {
    // anyOf[null] pattern (nullable fields): keep the object branch strict.
    const branches = source.anyOf
      .filter(
        (branch) =>
          !(
            typeof branch === "object" &&
            branch !== null &&
            (branch as Record<string, unknown>).type === "null"
          )
      )
      .map((branch) =>
        toStrictSchema(branch as Record<string, unknown>)
      );

    if (branches.length === 1) {
      return {
        ...branches[0],
        nullable: true,
      };
    }

    return {
      ...source,
      anyOf: branches,
    };
  }

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(source)) {
    if (key === "properties" && value && typeof value === "object") {
      const properties = value as Record<string, unknown>;

      result.properties = Object.fromEntries(
        Object.entries(properties).map(([prop, propSchema]) => [
          prop,
          toStrictSchema(propSchema as Record<string, unknown>),
        ])
      );

      continue;
    }

    if (key === "items") {
      result.items = toStrictSchema(
        value as Record<string, unknown>
      );

      continue;
    }

    result[key] = value;
  }

  if (result.type === "object") {
    result.additionalProperties = false;

    if (!result.required && result.properties) {
      result.required = Object.keys(
        result.properties as Record<string, unknown>
      );
    }
  }

  return result;
}

function extractJSON(
  raw: string
): unknown {
  const trimmed = raw.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    // fall through to fence / brace extraction
  }

  const fenced = trimmed.match(
    /```(?:json)?\s*([\s\S]*?)```/
  );

  if (fenced?.[1]) {
    return JSON.parse(fenced[1].trim());
  }

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");

  if (start !== -1 && end > start) {
    return JSON.parse(trimmed.slice(start, end + 1));
  }

  throw new Error(
    "Model did not return parseable JSON."
  );
}

async function callOllama(
  options: ChatJSONOptions
): Promise<unknown> {
  const baseUrl = (
    process.env.OLLAMA_BASE_URL || "http://localhost:11434"
  ).replace(/\/$/, "");

  const model = (
    process.env.OLLAMA_MODEL || "qwen3:4b-instruct"
  ).trim();

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      stream: false,
      format: options.schema,
      options: {
        temperature: options.temperature ?? 0,
      },
      messages: [
        { role: "system", content: options.system },
        { role: "user", content: options.user },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `Ollama error ${response.status}: ${text.slice(0, 300)}`
    );
  }

  const data = (await response.json()) as {
    message?: { content?: string };
  };

  const content = data.message?.content;

  if (!content) {
    throw new Error("Ollama returned no message content.");
  }

  return extractJSON(content);
}

export function openRouterModels(): string[] {
  const raw =
    process.env.OPENROUTER_MODELS ||
    process.env.OPENROUTER_MODEL ||
    "nvidia/nemotron-3.5-super-vl:free";

  const models = raw
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean);

  return models.length > 0
    ? models
    : ["nvidia/nemotron-3.5-super-vl:free"];
}

async function callOpenRouter(
  options: ChatJSONOptions,
  model: string
): Promise<unknown> {
  const baseUrl = (
    process.env.OPENROUTER_BASE_URL ||
    "https://openrouter.ai/api/v1"
  ).replace(/\/$/, "");

  const body = {
    model,
    temperature: options.temperature ?? 0,
    max_tokens: options.maxTokens ?? 16384,
    messages: [
      { role: "system", content: options.system },
      { role: "user", content: options.user },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: options.schemaName || "output",
        strict: true,
        schema: toStrictSchema(options.schema),
      },
    },
  };

  const response = await fetch(
    `${baseUrl}/chat/completions`,
    {
      method: "POST",
      signal: AbortSignal.timeout(
        Number(process.env.OPENROUTER_TIMEOUT_MS || 240000)
      ),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openRouterKey()}`,
        "HTTP-Referer":
          process.env.OPENROUTER_REFERER ||
          "http://localhost:3000",
        "X-Title":
          process.env.OPENROUTER_TITLE ||
          "Argument Engine",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `OpenRouter error ${response.status}: ${text.slice(0, 400)}`
    );
  }

  const data = (await response.json()) as {
    choices?: {
      finish_reason?: string | null;
      message?: { content?: string };
    }[];
  };

  const choice = data.choices?.[0];

  const content = choice?.message?.content;

  if (!content) {
    throw new Error(
      `OpenRouter returned no message content (finish_reason: ${choice?.finish_reason ?? "unknown"}).`
    );
  }

  if (choice?.finish_reason === "length") {
    throw new Error(
      "Model hit the token limit before producing output."
    );
  }

  return extractJSON(content);
}

/**
 * Runs one structured chat completion and returns parsed JSON.
 */
export async function chatJSON(
  options: ChatJSONOptions
): Promise<unknown> {
  const provider = resolveProvider();

  if (provider !== "openrouter") {
    return callOllama(options);
  }

  const models = openRouterModels();

  let lastError: unknown = null;

  for (const model of models) {
    try {
      const value = await callOpenRouter(options, model);

      if (options.validate && !options.validate(value)) {
        lastError = new Error(
          `Model ${model} returned output that failed validation.`
        );

        continue;
      }

      return value;
    } catch (error) {
      lastError = error;

      console.error(
        `[llm] model ${model} failed:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  throw new Error(
    `All OpenRouter models failed. Last error: ${
      lastError instanceof Error
        ? lastError.message
        : String(lastError)
    }`
  );
}

export function providerLabel(): string {
  const provider = resolveProvider();

  if (provider === "openrouter") {
    return openRouterModels().join(", ");
  }

  return (
    process.env.OLLAMA_MODEL || "qwen3:4b-instruct"
  );
}
