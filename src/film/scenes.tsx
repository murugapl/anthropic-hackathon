import type { CSSProperties, ReactNode } from 'react'
import PeriMascot from '../components/PeriMascot'
import { STATS, STORM } from './content'
import { clamp, easeOut, keyframes, progress, vis } from './engine'

const C = {
  terracotta: '#bc6240',
  terracottaDark: '#a14e30',
  terracottaSoft: '#f5e2d8',
  sage: '#778f64',
  sageDark: '#495a3f',
  sageSoft: '#e3ead0',
  sand: '#faf8f4',
  sand200: '#e6dac6',
  ink900: '#2a2622',
  ink700: '#44403a',
  ink500: '#6f6a62',
  ink300: '#b8b2a9',
}

const rand = (i: number, salt = 0) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

/** Fade + rise in at `at`, optionally out at `out`. */
function Reveal({
  t,
  at,
  out = Infinity,
  rise = 18,
  children,
  style,
}: {
  t: number
  at: number
  out?: number
  rise?: number
  children: ReactNode
  style?: CSSProperties
}) {
  const p = easeOut(progress(t, at, 0.7))
  const o = out === Infinity ? p : Math.min(p, easeOut(clamp((out - t) / 0.6)))
  // Keep layout space reserved before the reveal so nothing shifts.
  return (
    <div style={{ opacity: Math.max(0, o), transform: `translateY(${(1 - p) * rise}px)`, ...style }}>{children}</div>
  )
}

const full: CSSProperties = { position: 'absolute', inset: 0 }

// ======================= COLD OPEN (0 - 35) =======================

const STORM_END = 27.6

function stormTimes(): number[] {
  const times: number[] = []
  let at = 1.2
  let gap = 2.6
  while (at < STORM_END) {
    times.push(at)
    at += gap
    gap = Math.max(0.24, gap * 0.88)
  }
  return times
}
const PHONE_TIMES = stormTimes()
// After the scripted list runs out, keep cycling postpartum items only.
const POSTPARTUM_START = STORM.findIndex((n) => n.stage === 'Day 1')
const stormItem = (i: number) =>
  STORM[i < STORM.length ? i : POSTPARTUM_START + ((i - STORM.length) % (STORM.length - POSTPARTUM_START))]

function scatterTimes(): number[] {
  const times: number[] = []
  let at = 19.5
  let gap = 0.55
  while (at < STORM_END) {
    times.push(at)
    at += gap
    gap = Math.max(0.07, gap * 0.9)
  }
  return times
}
const SCATTER_TIMES = scatterTimes()

function NotificationCard({
  n,
  width = 360,
  dim = false,
}: {
  n: { app: string; color: string; title: string; body: string }
  width?: number
  dim?: boolean
}) {
  return (
    <div
      style={{
        width,
        borderRadius: 22,
        padding: '12px 14px',
        background: dim ? 'rgba(255,255,255,0.10)' : 'rgba(250,248,244,0.86)',
        boxShadow: dim ? 'none' : '0 8px 24px rgba(0,0,0,0.35)',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        color: dim ? '#e9e4dc' : C.ink900,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 9,
          background: n.color,
          flexShrink: 0,
          color: 'white',
          fontWeight: 700,
          fontSize: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {n.app[0]}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, opacity: 0.6 }}>
          <span style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>{n.app}</span>
          <span>now</span>
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, marginTop: 1 }}>{n.title}</div>
        <div style={{ fontSize: 14, opacity: 0.75 }}>{n.body}</div>
      </div>
    </div>
  )
}

