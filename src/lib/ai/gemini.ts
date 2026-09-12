/**
 * Optional, user-keyed Gemini client. Runs entirely in the browser.
 *
 * Security notes:
 *  - The key is sent in the `x-goog-api-key` header, never in the URL.
 *  - The key is never bundled, logged, or persisted by us beyond opt-in localStorage.
 *  - The model is configurable via VITE_GEMINI_MODEL (default gemini-2.5-flash).
 */
const DEFAULT_MODEL = "gemini-2.5-flash";
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

export const aiEnabled = (import.meta.env.VITE_AI_ENABLED ?? "true") !== "false";
export const aiModel = import.meta.env.VITE_GEMINI_MODEL ?? DEFAULT_MODEL;

export interface GenerateOptions {
  apiKey: string;
  prompt: string;
  signal?: AbortSignal;
  timeoutMs?: number;
}

interface GeminiResponse {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
  error?: { message?: string };
}

export class AiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiError";
  }
}

export async function generateBrief({
  apiKey,
  prompt,
  signal,
  timeoutMs = 45_000,
}: GenerateOptions): Promise<string> {
  const key = apiKey.trim();
  if (!key) throw new AiError("Add a Gemini API key to generate a live brief.");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  if (signal) signal.addEventListener("abort", () => controller.abort(), { once: true });

  try {
    const response = await fetch(`${ENDPOINT}/${aiModel}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": key,
      },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      signal: controller.signal,
    });

    const data = (await response.json().catch(() => ({}))) as GeminiResponse;
    if (!response.ok) {
      throw new AiError(data.error?.message ?? `AI request failed (HTTP ${response.status}).`);
    }
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new AiError("The model returned an empty response.");
    return text;
  } catch (error) {
    if (error instanceof AiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new AiError("The AI request timed out. Try again.");
    }
    throw new AiError("Could not reach the AI service. Check your connection and key.");
  } finally {
    clearTimeout(timeout);
  }
}
