# Peri — project context

Read this whole file before doing anything. This is a solo 2-hour hackathon build — one person driving Claude Code directly, no team branches to coordinate.

## What we are building

**Peri** is a pregnancy and postpartum companion app. An OB-GYN we interviewed described a "6-week cliff": formal follow-up ends at 6 weeks, but hypertension, gestational/type 2 diabetes, depression, and cardiovascular risk all need monitoring for up to a year. Clinics aren't staffed or paid for it, referrals fall through the cracks, and patients are left on their own. Patients engage when they feel "someone is there," not an algorithm — and exhaustion, not motivation, is the real barrier to logging data.

Peri has two sides:

- **Patient**: a single place that centralizes pregnancy/postpartum guidance. A today snapshot built from mock wearable data (sleep, heart rate, blood pressure), a staged advice feed personalized to the current week, an "Ask Peri" chat grounded in calm, non-diagnostic postpartum guidance, and a virtual therapy scheduler that surfaces when mood data signals she might need it.
- **Doctor**: a patient list with flags, a drill-in detail view, and a "generate 6-week summary & referral" button that produces a referral doctors can send to specialists and patients can see too — so no one is left in the dark.

**Business model layer**: Ask Peri and the advice feed recommend real products (pregnancy pillows, baby gear, postpartum recovery items, nipple cream, etc.) and virtual therapy sessions, framed as affiliate/referral revenue that subsidizes the app so it stays free for patients whose insurance or clinic doesn't cover extended follow-up. A patient-set monthly **budget** gates every recommendation so the model doesn't skew toward whoever pays the best commission — paid suggestions always ship alongside a free/low-cost alternative, never instead of one. Access shouldn't depend on wealth.

**Positioning**: this is a demo. All patient data is synthetic. Peri is decision support and an engagement layer, not a diagnostic tool or a medical device — advice and chat responses should read as "here's something to try" or "bring this to your doctor," never as a diagnosis.

## Hard rules

1. **Never commit secrets.** `VITE_ANTHROPIC_API_KEY` lives in `.env` (gitignored). Commit `.env.example` only, with the key left blank.
2. **Client-side Claude calls are a deliberate demo-only shortcut.** Calling `@anthropic-ai/sdk` directly from the browser (`dangerouslyAllowBrowser: true`) is acceptable here because this build is local and never deployed or pushed with a real key in it. Don't "fix" this into a backend mid-build — it's intentional, not an oversight.
3. **All data is synthetic.** Jenny and every patient, product, and therapist are fictional. Don't write code or copy that could be mistaken for real patient data or real affiliate/medical partnerships.
4. **No diagnosis.** Advice feed and chat content should sound like suggestions and general information, never a clinical diagnosis. This mirrors the OB-GYN's own framing: Peri helps a patient show up informed, it doesn't replace her doctor.
5. **Budget guardrail.** Any product or therapy recommendation — in chat or the advice feed — must respect the patient's set budget, and every paid suggestion must be paired with a free/low-cost alternative. This is the equity argument of the business model, not a nice-to-have. Don't drop it under time pressure.

## Stack

- **Frontend only** — Vite + React + TypeScript, already scaffolded at the repo root (no nested `frontend/`/`backend/` folders, this is a single-package app).
- **Styling**: Tailwind CSS v4, CSS-first config via `@theme` in `src/index.css` (no `tailwind.config.js` needed) — defines the Peri palette (terracotta, sage, sand, ink).
- **Routing**: `react-router-dom`.
- **LLM**: `@anthropic-ai/sdk`, called client-side, model `claude-sonnet-5` via the Messages API.
- **No backend, no database.** Everything lives in mock data modules and component/context state for the duration of the demo.

## Peri brand

- Name: **Peri**.
- Palette: terracotta, sage green, warm neutral sand/grey, earthy — calming, not clinical, not alarming.
- Tone: easy to use, uncluttered, "someone is there" — never overwhelming. Advice is staged over time, not dumped all at once.

## Repo layout

```
src/
  main.tsx, App.tsx
  index.css              # Tailwind import + Peri @theme tokens
  data/
    patient.ts            # Jenny's mocked week-by-week arc (wearables, mood, flags)
    products.ts           # mock product catalog: name, category, price, buy link, free alternative
    therapists.ts         # mock virtual therapy providers: sliding-scale price, open slots
  state/
    budget.ts             # lightweight context/hook holding the patient's set budget
  lib/
    claude.ts             # thin wrapper around @anthropic-ai/sdk, shared by chat + referral gen
  routes/
    Landing.tsx           # "I'm a patient" / "I'm a doctor" entry
    patient/
      PatientHome.tsx      # today snapshot + advice feed + week scrubber + budget control
      AskPeri.tsx           # chat, budget-aware product recommendations
      TherapyScheduler.tsx  # mock slot picker, shown when a mood/depression flag is active
    doctor/
      DoctorDashboard.tsx   # patient list w/ flags
      PatientDetail.tsx      # Jenny detail + referral generator
```

## Demo persona

**Jenny** is the one deep persona, with a compressed arc from late pregnancy through 20+ weeks postpartum:

- Early weeks: sleep trouble → advice feed suggests a pregnancy/nursing pillow, priced against her budget, with a free alternative (positioning tips) shown alongside it.
- Around week 6: blood pressure starts trending up right as her formal follow-up ends — this is the flag the doctor dashboard surfaces and the thing the 6-week referral generator writes up.
- A low-mood stretch in the data triggers the therapy scheduler in the patient view, tying mental health risk directly to the OB-GYN's "depression, suicide and homicide risk" framing without being alarming in tone.
- Two lightweight stub patients sit alongside Jenny in the doctor's list purely so it doesn't look empty — only Jenny has a working drill-in.

This persona and arc are the single source of truth; `AGENT_TASKS.md` references it rather than redefining it.

## Definition of done

- `npm run build` succeeds.
- `npm run dev` click-through works end-to-end: landing → patient home → advice feed → Ask Peri chat → therapy scheduler → doctor dashboard → patient detail → referral generator.
- No secrets committed; `.env` is gitignored, `.env.example` is committed and blank.
- Commit after each step in `AGENT_TASKS.md`, once its check passes.
