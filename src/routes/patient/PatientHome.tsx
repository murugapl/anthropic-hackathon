import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DEFAULT_WEEK_INDEX, jennyTimeline, patientProfile } from '../../data/patient'
import { getFunFact } from '../../data/funFacts'
import { prepareTopics } from '../../data/prepareTopics'
import { buildAdviceFeed } from '../../lib/advice'
import { useBudget } from '../../state/budget'

function StatChip({
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
      className={`flex-1 rounded-2xl border p-3 ${
        flagged ? 'border-terracotta-300 bg-terracotta-50' : 'border-sand-200 bg-white'
      }`}
    >
      <p className="text-[10px] font-medium uppercase tracking-wide text-ink-500">
        {label}
      </p>
      <p className={`mt-0.5 text-base font-semibold ${flagged ? 'text-terracotta-700' : 'text-ink-900'}`}>
        {value}
      </p>
    </div>
  )
}

export default function PatientHome() {
  const [weekIndex, setWeekIndex] = useState(DEFAULT_WEEK_INDEX)
  const { budget } = useBudget()
  const week = jennyTimeline[weekIndex]
  const advice = buildAdviceFeed(week, budget)
  const topCard = advice[0]
  const funFact = getFunFact(week.weekIndex)

  return (
    <div className="px-5 py-2">
      <h1 className="text-xl font-semibold text-ink-900">
        Hi, {patientProfile.name}
      </h1>
      <p className="text-sm text-ink-500">{week.label}</p>

      <div className="mt-4 rounded-2xl border border-sand-200 bg-white p-3">
        <label className="flex items-center justify-between text-[10px] font-medium text-ink-500">
          <span>Move through Jenny's story</span>
        </label>
        <input
          type="range"
          min={0}
          max={jennyTimeline.length - 1}
          value={weekIndex}
          onChange={(e) => setWeekIndex(Number(e.target.value))}
          className="mt-1 w-full accent-terracotta-500"
        />
        <p className="mt-1 text-xs text-ink-500">{week.note}</p>
      </div>

      {funFact && (
        <div className="mt-3 rounded-2xl bg-sage-100 p-3 text-sm text-sage-700">
          {week.postpartumWeek === null ? '🫛 ' : '✨ '}
          {funFact}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <StatChip label="Sleep" value={`${week.wearables.sleepHours}h`} flagged={week.flags.sleepDebt} />
        <StatChip label="HR" value={`${week.wearables.restingHeartRate}`} flagged={false} />
        <StatChip
          label="BP"
          value={`${week.wearables.bpSystolic}/${week.wearables.bpDiastolic}`}
          flagged={week.flags.bpElevated}
        />
      </div>
      <Link to="/patient/trends" className="mt-2 inline-block text-xs text-terracotta-600">
        See full trends →
      </Link>

      <div className="mt-5">
        <p className="text-[10px] font-medium uppercase tracking-wide text-ink-500">
          For you today
        </p>
        {!topCard && (
          <p className="mt-2 text-sm text-ink-500">
            Nothing flagged this week — take the win.
          </p>
        )}
        {topCard && (
          <div className="mt-2 rounded-2xl border border-sand-200 bg-white p-4">
            <h3 className="font-medium text-ink-900">{topCard.title}</h3>
            <p className="mt-1 text-sm text-ink-500">{topCard.body}</p>
            {topCard.therapyPrompt && (
              <Link
                to="/patient/therapy"
                className="mt-3 inline-block rounded-full bg-sage-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-sage-600"
              >
                Schedule virtual therapy
              </Link>
            )}
            {!topCard.therapyPrompt && (
              <Link
                to="/patient/shop"
                className="mt-3 inline-block text-xs font-medium text-terracotta-600"
              >
                See this pick in Shop →
              </Link>
            )}
          </div>
        )}
        {advice.length > 1 && (
          <Link to="/patient/shop" className="mt-3 block text-xs text-terracotta-600">
            {advice.length - 1} more recommendation{advice.length - 1 === 1 ? '' : 's'} in Shop →
          </Link>
        )}
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-medium uppercase tracking-wide text-ink-500">
            How to prepare for
          </p>
          <Link to="/patient/prepare" className="text-xs text-terracotta-600">
            See all →
          </Link>
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {prepareTopics.map((t) => (
            <Link
              key={t.id}
              to={`/patient/prepare/${t.id}`}
              className="w-40 shrink-0 rounded-2xl border border-sand-200 bg-white p-3 hover:border-terracotta-300"
            >
              <h3 className="text-sm font-medium text-ink-900">{t.title}</h3>
              <p className="mt-1 text-xs text-ink-500">{t.summary}</p>
            </Link>
          ))}
        </div>
      </div>

      <Link
        to="/patient/care"
        className="mt-6 mb-2 block rounded-2xl border border-sand-200 bg-white p-4 hover:border-sage-300"
      >
        <p className="text-[10px] font-medium uppercase tracking-wide text-ink-500">
          Your care team
        </p>
        <p className="mt-1 text-sm text-ink-700">
          See updates from your doctor →
        </p>
      </Link>
    </div>
  )
}
