import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { jennyTimeline, type WeekEntry } from '../../data/patient'

function shortLabel(entry: WeekEntry): string {
  const match = entry.label.match(/week (\d+)/)
  const n = match ? match[1] : '?'
  return entry.postpartumWeek === null ? `P${n}` : `W${n}`
}

const chartData = jennyTimeline.map((w) => ({
  name: shortLabel(w),
  sleep: w.wearables.sleepHours,
  systolic: w.wearables.bpSystolic,
  diastolic: w.wearables.bpDiastolic,
  mood: w.moodScore,
}))

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="mt-4 rounded-2xl border border-sand-200 bg-white p-4">
      <h3 className="text-sm font-medium text-ink-900">{title}</h3>
      <p className="text-xs text-ink-500">{subtitle}</p>
      <div className="mt-2 h-40">{children}</div>
    </div>
  )
}

export default function Trends() {
  return (
    <div className="px-5 py-2">
      <h1 className="text-xl font-semibold text-ink-900">Your trends</h1>
      <p className="text-sm text-ink-500">
        Pregnancy (P) through 20 weeks postpartum (W).
      </p>

      <ChartCard title="Sleep" subtitle="Hours per night">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
            <CartesianGrid stroke="#ece9e4" strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6f6a62' }} />
            <YAxis domain={[3, 8]} tick={{ fontSize: 10, fill: '#6f6a62' }} />
            <Tooltip />
            <Line type="monotone" dataKey="sleep" stroke="#bc6240" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Blood pressure" subtitle="Systolic / diastolic, mmHg">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
            <CartesianGrid stroke="#ece9e4" strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6f6a62' }} />
            <YAxis domain={[70, 145]} tick={{ fontSize: 10, fill: '#6f6a62' }} />
            <Tooltip />
            <ReferenceLine y={130} stroke="#dc9f80" strokeDasharray="4 4" />
            <Line type="monotone" dataKey="systolic" stroke="#bc6240" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="diastolic" stroke="#778f64" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Mood" subtitle="Self-reported, 1-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
            <CartesianGrid stroke="#ece9e4" strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6f6a62' }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#6f6a62' }} />
            <Tooltip />
            <ReferenceLine y={4} stroke="#dc9f80" strokeDasharray="4 4" />
            <Line type="monotone" dataKey="mood" stroke="#778f64" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <p className="mb-4 mt-4 text-xs text-ink-500">
        Dashed lines mark the thresholds Peri uses to flag blood pressure and
        mood for your care team.
      </p>
    </div>
  )
}