function LockScreen({ stage, time, children }: { stage: string; time: string; children?: ReactNode }) {
  return (
    <div
      style={{
        width: 420,
        height: 860,
        borderRadius: 64,
        padding: 12,
        background: '#0d0c0b',
        boxShadow: '0 0 0 2px #3a3530, 0 40px 120px rgba(0,0,0,0.6)',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: 52,
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #2b2520 0%, #191512 60%, #100e0c 100%)',
        }}
      >
        <div style={{ textAlign: 'center', paddingTop: 70, color: '#efe9e0' }}>
          <div style={{ fontSize: 17, opacity: 0.7, fontWeight: 500 }}>{stage}</div>
          <div style={{ fontSize: 92, fontWeight: 300, lineHeight: 1, marginTop: 4 }}>{time}</div>
        </div>
        {children}
      </div>
    </div>
  )
}

export function ColdOpen({ t }: { t: number }) {
  if (t > 35.6) return null
  const storm = t < STORM_END
  const blackFade = 1 - progress(t, 34.4, 1.0)

  // newest notification in the phone
  let newest = -1
  for (let i = 0; i < PHONE_TIMES.length; i++) if (PHONE_TIMES[i] <= t) newest = i
  const stageLabel = newest >= 0 ? stormItem(newest).stage : 'Week 29'

  const shakeA = keyframes(t, [
    [13, 0],
    [STORM_END, 10],
  ])
  const dx = shakeA * Math.sin(t * 53)
  const dy = shakeA * 0.6 * Math.cos(t * 47)
  const rot = shakeA * 0.08 * Math.sin(t * 31)
  const vignette = keyframes(t, [
    [9, 0],
    [STORM_END, 0.6],
  ]) * (0.85 + 0.15 * Math.sin(t * 9))

  return (
    <div style={{ ...full, background: '#000', opacity: blackFade }}>
      {storm && (
        <>
          <div
            style={{
              ...full,
              background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(161,40,30,${vignette}) 100%)`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 750,
              top: 110,
              transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`,
              opacity: easeOut(progress(t, 0, 0.8)),
            }}
          >
            <LockScreen stage={stageLabel} time="2:14">
              <div style={{ position: 'absolute', left: 18, right: 18, top: 230 }}>
                {PHONE_TIMES.map((at, i) => {
                  if (at > t) return null
                  let slot = 0
                  for (let k = i + 1; k < PHONE_TIMES.length && PHONE_TIMES[k] <= t; k++) {
                    slot += easeOut(clamp((t - PHONE_TIMES[k]) / 0.22))
                  }
                  if (slot > 8) return null
                  const enter = easeOut(clamp((t - at) / 0.22))
                  return (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: slot * 88,
                        opacity: enter * (1 - clamp(slot - 6.5)),
                        transform: `translateY(${(1 - enter) * -24}px) scale(${0.96 + 0.04 * enter})`,
                      }}
                    >
                      <NotificationCard n={stormItem(i)} />
                    </div>
                  )
                })}
              </div>
            </LockScreen>
          </div>
          {SCATTER_TIMES.map((at, i) => {
            if (at > t) return null
            const p = easeOut(clamp((t - at) / 0.18))
            const side = rand(i, 1) < 0.5
            const x = side ? 40 + rand(i, 2) * 560 : 1220 + rand(i, 2) * 620
            const y = 30 + rand(i, 3) * 940
            const r = (rand(i, 4) - 0.5) * 14
            return (
              <div
                key={`s${i}`}
                style={{
                  position: 'absolute',
                  left: x - 170,
                  top: y - 40,
                  opacity: p,
                  transform: `rotate(${r}deg) scale(${0.85 + 0.15 * p})`,
                }}
              >
                <NotificationCard n={STORM[(i * 7 + 3) % STORM.length]} width={340} />
              </div>
            )
          })}
        </>
      )}

      {!storm && t >= 29 && (
        <>
          <div
            style={{
              position: 'absolute',
              left: 750,
              top: 70,
              transform: 'scale(0.85)',
              transformOrigin: 'top center',
              opacity: 0.55 * easeOut(progress(t, 29, 1.6)),
            }}
          >
            <LockScreen stage="Postpartum · week 6" time="9:00" />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 960 - 190,
              top: 300,
              opacity: easeOut(progress(t, 29.8, 1.4)),
            }}
          >
            <NotificationCard
              dim
              width={380}
              n={{
                app: 'Clinic portal',
                color: '#5a5048',
                title: 'Week 6: Your postpartum care is complete.',
                body: 'No further appointments scheduled.',
              }}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 900,
              textAlign: 'center',
              color: '#b8b2a9',
              fontSize: 34,
              fontStyle: 'italic',
              opacity: easeOut(progress(t, 31.8, 1.2)),
            }}
          >
            And then… nothing.
          </div>
        </>
      )}
    </div>
  )
}

