# Peri — agent task prompts

How to use this file:

1. One person runs **Prompt 0 (Scaffold)** first. It takes about 15–20 minutes and gives everyone a runnable skeleton, the API contract and mock endpoints.
2. Once Prompt 0 is merged to `main`, each person pulls `main`, creates their branch and gives their agent **their workstream prompt** (1, 2, 3 or 4). Everyone's agent reads `CLAUDE.md` automatically.
3. Paste a prompt as-is. Each one is self-contained and step-wise, and tells the agent to commit after every step.

## Timeline (2.5 hours)

| Time | What happens |
|---|---|
| 0:00–0:20 | Prompt 0: scaffold, contract, mocks (1 person). Others: data person finishes ICPSR download; frontend sketches screens; pitch starts slides. |
| 0:20–1:30 | Parallel build on four branches. Frontend builds against mocks. |
| 1:30–2:00 | Integration: backend swaps mocks for real models; frontend points at real API. Rebase and merge in order: data → backend → frontend → pitch. |
| 2:00–2:20 | End-to-end demo run, fix bugs only, record video. |
| 2:20 | Freeze. Tag `v0.1-demo`. No more commits except README typos. |

## Demo personas (used in tests, fixtures and the demo)

- **Persona A, "Maya", 45:** "I'm 45. My periods have been all over the place this year, sometimes 3 weeks apart, sometimes 2 months. I wake up drenched most nights, I can't concentrate at work, and I snap at my kids over nothing." → cycle-aware model, likely early peri.
- **Persona B, "Priya", 47, hormonal IUD:** "I'm 47 and have a Mirena so I don't really get periods. For about a year I've had hot flashes several times a day, I sleep terribly, my joints ache and I feel anxious for no reason." → symptoms-only model. This is the headline story.
- **Persona C, red flag:** "I'm 54, haven't had a period in two years, but I started bleeding again last week." → safety message, no stage.

---

## Prompt 0 — Scaffold (run first, one person, branch `chore/scaffold`)

```
You are setting up the Peri repo. Read CLAUDE.md fully first. Work step by step. After each step, run the listed check, then commit with the exact conventional message given (or a close equivalent). Do not combine steps into one commit.

Step 1 — Repo hygiene
- git init if needed. Create .gitignore covering: data/raw/, data/processed/, models/, .env, __pycache__/, .venv/, node_modules/, dist/, *.sav, *.dta, *.sas7bdat, *.xpt, *.rda, *.por, .DS_Store.
- Create .env.example with ANTHROPIC_API_KEY= and CLAUDE_MODEL=claude-sonnet-5-5.
- Create .githooks/pre-commit (bash, executable) that fails if any staged path matches data/raw/, data/processed/, models/, .env, or the SWAN file extensions above, printing which file was blocked. Add `make hooks` that runs `git config core.hooksPath .githooks`.
- Check: stage a dummy file at data/raw/test.sav and confirm the hook blocks it; then unstage and delete it.
- Commit: "chore: add gitignore, env example and pre-commit hook blocking data files"

Step 2 — Backend skeleton
- Create backend/ per the layout in CLAUDE.md. FastAPI app in backend/app/main.py with CORS for http://localhost:5173 and a GET /api/health returning {"ok": true}.
- backend/requirements.txt with pinned major versions: fastapi, uvicorn[standard], pydantic>=2, pandas, pyarrow, pyreadstat, scikit-learn, joblib, anthropic, python-dotenv, pyyaml, pytest, httpx.
- Check: `uvicorn app.main:app` starts; pytest test for /api/health passes.
- Commit: "feat(api): scaffold fastapi app with health endpoint"

Step 3 — API contract
- Implement every request/response model from the "API contract" section of CLAUDE.md in backend/app/schemas.py with pydantic v2, using Literal types for every enum listed there.
- Check: a pytest test that round-trips each example JSON from CLAUDE.md through its model.
- Commit: "feat(api): define pydantic schemas for the api contract"

Step 4 — Mock endpoints
- Create data/fallback/ with JSON fixtures for personas A, B and C (defined in AGENT_TASKS.md): extract, stage, trajectory and brief responses. Trajectory fixtures must set "source": "fallback" and use plausible, clearly illustrative numbers. Add data/fallback/README.md stating these are illustrative and not SWAN data.
- Implement POST /api/extract, /api/stage, /api/trajectory, /api/brief returning fixtures. Choose the persona by simple keyword matching on the text (IUD/Mirena → B, "bleeding again" → C, else A). Gate this with env var PERI_MOCK=1 (default 1 for now).
- Check: pytest hits each endpoint for each persona and validates against schemas.
- Commit: "feat(api): add mock endpoints backed by persona fixtures"

Step 5 — Frontend skeleton
- `npm create vite@latest frontend -- --template react-ts`. Add recharts.
- Create frontend/src/api/types.ts mirroring schemas.py exactly, and frontend/src/api/client.ts with one typed function per endpoint, base URL from VITE_API_URL (default http://localhost:8000).
- One placeholder screen calling /api/health and showing the result.
- Check: `npm run build` passes; the page shows ok:true with the backend running.
- Commit: "feat(web): scaffold vite react app with typed api client"

Step 6 — Developer experience
- Makefile targets: hooks, install, api (run uvicorn with reload), web (npm run dev), test (pytest + npm run build), train (placeholder that prints "see feat/data").
- README.md: one-paragraph pitch, quickstart (make install, cp .env.example .env, make hooks, make api, make web), a "Data" section pointing to data/README.md, and a "Not medical advice" note.
- data/README.md: how to get SWAN from ICPSR (free registered account, download the public-use files, place them in data/raw/, never commit them, redistribution is restricted by ICPSR terms).
- Check: fresh clone → follow README → app runs on mocks.
- Commit: "docs: add readme, data download instructions and makefile"

Finish: push branch, merge to main (fast-forward), tell the team main is ready.
```

