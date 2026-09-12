# V1 Remediation Recommendations — Mutual Fund Matrix

**Audience:** an engineering agent or developer tasked with fixing the *original*
Mutual Fund Matrix codebase (the one with `src/components/AgentCouncilView.tsx`,
`src/components/PortfolioDDLab.tsx`, `src/data/fundsDatabase.ts`, a single
`npm run build`, no tests).

**How to use this document:** work top to bottom. Every item has an ID, severity,
evidence, the required change, and an acceptance test. Do not mark an item done
until its acceptance test passes. Items are ordered so that later work depends on
earlier work.

**Guiding principle (the core of the fix):** *one contract for allocation, one
source for thresholds, and derive — never store — conclusions.* Almost every bug
in v1 is a violation of those three rules.

---

## 0. Executive summary

| ID | Severity | Issue | User-visible impact |
| --- | --- | --- | --- |
| P0-1 | 🔴 Critical | Committed secrets + course IP (`www.upsurge.club_cookies.txt`, transcripts) | Session hijack / legal exposure |
| P0-2 | 🔴 Critical | Stage keys differ per risk profile; Stage 3/4 only understand aggressive keys | 20–75% of moderate/conservative portfolios silently misallocated |
| P0-3 | 🔴 Critical | Stage 4 verdict/score/narrative hardcoded (`96/100`, `58.6%`, `18.5%`) | Approved-looking output unrelated to actual portfolio |
| P0-4 | 🟠 High | Stored `fiveStepFilter` flags contradict raw metrics (4 gold funds) | Wrong funds marked QUALIFIED |
| P0-5 | 🟠 High | Stage 2 SIP hardcoded (`84407`) in Stage 4 | Deployment cheques never match the goal |
| P0-6 | 🟠 High | Five hurdles defined differently in screener vs factsheet | Same fund passes one screen and fails another |
| P0-7 | 🟠 High | `portfolioTurnover` stored with mixed units | Renders 195–510% turnover |
| P0-8 | 🟠 High | Retired `gemini-1.5-flash`; API key in URL query | AI feature always fails; key leaks to logs |
| P0-9 | 🟡 Medium | Fake "LIVE API CONNECTED" AMFI sync (`setTimeout`) | Misrepresentation / trust |
| P1-1 | 🟡 Medium | No TER, tax, step-up in TVM; naive risk (no covariance); no rebalancing | Unrealistic plans; contradicts taught material |
| P1-2 | 🟡 Medium | No tests, no lint, no CI; 538 kB single bundle | Silent regressions, slow first load |
| P1-3 | 🟡 Medium | Curriculum numbering drifted from transcripts; no citations | Content cannot be traced |
| P1-4 | 🟡 Medium | Modal not accessible; tiny fonts; icon-only mobile nav | A11y failures |
| P2-1 | 🟢 Low | Hardcoded market data in header; `toLocaleString()` without `en-IN`; journey progress not persisted | Misleading/ cosmetic |
| P2-2 | 🟢 Low | Dead files (`writer.py`, `test_out.txt`, `test_pipe.txt`) | Noise |

---

## P0-1 — Remove secrets and course IP from the repository

**Evidence**
- `www.upsurge.club_cookies.txt` is tracked (`git ls-files`). It is a Netscape
  cookie jar from yt-dlp containing `_ga`, `FPID`, `_fbp`, `_clck`,
  `_hjSession…`; several expire in 2026–2027 (potentially live).
- All 14 `.srt` and `.txt` lecture transcripts are tracked.
- `.gitignore` only ignores `*.m4a`.

**Required change**
1. `git rm --cached www.upsurge.club_cookies.txt` and every transcript, then
   commit the deletion.
2. Rotate/invalidate the upsurge.club session and purge the file from history
   (`git filter-repo --path www.upsurge.club_cookies.txt --invert-paths`).
