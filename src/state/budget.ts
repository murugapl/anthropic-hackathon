import { createContext, useContext } from 'react'

export type BudgetMode = 'budget' | 'covered'

export interface BudgetState {
  mode: BudgetMode
  amount: number
}

export function isWithinBudget(state: BudgetState, price: number): boolean {
  return state.mode === 'covered' || price <= state.amount
}

export const DEFAULT_BUDGET_STATE: BudgetState = {
  mode: 'budget',
  amount: 40,
}

export interface BudgetContextValue {
  budget: BudgetState
  setBudget: (budget: BudgetState) => void
}

export const BudgetContext = createContext<BudgetContextValue | null>(null)

export function useBudget(): BudgetContextValue {
  const ctx = useContext(BudgetContext)
  if (!ctx) {
    throw new Error('useBudget must be used within a BudgetContext.Provider')
  }
  return ctx
}