---

## Prompt 1 — Data and models (branch `feat/data`)

```
You own the data and ML workstream for Peri. Read CLAUDE.md fully first, especially the hard rules on SWAN data. Work step by step; commit after each step with a conventional message; never stage anything under data/raw, data/processed or models/.

Context: SWAN public-use files from ICPSR are in data/raw/ (one or more files per visit, likely SAS/SPSS/Stata, plus codebook PDFs). Cohort: women aged 42–52 at baseline, followed annually.

Step 1 — Inventory and variable mapping (do not guess names)
- List files in data/raw/. Load the baseline file and one follow-up file with pyreadstat. Print column counts and a sample of names.
- Using the codebooks and column labels (pyreadstat returns variable labels — use them), find for EACH visit: participant ID, visit number, age, menopause status, bleeding/cycle regularity variables, hormone use, hysterectomy/oophorectomy, and these symptoms: hot flashes, night sweats, trouble sleeping, irritability/mood, depressed mood (or CES-D total), forgetfulness, vaginal dryness, joint stiffness/pain, heart racing, headaches. Note anything not available.
- Write data/variables.yaml mapping our feature name → per-visit source column → coding (what each value means) → notes. Include the menopause status codes exactly as in the codebook.
- Check: a script prints, per visit, which mapped columns are present and their non-null counts.
- Commit: "docs(data): map swan variables per visit in variables.yaml"

Step 2 — Long-format dataset
- backend/app/ml/load.py: read each visit, rename via variables.yaml, stack into one long table (one row per participant-visit), save to data/processed/swan_long.parquet.
- Map menopause status to our 4 classes: pre, early_peri, late_peri, post (natural only). Drop or flag visits with surgical menopause, current hormone therapy, or unknown status — record counts of what was dropped and why.
- Normalise symptom coding to: present (0/1) and, where available, frequency/severity on a small ordinal scale. Document the mapping in variables.yaml.
- Check: print rows, participants, class balance per visit, and the drop table. Unit test that load runs on a tiny synthetic frame with the same columns (create the synthetic frame in the test; do not use real data in tests).
- Commit: "feat(ml): build long-format swan dataset with 4-class stage labels"

Step 3 — Stage models (two models, honest evaluation)
- backend/app/ml/stage.py. Features: age + symptom features (+ cycle features for model A only).
  - Model A "cycle_aware": age + symptoms + bleeding/cycle features.
  - Model B "symptoms_only": age + symptoms; no bleeding/cycle features.
- HistGradientBoostingClassifier, class_weight balanced. Use GroupKFold by participant ID (5 folds) so no woman appears in both train and test. Calibrate with CalibratedClassifierCV (isotonic or sigmoid).
- Report per model: macro-F1, balanced accuracy, per-class recall, confusion matrix. Write to models/metrics.json and print a short markdown summary I can paste into slides. State plainly that model A's labels are largely defined by bleeding pattern, so its accuracy is expected to be high and is not the point; model B is the interesting result.
- Save both models with joblib to models/. Save the feature order alongside.
- Add `make train` that runs load + train end to end.
- Check: make train completes in under 5 minutes; metrics.json exists; unit test that a model trained on synthetic data returns 4 probabilities summing to 1.
- Commit: "feat(ml): train cycle-aware and symptoms-only stage models with grouped cv"

Step 4 — Explanations
- For a single input, return the top 3 reasons. Keep it simple and robust: compare the input's features to the training mean for the predicted class (or use permutation importance computed once at train time) and map feature names to plain-language phrases ("Daily hot flashes", "Cycle changes in the last year", "Age 45").
- Check: unit test on synthetic data returns 3 human-readable strings.
- Commit: "feat(ml): add plain-language reasons for stage predictions"

Step 5 — "Women like you" trajectories
- backend/app/ml/trajectory.py. Given a feature vector, find the k=50 nearest participant-visits (standardised age + symptoms + stage; one visit per participant, choose the closest). For each, take that visit as year 0 and gather their next up to 5 annual visits.
- For each symptom, compute prevalence per year (share reporting present) and a 90% bootstrap interval (200 resamples). Suppress any year with fewer than 20 contributing women (return null).
- Return exactly the /api/trajectory response shape from CLAUDE.md with "source": "swan".
- Precompute what you need at train time and save to models/ so requests are fast (<300 ms).
- Check: unit test on synthetic data enforces the n≥20 suppression; timing check prints latency.
- Commit: "feat(ml): add aggregate symptom trajectories for similar women"

Step 6 — Inference interface for the backend
- backend/app/ml/service.py exposing: features_from_extract(extract) -> (vector, model_choice), predict_stage(extract) -> StageResponse fields (minus headline wording), trajectory(extract) -> TrajectoryResponse. Map our symptom keys/severity/frequency to model features with a documented mapping; unknown symptoms default to absent.
- If models/ is missing, raise a clear ModelsNotTrained error so the backend can fall back to fixtures.
- Check: unit tests with personas A and B's extract fixtures from data/fallback/ (skip if models missing).
- Commit: "feat(ml): expose stage and trajectory inference service"

Step 7 — Slide numbers
- Print: cohort size used, number of visits, class balance, model A and B metrics, and one trajectory example for persona B. Save as pitch/model_summary.md (aggregate numbers only, no rows).
- Commit: "docs(pitch): add aggregate model summary for slides"

Then rebase on main and merge.
```