3. Add to `.gitignore`:
   ```
   *cookies*.txt
   *.m4a
   *.mp4
   *.srt
   content/transcripts/
   .env
   .env.*
   !.env.example
   *.tsbuildinfo
   ```
4. Add a secret scan to CI (e.g. `gitleaks`).

**Acceptance test**
- `git ls-files | Select-String "cookies|\\.srt"` returns nothing.
- A fresh clone contains no cookie file and no transcripts.

---

## P0-2 — One canonical allocation key set (fixes cross-stage data loss)

**Evidence**
- `src/components/AgentCouncilView.tsx` emits profile-specific keys:
  aggressive → `flexi/mid/large/debt/gold`, moderate → `…/baf/…`,
  conservative → `large/arb/corp/gold`.
- `src/components/PortfolioLookthroughBreakdown.tsx` and
  `src/components/PortfolioDDLab.tsx` only ever read
  `flexi, mid, large, debt, gold`.
- Result: for a moderate portfolio the 20–25% `baf` allocation is dropped; for
  conservative the `arb` + `corp` sleeves (60–75%) are dropped. The remainder is
  re-normalised, so every downstream number is wrong.
- `src/utils/storage.ts` default selections also assume the aggressive key set.

**Required change**
1. Introduce a single `SleeveKey` union used by every stage:
   `flexi | large | mid | small | baf | debt | gold`.
2. Add `sleeveOf(category)` mapping each SEBI category to exactly one sleeve.
3. Every stage 1 preset emits `SleeveKey → weight`. Stages 3 and 4 resolve
   selections only by `SleeveKey`.
4. Replace `selectedFundIdsByCategory` keys with the canonical set.

**Acceptance test**
- For each of the six presets (3 profiles × 2 models), a portfolio with one fund
  per active sleeve produces deployment cheques that sum to the input lump sum,
  with **no sleeve dropped**.
- Unit test: `sum(normalisedWeights) === 100` for every preset and for arbitrary
  perturbed weights.

---

## P0-3 — Derive the Stage 4 verdict; delete hardcoded conclusions

**Evidence**
- `src/components/PortfolioDDLab.tsx`: `96/100 Institutional Score` (line ~357),
  "58.6% blended down-capture" (~364, ~530), "18.5% low stock overlap" and
  "+16.6% downside protection" (~484), regardless of the user's portfolio.

**Required change**
1. Compute a transparent synthesis score from the live portfolio, e.g. weighted
   pillars: fund quality (40), capture asymmetry (20), overlap/diversification
   (15), downside defence/covariance (15), allocation completeness/band (10).
2. Render each pillar with its own score and a one-line derivation.
3. Empty portfolio ⇒ score `0`.
4. Remove all hardcoded narrative numbers; every sentence must interpolate a
   derived value.

**Acceptance test**
- Changing a selection changes the score.
- A portfolio with no funds selected scores `0` and shows an empty state (no
  phantom "Approved").
- No string literal like `96/100` or `58.6%` exists in the component.

---

## P0-4 — Stop storing screening verdicts; compute them

**Evidence**
- `src/data/fundsDatabase.ts` stores `fiveStepFilter.{rollingPassed, sortinoPassed,
  alphaPassed, upCapturePassed, downCapturePassed, totalScore, verdict,
  hurdleDeltas}` next to the raw metrics.
- Four gold funds have mean rolling below their benchmark yet
  `rollingPassed: true` / `QUALIFIED` (e.g. `nippon-gold-01` avg 13.85 vs bench
  13.92; `icici-gold-02`, `hdfc-gold-03`, `sbi-gold-04`).

**Required change**
1. Store raw metrics only. Delete every derived field from the dataset.
2. Add `runScreener(fund) → { results, score, verdict }` that computes pass/fail
   from `riskMetrics` + `rollingDistribution`.
3. The dataset must never contain `verdict`, `totalScore`, `hurdleDeltas` or
   `fiveStepFilter`.