// ======================= PROBLEM (35 - 75) =======================

const center: CSSProperties = {
  ...full,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
}

function Chip({ children, tone = 'terracotta' }: { children: ReactNode; tone?: 'terracotta' | 'sage' | 'sand' }) {
  const styles = {
    terracotta: { background: C.terracottaSoft, color: C.terracottaDark },
    sage: { background: C.sageSoft, color: C.sageDark },
    sand: { background: 'white', color: C.ink700, border: `1px solid ${C.sand200}` },
  }[tone]
  return (
    <span style={{ ...styles, borderRadius: 999, padding: '12px 24px', fontSize: 26, fontWeight: 500, display: 'inline-block' }}>
      {children}
    </span>
  )
}

function CliffChart({ t, start }: { t: number; start: number }) {
  const w = 1100
  const h = 330
  const x = (week: number) => 60 + ((week + 12) / 64) * (w - 100)
  const draw = clamp((t - start) / 2.6)
  const band = easeOut(progress(t, start + 2.4, 1))
  const care = `M ${x(-12)} 70 L ${x(6)} 70 L ${x(6)} 280 L ${x(52)} 280`
  return (
    <svg width={w} height={h + 40} style={{ overflow: 'visible' }}>
      <rect x={x(0)} y={40} width={x(52) - x(0)} height={260} fill={C.terracotta} opacity={0.1 * band} rx={8} />
      <text x={x(52) - 14} y={68} textAnchor="end" fontSize={20} fill={C.terracottaDark} opacity={band}>
        Risk window: up to a year
      </text>
      <line x1={x(-12)} x2={x(52)} y1={300} y2={300} stroke={C.ink300} strokeWidth={2} />
      {[
        [-12, 'Pregnancy'],
        [0, 'Birth'],
        [6, 'Week 6'],
        [52, '1 year'],
      ].map(([wk, label]) => (
        <text key={label} x={x(wk as number)} y={332} textAnchor="middle" fontSize={20} fill={C.ink500}>
          {label}
        </text>
      ))}
      <path d={care} fill="none" stroke={C.sage} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} />
      <text x={x(-10)} y={54} fontSize={20} fill={C.sageDark} opacity={draw > 0.1 ? 1 : 0}>
        Formal care
      </text>
      <text x={x(6) + 14} y={180} fontSize={22} fontWeight={600} fill={C.terracottaDark} opacity={clamp((draw - 0.45) * 4)}>
        ← care ends
      </text>
    </svg>
  )
}

