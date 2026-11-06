import { products } from '../../data/products'
import { isWithinBudget, useBudget } from '../../state/budget'

const CATEGORY_LABELS: Record<string, string> = {
  sleep: 'Sleep',
  breastfeeding: 'Breastfeeding',
  recovery: 'Recovery',
  'baby-gear': 'Baby gear',
  'mental-health': 'Mental health',
}

export default function Shop() {
  const { budget, setBudget } = useBudget()

  return (
    <div className="px-5 py-2">
      <h1 className="text-xl font-semibold text-ink-900">Shop</h1>
      <p className="text-sm text-ink-500">
        Picked for where you are right now. Every item has a free option too.
      </p>

      <div className="mt-4 rounded-2xl border border-sand-200 bg-white p-4">
        <p className="text-[10px] font-medium uppercase tracking-wide text-ink-500">
          Your budget
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setBudget({ ...budget, mode: 'budget' })}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              budget.mode === 'budget' ? 'bg-terracotta-500 text-white' : 'bg-sand-100 text-ink-500'
            }`}
          >
            Set a budget
          </button>
          <button
            type="button"
            onClick={() => setBudget({ ...budget, mode: 'covered' })}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              budget.mode === 'covered' ? 'bg-sage-500 text-white' : 'bg-sand-100 text-ink-500'
            }`}
          >
            Insurance covers this
          </button>
        </div>
        {budget.mode === 'budget' && (
          <div className="mt-2 flex items-center gap-2 text-sm text-ink-500">
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={budget.amount}
              onChange={(e) => setBudget({ ...budget, amount: Number(e.target.value) })}
              className="flex-1 accent-terracotta-500"
            />
            <span className="font-medium text-ink-900">${budget.amount}/mo</span>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-3 pb-4">
        {products.map((p) => {
          const withinBudget = isWithinBudget(budget, p.price)
          return (
            <div key={p.id} className="rounded-2xl border border-sand-200 bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-block rounded-full bg-sand-100 px-2 py-0.5 text-[10px] font-medium text-ink-500">
                    {CATEGORY_LABELS[p.category]}
                  </span>
                  <h3 className="mt-1 font-medium text-ink-900">{p.name}</h3>
                  <p className="text-sm text-ink-500">{p.blurb}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    withinBudget ? 'bg-sage-100 text-sage-700' : 'bg-sand-100 text-ink-500'
                  }`}
                >
                  ${p.price}
                </span>
              </div>
              <div className="mt-2 rounded-xl bg-sand-50 p-2 text-xs text-ink-700">
                Free option: {p.freeAlternative}
              </div>
              {withinBudget ? (
                <button
                  type="button"
                  className="mt-3 w-full rounded-full bg-terracotta-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-terracotta-600"
                >
                  Buy — ${p.price}
                </button>
              ) : (
                <p className="mt-2 text-xs text-ink-500">
                  Over your current budget — shown as a stretch pick.
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
