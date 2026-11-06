import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DEFAULT_WEEK_INDEX, jennyTimeline, patientProfile } from '../../data/patient'
import { buildAdviceFeed } from '../../lib/advice'
import { useBudget } from '../../state/budget'

function StatCard({
  label,
  value,
  flagged,
}: {
  label: string
  value: string
  flagged: boolean
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        flagged
          ? 'border-terracotta-300 bg-terracotta-50'
          : 'border-sand-200 bg-white'
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-ink-500">
        {label}
      </p>
      <p
        className={`mt-1 text-xl font-semibold ${
          flagged ? 'text-terracotta-700' : 'text-ink-900'
        }`}
      >
        {value}
      </p>
    </div>
  )
}

export default function PatientHome() {
  const [weekIndex, setWeekIndex] = useState(DEFAULT_WEEK_INDEX)
  const { budget, setBudget } = useBudget()
  const week = jennyTimeline[weekIndex]
  const advice = buildAdviceFeed(week, budget)

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-ink-900">
        Hi, {patientProfile.name}
      </h1>
      <p className="mt-1 text-sm text-ink-500">{week.label}</p>

      {/* Week scrubber */}
      <div className="mt-6 rounded-2xl border border-sand-200 bg-white p-4">
        <label className="flex items-center justify-between text-xs font-medium text-ink-500">
          <span>Move through Jenny's story</span>
          <span>{week.label}</span>
        </label>
        <input
          type="range"
          min={0}
          max={jennyTimeline.length - 1}
          value={weekIndex}
          onChange={(e) => setWeekIndex(Number(e.target.value))}
          className="mt-2 w-full accent-terracotta-500"
        />
        <p className="mt-2 text-sm text-ink-500">{week.note}</p>
      </div>

      {/* Today snapshot */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <StatCard
          label="Sleep"
          value={`${week.wearables.sleepHours}h`}
          flagged={week.flags.sleepDebt}
        />
        <StatCard
          label="Resting HR"
          value={`${week.wearables.restingHeartRate} bpm`}
          flagged={false}
        />
        <StatCard
          label="Blood pressure"
          value={`${week.wearables.bpSystolic}/${week.wearables.bpDiastolic}`}
          flagged={week.flags.bpElevated}
        />
      </div>

      {/* Budget control */}
      <div className="mt-6 rounded-2xl border border-sand-200 bg-white p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-500">
          Your budget
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setBudget({ ...budget, mode: 'budget' })}
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              budget.mode === 'budget'
                ? 'bg-terracotta-500 text-white'
                : 'bg-sand-100 text-ink-500'
            }`}
          >
            Set a budget
          </button>
          <button
            type="button"
            onClick={() => setBudget({ ...budget, mode: 'covered' })}
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              budget.mode === 'covered'
                ? 'bg-sage-500 text-white'
                : 'bg-sand-100 text-ink-500'
            }`}
          >
            Insurance covers this
          </button>
          {budget.mode === 'budget' && (
            <div className="flex items-center gap-2 text-sm text-ink-500">
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={budget.amount}
                onChange={(e) =>
                  setBudget({ ...budget, amount: Number(e.target.value) })
                }
                className="accent-terracotta-500"
              />
              <span className="font-medium text-ink-900">
                ${budget.amount}/mo
              </span>
            </div>
          )}
        </div>
        <p className="mt-2 text-xs text-ink-500">
          Every suggestion below respects your budget — a free option is
          always included.
        </p>
      </div>

      {/* Advice feed */}
      <div className="mt-6 space-y-4">
        {advice.length === 0 && (
          <p className="text-sm text-ink-500">
            Nothing flagged for you this week — take the win.
          </p>
        )}
        {advice.map((card) => (
          <div
            key={card.id}
            className="rounded-2xl border border-sand-200 bg-white p-4"
          >
            <h3 className="font-medium text-ink-900">{card.title}</h3>
            <p className="mt-1 text-sm text-ink-500">{card.body}</p>
            {card.product && (
              <div className="mt-3 rounded-xl bg-sand-50 p-3 text-sm">
                {card.withinBudget ? (
                  <p className="text-ink-700">
                    <span className="font-medium text-terracotta-700">
                      {card.product.name}
                    </span>{' '}
                    — ${card.product.price}, within your budget.
                  </p>
                ) : (
                  <p className="text-ink-700">
                    Free option:{' '}
                    <span className="font-medium">
                      {card.product.freeAlternative}
                    </span>
                  </p>
                )}
                {!card.withinBudget && (
                  <p className="mt-1 text-xs text-ink-500">
                    Stretch pick: {card.product.name} (${card.product.price})
                  </p>
                )}
                {card.withinBudget && (
                  <p className="mt-1 text-xs text-ink-500">
                    Free option: {card.product.freeAlternative}
                  </p>
                )}
              </div>
            )}
            {card.therapyPrompt && (
              <Link
                to="/patient/therapy"
                className="mt-3 inline-block rounded-full bg-sage-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-sage-600"
              >
                Schedule virtual therapy
              </Link>
            )}
          </div>
        ))}
      </div>

      <Link
        to="/patient/chat"
        className="mt-8 inline-block rounded-full bg-terracotta-500 px-4 py-2 text-sm font-medium text-white hover:bg-terracotta-600"
      >
        Ask Peri
      </Link>
    </div>
  )
}
