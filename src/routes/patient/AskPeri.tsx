import { useState } from 'react'
import { DEFAULT_WEEK_INDEX, jennyTimeline } from '../../data/patient'
import { askPeri, type ChatMessage } from '../../lib/claude'
import { buildAskPeriSystemPrompt } from '../../lib/systemPrompts'
import { useBudget } from '../../state/budget'

const SUGGESTED_QUESTIONS = [
  'Is it normal to still feel this exhausted months in?',
  'My blood pressure has been high since my 6-week visit — should I be worried?',
  'What can I do about nipple pain while breastfeeding?',
  'How do I know if what I feel is more than the baby blues?',
]

export default function AskPeri() {
  const { budget } = useBudget()
  const week = jennyTimeline[DEFAULT_WEEK_INDEX]
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmed }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)
    setError(null)
    try {
      const reply = await askPeri(buildAskPeriSystemPrompt(week, budget), nextMessages)
      setMessages([...nextMessages, { role: 'assistant', content: reply }])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col px-5 py-2">
      <h1 className="text-xl font-semibold text-ink-900">Ask Peri</h1>
      <p className="mt-1 text-sm text-ink-500">
        General guidance, not a diagnosis. For anything urgent, contact your
        clinician.
      </p>

      <div className="mt-4">
        <p className="text-[10px] font-medium uppercase tracking-wide text-ink-500">
          Women at your stage are asking
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => send(q)}
              className="rounded-full border border-sand-200 bg-white px-3 py-1.5 text-xs text-ink-700 hover:border-terracotta-300"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 min-h-[200px] space-y-3 rounded-2xl border border-sand-200 bg-white p-4">
        {messages.length === 0 && (
          <p className="text-sm text-ink-500">
            Ask anything — about sleep, recovery, feeding, or how you're
            feeling.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
              m.role === 'user'
                ? 'ml-auto bg-terracotta-500 text-white'
                : 'bg-sand-100 text-ink-900'
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && <p className="text-xs text-ink-500">Peri is typing…</p>}
        {error && <p className="text-xs text-terracotta-700">{error}</p>}
      </div>

      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a question for Peri…"
          className="flex-1 rounded-full border border-sand-200 bg-white px-4 py-2 text-sm outline-none focus:border-terracotta-300"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-terracotta-500 px-4 py-2 text-sm font-medium text-white hover:bg-terracotta-600 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  )
}
