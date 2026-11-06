import { Link } from 'react-router-dom'

export default function PatientHome() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-ink-900">Hi, Jenny</h1>
      <p className="mt-2 text-ink-500">
        Patient home — today snapshot, advice feed, and budget control land
        here in step 3.
      </p>
      <Link
        to="/patient/chat"
        className="mt-6 inline-block rounded-full bg-terracotta-500 px-4 py-2 text-sm font-medium text-white hover:bg-terracotta-600"
      >
        Ask Peri
      </Link>
    </div>
  )
}
