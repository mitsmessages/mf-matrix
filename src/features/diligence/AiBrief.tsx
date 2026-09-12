import { useState } from "react";
import { Bot, KeyRound, Sparkles } from "lucide-react";
import { aiEnabled, aiModel, generateBrief, AiError } from "@/lib/ai/gemini";
import { Button, Callout, Card } from "@/components/ui/primitives";

const STORAGE_KEY = "mf_matrix_gemini_key";

export function AiBrief({ buildPrompt }: { buildPrompt: () => string }) {
  const [apiKey, setApiKey] = useState<string>(
    () => localStorage.getItem(STORAGE_KEY) ?? "",
  );
  const [remember, setRemember] = useState<boolean>(() => Boolean(localStorage.getItem(STORAGE_KEY)));
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brief, setBrief] = useState<string | null>(null);

  if (!aiEnabled) {
    return (
      <Callout tone="info">
        Live analysis is disabled in this deployment (VITE_AI_ENABLED=false). The built-in derived
        synthesis below still applies.
      </Callout>
    );
  }

  const persistKey = (value: string, save: boolean) => {
    setApiKey(value);
    if (save) localStorage.setItem(STORAGE_KEY, value);
    else localStorage.removeItem(STORAGE_KEY);
  };

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      const text = await generateBrief({ apiKey, prompt: buildPrompt() });
      setBrief(text);
    } catch (err) {
      setError(err instanceof AiError ? err.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Live AI committee brief
            </div>
            <div className="text-[11px] text-stone-500">
              Optional. Runs in your browser with your own key ({aiModel}).
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowKey((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-stone-600 hover:border-stone-400"
        >
          <KeyRound className="h-3 w-3" /> {apiKey ? "Key set" : "Add key"}
        </button>
      </div>

      {showKey ? (
        <div className="mt-3 space-y-2 rounded-xl border border-stone-200 bg-stone-50 p-3">
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => persistKey(e.target.value, remember)}
              placeholder="AIza…"
              aria-label="Gemini API key"
              className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-1.5 font-mono text-xs focus:border-stone-500 focus:outline-none"
            />
            <Button
              variant="accent"
              size="sm"
              onClick={() => {
                void run();
              }}
              disabled={loading || !apiKey}
            >
              {loading ? "Analyzing…" : "Analyze"}
            </Button>
          </div>
          <label className="flex items-center gap-2 text-[11px] text-stone-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => {
                setRemember(e.target.checked);
                persistKey(apiKey, e.target.checked);
              }}
              className="h-3.5 w-3.5 accent-stone-900"
            />
            Remember the key in this browser (localStorage)
          </label>
          <p className="text-[10px] text-stone-500">
            The key is sent only to Google via the request header, never bundled or logged. Get one
            at aistudio.google.com.
          </p>
        </div>
      ) : null}

      {error ? (
        <Callout tone="danger" className="mt-3">
          {error}
        </Callout>
      ) : null}

      {brief ? (
        <div className="mt-3 rounded-xl border border-stone-200 bg-stone-900 p-4">
          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-300">
            <Sparkles className="h-3 w-3" /> {aiModel} brief
          </div>
          <div className="whitespace-pre-wrap text-xs leading-relaxed text-stone-200">{brief}</div>
        </div>
      ) : null}
    </Card>
  );
}
