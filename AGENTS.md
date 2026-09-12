# AGENTS.md

Instructions for agents working in this repo. Read `CONTEXT.md` first — it is
the shared language. Then read `README.md` and the ADRs in `docs/adr/`.

## Non-negotiables

1. **Never store derived verdicts.** Screening results come from
   `runScreener` / `evaluateScreening`. Do not add `verdict`, `totalScore` or
   `hurdleDeltas` to the dataset (ADR-0002).
2. **Allocation keys are canonical.** Only `SleeveKey` values cross stage
   boundaries. Do not introduce profile-specific keys (ADR-0001).
3. **`src/domain` is framework-free.** No React imports there. New financial
   logic goes in `domain/finance` with tests (ADR-0003).
4. **One threshold source.** Change hurdles only in
   `src/domain/finance/thresholds.ts`.
5. **No secrets.** Never add an API key to `.env`, code, or the bundle. AI keys
   are user-supplied at runtime and sent in a header.

## Workflow

- Run `npm run verify` before declaring any task done. It runs typecheck, lint,
  tests and a production build.
- For logic changes, write or update a test in the same folder (Vitest). The
  domain tests are the contract.
- Keep components thin: derive values with domain functions, render, done.
  Feature pages live in `src/features/<stage>` and are lazy-loaded.
- Prefer editing existing files. Do not add documentation files unless asked.

## Where to change what

| I want to… | Edit |
| --- | --- |
| Add/adjust a screening rule | `src/domain/finance/thresholds.ts` (+ its tests) |
| Add a fund | `pipeline/supplemental_funds.json`, then `npm run data:build` |
| Change the TVM maths | `src/domain/finance/tvm.ts` |
| Change crash/risk assumptions | `src/domain/finance/portfolio.ts` |
| Change the committee score | `src/domain/finance/synthesis.ts` |
| Change a curriculum module | `src/data/curriculum.ts` (keep citations) |
| Change routing/stages | `src/app/routes.ts`, `src/app/App.tsx` |

## Definition of done

- `npm run verify` is green.
- New domain behaviour is covered by a test that would fail without the change.
- No new `any`, no `@ts-ignore`, no unused exports.
- Numbers shown in the UI are derived or labelled as assumptions.