**Acceptance test**
- A schema/test asserts the dataset has no derived fields.
- For every fund, `runScreener` output fully explains the displayed verdict.

---

## P0-5 — Couple the Stage 2 SIP into Stage 4 cheques

**Evidence**
- `src/components/PortfolioLookthroughBreakdown.tsx:39`: `const monthlySIP = 84407;`
- Stage 4 also prints "₹84,407 / month" and "₹1.90 Cr" as literal text.

**Required change**
1. Run the TVM solver once for the current goal and pass its
   `requiredMonthlySip` into the deployment calculator.
2. Pass the same function output into Stage 4 summary text.

**Acceptance test**
- Changing the goal horizon or expected return changes the monthly cheque on
  every scheme and the summary sentence.

---

## P0-6 — One threshold source, used everywhere

**Evidence**
- `FundCatalogView.tsx` criteria: Sortino > 1.5, Alpha > +1.5%, Up > 80%,
  Down < 75%, rolling beat > benchmark.
- `FactsheetModal.tsx:216-243` labels the *same* steps as: Sortino "> Benchmark",
  Alpha "> 0", Up-Capture "> 100", Down-Capture "< 100".
- The course rule for step 1 is "beat benchmark in ≥ 75% of rolling windows", but
  the code compares mean rolling CAGR.

**Required change**
1. Create `thresholds.ts` exporting the five hurdles exactly once.
2. Step 1 tests `beatBenchmarkPct >= 75` (and no negative windows), not the mean.
3. Factsheet, screener and any audit view import the same constants and labels.

**Acceptance test**
- A single grep for the numeric thresholds finds only `thresholds.ts`.
- The factsheet and the screener show identical pass/fail for every fund.

---

## P0-7 — Normalise numeric units in the dataset

**Evidence**
- `portfolioTurnover` is stored as a fraction for most funds (`0.18`) but as
  `1.95`, `4.8`, `5.1`, `4.2` for four funds (`quant-fc-05`, `kotak-arb-01`,
  `icici-arb-02`, `sbi-arb-03`); the UI multiplies by 100, rendering 195–510%.

**Required change**
1. Rename the field to `portfolioTurnoverPct` and store a percentage for all
   funds (a fraction × 100).
2. Audit every other numeric field for units and encode the unit in the name
   (`…Pct`, `…Cr`, `…Years`).
3. Validate ranges with a schema (e.g. 0 ≤ turnover ≤ 1000).

**Acceptance test**
- Dataset schema validation passes; a test asserts no value's unit is ambiguous
  and that all percentages are within sane bounds.

---

## P0-8 — Fix the AI integration

**Evidence**
- `PortfolioDDLab.tsx` calls
  `…/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`.
- `gemini-1.5-flash` was retired in 2025 → the call 404s.
- The key is passed in the URL query string, which leaks into logs/history.

**Required change**
1. Use a current model (e.g. `gemini-2.5-flash`), configurable via
   `VITE_GEMINI_MODEL`.
2. Send the key in the `x-goog-api-key` **header**, never the URL.
3. Gate the feature behind `VITE_AI_ENABLED`; show a graceful error and a
   timeout; never bundle or log a key.
4. State clearly that the key is user-supplied and stays in the browser.

**Acceptance test**
- A live request with a valid key returns text.
- Network inspection shows no key in the URL.

---

## P0-9 — Remove the fake "LIVE API CONNECTED" claim

**Evidence**
- `FundCatalogView.tsx` runs a `setTimeout` and reports
  "Sync complete! 1,428 active schemes scanned" with a "LIVE API CONNECTED"
  badge. Nothing is fetched.

**Required change**
- Either implement a real data refresh (see Appendix A) or remove the badge and
  the claim. Never present a simulation as a live integration.

**Acceptance test**
- No UI copy claims live connectivity unless an actual network fetch occurs.

---

## P1-1 — Deepen the financial engine

