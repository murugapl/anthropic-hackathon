import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { jennyTimeline, patientProfile } from '../../data/patient'
import { askPeri } from '../../lib/claude'
import { computeDoctorFlags } from '../../lib/doctorSummary'
import { REFERRAL_SYSTEM_PROMPT, buildReferralPrompt } from '../../lib/systemPrompts'
import { useReferral } from '../../state/referral'

export default function PatientDetail() {
  const { patientId } = useParams()
  const { referral, setReferral } = useReferral()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (patientId !== patientProfile.id) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-ink-900">Demo placeholder</h1>
        <p className="mt-2 text-ink-500">
          This patient is a lightweight stub for the patient list and
          doesn't have a full record in this demo.
        </p>
        <Link to="/doctor" className="mt-4 inline-block text-sm text-terracotta-600">
          Back to patients
        </Link>
      </div>
    )
  }

  const latest = jennyTimeline[jennyTimeline.length - 1]
  const flags = computeDoctorFlags(jennyTimeline)

  async function generateReferral() {
    setLoading(true)
    setError(null)
    try {
      const result = await askPeri(REFERRAL_SYSTEM_PROMPT, [
        { role: 'user', content: buildReferralPrompt(latest, flags) },
      ])
      setReferral(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link to="/doctor" className="text-sm text-ink-500 hover:text-terracotta-600">
        ← Your patients
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-ink-900">
        {patientProfile.name}
      </h1>
      <p className="text-sm text-ink-500">{latest.label}</p>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-sand-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-500">
            Sleep
          </p>
          <p className="mt-1 text-xl font-semibold text-ink-900">
            {latest.wearables.sleepHours}h
          </p>
        </div>
        <div className="rounded-2xl border border-sand-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-500">
            Resting HR
          </p>
          <p className="mt-1 text-xl font-semibold text-ink-900">
            {latest.wearables.restingHeartRate} bpm
          </p>
        </div>
        <div className="rounded-2xl border border-terracotta-300 bg-terracotta-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-500">
            Blood pressure
          </p>
          <p className="mt-1 text-xl font-semibold text-terracotta-700">
            {latest.wearables.bpSystolic}/{latest.wearables.bpDiastolic}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-500">
          Flags
        </p>
        <div className="mt-2 space-y-2">
          {flags.map((f) => (
            <div key={f.id} className="rounded-2xl border border-sand-200 bg-white p-4">
              <h3 className="font-medium text-ink-900">{f.label}</h3>
              <p className="mt-1 text-sm text-ink-500">{f.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={generateReferral}
          disabled={loading}
          className="rounded-full bg-terracotta-500 px-4 py-2 text-sm font-medium text-white hover:bg-terracotta-600 disabled:opacity-50"
        >
          {loading ? 'Generating…' : 'Generate 6-week summary & referral'}
        </button>
        {error && <p className="mt-2 text-xs text-terracotta-700">{error}</p>}
        {referral.text && (
          <div className="mt-4 rounded-2xl border border-sand-200 bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-500">
              Summary & referral — visible to Jenny's Care tab too
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-ink-700">
              {referral.text}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
