# ADR-0001 — Canonical sleeve keys across all stages

- Status: accepted
- Date: 2026-09-12

## Context

The previous engine let each risk profile invent its own allocation keys
(`flexi/mid/large/debt/gold` for aggressive, but `baf` for moderate and
`arb/corp` for conservative). Stage 3 and Stage 4 only understood the
aggressive key set, so every moderate/conservative portfolio silently dropped
20–75% of its allocation and re-normalised the rest. All downstream numbers —
look-through, deployment cheques, crash stress — were wrong.

## Decision

Introduce a single `SleeveKey` union used by every stage:

`flexi | large | mid | small | baf | debt | gold`

- Stage 1 emits `SleeveKey → weight` maps.
- Funds carry a SEBI `category`; `sleeveOf(category)` maps it to a `SleeveKey`.
- Stage 3/4 resolve selections by `SleeveKey` only.

## Consequences

- One contract, enforced by types. The class of bug is structurally impossible.
- The conservative profile's "corporate bond" sleeve is represented as `debt`
  (arbitrage + high-grade) until dedicated short-debt funds are added.
- Sleeve metadata (expected CAGR, volatility, role) lives in one registry.
