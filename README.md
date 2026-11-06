# Peri

Postpartum follow-up ends at six weeks. Recovery doesn't. Peri keeps someone there — for the patient, and for her doctor — for as long as it actually takes.

Built for a 2-hour hackathon. All patient data is synthetic. See `CLAUDE.md` for the full product context and hard rules, and `AGENT_TASKS.md` for the build plan.

## What's in the demo

- **Patient home** — a today snapshot from mock wearable data, a staged advice feed that respects a patient-set budget (every paid suggestion ships with a free alternative), and a week scrubber across one patient's full pregnancy-to-20-weeks-postpartum arc.
- **Ask Peri** — a chat grounded in calm, non-diagnostic postpartum guidance, with budget-aware product suggestions and built-in red-flag safety messaging.
- **Therapy scheduler** — surfaces automatically when the data shows a low-mood stretch, with sliding-scale virtual therapy slots.
- **Doctor dashboard** — a patient list with flags, a detail view, and a one-click 6-week summary + specialist referral generator — visible to the doctor and the patient, so no one is left in the dark.

## Quickstart

```bash
npm install
cp .env.example .env   # add your Anthropic API key to .env
npm run dev
```

Note: Claude is called directly from the browser for this demo (`dangerouslyAllowBrowser: true`). This is intentional and demo-only — see `CLAUDE.md` hard rule #2. Never deploy this build with a real key in it.

## Stack

Vite + React + TypeScript, Tailwind CSS v4, `react-router-dom`, `@anthropic-ai/sdk`. No backend, no database — everything lives in mock data modules and in-memory state.