export function Problem({ t }: { t: number }) {
  if (t < 34.4 || t > 75.6) return null
  return (
    <div style={{ ...full, background: C.sand, opacity: 1 - progress(t, 75, 0.5) }}>
      {/* A: six weeks */}
      <div style={{ ...center, opacity: vis(t, 35.6, 42.3) }}>
        <Reveal t={t} at={36}>
          <div style={{ fontSize: 44, color: C.ink700 }}>Formal postpartum care ends at</div>
        </Reveal>
        <Reveal t={t} at={36.8}>
          <div style={{ fontSize: 150, fontWeight: 600, color: C.terracotta, lineHeight: 1.1 }}>six weeks.</div>
        </Reveal>
        <Reveal t={t} at={39.2}>
          <div style={{ fontSize: 40, color: C.ink900, marginTop: 30, fontWeight: 500 }}>The risks don't.</div>
        </Reveal>
        <div style={{ display: 'flex', gap: 16, marginTop: 28 }}>
          {['High blood pressure', 'Diabetes', 'Depression', 'Heart disease'].map((label, i) => (
            <Reveal key={label} t={t} at={39.8 + i * 0.4}>
              <Chip>{label}</Chip>
            </Reveal>
          ))}
        </div>
      </div>

      {/* B: stat */}
      <div style={{ ...center, opacity: vis(t, 42.6, 52) }}>
        <Reveal t={t} at={42.9}>
          <div style={{ fontSize: 230, fontWeight: 700, color: C.terracotta, lineHeight: 1 }}>{STATS.big}</div>
        </Reveal>
        <Reveal t={t} at={43.8}>
          <div style={{ fontSize: 46, color: C.ink900, maxWidth: 1200, marginTop: 20 }}>{STATS.line}</div>
        </Reveal>
        <Reveal t={t} at={47.2}>
          <div style={{ fontSize: 46, color: C.terracottaDark, fontWeight: 600, marginTop: 30 }}>{STATS.follow}</div>
        </Reveal>
        <Reveal t={t} at={48}>
          <div style={{ fontSize: 18, color: C.ink500, marginTop: 60 }}>{STATS.source}</div>
        </Reveal>
      </div>

      {/* C: the cliff */}
      <div style={{ ...center, opacity: vis(t, 52.3, 62) }}>
        <Reveal t={t} at={52.6}>
          <div style={{ fontSize: 28, color: C.ink500, letterSpacing: 2, textTransform: 'uppercase' }}>
            We interviewed an OB-GYN
          </div>
        </Reveal>
        <Reveal t={t} at={53.6}>
          <div style={{ fontSize: 120, fontWeight: 600, color: C.ink900, marginTop: 6 }}>“It's a cliff.”</div>
        </Reveal>
        <div style={{ marginTop: 20, height: 370 }}>{t > 55 && <CliffChart t={t} start={55} />}</div>
        <Reveal t={t} at={58.6}>
          <div style={{ fontSize: 32, color: C.ink700, maxWidth: 1300 }}>
            Clinics aren't staffed or paid to follow up past six weeks. Referrals fall through the cracks.
          </div>
        </Reveal>
      </div>

      {/* D: two insights */}
      <div style={{ ...center, opacity: vis(t, 62.3, 75.2) }}>
        <Reveal t={t} at={62.5}>
          <div style={{ fontSize: 28, color: C.ink500, letterSpacing: 2, textTransform: 'uppercase' }}>
            What we heard
          </div>
        </Reveal>
        <div style={{ display: 'flex', gap: 40, marginTop: 40 }}>
          {[
            { at: 63.5, kicker: 'Engagement', text: 'Patients engage when they feel someone is there. Not an algorithm.' },
            { at: 68.5, kicker: 'The real barrier', text: "It isn't motivation. It's exhaustion." },
          ].map((card) => (
            <Reveal key={card.kicker} t={t} at={card.at} rise={30}>
              <div
                style={{
                  width: 640,
                  minHeight: 300,
                  borderRadius: 36,
                  background: 'white',
                  border: `1px solid ${C.sand200}`,
                  padding: 48,
                  textAlign: 'left',
                  boxShadow: '0 20px 60px rgba(68,64,58,0.08)',
                }}
              >
                <div style={{ fontSize: 22, color: C.terracotta, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                  {card.kicker}
                </div>
                <div style={{ fontSize: 46, color: C.ink900, fontWeight: 500, marginTop: 18, lineHeight: 1.2 }}>{card.text}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}

// ======================= MEET PERI (75 - 95) =======================

export function MeetPeri({ t }: { t: number }) {
  if (t < 75 || t > 95.5) return null
  const pop = easeOut(progress(t, 75.5, 0.9))
  return (
    <div style={{ ...center, background: C.sand, opacity: vis(t, 75.1, 95.3, 0.5) }}>
      <div style={{ opacity: vis(t, 75.4, 82.6), display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute' }}>
        <div style={{ transform: `scale(${0.6 + 0.4 * pop})`, opacity: pop }}>
          <PeriMascot size={190} />
        </div>
        <Reveal t={t} at={76}>
          <div style={{ fontSize: 130, fontWeight: 600, color: C.ink900, letterSpacing: -2, lineHeight: 1 }}>Peri</div>
        </Reveal>
        <Reveal t={t} at={77.6}>
          <div style={{ fontSize: 40, color: C.ink500, maxWidth: 1100, marginTop: 26 }}>
            A companion from pregnancy through the first year postpartum, that keeps her doctor in the loop.
          </div>
        </Reveal>
      </div>
      <div style={{ opacity: vis(t, 83, 95), display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute' }}>
        <Reveal t={t} at={83}>
          <div style={{ fontSize: 120, fontWeight: 600, color: C.sage, lineHeight: 1 }}>Free for patients.</div>
        </Reveal>
        <Reveal t={t} at={84.6}>
          <div style={{ fontSize: 36, color: C.ink700, marginTop: 28, maxWidth: 1200 }}>
            Because the women most likely to fall off the cliff often have the least coverage, the longest drive, and no time for one more call.
          </div>
        </Reveal>
        <div style={{ display: 'flex', gap: 18, marginTop: 40 }}>
          {['No coverage required', 'Works wherever she lives', 'No extra phone calls'].map((label, i) => (
            <Reveal key={label} t={t} at={87.2 + i * 0.8}>
              <Chip tone="sage">{label}</Chip>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}

// ======================= TRUST (210 - 240) =======================

const TRUST_ITEMS = [
  { at: 213, title: 'She owns her data', body: 'View, export or delete it at any time.' },
  { at: 215.5, title: 'Encrypted everywhere', body: 'At rest and in transit.' },
  { at: 218, title: "Only what's needed", body: 'We collect the minimum it takes to help.' },
  { at: 220.5, title: 'Shared only with a yes', body: 'Nothing reaches her doctor without her consent, and she can revoke it anytime.' },
  { at: 223, title: 'HIPAA agreements with clinics', body: 'Signed business associate agreements with every partner clinic.' },
  { at: 225.5, title: 'Never sold', body: 'Revenue comes from what patients choose to buy, never from who they are.' },
]

function LockIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={C.sageDark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

export function Trust({ t }: { t: number }) {
  if (t < 210 || t > 240.5) return null
  return (
    <div style={{ ...center, background: C.sand, opacity: vis(t, 210.2, 240.2, 0.6) }}>
      <Reveal t={t} at={210.6}>
        <div style={{ fontSize: 26, color: C.ink500, letterSpacing: 2, textTransform: 'uppercase' }}>
          Designed for sensitive data from day one
        </div>
      </Reveal>
      <Reveal t={t} at={211.2}>
        <div style={{ fontSize: 96, fontWeight: 600, color: C.ink900, marginTop: 8 }}>Her data, her rules.</div>
      </Reveal>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 500px)', gap: 24, marginTop: 50, textAlign: 'left' }}>
        {TRUST_ITEMS.map((item) => (
          <Reveal key={item.title} t={t} at={item.at}>
            <div style={{ background: 'white', border: `1px solid ${C.sand200}`, borderRadius: 28, padding: 30, height: 190 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: C.sageSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LockIcon />
              </div>
              <div style={{ fontSize: 28, fontWeight: 600, color: C.ink900, marginTop: 16 }}>{item.title}</div>
              <div style={{ fontSize: 21, color: C.ink500, marginTop: 6 }}>{item.body}</div>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal t={t} at={231}>
        <div style={{ fontSize: 24, color: C.ink500, marginTop: 50 }}>
          This demo uses only synthetic data. Peri is decision support, not a diagnosis.
        </div>
      </Reveal>
    </div>
  )
}

// ======================= NEXT STEPS (240 - 260) =======================

function SketchPanel({ w, h, t, at, label }: { w: number; h: number; t: number; at: number; label?: string }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 18,
        border: `3px dashed ${C.ink300}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: C.ink300,
        fontSize: label ? 22 : 54,
        fontWeight: 600,
        opacity: easeOut(progress(t, at, 0.6)),
      }}
    >
      {label ?? '?'}
    </div>
  )
}

export function NextSteps({ t }: { t: number }) {
  if (t < 240 || t > 260.5) return null
  return (
    <div style={{ ...full, background: C.sand, opacity: vis(t, 240.2, 260.2, 0.6) }}>
      <div style={{ position: 'absolute', left: 120, top: 200, width: 720, height: 680, background: 'white', borderRadius: 32, border: `1px solid ${C.sand200}`, padding: 36, boxShadow: '0 20px 60px rgba(68,64,58,0.08)' }}>
        <div style={{ fontSize: 22, color: C.ink500, fontWeight: 600 }}>Clinician dashboard · v2</div>
        <div style={{ display: 'flex', gap: 20, marginTop: 24 }}>
          <SketchPanel w={310} h={170} t={t} at={241} />
          <SketchPanel w={310} h={170} t={t} at={241.4} />
        </div>
        <div style={{ marginTop: 20 }}>
          <SketchPanel w={640} h={200} t={t} at={241.8} />
        </div>
        <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
          <SketchPanel w={200} h={150} t={t} at={242.2} />
          <SketchPanel w={200} h={150} t={t} at={242.6} />
          <SketchPanel w={200} h={150} t={t} at={243} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: 940, top: 210, width: 860 }}>
        <Reveal t={t} at={240.6}>
          <div style={{ fontSize: 26, color: C.terracotta, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>What's next</div>
        </Reveal>
        <Reveal t={t} at={241.2}>
          <div style={{ fontSize: 56, fontWeight: 600, color: C.ink900, marginTop: 12, lineHeight: 1.15 }}>
            The doctor's side is the part we're least sure about. On purpose.
          </div>
        </Reveal>
        <Reveal t={t} at={244.5}>
          <div style={{ fontSize: 32, color: C.ink700, marginTop: 30 }}>
            Next, we co-design it with doctors, nurses and midwives, starting with one question:
          </div>
        </Reveal>
        <Reveal t={t} at={247}>
          <div style={{ fontSize: 40, color: C.terracottaDark, fontStyle: 'italic', marginTop: 24, borderLeft: `5px solid ${C.terracotta}`, paddingLeft: 24 }}>
            “What do you actually need to see between visits?”
          </div>
        </Reveal>
        <Reveal t={t} at={251}>
          <div style={{ fontSize: 24, color: C.ink500, marginTop: 44, textTransform: 'uppercase', letterSpacing: 2 }}>Then</div>
        </Reveal>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 14 }}>
          {['Real wearable integrations', 'More languages', 'Pilots with rural & under-covered clinics'].map((label, i) => (
            <Reveal key={label} t={t} at={251.6 + i * 0.9}>
              <Chip tone="sand">{label}</Chip>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}

// ======================= FINALE (268 - 275) =======================

export function Finale({ t }: { t: number }) {
  if (t < 268) return null
  return (
    <div style={{ ...center, background: C.sand, opacity: easeOut(progress(t, 268.2, 0.8)) }}>
      <Reveal t={t} at={268.8}>
        <div style={{ fontSize: 72, color: C.ink700 }}>Follow-up ends at six weeks.</div>
      </Reveal>
      <Reveal t={t} at={270.2}>
        <div style={{ fontSize: 96, fontWeight: 600, color: C.terracotta, marginTop: 10 }}>Recovery doesn't.</div>
      </Reveal>
      <Reveal t={t} at={271.8}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 70 }}>
          <PeriMascot size={84} />
          <span style={{ fontSize: 64, fontWeight: 600, color: C.ink900 }}>Peri</span>
        </div>
      </Reveal>
    </div>
  )
}
