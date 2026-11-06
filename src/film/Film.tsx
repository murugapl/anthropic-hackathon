// Scripted demo video. Open /film to preview in real time, or run
// `npm run film:record` to render a frame-perfect MP4 (no audio).
// Jenny's segments drive the REAL app inside iframes; the narrative scenes
// (cold open, problem, privacy, next steps, finale) are animated here.

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { jennyTimeline } from '../data/patient'
import { FILM_REFERRAL } from './content'
import {
  Timeline,
  addTap,
  easeOut,
  find,
  highlight,
  keyframes,
  loadFrame,
  nextFrames,
  progress,
  setFilmTime,
  setRange,
  stagePoint,
  useFilmTime,
  useTaps,
  vis,
  waitFor,
  type Cue,
} from './engine'
import { ColdOpen, Finale, MeetPeri, NextSteps, Problem, Trust } from './scenes'

export const FILM_DURATION = 275
const W = 1920
const H = 1080

const weekIdx = (label: string) => {
  const i = jennyTimeline.findIndex((w) => w.label === label)
  if (i < 0) throw new Error(`film: unknown week ${label}`)
  return i
}
const W28 = weekIdx('Pregnancy · week 28')
const W35 = weekIdx('Pregnancy · week 35')
const PP6 = weekIdx('Postpartum · week 6')
const PP12 = weekIdx('Postpartum · week 12')

// ---------- captions shown beside the real app ----------
interface Caption {
  from: number
  to: number
  kicker: string
  title: string
  sub?: string
  extra?: 'devices'
}
const PHONE_CAPTIONS: Caption[] = [
  { from: 95.6, to: 100.2, kicker: 'Meet Jenny', title: '35 weeks pregnant.', sub: "What you're seeing is the real Peri app, running on synthetic data." },
  { from: 100.6, to: 112, kicker: 'Passive by design', title: "She hasn't typed a thing.", sub: 'Peri reads from the devices she already has.', extra: 'devices' },
  { from: 112.4, to: 120, kicker: 'Peri notices', title: 'Under 6 hours of sleep.', sub: 'So her feed suggests something gentle: a supportive pillow.' },
  { from: 120.4, to: 128, kicker: 'How Peri stays free', title: 'Referral fees on what she chooses to buy.', sub: 'Our main revenue. We never sell her data.' },
  { from: 128.4, to: 140, kicker: 'Her budget, her call', title: 'Free option first. Always.', sub: 'Every paid suggestion comes with a free alternative, so advice never depends on commission or on what she can afford.' },
  { from: 140.4, to: 151.6, kicker: 'Postpartum · week 6', title: 'Follow-up ends. Blood pressure starts rising.', sub: 'Normally, nobody would see it.' },
  { from: 173, to: 180, kicker: "Back on Jenny's phone", title: 'She sees the same document.', sub: 'No one is left in the dark.' },
  { from: 180.4, to: 191, kicker: 'The quiet weeks', title: 'Her mood check-ins dip.', sub: "Peri doesn't diagnose or raise an alarm. It reaches out gently." },
  { from: 191.4, to: 209.6, kicker: 'Virtual therapy', title: 'Sliding-scale prices. Booked in a few taps.', sub: 'From her couch, wherever she lives.' },
  { from: 260.6, to: 268, kicker: 'Postpartum · week 20', title: "Jenny's still here.", sub: 'So is Peri.' },
]
const DOCTOR_CAPTIONS: Caption[] = [
  { from: 153.4, to: 163, kicker: "Her doctor's view", title: 'Her doctor does.', sub: 'Jenny is flagged, with the trend and the reason.' },
  { from: 163.4, to: 172, kicker: 'One click', title: 'A 6-week summary and specialist referral.', sub: 'Plain language, ready to send.' },
]

function DeviceRow({ t, at }: { t: number; at: number }) {
  const devices = ['Smartwatch', 'Smart ring', 'BP cuff']
  return (
    <div style={{ marginTop: 36 }}>
      <div style={{ display: 'flex', gap: 14 }}>
        {devices.map((d, i) => {
          const p = easeOut(progress(t, at + i * 0.5, 0.6))
          const pulse = 0.5 + 0.5 * Math.sin((t - i) * 5)
          return (
            <div key={d} style={{ opacity: p, transform: `translateY(${(1 - p) * 14}px)`, background: 'white', border: '1px solid #e6dac6', borderRadius: 20, padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, color: '#2a2622', fontWeight: 500 }}>
              <span style={{ width: 12, height: 12, borderRadius: 999, background: '#778f64', opacity: 0.4 + 0.6 * pulse }} />
              {d}
            </div>
          )
        })}
      </div>
      <div style={{ marginTop: 14, fontSize: 21, color: '#6f6a62', opacity: easeOut(progress(t, at + 1.6, 0.6)) }}>
        Through Apple Health and Google Health Connect
      </div>
      <div style={{ marginTop: 26, display: 'inline-block', background: '#e3ead0', color: '#495a3f', borderRadius: 18, padding: '14px 22px', fontSize: 23, opacity: easeOut(progress(t, at + 3.4, 0.6)) }}>
        No wearable? A 10-second check-in on any phone works too.
      </div>
    </div>
  )
}

