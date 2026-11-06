import type { WeekEntry } from '../data/patient'

export interface PatientFlag {
  id: string
  label: string
  detail: string
}

export function computeDoctorFlags(timeline: WeekEntry[]): PatientFlag[] {
  const latest = timeline[timeline.length - 1]
  const flags: PatientFlag[] = []

  const firstBp = timeline.find((w) => w.flags.bpElevated)
  if (firstBp) {
    flags.push({
      id: 'bp',
      label: latest.flags.bpElevated
        ? 'Blood pressure still elevated'
        : 'Blood pressure was elevated',
      detail: `Trending up since ${firstBp.label.toLowerCase()}, currently ${latest.wearables.bpSystolic}/${latest.wearables.bpDiastolic}. No clinician has reviewed this since her 6-week visit.`,
    })
  }

  const firstMood = timeline.find((w) => w.flags.lowMood)
  if (firstMood) {
    flags.push({
      id: 'mood',
      label: latest.flags.lowMood ? 'Low mood, ongoing' : 'Low mood, improving',
      detail: latest.flags.lowMood
        ? `Flagged starting ${firstMood.label.toLowerCase()}, still ongoing.`
        : `Flagged starting ${firstMood.label.toLowerCase()}, trending better after starting virtual therapy.`,
    })
  }

  return flags
}
