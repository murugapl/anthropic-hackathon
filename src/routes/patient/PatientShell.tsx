import { NavLink, Outlet } from 'react-router-dom'

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#bc6240' : '#b8b2a9'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9" />
    </svg>
  )
}

function TrendsIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#bc6240' : '#b8b2a9'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="m7 15 3.5-4 3 3L19 7" />
    </svg>
  )
}

function ShopIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#bc6240' : '#b8b2a9'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8h12l1 12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  )
}

function ChatIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#bc6240' : '#b8b2a9'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.4 8.5 8.5 0 0 1-4-1L3 20l1.1-5.5A8.4 8.4 0 0 1 21 11.5Z" />
    </svg>
  )
}

function MindIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#bc6240' : '#b8b2a9'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-4.4-9.5-8.8C.9 9 2.3 5.5 5.6 5A4.7 4.7 0 0 1 12 7.3 4.7 4.7 0 0 1 18.4 5c3.3.5 4.7 4 3.1 7.2C19 16.6 12 21 12 21Z" />
    </svg>
  )
}

function CareIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#bc6240' : '#b8b2a9'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  )
}

const TABS = [
  { to: '/patient', label: 'Home', icon: HomeIcon, end: true },
  { to: '/patient/trends', label: 'Data', icon: TrendsIcon, end: false },
  { to: '/patient/shop', label: 'Shop', icon: ShopIcon, end: false },
  { to: '/patient/mind', label: 'Mind', icon: MindIcon, end: false },
  { to: '/patient/chat', label: 'Chat', icon: ChatIcon, end: false },
  { to: '/patient/care', label: 'Care', icon: CareIcon, end: false },
]

export default function PatientShell() {
  return (
    <div className="flex h-dvh justify-center bg-ink-100 sm:h-screen sm:items-center sm:py-4">
      <div className="flex h-full w-full max-w-[430px] flex-col overflow-hidden bg-sand-50 shadow-xl sm:h-[860px] sm:rounded-[2.5rem] sm:border sm:border-ink-100">
        <div className="shrink-0 flex items-center justify-between px-5 pb-2 pt-5">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-terracotta-400" />
            <span className="text-sm font-semibold text-ink-900">Peri</span>
          </div>
          <NavLink to="/" className="text-xs text-ink-500 hover:text-terracotta-600">
            Exit
          </NavLink>
        </div>

        <div className="flex-1 overflow-y-auto pb-6">
          <Outlet />
        </div>

        <nav className="shrink-0 flex justify-around border-t border-sand-200 bg-white/95 px-2 py-2 backdrop-blur">
          {TABS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className="flex flex-col items-center gap-1 rounded-xl px-3 py-1.5"
            >
              {({ isActive }) => (
                <>
                  <Icon active={isActive} />
                  <span
                    className={`text-[10px] font-medium ${
                      isActive ? 'text-terracotta-600' : 'text-ink-300'
                    }`}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
