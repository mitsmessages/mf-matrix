/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AI_ENABLED?: string;
  readonly VITE_GEMINI_MODEL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
