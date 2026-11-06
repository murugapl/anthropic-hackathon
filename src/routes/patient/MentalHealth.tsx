import { useState } from 'react'
import { Link } from 'react-router-dom'
import { readings } from '../../data/readings'

export default function MentalHealth() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className="px-5 py-2">
      <h1 className="text-xl font-semibold text-ink-900">Mental health</h1>
      <p className="text-sm text-ink-500">
        Short reads on what to watch for, and a fast way to talk to someone.
      </p>

      <Link
        to="/patient/therapy"
        className="mt-4 block rounded-2xl bg-sage-500 p-4 text-white hover:bg-sage-600"
      >
        <p className="text-sm font-medium">Schedule virtual therapy →</p>
        <p className="mt-0.5 text-xs text-sage-50">
          Sliding-scale pricing based on your budget. Usually a slot within a few days.
        </p>
      </Link>

      <div className="mt-5 space-y-2">
        {readings.map((r) => {
          const open = openId === r.id
          return (
            <div key={r.id} className="rounded-2xl border border-sand-200 bg-white p-4">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : r.id)}
                className="flex w-full items-start justify-between gap-2 text-left"
              >
                <div>
                  <h3 className="font-medium text-ink-900">{r.title}</h3>
                  <p className="text-sm text-ink-500">{r.blurb}</p>
                </div>
                <span className="shrink-0 text-ink-300">{open ? '−' : '+'}</span>
              </button>
              {open && <p className="mt-3 text-sm text-ink-700">{r.body}</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
