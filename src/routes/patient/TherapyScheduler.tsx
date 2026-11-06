import { useState } from 'react'
import { Link } from 'react-router-dom'
import { therapists } from '../../data/therapists'
import { useBudget } from '../../state/budget'

export default function TherapyScheduler() {
  const { budget } = useBudget()
  const [confirmed, setConfirmed] = useState<{ therapist: string; slot: string } | null>(null)

  if (confirmed) {
    return (
      <div className="px-5 py-12 text-center">
        <span className="inline-block rounded-full bg-sage-100 px-3 py-1 text-xs font-medium text-sage-700">
          Booked
        </span>
        <h1 className="mt-4 text-2xl font-semibold text-ink-900">
          You're set for {confirmed.slot}
        </h1>
        <p className="mt-2 text-ink-500">
          With {confirmed.therapist}. We'll send a reminder beforehand —
          someone will be there.
        </p>
        <Link
          to="/patient"
          className="mt-6 inline-block rounded-full bg-terracotta-500 px-4 py-2 text-sm font-medium text-white hover:bg-terracotta-600"
        >
          Back to home
        </Link>
      </div>
    )
  }

  return (
    <div className="px-5 py-2">
      <h1 className="text-xl font-semibold text-ink-900">
        Schedule virtual therapy
      </h1>
      <p className="mt-2 text-ink-500">
        Talking to someone can help. Pricing shown reflects your budget
        {budget.mode === 'covered' ? ' (covered by your insurance/clinic).' : ` ($${budget.amount}/mo).`}
      </p>

      <div className="mt-6 space-y-4">
        {therapists.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl border border-sand-200 bg-white p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-ink-900">{t.name}</h3>
                <p className="text-sm text-ink-500">{t.specialty}</p>
              </div>
              <div className="text-right text-sm">
                <p className="font-medium text-ink-900">
                  ${t.pricePerSession}/session
                </p>
                <p className="text-xs text-sage-600">{t.slidingScaleNote}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {t.slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setConfirmed({ therapist: t.name, slot })}
                  className="rounded-full border border-sand-200 px-3 py-1.5 text-xs text-ink-700 hover:border-sage-300 hover:bg-sage-50"
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
