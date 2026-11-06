// Keyed by WeekEntry.weekIndex in jennyTimeline. Light, warm, non-clinical.
export const FUN_FACTS: Record<number, string> = {
  0: "Your baby is about the size of an eggplant — around 2.5 lbs, and can now blink.",
  1: "Your baby is about the size of a squash — around 3.8 lbs, and practicing breathing.",
  2: "Your baby is about the size of a honeydew melon, and their immune system is getting a boost from you.",
  3: "Your baby is about the size of a mini watermelon — full term is just around the corner.",
  4: "Newborns typically lose up to 10% of birth weight in the first week — totally normal.",
  5: "Around now, many babies start regaining their birth weight.",
  6: "Your baby can likely focus on faces about 8-12 inches away — right about nursing distance.",
  7: "Many babies start their first real social smiles around now.",
  8: "Baby's neck muscles are getting stronger — more \"tummy time\" head lifts this week.",
  9: "Many babies start sleeping in slightly longer stretches around 6 weeks — slightly.",
  10: "Around 2 months, babies often start cooing — the start of 'conversations.'",
  11: "By 10 weeks, a lot of babies can track a moving object with their eyes.",
  12: "Many babies begin reaching for objects around 3 months.",
  13: "Around 14 weeks, laughter often makes its first appearance.",
  14: "By 16 weeks, a lot of babies can hold their head steady without support.",
  15: "At 20 weeks, many babies are babbling and starting to roll over — big month.",
}

export function getFunFact(weekIndex: number): string | undefined {
  return FUN_FACTS[weekIndex]
}
