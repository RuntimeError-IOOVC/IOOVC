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

## Deploying to Cloudflare (Workers + Assets → *.pages.dev / *.workers.dev)

This repo uses [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare)
to run the Next.js app on Cloudflare Workers with static assets. The app is
**not a static site** (it has `/api/compile` and `/api/steelman` routes), so it
cannot use Cloudflare Pages' simple static git flow — the managed equivalent is
Workers + OpenNext, which still gives you a `https://<project>.pages.dev` (or
`.workers.dev`) URL and is fully manageable from the Cloudflare dashboard.

### 1. Local build & preview

```bash
npm install
npx opennextjs-cloudflare build     # produces .open-next/ (worker + assets)

# create .dev.vars first with your key for preview:
#   OPENROUTER_API_KEY=sk-or-...
npx opennextjs-cloudflare preview   # -> http://localhost:8787
```

### 2. Deploy

First-time CLI deploy:

```bash
npx wrangler login                                  # browser OAuth
npx wrangler secret put OPENROUTER_API_KEY          # paste sk-or-... key
npm run deploy                                      # = opennextjs-cloudflare build && deploy
```

### 3. Manage from the Cloudflare dashboard (web)

After the first deploy, everything is visible/editable at
https://dash.cloudflare.com → **Workers & Pages** → **argument-engine**:

- **Overview / Deployments** — see versions, roll back to any previous deploy
- **Settings → Variables and Secrets** — add/update `OPENROUTER_API_KEY` and
  other env vars right in the web UI (no CLI needed for changes)
- **Observability → Logs / Metrics** — view request logs & error traces
- **Custom Domains** — attach your own domain (e.g. `argument.example.com`)
- **Triggers** — set up cron triggers if you later add scheduled tasks

### 4. Automatic deploys from GitHub (CI) — optional but recommended

A workflow is included (`.github/workflows/deploy.yml`): every push to `main`
rebuilds and deploys automatically. To enable it:

1. In GitHub: repo → Settings → Secrets and variables → Actions, add:
   - `CLOUDFLARE_API_TOKEN` — create an API token at
     <https://dash.cloudflare.com/profile/api-tokens>
     (template "Edit Cloudflare Workers" or "Read/Write" on your account)
   - `CLOUDFLARE_ACCOUNT_ID` — your account ID (dashboard sidebar)
   - `OPENROUTER_API_KEY` — your `sk-or-...` key
2. Push the workflow to GitHub:

   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "ci: deploy to cloudflare on push"
   git push
   ```

   The action will build and deploy; subsequent deploys are fully automatic.

### Cloudflare env config (`wrangler.jsonc`)

- `main` → the OpenNext worker (`.open-next/worker.js`)
- `assets.directory` → `.open-next/assets`
- `vars` → non-secret config (`LLM_PROVIDER`, `OPENROUTER_MODELS`, ...)
- `compatibility_flags: ["nodejs_compat"]` → required for the Node.js runtime
- Secrets → `wrangler secret put` or dashboard (stored encrypted)

> Note: on Cloudflare the `ollama` fallback cannot work (it points at localhost).
> Use `openrouter` (the default).

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
