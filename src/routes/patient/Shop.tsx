import { products, type Product } from '../../data/products'
import { isWithinBudget, useBudget } from '../../state/budget'

const CATEGORY_LABELS: Record<Product['category'], string> = {
  sleep: 'Sleep',
  breastfeeding: 'Breastfeeding',
  recovery: 'Recovery',
  'baby-gear': 'Baby gear',
  'mental-health': 'Mental health',
}

const CATEGORY_STYLES: Record<Product['category'], { bg: string; fg: string; path: string }> = {
  sleep: { bg: '#f5e2d8', fg: '#a14e30', path: 'M4 14c2-4 6-6 10-6a6 6 0 0 1 6 6c0 1-.3 2-.8 2.8M4 14l16 0M4 14c0 2.5 2 4.5 4.5 4.5' },
  breastfeeding: { bg: '#e3ead0', fg: '#5e7350', path: 'M9 4c0 3-2 3-2 6a5 5 0 0 0 10 0c0-3-2-3-2-6M7 14a7 7 0 0 0 14 0' },
  recovery: { bg: '#f5e2d8', fg: '#a14e30', path: 'M12 21s-7-4.4-9.5-8.8C.9 9 2.3 5.5 5.6 5A4.7 4.7 0 0 1 12 7.3 4.7 4.7 0 0 1 18.4 5c3.3.5 4.7 4 3.1 7.2C19 16.6 12 21 12 21Z' },
  'baby-gear': { bg: '#e3ead0', fg: '#5e7350', path: 'M6 8h12l1 12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1L6 8Z M9 8V6a3 3 0 0 1 6 0v2' },
  'mental-health': { bg: '#f5e2d8', fg: '#a14e30', path: 'M9 18h6 M10 21h4 M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 3Z' },
}

function CategoryBadge({ category }: { category: Product['category'] }) {
  const style = CATEGORY_STYLES[category]
  return (
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
      style={{ backgroundColor: style.bg }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={style.fg} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d={style.path} />
      </svg>
    </div>
  )
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
              <div className="flex items-start gap-3">
                <CategoryBadge category={p.category} />
                <div className="min-w-0 flex-1">
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
                </div>
              </div>
              <p className="mt-3 text-xs italic text-ink-500">{p.socialProof}</p>
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
