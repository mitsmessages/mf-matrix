/**
 * Peer-ranking weights — the composite used to order the top-12 universe.
 * Separate from the verdict (which counts hurdles equally). Single source for
 * the UI; the Python pipeline mirrors these numbers.
 */
export const RANK_WEIGHTS = [
  { id: "rolling", label: "Rolling beat rate", weightPct: 30 },
  { id: "sortino", label: "Sortino", weightPct: 18 },
  { id: "alpha", label: "Alpha", weightPct: 18 },
  { id: "spread", label: "Capture spread", weightPct: 18 },
  { id: "downCapture", label: "Down-capture", weightPct: 16 },
] as const;

export const rankWeightSummary = (): string =>
  RANK_WEIGHTS.map((w) => `${w.label} ${w.weightPct}%`).join(" · ");
