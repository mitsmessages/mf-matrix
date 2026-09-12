# ADR-0002 — Derive fund verdicts; never store them

- Status: accepted
- Date: 2026-09-12

## Context

The previous dataset stored `fiveStepFilter` flags, `totalScore`, `verdict`
and `hurdleDeltas` alongside the raw metrics. They drifted: four gold funds had
rolling averages below their benchmark yet were flagged `rollingPassed: true`
and `QUALIFIED`. Unit errors (`portfolioTurnover: 4.8` meaning 480% or 4.8%?)
compounded the problem.

## Decision

Store **raw, unit-documented metrics only**. Compute screening results at
runtime with `runScreener(fund)`:

- `portfolioTurnoverPct` is always a percentage (0–1000).
- Thresholds live in `domain/finance/thresholds.ts`.
- `verdict`, `totalScore` and all deltas are derived.

## Consequences

- A dataset can no longer contradict the screener.
- Changing a threshold instantly re-rates the whole universe.
- Tests pin the derivation so regressions are caught in CI.
