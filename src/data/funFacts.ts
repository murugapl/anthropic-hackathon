export type FunFactIcon = 'eggplant' | 'squash' | 'melon' | 'watermelon' | 'milestone'

export interface FunFact {
  text: string
  icon: FunFactIcon
  sizeLabel?: string
}

// Keyed by WeekEntry.weekIndex in jennyTimeline. Light, warm, non-clinical.
export const FUN_FACTS: Record<number, FunFact> = {
  0: {
    icon: 'eggplant',
    sizeLabel: 'Eggplant-sized',
    text: 'About 2.5 lbs, and can now blink.',
  },
  1: {
    icon: 'squash',
    sizeLabel: 'Acorn squash-sized',
    text: 'About 3.8 lbs, and practicing breathing.',
  },
  2: {
    icon: 'melon',
    sizeLabel: 'Honeydew-sized',
    text: "Their immune system is getting a boost from you.",
  },
  3: {
    icon: 'watermelon',
    sizeLabel: 'Mini watermelon-sized',
    text: 'Full term is just around the corner.',
  },
  4: { icon: 'milestone', text: 'Newborns typically lose up to 10% of birth weight in the first week — totally normal.' },
  5: { icon: 'milestone', text: 'Around now, many babies start regaining their birth weight.' },
  6: { icon: 'milestone', text: 'Your baby can likely focus on faces about 8-12 inches away — right about nursing distance.' },
  7: { icon: 'milestone', text: 'Many babies start their first real social smiles around now.' },
  8: { icon: 'milestone', text: "Baby's neck muscles are getting stronger — more tummy-time head lifts this week." },
  9: { icon: 'milestone', text: 'Many babies start sleeping in slightly longer stretches around 6 weeks.' },
  10: { icon: 'milestone', text: 'Around 2 months, babies often start cooing — the start of "conversations."' },
  11: { icon: 'milestone', text: 'By 10 weeks, a lot of babies can track a moving object with their eyes.' },
  12: { icon: 'milestone', text: 'Many babies begin reaching for objects around 3 months.' },
  13: { icon: 'milestone', text: "Around 14 weeks, laughter often makes its first appearance." },
  14: { icon: 'milestone', text: 'By 16 weeks, a lot of babies can hold their head steady without support.' },
  15: { icon: 'milestone', text: 'At 20 weeks, many babies are babbling and starting to roll over — big month.' },
}

export function getFunFact(weekIndex: number): FunFact | undefined {
  return FUN_FACTS[weekIndex]
}
