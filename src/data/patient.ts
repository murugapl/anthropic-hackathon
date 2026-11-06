export interface WeekEntry {
  weekIndex: number
  label: string
  postpartumWeek: number | null
  wearables: {
    sleepHours: number
    restingHeartRate: number
    bpSystolic: number
    bpDiastolic: number
  }
  moodScore: number // 1-10, higher is better
  flags: {
    sleepDebt: boolean
    bpElevated: boolean
    lowMood: boolean
  }
  note: string
}

export const patientProfile = {
  id: 'jenny',
  name: 'Jenny',
  age: 32,
}

export const jennyTimeline: WeekEntry[] = [
  {
    weekIndex: 0,
    label: 'Pregnancy · week 38',
    postpartumWeek: null,
    wearables: { sleepHours: 7.2, restingHeartRate: 71, bpSystolic: 118, bpDiastolic: 76 },
    moodScore: 7,
    flags: { sleepDebt: false, bpElevated: false, lowMood: false },
    note: 'Baseline, taken at her last prenatal visit.',
  },
  {
    weekIndex: 1,
    label: 'Postpartum · week 1',
    postpartumWeek: 1,
    wearables: { sleepHours: 4.8, restingHeartRate: 80, bpSystolic: 122, bpDiastolic: 79 },
    moodScore: 6,
    flags: { sleepDebt: true, bpElevated: false, lowMood: false },
    note: 'Newborn stage. Fragmented sleep is expected here.',
  },
  {
    weekIndex: 2,
    label: 'Postpartum · week 2',
    postpartumWeek: 2,
    wearables: { sleepHours: 4.5, restingHeartRate: 81, bpSystolic: 121, bpDiastolic: 78 },
    moodScore: 6,
    flags: { sleepDebt: true, bpElevated: false, lowMood: false },
    note: 'Still in the newborn fog.',
  },
  {
    weekIndex: 3,
    label: 'Postpartum · week 3',
    postpartumWeek: 3,
    wearables: { sleepHours: 5.0, restingHeartRate: 79, bpSystolic: 123, bpDiastolic: 80 },
    moodScore: 6.5,
    flags: { sleepDebt: true, bpElevated: false, lowMood: false },
    note: 'Sleep debt building steadily.',
  },
  {
    weekIndex: 4,
    label: 'Postpartum · week 4',
    postpartumWeek: 4,
    wearables: { sleepHours: 5.2, restingHeartRate: 78, bpSystolic: 124, bpDiastolic: 80 },
    moodScore: 6.5,
    flags: { sleepDebt: true, bpElevated: false, lowMood: false },
    note: 'Still averaging under 6 hours of sleep most nights.',
  },
  {
    weekIndex: 5,
    label: 'Postpartum · week 5',
    postpartumWeek: 5,
    wearables: { sleepHours: 5.6, restingHeartRate: 76, bpSystolic: 126, bpDiastolic: 81 },
    moodScore: 6.5,
    flags: { sleepDebt: true, bpElevated: false, lowMood: false },
    note: 'One week out from her 6-week visit.',
  },
  {
    weekIndex: 6,
    label: 'Postpartum · week 6',
    postpartumWeek: 6,
    wearables: { sleepHours: 5.8, restingHeartRate: 76, bpSystolic: 131, bpDiastolic: 85 },
    moodScore: 6,
    flags: { sleepDebt: true, bpElevated: true, lowMood: false },
    note: 'The 6-week visit. BP is just starting to trend up — formal follow-up ends today.',
  },
  {
    weekIndex: 7,
    label: 'Postpartum · week 8',
    postpartumWeek: 8,
    wearables: { sleepHours: 6.0, restingHeartRate: 75, bpSystolic: 134, bpDiastolic: 87 },
    moodScore: 5.5,
    flags: { sleepDebt: false, bpElevated: true, lowMood: false },
    note: 'No clinician is monitoring BP anymore. Nobody has flagged the trend.',
  },
  {
    weekIndex: 8,
    label: 'Postpartum · week 10',
    postpartumWeek: 10,
    wearables: { sleepHours: 6.1, restingHeartRate: 74, bpSystolic: 136, bpDiastolic: 88 },
    moodScore: 4.5,
    flags: { sleepDebt: false, bpElevated: true, lowMood: false },
    note: 'BP continues to climb, unaddressed.',
  },
  {
    weekIndex: 9,
    label: 'Postpartum · week 12',
    postpartumWeek: 12,
    wearables: { sleepHours: 6.0, restingHeartRate: 75, bpSystolic: 138, bpDiastolic: 90 },
    moodScore: 3.5,
    flags: { sleepDebt: false, bpElevated: true, lowMood: true },
    note: 'Mood check-ins have dropped sharply. This is the start of the low-mood stretch.',
  },
  {
    weekIndex: 10,
    label: 'Postpartum · week 14',
    postpartumWeek: 14,
    wearables: { sleepHours: 6.2, restingHeartRate: 74, bpSystolic: 139, bpDiastolic: 91 },
    moodScore: 3,
    flags: { sleepDebt: false, bpElevated: true, lowMood: true },
    note: 'Lowest point. Both BP and mood are flagged, with no clinician in the loop.',
  },
  {
    weekIndex: 11,
    label: 'Postpartum · week 16',
    postpartumWeek: 16,
    wearables: { sleepHours: 6.4, restingHeartRate: 73, bpSystolic: 137, bpDiastolic: 89 },
    moodScore: 4,
    flags: { sleepDebt: false, bpElevated: true, lowMood: true },
    note: 'Still struggling. This is the week Peri surfaces the therapy scheduler.',
  },
  {
    weekIndex: 12,
    label: 'Postpartum · week 20',
    postpartumWeek: 20,
    wearables: { sleepHours: 6.8, restingHeartRate: 71, bpSystolic: 133, bpDiastolic: 86 },
    moodScore: 6,
    flags: { sleepDebt: false, bpElevated: true, lowMood: false },
    note: 'Today. Mood is recovering after starting therapy. BP is still elevated and needs a referral.',
  },
]

export const DEFAULT_WEEK_INDEX = jennyTimeline.length - 1

export interface StubPatient {
  id: string
  name: string
  flagLabel: string
}

export const stubPatients: StubPatient[] = [
  { id: 'alice', name: 'Alice M.', flagLabel: 'On track' },
  { id: 'mary', name: 'Mary T.', flagLabel: 'Gestational diabetes follow-up' },
]
