import { Link } from 'react-router-dom'
import { jennyTimeline, patientProfile, stubPatients } from '../../data/patient'
import { computeDoctorFlags } from '../../lib/doctorSummary'

export default function DoctorDashboard() {
  const jennyFlags = computeDoctorFlags(jennyTimeline)

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-ink-900">Your patients</h1>
      <p className="mt-1 text-sm text-ink-500">
        Flagged patients first, so nothing falls through after the 6-week
        visit.
      </p>

      <div className="mt-6 space-y-3">
        <Link
          to={`/doctor/${patientProfile.id}`}
          className="block rounded-2xl border border-terracotta-300 bg-terracotta-50 p-4 transition hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-ink-900">{patientProfile.name}</h3>
            <span className="rounded-full bg-terracotta-500 px-2 py-0.5 text-xs font-medium text-white">
              {jennyFlags.length} flag{jennyFlags.length === 1 ? '' : 's'}
            </span>
          </div>
          <ul className="mt-2 space-y-0.5 text-sm text-ink-700">
            {jennyFlags.map((f) => (
              <li key={f.id}>{f.label}</li>
            ))}
          </ul>
        </Link>

        {stubPatients.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-sand-200 bg-white p-4 opacity-70"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-ink-900">{p.name}</h3>
              <span className="rounded-full bg-sand-100 px-2 py-0.5 text-xs font-medium text-ink-500">
                {p.flagLabel}
              </span>
            </div>
            <p className="mt-1 text-xs text-ink-500">
              Demo placeholder — not an interactive record.
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