---

## Prompt 2 — Backend and Claude layer (branch `feat/backend`)

```
You own the API and Claude prompts for Peri. Read CLAUDE.md fully first. The mock endpoints and schemas already exist. Work step by step; commit after each step with a conventional message. Keep endpoints matching the contract exactly.

Step 1 — Claude client
- backend/app/claude/client.py: one Anthropic client, model from CLAUDE_MODEL env (default claude-sonnet-5-5), timeout 30 s, one retry on transient errors. Helper `call_tool(system, user, tool_schema)` that forces the tool with tool_choice and returns the parsed input dict.
- Check: test with the Anthropic client mocked (no network in tests).
- Commit: "feat(claude): add client wrapper with forced tool use"

Step 2 — /api/extract
- backend/app/claude/extract.py. System prompt rules:
  - Extract only what she said. Never infer a symptom she didn't mention; mark it absent only if she explicitly denies it, otherwise omit it.
  - Map her words to the fixed symptom keys in CLAUDE.md; keep a short verbatim quote for each.
  - Detect hormonal contraception, hormonal IUD (Mirena, Kyleena, etc.), hysterectomy, HRT.
  - Detect red flags exactly as listed in CLAUDE.md hard rule 6.
  - List up to 3 short follow-up questions in missing_info (e.g. age, whether periods have changed).
- Tool schema = the ExtractResponse JSON schema (generate it from the pydantic model with model_json_schema()). Validate Claude's output with pydantic; on validation failure retry once with the error message appended.
- Wire into the route when PERI_MOCK=0.
- Check: tests with mocked Claude responses for personas A, B, C; plus a manual script `python -m app.claude.extract "<persona text>"` that hits the real API and prints JSON. Run it for all three personas and confirm sensible output.
- Commit: "feat(api): extract structured symptoms from free text with claude"

Step 3 — /api/stage
- If red_flags is non-empty → return blocked_by_red_flag: true, empty probabilities, headline "Please speak to a clinician now", no reasons.
- Else call ml.service.predict_stage. Choose model per CLAUDE.md. Headline wording is deterministic, not Claude: "consistent with <stage in words>" using the top class; if the top probability < 0.45, say "somewhere between <top> and <second>".
- Caveats: always include "This is an estimate to discuss with your doctor, not a diagnosis." Add the symptoms-only caveat when that model is used, and "Based on a US cohort recruited in 1996–97" once.
- Fallback: if ModelsNotTrained, return the persona fixture and add caveat "Demo mode: illustrative estimate."
- Check: tests for red-flag blocking, model choice, low-confidence wording and fallback.
- Commit: "feat(api): serve stage estimates with safety gating and fallback"

Step 4 — /api/trajectory
- Call ml.service.trajectory; fall back to fixtures (source: "fallback") if models are missing. Never return series values for years suppressed by the ML layer (keep them null).
- Check: tests for both paths.
- Commit: "feat(api): serve similar-women trajectories with fallback"

Step 5 — /api/brief
- backend/app/claude/brief.py. Plain-text (markdown) generation, not tool use. System prompt rules:
  - Audience: her doctor, but written so she can read it too. Warm, concise, clinical where useful. Under 400 words.
  - Sections: "Summary" (3 sentences, in her own words where possible, quoting her), "Symptoms" (markdown table: symptom, frequency, severity, her words), "Where this may fit" (stage estimate exactly as given, with caveats; never upgrade certainty), "Questions to ask" (5–7 specific questions, e.g. about treatment options for vasomotor symptoms, whether her contraception affects assessment, sleep, mood screening), "Find a specialist" (link to The Menopause Society's find-a-practitioner directory — verify the current URL on menopause.org before hardcoding it).
  - Never recommend a specific drug or dose. Never state a diagnosis.
- If stage.blocked_by_red_flag, the brief is a short "seek care now" note listing the red flag in her words.
- Check: mocked tests; manual run for personas A and B; read the output and confirm it follows every rule.
- Commit: "feat(api): generate doctor brief with claude"

Step 6 — Hardening for demo
- Set PERI_MOCK default to 0; keep fixtures as automatic fallback on any Claude or model error (log the error, add the "Demo mode" caveat). The demo must never show a stack trace.
- Add request logging (endpoint, latency, which path: real/fallback). Never log the user's text.
- Check: kill the API key → all endpoints still return valid fallback responses.
- Commit: "fix(api): fall back to fixtures on any upstream failure"

Then rebase on main (after feat/data is merged), run make test, and merge.
```

