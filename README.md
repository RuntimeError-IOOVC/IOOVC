# Argument Engine

A debugger for human arguments. Next.js 16 app that compiles an argument into a
reasoning graph, flags reasoning weaknesses, finds the minimum logical cut, and
can steelman the argument back.

## LLM provider

The engine talks to an LLM through one of two providers, selected automatically:

| Provider    | When it is used                                   | Endpoint |
| ----------- | ------------------------------------------------- | -------- |
| `openrouter`| `OPENROUTER_API_KEY` is set (default)             | `https://openrouter.ai/api/v1` |
| `ollama`    | no OpenRouter key, or `LLM_PROVIDER=ollama`       | `http://localhost:11434` |

### Setup (OpenRouter)

```bash
cp .env.example .env.local
# then edit .env.local and paste your key from https://openrouter.ai/keys
```

```bash
LLM_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODELS=nvidia/nemotron-3.5-super-vl:free,minimax/minimax-m3.1-flash:free
```

`OPENROUTER_MODELS` is a comma-separated **fallback list**. The first model that
returns output matching the schema wins; if it errors, times out, or returns
malformed JSON, the next one is tried.

### Setup (local Ollama)

```bash
LLM_PROVIDER=ollama
OLLAMA_MODEL=qwen3:4b-instruct
```

Ollama is used as-is with its native `/api/chat` structured-output mode.

### Notes

- `.env.local` is git-ignored; `.env.example` is committed as the template.
- Requests use OpenRouter's `response_format: json_schema` structured output.
- Model output is normalised by `lib/normalize.ts` before Zod validation, so
  minor shape deviations (`from`/`to` instead of `source`/`target`, a diagnostic
  given as a plain string, and similar) are repaired rather than fatal.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Smoke test

With the dev server running:

```bash
node scripts/smoke-test.mjs
```

It compiles and steelmans three sample arguments and prints graph statistics.
