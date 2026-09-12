# CONTEXT — Mutual Fund Matrix (DeepSeek rebuild)

A shared language so humans and agents describe this system in the same words.
Read this before touching code.

## One-liner

A five-stage, offline-first decision engine that turns a mutual-fund masterclass
into an auditable investment workflow: **Allocate → Goal → Screen → Diligence →
Synthesise**.

## The five stages (ubiquitous language)

| Term | Meaning |
| --- | --- |
| **Journey** | The curriculum surface. 12 modules, each with a pitfall, the institutional fix, a rule, formulas, citations and a lab. Progress is persisted. |
| **Stage 1 — Allocation** | Risk profile → canonical sleeve weights. Never fund names yet. |
| **Stage 2 — TVM** | Convert a life goal into an inflation-adjusted target and the monthly SIP required to hit it (net of fees, with optional step-up and tax). |
| **Stage 3 — Screen** | The five-hurdle gatekeeper. Raw metrics in → verdict out. Thresholds live in one place. |
| **Stage 4 — Diligence** | Portfolio-level risk (covariance), crash stress, stock overlap, look-through and rebalance plan. |
| **Synthesis** | The committee verdict. Derived from data, never hardcoded. |

## Canonical vocabulary

- **Sleeve** (`SleeveKey`) — the *only* allocation unit. One of
  `flexi | large | mid | small | baf | debt | gold`. Every stage keys off this set.
- **Fund** — an instrument mapped to exactly one sleeve via `sleeveOf(category)`.
- **Hurdle** — one of five screening tests: `rolling`, `sortino`, `alpha`, `upCapture`, `downCapture`.
- **Verdict** — `QUALIFIED` (5/5), `WATCHLIST` (3–4/5), `REJECT` (≤2/5).
- **Baseline** vs **Enhanced** — Stage 1 model. Baseline = L02 two-asset model; Enhanced = council model (+ gold/hybrid).
- **Nominal** vs **Real** — money at future prices vs money at today's purchasing power.
- **TER** — total expense ratio. Reduces net return everywhere.
- **Capture** — up/down capture relative to benchmark (100 = in line).
- **Provenance** — every content claim cites a lecture id and (optionally) an SRT timestamp.

## Invariants (do not violate)

1. Stage 1, 3 and 4 speak **only** `SleeveKey`. No stage-specific keys. (ADR-0001)
2. A fund's verdict is **derived** at runtime from `runScreener`; it is never stored. (ADR-0002)
3. All financial math is **pure and framework-free** under `src/domain`. Tests are the contract. (ADR-0003)
4. No secret ever enters the bundle or git. AI keys are user-supplied at runtime.
5. Every number shown to a user is either derived from data or explicitly labelled as an assumption.

## Where things live

```
src/
  domain/      pure financial + content logic (no React)
    finance/   thresholds, tvm, screener, portfolio, lookthrough, rebalance
    content/   curriculum model + citation helpers
  data/        validated datasets (funds.json, curriculum, agents)
  features/    one folder per stage, owns its UI
  components/  shared, dumb UI kit
  store/       zustand profile store (persisted)
  lib/         formatting, classnames, AI client
  app/         router + shell
```

## Glossary of financial rules (from the masterclass)

- Sell-side return data lies; use **rolling returns** and **% of windows beating benchmark**.
- Penalise only downside variance → **Sortino**, not Sharpe alone.
- True skill = **Jensen's alpha** above CAPM, not borrowed beta.
- Protect compounding = **down-capture < 75**, target capture spread > +15 pts.
- Value a portfolio with **sector-native multiples** (P/B for banks, EV/EBITDA for infra, P/E for asset-light, P/S for cyclicals, dividend yield for PSUs).
- Diversification is covariance, not a weighted average of drawdowns.