**Evidence**
- TVM ignores expense ratio, tax and SIP step-up.
- Stage 1 "risk" is a weighted sum of drawdowns, assuming perfect correlation —
  the opposite of the covariance law the app teaches.
- Rebalancing (±5% band) is described but never computed.
- Method-2 multiples are static prose, not blended from holdings.

**Required change**
1. TVM: net return = gross − TER; optional annual step-up; optional
   capital-gains tax; report real return via Fisher.
   Solve the SIP numerically when step-up is used (bisection is fine).
2. Portfolio risk: `σp = sqrt(wᵀΣw)` with a documented correlation matrix.
   Report both covariance volatility and naive volatility, and the difference.
3. Add a rebalancing plan: for current sleeve values and target weights, emit
   BUY/SELL/HOLD with rupee amounts when `|drift| > band`.
4. Method 2: blend `fund.weightedMultiples` across equity/hybrid sleeves only.

**Acceptance test**
- Increasing TER increases the required SIP.
- A 50/50 equity/gold mix shows covariance volatility below the naive average.
- A drifted portfolio produces trades with amounts that restore target weights.

---

## P1-2 — Add feedback loops and ship smaller bundles

**Evidence**
- No test runner, no lint config, no CI; `build` is `tsc && vite build`.
- Single 538 kB JS chunk (126 kB gzip) shipped on every route.

**Required change**
1. Add Vitest + React Testing Library. Domain modules must be pure and tested.
2. Add a type-aware ESLint config and a `lint` script.
3. Add `verify = typecheck && lint && test && build` and run it in CI
   (Render build command or GitHub Actions).
4. Lazy-load each stage route and split vendor chunks.

**Acceptance test**
- `npm run verify` fails the build on type, lint or test errors.
- No production chunk exceeds 500 kB.

---

## P1-3 — Map the curriculum to the transcripts with citations

**Evidence**
- `courseModules.ts` numbers diverge from the actual transcripts:
  transcript L03 = Time Value of Money, but module `l03` = "Method 2 Valuation";
  transcript L04 = "Equity & Hybrid fund types", transcript L05 = "Macro".
  Internal cross-references also disagree (one component calls itself "L03 TVM",
  another calls Method 2 "L03").
- No module cites its source lecture.

**Required change**
1. Renumber modules to match the transcript filenames exactly.
2. Add a `citations` array (`lectureId`, `label`, optional `timestamp`) to every
   module.
3. Add a build script that validates every citation against the local transcript
   set (`python pipeline/build_content.py --check`).

**Acceptance test**
- Every module cites ≥ 1 existing lecture; the validator fails on an unknown id.

---

## P1-4 — Accessibility and readability

**Evidence**
- Modals have no `role="dialog"`, no `aria-modal`, no focus trap, no focus
  restore; the factsheet does not close on backdrop click.
- Many 9–10px labels with low-contrast `stone-400`/`stone-500` on white.
- Mobile navigation is icon-only.

**Required change**
1. Build one accessible dialog (focus trap, Escape, backdrop click, returns
   focus, `aria-labelledby`).
2. Raise the smallest body text to ~12px and meet WCAG AA contrast.
3. Give mobile nav labelled items; add visible focus rings.
4. Add `role="progressbar"` with `aria-valuenow` where bars are used.

**Acceptance test**
- Keyboard-only traversal reaches every control; Escape closes modals; screen
  reader announces the dialog and its title.

---

## P2-1 — Remove misleading/static UI details

**Evidence**
- `Header.tsx` displays hardcoded "PE 22.4 · Expansion · CPI 5.1%" as if live.
- Several `.toLocaleString()` calls omit `'en-IN'` (US grouping).
- `JourneyView` completion state is component-local and resets on reload.

**Required change**
- Only render market data that is derived or clearly labelled as an assumption.
- Use `'en-IN'` formatting consistently.
- Persist curriculum progress (localStorage or the profile store).

**Acceptance test**
- Reloading the page preserves completed modules; currency groups in lakh/crore
  style.

