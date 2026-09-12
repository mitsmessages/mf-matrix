# ADR-0003 — Pure domain layer, React only at the edge

- Status: accepted
- Date: 2026-09-12

## Context

In the previous codebase, the financial logic was buried inside 1,300-line
React components: TVM maths, crash stress, overlap and normalisation all mixed
with JSX. It could not be tested, reused, or reasoned about.

## Decision

All financial and content logic lives under `src/domain` as pure functions
with zero React imports. UI is a thin shell over it. Vitest owns the contract.

Deep modules (small interface, substantial behaviour):

- `finance/tvm.ts` — goal solver (TER, step-up, tax, real rate, schedule)
- `finance/screener.ts` — five-hurdle gatekeeper
- `finance/portfolio.ts` — covariance risk, capture, crash stress
- `finance/lookthrough.ts` — aggregation & deployment cheques
- `finance/rebalance.ts` — ±band rebalance plan

## Consequences

- Domain is fully unit-tested in CI without a DOM.
- Components become render logic only, and shrink dramatically.
- Any surface (web, CLI, report) can reuse the same engine.
