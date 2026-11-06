import { useState, type ReactNode } from 'react'
import { BudgetContext, DEFAULT_BUDGET_STATE, type BudgetState } from './budget'

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [budget, setBudget] = useState<BudgetState>(DEFAULT_BUDGET_STATE)
  return (
    <BudgetContext.Provider value={{ budget, setBudget }}>
      {children}
    </BudgetContext.Provider>
  )
}
