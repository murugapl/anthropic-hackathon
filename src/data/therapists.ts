export interface Therapist {
  id: string
  name: string
  specialty: string
  pricePerSession: number
  slidingScaleNote: string
  slots: string[]
}

export const therapists: Therapist[] = [
  {
    id: 'osei',
    name: 'Dr. Amara Osei, LCSW',
    specialty: 'Postpartum mood & anxiety',
    pricePerSession: 120,
    slidingScaleNote: 'Sliding scale available as low as $20/session based on your budget.',
    slots: ['Mon 10:00 AM', 'Wed 2:00 PM', 'Fri 9:00 AM'],
  },
  {
    id: 'nandan',
    name: 'Priya Nandan, LMFT',
    specialty: 'Perinatal mental health',
    pricePerSession: 95,
    slidingScaleNote: 'Sliding scale available as low as $15/session based on your budget.',
    slots: ['Tue 1:00 PM', 'Thu 11:00 AM'],
  },
  {
    id: 'reyes',
    name: 'Dr. Sofia Reyes, PsyD',
    specialty: 'Postpartum depression & trauma',
    pricePerSession: 150,
    slidingScaleNote: 'Sliding scale available as low as $25/session based on your budget.',
    slots: ['Mon 4:00 PM', 'Wed 10:00 AM', 'Fri 1:00 PM'],
  },
]