---

## P2-2 — Delete dead artefacts

**Evidence**
- `writer.py`, `test_out.txt`, `test_pipe.txt` are unused.

**Required change**
- Remove them, or move genuinely useful tooling under `pipeline/` with docs.

**Acceptance test**
- No unreferenced files remain at the repository root.

---

## Cross-cutting: target architecture

Move all financial and content logic out of React components into pure modules:

```
src/domain/         # no React imports; fully unit-tested
  finance/          # thresholds · tvm · screener · portfolio · lookthrough · rebalance · synthesis
  content/          # curriculum model + citation types
src/data/           # validated datasets (schema-checked) + defaults
src/features/       # one folder per stage (thin, lazy-loaded)
src/components/ui/  # dumb primitives + one accessible Modal
src/store/          # persisted profile state
```

**Contract rules**
1. Stages 1/3/4 speak only `SleeveKey`.
2. Verdicts and scores are derived at runtime, never stored.
3. All thresholds live in one file.
4. Every user-visible number is either derived or labelled an assumption.

---

## Definition of Done (whole remediation)

- [ ] `npm run verify` (typecheck + lint + test + build) is green.
- [ ] No secrets or transcripts tracked; `gitleaks` clean.
- [ ] Six preset portfolios produce complete, correctly-summed allocations.
- [ ] Every fund verdict is derived and self-consistent.
- [ ] Deployment cheques sum exactly to the invested amount and reflect the goal.
- [ ] Stage 4 shows a derived score with pillar breakdown and a real empty state.
- [ ] AI call works on a current model with header auth.
- [ ] No chunk > 500 kB; every route lazy-loaded.
- [ ] Domain modules covered by tests, including a fuzz pass over
      many profile × weights × selections × goal combinations.
- [ ] Curriculum citations validate against the transcript set.

---

## Appendix A — Live NAV and daily refresh (future work)

**Current state:** the v1 and v2 datasets are static, representative,
teaching-only figures. **No live NAV is fetched**, and parameters are stored as
already-computed values rather than recomputed from price history.

**What "daily refresh" actually requires**

| Parameter | Source | Note |
| --- | --- | --- |
| Latest NAV | AMFI `NAVAll.txt` (daily) | One row per scheme; `scheme_code, nav, date` |
| NAV history | AMFI per-scheme history or `mfapi.in` | Required for rolling returns, σ, β, capture |
| Portfolio holdings / turnover | AMFI / SEBI monthly portfolio disclosures | Monthly, not daily |
| Benchmark levels | Index provider / AMFI TRI | For alpha, capture, beat-rate |

**Important:** rolling 3-year returns, Sortino, Jensen's alpha and capture ratios
cannot be computed from a single day's NAV. You need a rolling window of NAVs
(and benchmark return series). A daily job updates *one* new NAV per scheme but
must run the full computation over history.

**Recommended architecture (static hosting friendly)**

```
GitHub Action (cron: daily 21:00 IST)
  └─ python pipeline/fetch_nav.py
       ├─ download NAVAll.txt (+ history for new days)
       ├─ store history in data/nav_history/ (or a small DB / S3)
       ├─ recompute metrics for each scheme
       └─ emit src/data/funds.json (same schema)
  └─ npm run verify
  └─ commit regenerated funds.json -> Render redeploys
```

- Do **not** fetch AMFI directly from the browser: CORS, rate limits, and heavy
  rolling-return computation belong server-side.
- Keep the schema identical so the switch is drop-in for `src/data/funds.ts`.
- Cache last-known-good data; if a fetch fails, keep serving the previous file.
- Add a clear "as of <date>" label and the disclaimer that this is not advice.
- Attribution: respect the terms of use of any NAV/holdings source.

**Acceptance test for refresh**
- Running the job twice does not duplicate data.
- `funds.json` validates against the schema and changes only on days with new NAVs.
- The app shows the new "as of" date.
