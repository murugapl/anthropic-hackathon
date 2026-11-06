import { Link } from 'react-router-dom'
import PeriMascot from '../components/PeriMascot'

export default function Landing() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center">
      <span className="rounded-full bg-sage-100 px-3 py-1 text-xs font-medium text-sage-700">
        Care that doesn't stop at 6 weeks
      </span>
      <PeriMascot size={72} />
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
        Peri
      </h1>
      <p className="mt-4 max-w-xl text-lg text-ink-500">
        Postpartum follow-up ends at six weeks. Recovery doesn't. Peri keeps
        someone there — for you, and for your doctor.
      </p>

      <div className="mt-10 grid w-full gap-4 sm:grid-cols-2">
        <Link
          to="/patient"
          className="rounded-2xl border border-sand-200 bg-white p-6 text-left shadow-sm transition hover:border-terracotta-300 hover:shadow-md"
        >
          <span className="text-sm font-medium text-terracotta-600">
            I'm a patient
          </span>
          <p className="mt-2 text-sm text-ink-500">
            See your week, get advice that fits your life, and ask Peri
            anything.
          </p>
        </Link>
        <Link
          to="/doctor"
          className="rounded-2xl border border-sand-200 bg-white p-6 text-left shadow-sm transition hover:border-sage-300 hover:shadow-md"
        >
          <span className="text-sm font-medium text-sage-600">
            I'm a doctor
          </span>
          <p className="mt-2 text-sm text-ink-500">
            See who needs attention, and generate a 6-week summary and
            referral in seconds.
          </p>
        </Link>
      </div>
    </div>
  )
}
