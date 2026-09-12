const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inr2 = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export const formatINR = (value: number): string => inr.format(Math.round(value));
export const formatINRPrecise = (value: number): string => inr2.format(value);

export const formatPct = (value: number, dp = 1): string => `${value.toFixed(dp)}%`;

export const formatSignedPct = (value: number, dp = 1): string =>
  `${value > 0 ? "+" : ""}${value.toFixed(dp)}%`;

/** 1,00,00,000 -> ₹1.00 Cr · 2,50,000 -> ₹2.5 L */
export function formatCompactINR(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(2)} Cr`;
  if (abs >= 1_00_000) return `₹${(value / 1_00_000).toFixed(1)} L`;
  if (abs >= 1_000) return `₹${(value / 1_000).toFixed(1)}k`;
  return `₹${value.toFixed(0)}`;
}

export const formatNumber = (value: number, dp = 0): string => value.toFixed(dp);

/** Tiny relative time for "as of" labels. */
export function relativeFromISO(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return iso;
  const days = Math.round((Date.now() - then) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  return `${Math.round(months / 12)} year(s) ago`;
}
