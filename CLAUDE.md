# Peri — project context for all agents

Read this whole file before doing anything. It is the shared contract for four parallel workstreams. If anything you are asked to do conflicts with this file, stop and ask.

## What we are building

**Peri** is a perimenopause companion web app. A woman describes her symptoms in plain words. Peri:

1. Turns her free text into structured symptoms (Claude).
2. Estimates where she is in the menopause transition (pre, early peri, late peri, post) with a model trained on SWAN data, phrased as "consistent with", never as a diagnosis.
3. Shows how symptoms evolved over the following years for similar women in SWAN ("women like you"), as an aggregate band, never as individual participants.
4. Writes a one-page brief she can take to her doctor, with questions to ask and a link to The Menopause Society's practitioner directory.

**Positioning:** decision support ("bring this to your doctor"), not diagnosis. The brief is the product. The stage gauge is the hook.

**Headline model story:** cycle-based staging breaks for women on hormonal contraception, with a hormonal IUD, or after a hysterectomy. Our symptoms-only model estimates stage from age and symptoms alone. We train it with bleeding features held out and say so honestly. SWAN excluded hormone users at baseline, so this is a simulation of that scenario.

## Hard rules

1. **Never commit SWAN data or anything derived row-by-row from it.** ICPSR terms restrict redistribution. `data/raw/`, `data/processed/` and `models/` are gitignored. The pre-commit hook blocks them. Do not bypass the hook (`--no-verify` is forbidden).
2. **Never invent SWAN variable names.** Read the codebook. Record every variable you use, its codebook name per visit and its meaning in `data/variables.yaml` (this file IS committed; it contains no data).
3. **Never show individual participant trajectories.** Aggregate over at least 20 women. Suppress any cell with fewer than 20.
4. **Never commit secrets.** `ANTHROPIC_API_KEY` lives in `.env` (gitignored). Commit `.env.example` only.
5. **No user data on the server.** The backend is stateless. Symptom logs and briefs live in the browser (`localStorage`). This is a selling point; keep it true.
6. **Safety:** if the extracted symptoms include a red flag (bleeding after 12 months without a period, very heavy bleeding soaking a pad an hour, chest pain, thoughts of self-harm), the app shows a "please contact a clinician / emergency services now" message before anything else, and does not show a stage estimate.
7. **Stick to the API contract below.** If you need to change it, stop and tell the human; another workstream depends on it.

## Stack

- **Backend:** Python 3.11, FastAPI, uvicorn, pandas, pyreadstat, scikit-learn (`HistGradientBoostingClassifier`), anthropic SDK, pydantic v2, pytest.
- **Frontend:** Vite + React + TypeScript, Recharts for charts, plain CSS modules. Mobile-first (max width 430px, centred on desktop).
- **Claude model:** `claude-sonnet-5-5` via the Messages API. Use forced tool use (`tool_choice`) for anything that must return JSON.
- **Package management:** `uv` or `pip` with `backend/requirements.txt`; `npm` for frontend.

## Repo layout

```
peri/
  CLAUDE.md
  README.md
  .gitignore
  .env.example
  .githooks/pre-commit
  Makefile
  data/
    README.md              # how to download SWAN from ICPSR (committed)
    variables.yaml         # variable mapping (committed, no data)
    fallback/              # illustrative synthetic fixtures, clearly labelled (committed)
    raw/                   # SWAN files from ICPSR (gitignored)
    processed/             # parquet outputs (gitignored)
  models/                  # trained artefacts (gitignored)
  backend/
    app/
      main.py
      schemas.py           # pydantic models = the API contract
      routes/
      claude/              # prompts + client
      ml/                  # loading, features, stage model, trajectories
    tests/
    requirements.txt
  frontend/
    src/
      api/                 # typed client + types mirroring schemas.py
      screens/
      components/
  pitch/                   # slides, script, video notes
```

## API contract

All endpoints are `POST`, JSON in and out, under `/api`. Types are defined once in `backend/app/schemas.py` and mirrored in `frontend/src/api/types.ts`.