function CaptionPanel({ t, captions, left, width }: { t: number; captions: Caption[]; left: number; width: number }) {
  return (
    <>
      {captions.map((c) => {
        const o = vis(t, c.from, c.to, 0.5)
        if (o <= 0) return null
        const rise = (1 - easeOut(progress(t, c.from, 0.6))) * 20
        return (
          <div key={c.from} style={{ position: 'absolute', left, width, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: o, transform: `translateY(${rise}px)` }}>
            <div style={{ fontSize: 24, color: '#bc6240', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>{c.kicker}</div>
            <div style={{ fontSize: width > 600 ? 68 : 54, color: '#2a2622', fontWeight: 600, lineHeight: 1.12, marginTop: 14 }}>{c.title}</div>
            {c.sub && <div style={{ fontSize: 30, color: '#6f6a62', marginTop: 20, lineHeight: 1.35 }}>{c.sub}</div>}
            {c.extra === 'devices' && <DeviceRow t={t} at={c.from + 1.5} />}
          </div>
        )
      })}
    </>
  )
}

function JourneyBar({ t, opacity }: { t: number; opacity: number }) {
  const pos = keyframes(t, [
    [95, 0.02],
    [96.5, 0.02],
    [99.5, 0.17],
    [141, 0.17],
    [145, 0.52],
    [181, 0.52],
    [184, 0.72],
    [259, 0.72],
    [261, 1],
  ])
  const stops: [number, string][] = [
    [0, 'Pregnancy'],
    [0.3, 'Birth'],
    [0.52, 'Week 6'],
    [0.72, 'Week 12'],
    [1, 'Week 20'],
  ]
  const w = 760
  return (
    <div style={{ position: 'absolute', left: 980, top: 940, width: w, opacity }}>
      <div style={{ position: 'relative', height: 4, background: '#e6dac6', borderRadius: 4 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: 4, width: pos * w, background: '#bc6240', borderRadius: 4 }} />
        {stops.map(([p, label]) => (
          <div key={label} style={{ position: 'absolute', left: p * w, top: -4, transform: 'translateX(-50%)', textAlign: 'center' }}>
            <div style={{ width: 12, height: 12, borderRadius: 99, margin: '0 auto', background: pos >= p ? '#bc6240' : '#e6dac6' }} />
            <div style={{ marginTop: 10, fontSize: 18, color: '#6f6a62', whiteSpace: 'nowrap' }}>{label}</div>
          </div>
        ))}
        <div style={{ position: 'absolute', left: pos * w, top: -9, width: 22, height: 22, borderRadius: 99, background: 'white', border: '5px solid #bc6240', transform: 'translateX(-50%)' }} />
      </div>
    </div>
  )
}

function Taps({ t }: { t: number }) {
  const taps = useTaps()
  return (
    <>
      {taps.map((tap, i) => {
        const p = (t - tap.at) / 0.7
        if (p < 0 || p > 1) return null
        const r = 22 + 30 * easeOut(p)
        return (
          <div key={i} style={{ position: 'absolute', left: tap.x - r, top: tap.y - r, width: r * 2, height: r * 2, borderRadius: 999, background: 'rgba(188,98,64,0.25)', border: '3px solid rgba(188,98,64,0.8)', opacity: 1 - p, pointerEvents: 'none' }} />
        )
      })}
    </>
  )
}

function Bezel({ children }: { children: ReactNode }) {
  return (
    <div style={{ padding: 12, borderRadius: 62, background: '#2a2622', boxShadow: '0 40px 90px rgba(68,64,58,0.25)' }}>
      <div style={{ borderRadius: 50, overflow: 'hidden', width: 430 * 1.1, height: 880 * 1.1 }}>{children}</div>
    </div>
  )
}

// ---------- the film ----------

let started = false

export default function Film() {
  const t = useFilmTime()
  const stageRef = useRef<HTMLDivElement>(null)
  const phoneRef = useRef<HTMLIFrameElement>(null)
  const browserRef = useRef<HTMLIFrameElement>(null)
  const [fit, setFit] = useState(1)
  const [ready, setReady] = useState(false)
  const params = new URLSearchParams(window.location.search)
  const renderMode = params.has('render')

  useEffect(() => {
    if (renderMode) return
    const onResize = () => setFit(Math.min(window.innerWidth / W, window.innerHeight / H))
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [renderMode])

  useEffect(() => {
    if (started) return
    started = true
    const S = () => stageRef.current!
    const P = () => phoneRef.current!
    const B = () => browserRef.current!

    localStorage.removeItem('peri-referral')
    let resolveReferral: ((text: string) => void) | null = null
    ;(window as unknown as { __periFilm: unknown }).__periFilm = {
      respond: () => new Promise<string>((r) => (resolveReferral = r)),
    }

    const held = new Map<string, HTMLElement | null>()
    const on = (key: string, frame: () => HTMLIFrameElement, selector: string, text?: string): Cue['run'] => () => {
      const el = find(frame(), selector, text)
      held.set(key, el)
      highlight(el)
    }
    const off = (key: string): Cue['run'] => () => {
      highlight(held.get(key) ?? null, false)
      held.delete(key)
    }
    const tap = (at: number, frame: () => HTMLIFrameElement, selector: string, text?: string): Cue => ({
      at,
      run: async () => {
        const el = await waitFor(frame(), selector, text)
        addTap({ ...stagePoint(S(), frame(), el), at })
        el.click()
        await nextFrames(frame().contentWindow!, 3)
      },
    })
    const homeSlider = () => find(P(), 'input[type=range]')!
    const setWeek = (at: number, week: number): Cue => ({
      at,
      run: async () => {
        await waitFor(P(), 'input[type=range]')
        await setRange(P(), homeSlider(), week)
      },
    })
    const scrubWeeks = (at: number, dur: number, from: number, to: number): Cue => ({
      at,
      dur,
      run: (p) => setRange(P(), homeSlider(), Math.round(from + (to - from) * easeOut(p))),
    })

    const cues: Cue[] = [
      // ---- Week 35: wearables, sleep, budget ----
      setWeek(94.9, W28),
      scrubWeeks(96.6, 3, W28, W35),
      { at: 101.5, run: on('sleep', P, 'div.flex-1.rounded-2xl', 'Sleep') },
      { at: 111.8, run: off('sleep') },
      { at: 112.6, run: on('advice', P, 'div.rounded-2xl.p-4', 'Third-trimester sleep') },
      { at: 119.4, run: off('advice') },
      tap(120, P, 'a', 'See this pick in Shop'),
      { at: 120.05, run: async () => setRange(P(), await waitFor(P(), 'input[type=range]'), 60) },
      { at: 121.6, run: on('buy', P, 'button', 'Buy — $45') },
      { at: 127.8, run: off('buy') },
      {
        at: 129,
        dur: 3.5,
        run: (p) => setRange(P(), find(P(), 'input[type=range]')!, Math.round((60 - 40 * easeOut(p)) / 5) * 5),
      },
      { at: 133.2, run: on('free', P, 'div.rounded-xl', 'Prop regular pillows') },
      { at: 139.6, run: off('free') },

      // ---- Week 6: BP rising ----
      tap(140.2, P, 'nav a', 'Home'),
      setWeek(140.25, W35),
      scrubWeeks(141.2, 3.8, W35, PP6),
      { at: 146, run: on('bpchip', P, 'div.flex-1.rounded-2xl', 'BP') },
      { at: 148.5, run: on('bpcard', P, 'div.rounded-2xl.p-4', 'blood pressure has been trending up') },
      { at: 151.8, run: () => { off('bpchip')(0); off('bpcard')(0) } },

      // ---- Doctor ----
      { at: 155, run: on('jenny', B, 'a[href="/doctor/jenny"]') },
      { at: 157.6, run: off('jenny') },
      tap(158, B, 'a[href="/doctor/jenny"]'),
      { at: 159.4, run: on('bpflag', B, 'div.rounded-2xl.p-4', 'Blood pressure still elevated') },
      { at: 162.6, run: off('bpflag') },
      tap(163.2, B, 'button', 'Generate'),
      { at: 165.6, run: async () => { resolveReferral?.(FILM_REFERRAL); await waitFor(B(), 'div.rounded-2xl', 'Summary & referral') } },
      {
        at: 166.2,
        dur: 4.5,
        run: (p) => {
          const win = B().contentWindow!
          const max = win.document.documentElement.scrollHeight - win.innerHeight
          win.scrollTo(0, max * easeOut(p))
        },
      },

      // ---- Jenny sees the referral ----
      { at: 172, run: () => loadFrame(P(), '/patient/care', 'div.rounded-2xl', 'Latest update') },
      { at: 174.2, run: on('care', P, 'div.rounded-2xl', 'Shared by your doctor') },
      { at: 179.6, run: off('care') },

      // ---- Mood -> therapy ----
      tap(180.4, P, 'nav a', 'Home'),
      setWeek(180.45, PP6),
      scrubWeeks(181.2, 3, PP6, PP12),
      { at: 185, run: on('mood', P, 'div.bg-sage-100', 'Checking in') },
      { at: 190.6, run: off('mood') },
      tap(191.2, P, 'a', 'Talk to someone'),
      { at: 194, run: on('scale', P, 'div.rounded-2xl', 'as low as $15') },
      { at: 198.6, run: off('scale') },
      tap(199.4, P, 'button', 'Thu 11:00 AM'),

      // ---- Week 20 close ----
      { at: 259, run: () => loadFrame(P(), '/patient', 'input[type=range]') },
    ]
    const timeline = new Timeline(cues)

    async function seek(time: number) {
      flushSync(() => setFilmTime(time))
      await timeline.seek(time)
      await nextFrames(window, 2)
    }

    async function boot() {
      await Promise.all([
        loadFrame(P(), '/patient', 'input[type=range]'),
        loadFrame(B(), '/doctor', 'h1', 'Your patients'),
      ])
      const w = window as unknown as { __filmSeek: typeof seek; __filmReady: boolean; __filmDuration: number }
      w.__filmSeek = seek
      w.__filmDuration = FILM_DURATION
      w.__filmReady = true
      setReady(true)
      if (renderMode) return

      const startAt = Number(params.get('t') ?? 0)
      const t0 = performance.now()
      let busy = false
      const loop = async () => {
        const now = startAt + (performance.now() - t0) / 1000
        if (!busy && now <= FILM_DURATION) {
          busy = true
          await seek(now)
          busy = false
        }
        if (now <= FILM_DURATION) requestAnimationFrame(loop)
      }
      requestAnimationFrame(loop)
    }
    boot()
  }, [])

  const phoneO = Math.max(vis(t, 95, 152, 0.9), vis(t, 172.4, 210, 0.9), vis(t, 260, 268.4, 0.9))
  const phoneRise = (1 - phoneO) * 60
  const browserO = vis(t, 152.4, 172.4, 0.9)
  const appBg = t > 94.5 && t < 268.6

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', overflow: 'hidden' }}>
      <div
        ref={stageRef}
        style={{
          position: 'relative',
          width: W,
          height: H,
          overflow: 'hidden',
          background: '#faf8f4',
          fontFamily: "'Avenir Next', 'Segoe UI', system-ui, sans-serif",
          transform: `scale(${fit})`,
          transformOrigin: 'top left',
        }}
      >
        {/* real app: patient phone */}
        <div style={{ position: 'absolute', left: 290, top: 32, opacity: phoneO, transform: `translateY(${phoneRise}px)`, pointerEvents: phoneO > 0 ? 'auto' : 'none' }}>
          <Bezel>
            <iframe ref={phoneRef} title="Peri patient app" style={{ width: 430, height: 880, border: 0, transform: 'scale(1.1)', transformOrigin: 'top left', background: '#faf8f4' }} />
          </Bezel>
        </div>
        {/* real app: doctor browser */}
        <div style={{ position: 'absolute', left: 80, top: 140, opacity: browserO, transform: `translateY(${(1 - browserO) * 60}px)`, pointerEvents: browserO > 0 ? 'auto' : 'none', borderRadius: 18, overflow: 'hidden', boxShadow: '0 40px 90px rgba(68,64,58,0.25)', border: '1px solid #e6dac6' }}>
          <div style={{ height: 44, background: '#f2ede1', display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px' }}>
            {['#e0565b', '#d9a13b', '#5fae5b'].map((c) => (
              <span key={c} style={{ width: 13, height: 13, borderRadius: 99, background: c }} />
            ))}
            <span style={{ marginLeft: 16, flex: 1, background: 'white', borderRadius: 8, padding: '5px 14px', fontSize: 15, color: '#6f6a62' }}>Peri · Clinician view</span>
          </div>
          <div style={{ width: 1000 * 1.18, height: 640 * 1.18, overflow: 'hidden' }}>
            <iframe ref={browserRef} title="Peri doctor app" style={{ width: 1000, height: 640, border: 0, transform: 'scale(1.18)', transformOrigin: 'top left', background: '#faf8f4' }} />
          </div>
        </div>

        {appBg && (
          <>
            <CaptionPanel t={t} captions={PHONE_CAPTIONS} left={980} width={800} />
            <CaptionPanel t={t} captions={DOCTOR_CAPTIONS} left={1340} width={500} />
            <JourneyBar t={t} opacity={phoneO} />
          </>
        )}

        <Problem t={t} />
        <MeetPeri t={t} />
        <Trust t={t} />
        <NextSteps t={t} />
        <Finale t={t} />
        <ColdOpen t={t} />
        <Taps t={t} />

        {!ready && (
          <div style={{ position: 'absolute', inset: 0, background: '#000', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
            Loading film…
          </div>
        )}
      </div>
    </div>
  )
}
