import { Link } from 'react-router-dom'
import { prepareTopics } from '../../data/prepareTopics'

export default function Prepare() {
  return (
    <div className="px-5 py-2">
      <h1 className="text-xl font-semibold text-ink-900">How to prepare for</h1>
      <p className="text-sm text-ink-500">Short guides for what's coming next.</p>

      <div className="mt-4 space-y-3 pb-4">
        {prepareTopics.map((t) => (
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
}
