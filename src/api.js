import { callLocalLLM } from "./localLLM.js";

export async function callLLM({ messages, system, settings }) {
  // Demo mode: use local mock LLM (no network required)
  if (settings.demoMode) {
    return callLocalLLM({ messages, system });
  }

  const headers = {
    "Content-Type": "application/json",
    "anthropic-version": "2023-06-01",
  };
  if (settings.apiKey) headers["x-api-key"] = settings.apiKey;

  const res = await fetch(settings.apiUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: settings.model || "claude-sonnet-4-20250514",
      max_tokens: 800,
      system,
      messages,
    }),
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  return data.content.find((b) => b.type === "text")?.text || "";
}
