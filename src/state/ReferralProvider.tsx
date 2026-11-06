import { useState, type ReactNode } from 'react'
import { ReferralContext, type ReferralState } from './referral'

const STORAGE_KEY = 'peri-referral'

function loadInitial(): ReferralState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { text: null, generatedAt: null }
    const parsed = JSON.parse(raw) as { text: string; generatedAt: string }
    return { text: parsed.text, generatedAt: new Date(parsed.generatedAt) }
  } catch {
    return { text: null, generatedAt: null }
  }
}

export function ReferralProvider({ children }: { children: ReactNode }) {
  const [referral, setReferralState] = useState<ReferralState>(loadInitial)

  function setReferral(text: string) {
    const next = { text, generatedAt: new Date() }
    setReferralState(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  return (
    <ReferralContext.Provider value={{ referral, setReferral }}>
      {children}
    </ReferralContext.Provider>
  )
}
