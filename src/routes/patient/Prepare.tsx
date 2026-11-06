import { Link } from 'react-router-dom'
import { prepareTopics, STAGE_LABELS, type PrepareStage } from '../../data/prepareTopics'

const STAGE_ORDER: PrepareStage[] = ['pregnancy', 'early-postpartum', 'later-postpartum']

export default function Prepare() {
  return (
    <div className="px-5 py-2">
      <h1 className="text-xl font-semibold text-ink-900">How to prepare for</h1>
      <p className="text-sm text-ink-500">Short guides, grouped by where you are.</p>

      {STAGE_ORDER.map((stage) => {
        const topics = prepareTopics.filter((t) => t.stages.includes(stage))
        if (topics.length === 0) return null
        return (
          <div key={stage} className="mt-5">
            <p className="text-[10px] font-medium uppercase tracking-wide text-ink-500">
              {STAGE_LABELS[stage]}
            </p>
            <div className="mt-2 space-y-3 pb-1">
              {topics.map((t) => (
                <Link
                  key={t.id}
                  to={`/patient/prepare/${t.id}`}
                  className="block rounded-2xl border border-sand-200 bg-white p-4 hover:border-terracotta-300"
                >
                  <h3 className="font-medium text-ink-900">{t.title}</h3>
                  <p className="mt-1 text-sm text-ink-500">{t.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        )
      })}
      <div className="pb-4" />
    </div>
  )
}
