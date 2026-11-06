import { Link, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="flex min-h-full flex-col bg-sand-50">
      <header className="border-b border-sand-200 bg-sand-50/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-terracotta-400" />
            <span className="text-lg font-semibold tracking-tight text-ink-900">
              Peri
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-sm text-ink-500">
            <Link to="/patient" className="hover:text-terracotta-600">
              Patient
            </Link>
            <Link to="/doctor" className="hover:text-terracotta-600">
              Doctor
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
