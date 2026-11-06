# Peri — agent task list

Solo build, one agent (Claude Code), ~2 hours. Read `CLAUDE.md` fully first. Work through the steps in order; after each step's check passes, commit with a short conventional-ish message before moving on.

## Demo persona recap (full definition lives in `CLAUDE.md`)

**Jenny** — late pregnancy through 20+ weeks postpartum. Sleep trouble early → product advice within budget. BP trending up right at week 6, as formal follow-up ends → the doctor-side flag and referral. A low-mood stretch → the therapy scheduler surfaces. Two lightweight stub patients sit next to her in the doctor's list for context only.

## Time budget (~2 hours)

| Step | What | Time |
|---|---|---|
| 1 | Theme + routing shell | ~15 min |
| 2 | Mock data: patient arc, products, therapists | ~20 min |
| 3 | Patient view + budget control | ~25 min |
| 4 | Ask Peri chat + therapy scheduler | ~25 min |
| 5 | Doctor dashboard + referral generator | ~25 min |
| 6 | Env + polish pass | ~10 min |

If time runs short: protect the budget control and the paid/free-alternative pairing in step 3 and 4 — that's the pitch's equity argument. The therapy scheduler's visual polish in step 4 is the first thing to cut.

---

## Step 1 — Theme + routing shell (~15 min)

- Install `tailwindcss`, `@tailwindcss/postcss`, `postcss`, `autoprefixer`, `react-router-dom`, `@anthropic-ai/sdk`.
- Create `postcss.config.js` wiring `@tailwindcss/postcss`.
- Rewrite `src/index.css`: `@import "tailwindcss";` plus a `@theme` block defining the Peri palette (terracotta, sage, sand, ink scales) per `CLAUDE.md`.
- Set up `react-router-dom` with routes: `/` (Landing — "I'm a patient" / "I'm a doctor"), `/patient`, `/patient/chat`, `/doctor`, `/doctor/:patientId`.
- Basic shared layout shell (header with Peri name/logo mark, calm background).
- Check: `npm run dev` loads the landing route and both entry links route correctly.
- Commit: "feat: add tailwind theme, routing shell, and landing"

## Step 2 — Mock data: patient arc, products, therapists (~20 min)

- `src/data/patient.ts`: Jenny's week-by-week timeline from late pregnancy to 20+ weeks postpartum — wearable readings (sleep hours, resting heart rate, blood pressure), a mood/check-in score, and derived flags per week (e.g. `sleepDebt`, `bpElevated` starting ~week 6, `lowMood` during one stretch).
- `src/data/products.ts`: catalog entries — `{ id, name, category, price, buyLink, freeAlternative }`. Cover sleep, breastfeeding/postpartum recovery, baby gear. Every paid entry has a `freeAlternative` string.
- `src/data/therapists.ts`: 2–3 virtual providers — `{ id, name, pricePerSession, slidingScaleNote, slots: string[] }`.
- Check: a scratch import/log of each module in `App.tsx` (temporary) confirms shapes are usable; remove before commit.
- Commit: "feat: add mock patient, product, and therapist data"

## Step 3 — Patient view + budget control (~25 min)

- `src/state/budget.ts`: small context/hook holding a monthly `$` budget value (or an "insurance covers this" toggle meaning no constraint), settable from the UI.
- `src/routes/patient/PatientHome.tsx`:
  - Today snapshot cards (sleep, HR, BP) for the current week.
  - Budget control (simple slider or input + the insurance toggle).
  - Week scrubber (1 → 20+) so the demo can move through Jenny's arc live.
  - Staged advice feed driven by the current week's flags, each card showing a product recommendation *filtered/labeled against budget* — if the product's price is within budget show it plainly; if not, lead with the free alternative and show the paid option as a stretch pick. Never show a paid-only recommendation.
- Check: scrubbing through weeks changes the snapshot and advice feed; toggling the budget changes which product is primary vs. the free alternative.
- Commit: "feat: add patient home with budget-aware advice feed"

## Step 4 — Ask Peri chat + therapy scheduler (~25 min)

- `src/lib/claude.ts`: thin wrapper around `@anthropic-ai/sdk` (`dangerouslyAllowBrowser: true`, key from `import.meta.env.VITE_ANTHROPIC_API_KEY`), one function for chat, reused in step 5 for referral generation.
- `src/routes/patient/AskPeri.tsx`: chat UI. System prompt: calm, non-diagnostic postpartum/pregnancy assistant; when relevant, it may recommend catalog products from `products.ts` but must stay within the patient's set budget and always mention a free alternative; never phrases anything as a diagnosis. Include a static "women at your stage are asking" row of suggested questions above the input.
- `src/routes/patient/TherapyScheduler.tsx`: when the current week's data has `lowMood` set, show a card/banner on patient home linking here. Modal or page listing `therapists.ts` with price shown against the sliding scale and the budget; picking a slot shows a mock confirmation (no real calendar/payment integration).
- Check: sending a chat message gets a real Claude response; asking about something budget-relevant (e.g. "what should I buy for sleep") stays within budget and mentions a free option; scrubbing to the low-mood week surfaces the scheduler entry point.
- Commit: "feat: add Ask Peri chat and therapy scheduler"

## Step 5 — Doctor dashboard + referral generator (~25 min)

- `src/routes/doctor/DoctorDashboard.tsx`: patient list — Jenny (full, clickable) plus 2 lightweight stub rows (name + a flag badge only, not clickable or clearly marked "demo placeholder") so the list doesn't look empty.
- `src/routes/doctor/PatientDetail.tsx`: Jenny's stats summary, her flags with plain-language reasons (e.g. "BP trending up since week 6"), and a "Generate 6-week summary & referral" button.
- The button calls Claude (via `lib/claude.ts`) with Jenny's mock data to produce referral text (plain-language summary + what a specialist should know), rendered for the doctor and also viewable from a link/section on the patient side so she's never left in the dark.
- Check: clicking Jenny shows her detail; generating a referral returns real Claude output referencing her actual flags (e.g. the BP trend); the two stub rows render but don't navigate anywhere broken.
- Commit: "feat: add doctor dashboard and 6-week referral generator"

## Step 6 — Env + polish pass (~10 min)

- `.env.example` with `VITE_ANTHROPIC_API_KEY=`. Confirm `.env` is listed in `.gitignore` (add it if not).
- Update `index.html` `<title>` and `README.md` to Peri branding/pitch summary.
- Full click-through: landing → patient home (scrub weeks, toggle budget) → Ask Peri chat → therapy scheduler → doctor dashboard → Jenny's detail → referral generator. Fix anything broken.
- Commit: "chore: env example, branding, and polish pass"

## Definition of done per step

- Code runs (`npm run dev` or the step's specific check above).
- No secrets staged (`git status` / `git diff --staged` before committing — nothing under `.env`).
- Committed with a short, clear message before moving to the next step.
