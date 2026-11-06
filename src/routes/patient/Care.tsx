import { useReferral } from '../../state/referral'

export default function Care() {
  const { referral } = useReferral()

  return (
    <div className="px-5 py-2">
      <h1 className="text-xl font-semibold text-ink-900">Your care team</h1>
      <p className="text-sm text-ink-500">
        Peri keeps your doctor in the loop, even after the 6-week visit.
      </p>

      <div className="mt-4 rounded-2xl border border-sand-200 bg-white p-4">
        <p className="text-[10px] font-medium uppercase tracking-wide text-ink-500">
          Your doctor
        </p>
        <h3 className="mt-1 font-medium text-ink-900">Dr. Maria Chen, OB-GYN</h3>
        <p className="text-sm text-ink-500">Magnolia Women's Health</p>
        <button
          type="button"
          disabled
          className="mt-3 w-full cursor-not-allowed rounded-full border border-sand-200 px-3 py-1.5 text-sm font-medium text-ink-300"
        >
          Message care team (demo only)
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-sand-200 bg-white p-4">
        <p className="text-[10px] font-medium uppercase tracking-wide text-ink-500">
          Latest update
        </p>
        {!referral.text && (
          <p className="mt-2 text-sm text-ink-500">
            Nothing yet — this fills in once your doctor generates your
            6-week summary and referral.
          </p>
        )}
        {referral.text && (
          <>
            <p className="mt-1 text-xs text-ink-500">
              Shared by your doctor
              {referral.generatedAt &&
                ` · ${referral.generatedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-ink-700">
              {referral.text}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