---

## Prompt 3 — Frontend (branch `feat/frontend`)

```
You own the Peri web app. Read CLAUDE.md fully first. The typed API client and mock backend already exist; build against them. Work step by step; commit after each step with a conventional message.

Design direction: calm, warm, trustworthy — not clinical blue, not pink. Soft neutral background, one warm accent colour, generous spacing, large readable type (16px minimum body), rounded cards. Mobile-first: max-width 430px centred, works on a laptop for the demo. Accessible: proper labels, colour contrast AA, charts with text alternatives.

Step 1 — Layout and navigation
- App shell with a header ("Peri") and four screens: Welcome → Tell me (chat log) → Your picture (results) → Your brief. Simple state machine, no router library needed.
- Welcome: one-line promise ("Understand your symptoms. Get taken seriously."), age input, a privacy line ("Everything stays on your device"), and "Not medical advice" note. Continue button.
- Commit: "feat(web): add app shell and welcome screen"

Step 2 — Tell me (chat-style log)
- A chat-style screen: Peri asks "Tell me what's been going on, in your own words." Text area + send. Show her message as a bubble.
- On send: call /api/extract. Show a typing indicator. Then show Peri's reply as chips of the extracted symptoms (each chip shows the symptom and her quote on tap) and any missing_info questions as tappable follow-ups that prefill the box.
- "See my picture" button when at least one symptom is extracted.
- Persist the conversation and extract result in localStorage under one key; add a "Clear my data" button in the header menu.
- Commit: "feat(web): add chat-style symptom log with extraction chips"

Step 3 — Red-flag screen
- If extract.red_flags is non-empty, skip results and show a full-screen, calm but clear message: what she described (her words), "Please contact your doctor today, or emergency services if you feel unwell," and a back button. No stage gauge.
- Commit: "feat(web): add red-flag safety screen"

Step 4 — Your picture (results)
- Call /api/stage and /api/trajectory in parallel.
- Stage gauge: a horizontal four-segment track (Pre · Early peri · Late peri · Post) with a marker and soft probability shading. Headline text above it ("Your symptoms are consistent with early perimenopause"). Reasons as a short list. Caveats in small text. If model_used is symptoms_only, show a friendly note: "Because you have a hormonal IUD, we estimated this from your symptoms, not your cycle."
- Trajectory chart (Recharts): one line per symptom she reported (max 4, the most prevalent), with a shaded band from low to high, x-axis "Years from now", y-axis "Women like you reporting it (%)". Above it: "How symptoms changed for {n_similar} women like you". Render null values as gaps. If source is "fallback", show a small "Illustrative data" badge.
- Commit: "feat(web): add stage gauge and women-like-you trajectory chart"

Step 5 — Your brief
- Call /api/brief, render the markdown (use a small markdown renderer such as react-markdown) in a paper-style card.
- Buttons: "Download PDF" (window.print with a print stylesheet that shows only the brief, A4/letter friendly) and "Copy text".
- Save the latest brief in localStorage.
- Commit: "feat(web): add doctor brief view with print-to-pdf"

Step 6 — Polish for demo
- Loading and error states on every call (friendly copy, retry button; never show raw errors).
- A hidden demo helper: pressing "1", "2" or "3" on the Tell me screen prefills persona A, B or C text (from AGENT_TASKS.md).
- Check the full flow for all three personas on mocks, then against the real backend.
- Check: npm run build passes with no TypeScript errors.
- Commit: "style(web): add loading states, error handling and demo shortcuts"

Then rebase on main and merge.
```

