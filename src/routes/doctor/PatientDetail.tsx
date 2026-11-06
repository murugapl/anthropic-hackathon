import { useParams } from 'react-router-dom'

export default function PatientDetail() {
  const { patientId } = useParams()
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-ink-900">
        Patient: {patientId}
      </h1>
      <p className="mt-2 text-ink-500">
        Stats, flags, and the referral generator land here in step 5.
      </p>
    </div>
  )
}
