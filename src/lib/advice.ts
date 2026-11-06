import type { WeekEntry } from '../data/patient'
import { products, type Product } from '../data/products'
import { isWithinBudget, type BudgetState } from '../state/budget'

export interface AdviceCard {
  id: string
  title: string
  body: string
  product?: Product
  withinBudget?: boolean
  therapyPrompt?: boolean
}

function productById(id: string): Product {
  const product = products.find((p) => p.id === id)
  if (!product) throw new Error(`Unknown product id: ${id}`)
  return product
}

export function buildAdviceFeed(week: WeekEntry, budget: BudgetState): AdviceCard[] {
  const cards: AdviceCard[] = []

  if (week.flags.sleepDebt) {
    const isPregnant = week.postpartumWeek === null
    const product = productById('nursing-pillow')
    cards.push({
      id: 'sleep',
      title: isPregnant
        ? "Third-trimester sleep has been rough this week"
        : "You haven't been sleeping much this week",
      body: isPregnant
        ? 'A supportive pillow can make side-sleeping easier as your bump grows now, and it keeps helping with feeding positions after the baby arrives.'
        : 'A supportive pillow can make side-sleeping and feeding easier on your back.',
      product,
      withinBudget: isWithinBudget(budget, product.price),
    })
  }

  if (week.postpartumWeek !== null && week.postpartumWeek <= 4) {
    const product = productById('silver-cups')
    cards.push({
      id: 'breastfeeding',
      title: 'Early breastfeeding can be rough on you',
      body: 'Nipple soreness is common in the first few weeks. Here is something that helps it heal faster.',
      product,
      withinBudget: isWithinBudget(budget, product.price),
    })
  }

  if (week.flags.bpElevated) {
    const product = productById('compression-socks')
    cards.push({
      id: 'bp',
      title: 'Your blood pressure has been trending up',
      body: 'This is worth mentioning to your doctor, even outside a scheduled visit. In the meantime, this can help with swelling.',
      product,
      withinBudget: isWithinBudget(budget, product.price),
    })
  }

  if (week.flags.lowMood) {
    const product = productById('meditation-app')
    cards.push({
      id: 'mood',
      title: "It looks like it's been a hard stretch",
      body: 'You are not alone in this, and talking to someone can help. A few short guided sessions can also help in the moment.',
      product,
      withinBudget: isWithinBudget(budget, product.price),
      therapyPrompt: true,
    })
  }

  return cards
}