---

## Prompt 4 — Pitch and docs (branch `docs/pitch`)

```
You own the Peri pitch materials and README polish. Read CLAUDE.md fully first. Work step by step; commit after each step. Only state facts that come from a source you have opened; put every source in pitch/sources.md with its URL.

Step 1 — Verify the gap statistics
- Find and open the original source for each: (a) only 25% of women identified as perimenopausal or menopausal at their first visit and 35% needing four or more visits (the team has a KVIA news link — find the underlying study); (b) fewer than 14% of women with moderate or severe hot flashes treated in primary care; (c) roughly 4,500 certified menopause practitioners vs 49,000+ OB-GYNs. Record exact figures, study, year and URL. Flag anything you cannot verify.
- Commit: "docs(pitch): verify gap statistics with sources"

Step 2 — Competitor slide
- One table: Apple Health (perimenopause/menopause tracking announced at WWDC 2026), 2–3 dedicated perimenopause apps, and 1–2 menopause telehealth companies. Columns: what it does, who pays, does it give her something for her doctor, does it use longitudinal evidence. Verify each from its own site.
- One-line differentiation: "Trackers record symptoms. Peri turns them into evidence and a brief that gets you taken seriously at the first visit, not the fourth."
- Commit: "docs(pitch): add competitor comparison"

Step 3 — Pitch script (3 minutes)
- pitch/script.md: hook with persona B (47, Mirena, a year of symptoms, told she's "too young" or "it's stress") → gap stats → demo (persona A quick, persona B in depth) → the symptoms-only model result (from pitch/model_summary.md when available) → privacy (data stays on device) → limitations said confidently (1996–97 US cohort, proof of concept, decision support not diagnosis) → close.
- Commit: "docs(pitch): add three-minute pitch script"

Step 4 — README polish
- Add: screenshot placeholders, architecture in 5 bullets, how the two models differ and why, data ethics (ICPSR terms, no data in repo, aggregate-only trajectories, n≥20 suppression, local-only storage), limitations, team.
- Commit: "docs: expand readme with architecture, data ethics and limitations"

Then rebase on main and merge last.
```

---

## Integration checklist (1:30–2:00, whole team)

1. Merge order: `feat/data` → `feat/backend` → `feat/frontend` → `docs/pitch`. Each author rebases on the latest `main` first and runs `make test`.
2. Data person runs `make train` on the demo laptop (models are not in git).
3. Set `PERI_MOCK=0`, run all three personas end to end.
4. Confirm: no SWAN files in `git log --all --stat` (`git log --all --name-only | grep -E "data/raw|data/processed|models/"` returns nothing).
5. Tag: `git tag v0.1-demo && git push --tags`.