### `POST /api/extract`
Request: `{ "text": string, "age": number | null }`
Response:
```json
{
  "age": 45,
  "symptoms": [
    { "key": "hot_flashes", "present": true, "severity": "moderate", "frequency": "daily", "quote": "I wake up drenched" }
  ],
  "cycle": { "status": "irregular", "months_since_last_period": null, "changed_in_last_year": true },
  "hormonal_factors": { "hormonal_contraception": false, "hormonal_iud": false, "hysterectomy": false, "hrt": false },
  "red_flags": [],
  "missing_info": ["Does she have a hormonal IUD?"]
}
```
`symptoms[].key` is one of: `hot_flashes`, `night_sweats`, `sleep_trouble`, `mood_irritability`, `low_mood`, `anxiety`, `brain_fog`, `vaginal_dryness`, `low_libido`, `joint_pain`, `palpitations`, `headaches`. Severity: `mild | moderate | severe | null`. Frequency: `daily | weekly | monthly | rarely | null`. Cycle status: `regular | irregular | skipped_periods | no_period_12m | unknown`.

### `POST /api/stage`
Request: the `/api/extract` response.
Response:
```json
{
  "model_used": "cycle_aware" | "symptoms_only",
  "probabilities": { "pre": 0.12, "early_peri": 0.55, "late_peri": 0.28, "post": 0.05 },
  "headline": "consistent with early perimenopause",
  "reasons": ["Cycle changes in the last year", "Daily hot flashes", "Age 45"],
  "caveats": ["Estimated from symptoms only because of hormonal IUD"],
  "blocked_by_red_flag": false
}
```
Use `symptoms_only` whenever any `hormonal_factors` value is true or cycle status is `unknown`.

### `POST /api/trajectory`
Request: the `/api/extract` response.
Response:
```json
{
  "n_similar": 64,
  "source": "swan" | "fallback",
  "years": [0, 1, 2, 3, 4, 5],
  "series": [
    { "key": "hot_flashes", "label": "Hot flashes", "prevalence": [0.62, 0.66, 0.70, 0.64, 0.55, 0.48], "low": [...], "high": [...] }
  ],
  "note": "Share of similar SWAN participants reporting each symptom in the years after a visit like yours."
}
```

### `POST /api/brief`
Request: `{ "extract": <extract response>, "stage": <stage response>, "trajectory": <trajectory response> }`
Response: `{ "markdown": string }` containing: a 3-sentence summary in her words, a symptom table, the stage estimate with caveats, 5–7 questions to ask her doctor, and the practitioner directory link. Under 400 words.

## Git workflow — clean history is a requirement

- **Branches:** one per workstream: `feat/data`, `feat/backend`, `feat/frontend`, `docs/pitch`. `main` is always runnable.
- **Commits:** Conventional Commits, imperative mood, subject ≤ 72 characters, lowercase type, a scope where useful.
  - Types: `feat`, `fix`, `chore`, `docs`, `test`, `refactor`, `style`.
  - Examples: `feat(ml): train symptoms-only stage model`, `feat(api): add /api/extract with forced tool use`, `chore: add pre-commit hook blocking data files`.
- **One logical change per commit.** Code plus its tests in the same commit. No "WIP", "fix stuff", "final", or mega-commits mixing workstreams.
- **Commit at the end of every numbered step** in your task list, after its checks pass. Before each commit run `git status` and `git diff --staged` and confirm nothing under `data/raw`, `data/processed`, `models/` or `.env` is staged.
- **Integrating:** `git fetch && git rebase origin/main` on your branch, re-run checks, then open a PR or fast-forward merge. Never force-push `main`. Never merge `main` into your branch (rebase instead).
- **Freeze:** at demo freeze, tag `v0.1-demo` on `main`.

## Definition of done for any step

- Code runs. Tests for that step pass (`make test`).
- No secrets or data staged.
- Committed with a conventional message.
- If it changes how to run the app, `README.md` is updated in the same commit.
