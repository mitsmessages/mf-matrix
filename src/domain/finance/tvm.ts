/**
 * Stage 2 — Time Value of Money goal solver.
 *
 * Pure. Net of expense ratio, with optional annual SIP step-up and optional
 * capital-gains tax. Uses an annuity-due (start-of-month) convention, matching
 * how Indian SIPs are debited. See CONTEXT.md (Stage 2).
 */

export interface TvmInput {
  goalName: string;
  /** Goal cost in today's money (₹). */
  targetToday: number;
  horizonYears: number;
  inflationPct: number;
  /** Gross expected portfolio CAGR (%). */
  expectedReturnPct: number;
  /** Total expense ratio (%). Reduces net return. */
  expenseRatioPct: number;
  /** Existing corpus already invested (₹). */
  existingLumpSum: number;
  /** Annual increase applied to the SIP (%). 0 = flat. */
  stepUpPct: number;
  taxEnabled: boolean;
  /** Effective tax rate on gains (%). */
  taxRatePct: number;
}

export interface TvmYearRow {
  year: number;
  annualOutlay: number;
  cumulativeInvested: number;
  gains: number;
  nominalValue: number;
  realValue: number;
  pctOfGoal: number;
}

export interface TvmResult {
  futureCostTarget: number;
  netReturnPct: number;
  netMonthlyRatePct: number;
  realReturnPct: number;
  requiredMonthlySip: number;
  lumpSumTodayRequired: number;
  totalInvested: number;
  finalValue: number;
  gains: number;
  postTaxValue: number;
  taxPaid: number;
  months: number;
  schedule: TvmYearRow[];
}

const EPS = 1e-9;

export const DEFAULT_TVM: TvmInput = {
  goalName: "Retirement Corpus",
  targetToday: 10_000_000,
  horizonYears: 10,
  inflationPct: 6.65,
  expectedReturnPct: 12,
  expenseRatioPct: 0.8,
  existingLumpSum: 0,
  stepUpPct: 0,
  taxEnabled: false,
  taxRatePct: 12.5,
};

interface Simulation {
  final: number;
  investedFromSip: number;
  totalInvested: number;
  /** Sample of the balance at the end of each year (index 0 = year 1). */
  yearly: { outlay: number; cumulativeInvested: number; value: number }[];
  monthlyRate: number;
}

function simulateSip(
  sip: number,
  input: TvmInput,
  monthlyRate: number,
  months: number,
): Simulation {
  const stepUp = input.stepUpPct / 100;
  let balance = input.existingLumpSum;
  let investedFromSip = 0;
  const yearly: Simulation["yearly"] = [];
  let yearOutlay = 0;

  for (let m = 0; m < months; m++) {
    const yearIndex = Math.floor(m / 12);
    const deposit = sip * Math.pow(1 + stepUp, yearIndex);
    balance += deposit;
    investedFromSip += deposit;
    yearOutlay += deposit;
    balance *= 1 + monthlyRate;

    if ((m + 1) % 12 === 0 || m === months - 1) {
      yearly.push({
        outlay: yearOutlay,
        cumulativeInvested: input.existingLumpSum + investedFromSip,
        value: balance,
      });
      yearOutlay = 0;
    }
  }

  return {
    final: balance,
    investedFromSip,
    totalInvested: input.existingLumpSum + investedFromSip,
    yearly,
    monthlyRate,
  };
}

function postTax(final: number, totalInvested: number, input: TvmInput): number {
  if (!input.taxEnabled) return final;
  const gains = Math.max(0, final - totalInvested);
  const tax = (gains * input.taxRatePct) / 100;
  return final - tax;
}

/** Solve the initial SIP by bisection so the goal is met (pre- or post-tax). */
function solveSip(
  input: TvmInput,
  monthlyRate: number,
  months: number,
  netReturnPct: number,
): Simulation {
  const required = input.targetToday * Math.pow(1 + input.inflationPct / 100, input.horizonYears);
  const existingFv = input.existingLumpSum * Math.pow(1 + netReturnPct / 100, input.horizonYears);
  if (existingFv >= required - EPS) {
    return simulateSip(0, input, monthlyRate, months);
  }

  const meetsTarget = (s: number): boolean => {
    const sim = simulateSip(s, input, monthlyRate, months);
    return postTax(sim.final, sim.totalInvested, input) >= required - EPS;
  };

  let lo = 0;
  let hi = Math.max(1000, required / Math.max(1, months));
  let guard = 0;
  while (!meetsTarget(hi) && guard++ < 80) {
    hi *= 2;
    if (hi > 1e12) break;
  }
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (meetsTarget(mid)) hi = mid;
    else lo = mid;
  }
  return simulateSip(hi, input, monthlyRate, months);
}

export function solveTvm(rawInput: TvmInput): TvmResult {
  const input: TvmInput = {
    ...rawInput,
    horizonYears: Math.max(0, Math.round(rawInput.horizonYears)),
  };
  const months = input.horizonYears * 12;
  const netReturnPct = Math.max(0, input.expectedReturnPct - input.expenseRatioPct);
  const monthlyRate = Math.pow(1 + netReturnPct / 100, 1 / 12) - 1;

  const futureCostTarget =
    input.targetToday * Math.pow(1 + input.inflationPct / 100, input.horizonYears);

  const realReturnPct =
    ((1 + netReturnPct / 100) / (1 + input.inflationPct / 100) - 1) * 100;

  const existingFv =
    input.existingLumpSum * Math.pow(1 + netReturnPct / 100, input.horizonYears);
  const shortfall = Math.max(0, futureCostTarget - existingFv);
  const lumpSumTodayRequired = shortfall / Math.pow(1 + netReturnPct / 100, input.horizonYears);

  const sim = solveSip(input, monthlyRate, months, netReturnPct);
  const requiredMonthlySip =
    sim.investedFromSip < 1e-6 ? 0 : sim.investedFromSip / depositFactor(input, months);
  const gains = Math.max(0, sim.final - sim.totalInvested);
  const postTaxValue = postTax(sim.final, sim.totalInvested, input);

  const schedule: TvmYearRow[] = sim.yearly.map((row, idx) => {
    const year = idx + 1;
    const realValue = row.value / Math.pow(1 + input.inflationPct / 100, year);
    return {
      year,
      annualOutlay: row.outlay,
      cumulativeInvested: row.cumulativeInvested,
      gains: Math.max(0, row.value - row.cumulativeInvested),
      nominalValue: row.value,
      realValue,
      pctOfGoal: Math.min(100, (row.value / (futureCostTarget || 1)) * 100),
    };
  });

  return {
    futureCostTarget,
    netReturnPct,
    netMonthlyRatePct: monthlyRate * 100,
    realReturnPct,
    requiredMonthlySip,
    lumpSumTodayRequired,
    totalInvested: sim.totalInvested,
    finalValue: sim.final,
    gains,
    postTaxValue,
    taxPaid: sim.final - postTaxValue,
    months,
    schedule,
  };
}

/**
 * The ratio between total deposits over the horizon and the *initial* monthly
 * instalment. With a step-up, deposits form 12·(1 + g + g² + …) per year, so
 * dividing total deposits by this factor recovers the initial SIP.
 */
function depositFactor(input: TvmInput, months: number): number {
  const g = input.stepUpPct / 100;
  const fullYears = Math.floor(months / 12);
  const remainder = months - fullYears * 12;
  let factor = 0;
  for (let y = 0; y < fullYears; y++) factor += 12 * Math.pow(1 + g, y);
  if (remainder > 0) factor += Math.pow(1 + g, fullYears) * remainder;
  return factor === 0 ? months : factor;
}
