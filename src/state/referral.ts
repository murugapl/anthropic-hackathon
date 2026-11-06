import { createContext, useContext } from 'react'

export interface ReferralState {
  text: string | null
  generatedAt: Date | null
}

export interface ReferralContextValue {
  referral: ReferralState
  setReferral: (text: string) => void
}

export const ReferralContext = createContext<ReferralContextValue | null>(null)

export function useReferral(): ReferralContextValue {
  const ctx = useContext(ReferralContext)
  if (!ctx) {
    throw new Error('useReferral must be used within a ReferralContext.Provider')
  }
  return ctx
}
