import type { BadgeTone } from "./primitives";

export const verdictTone = (verdict: "QUALIFIED" | "WATCHLIST" | "REJECT"): BadgeTone =>
  verdict === "QUALIFIED" ? "success" : verdict === "WATCHLIST" ? "warning" : "danger";
