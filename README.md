# Mutual Fund Matrix — DeepSeek rebuild

A production-grade, offline-first decision engine that turns a mutual-fund
masterclass into an auditable five-stage workflow:

**Journey → Allocate → Goal → Screen → Diligence → Synthesise**

Built from scratch as a clean rebuild. Every financial number is derived from a
validated dataset by pure, unit-tested domain functions. Nothing important is
hardcoded.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
npm run verify       # typecheck + lint + tests + production build
```

Node 20+ required. Python 3.10+ is only needed for the optional data/content
pipelines.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server on port 3000 |
| `npm run build` | Typecheck (`tsc -b`) then production build to `dist` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Strict TypeScript, no emit |
| `npm run lint` | ESLint (type-aware) |
| `npm test` / `test:watch` | Vitest (55+ tests) |
| `npm run test:coverage` | Coverage for `src/domain` and `src/lib` |
| `npm run verify` | The full gate — run before every commit |
| `npm run data:build` | Regenerate `funds.json` from a legacy source |
| `npm run content:check` | Validate curriculum citations against transcripts |

## The five stages

| Stage | Route | What it does | Key domain module |
| --- | --- | --- | --- |
| Journey | `/journey` | 12 curriculum modules with pitfalls, rules, formulas, citations and persisted progress | `data/curriculum.ts` |
| 1 — Allocate | `/allocation` | Risk profile to canonical sleeve weights, with a 5-agent council. Covariance-based risk. | `domain/finance/portfolio.ts` |
| 2 — Goal | `/goal` | Net-of-TER SIP solver with step-up, tax and a year-by-year matrix | `domain/finance/tvm.ts` |
| 3 — Screen | `/screener` | The five-hurdle gatekeeper over the whole universe, sortable and selectable | `domain/finance/screener.ts` |
| 4 — Diligence | `/diligence` | Look-through, Method 2 multiples, overlap, crash stress, rebalancing, derived synthesis, optional AI brief | `domain/finance/lookthrough.ts`, `portfolio.ts`, `rebalance.ts`, `synthesis.ts` |

## Architecture

```
src/
  domain/            pure, framework-free, fully tested
    finance/         thresholds · tvm · screener · portfolio · lookthrough · rebalance · synthesis
    content/         curriculum + citation types
  data/              validated datasets (zod) + defaults
  features/          one folder per stage (lazy-loaded route)
  components/ui/     shared primitives + accessible Modal
  store/             zustand persisted profile
  lib/               formatting · cn · AI client
  app/               router + shell + error boundary
pipeline/            python: funds transform + transcript content pipeline
docs/adr/            architecture decision records
```

### Design rules (enforced)

1. **One allocation unit.** Stages 1, 3 and 4 speak only `SleeveKey`
   (`flexi | large | mid | small | baf | debt | gold`). See ADR-0001.
2. **Derive, never store, verdicts.** Screening results are computed from raw
   metrics at runtime. See ADR-0002.
3. **Pure domain.** No React under `src/domain`; tests are the contract. See ADR-0003.
4. **No secrets in the bundle.** The optional AI brief uses a user-supplied key
   sent via the `x-goog-api-key` header, never a URL or env secret.

## Dataset

`src/data/funds.json` holds 32 funds across five SEBI categories, plus four
hand-authored Balanced Advantage / Small Cap funds so every preset sleeve is
satisfiable. It is validated by zod at load and by tests in CI. Turnover is
always a percentage; market-cap breakdowns sum to 100; verdicts are absent.

Provenance is tagged `synthetic-teaching-dataset` and surfaced in the footer.
This is an educational tool, **not investment advice**.

## Live universe & weekly refresh

The Screener runs over a real, ranked universe generated from live data:

```bash
python pipeline/fetch_universe.py --top 12 --candidates 45
```

- **Sources:** AMFI `NAVAll.txt` (direct-growth scheme list + latest NAV) and
  `api.mfapi.in` (NAV history + SEBI category).
- **Method:** top 12 per category by a transparent composite (rolling beat rate,
  Sortino, alpha, capture spread, down-capture), computed against a
  category-consensus benchmark.
- **Output:** `src/data/universe.generated.json` (metrics-only funds, clearly
  labelled) plus `src/data/universe_changelog.json` (retained / new / dropped).
- **Automation:** `.github/workflows/refresh-universe.yml` runs weekly.

Holdings, TER, AUM and manager data are not in these feeds; generated funds are
tagged `dataQuality: "metrics-only"` and the UI shows those fields as `—`.

## Sleeve-aware screening

The five-hurdle gatekeeper adapts to the sleeve: equity (full five hurdles),
hybrid/BAF (relaxed down-capture), debt (stability and capital preservation) and
commodity/gold (crisis defence). Thresholds live only in
`src/domain/finance/thresholds.ts`.

## Scenario & Recommendations

`/scenario` shows the selected scenario end to end plus rule-based suggestions
(index core, international, duration, gold wrapper, overlap, capture asymmetry,
cost drag, horizon fit) — each citing its lecture.

## Optional AI brief

Set `VITE_AI_ENABLED=true` (default) and paste a Gemini API key in the Stage 4
panel. The key is used only in your browser against `x-goog-api-key`. Configure
the model with `VITE_GEMINI_MODEL` (default `gemini-2.5-flash`).

## Content pipeline

Course transcripts are IP and are not committed. To validate that every
curriculum citation resolves:

```bash
# put transcripts in content/transcripts/ as "<Lxx> <title>.txt|.srt"
python pipeline/build_content.py --check
```

To draft modules from transcripts with an LLM, set `GEMINI_API_KEY` and run
`python pipeline/build_content.py --generate`. Generated drafts are review-only
and land in the gitignored `content/generated/`.

## Deployment

`render.yaml` deploys as a static site: `npm ci && npm run verify`, publishing
`dist`, with SPA rewrites and immutable asset caching. The build fails if types,
lint or tests fail.

## License / disclaimer

Educational use. Past performance does not guarantee future results. Mutual fund
investments are subject to market risk.
