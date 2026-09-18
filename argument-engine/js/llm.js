// Optional local-LLM compiler. Talks to any OpenAI-compatible endpoint
// (LM Studio at 1234, Ollama at 11434). The response must match the same
// {nodes, edges} shape as the heuristic compiler.

export const DEFAULT_CONFIG = {
  baseUrl: "http://localhost:1234/v1",
  model: "",
  apiKey: "",
};

const SYSTEM_PROMPT = [
  "You are the compiler inside Argument Engine, a debugger for human arguments.",
  "Decompile the user's argument into a reasoning graph.",
  "Reply with JSON only, no prose:",
  '{"nodes":[{"id":"c1","kind":"claim","label":"CLAIM","text":"..."},...],"edges":[{"from":"e1","to":"p1","kind":"grounds"}]}',
  "Kinds: claim (exactly one), inference (the unstated step that makes the claim follow), premise, evidence.",
  "Edges point upward: evidence -> premise (grounds), premise -> inference (supports), inference -> claim (proves).",
].join(" ");

export async function compileWithLLM(source, config = {}) {
  const { baseUrl, model, apiKey } = { ...DEFAULT_CONFIG, ...config };
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify({
      model: model || "local-model",
      temperature: 0,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: source },
      ],
    }),
  });
  if (!response.ok) throw new Error(`LLM request failed: HTTP ${response.status}`);
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? "";
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("LLM returned no JSON graph");
  const parsed = JSON.parse(match[0]);
  if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
    throw new Error("LLM payload is not a graph");
  }
  return parsed;
}
