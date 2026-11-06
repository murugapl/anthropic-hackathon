import Anthropic from '@anthropic-ai/sdk'

const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined

// Demo-only: calling Claude directly from the browser. See CLAUDE.md hard rule #2 -
// this is intentional for a local, never-deployed hackathon build, not an oversight.
const client = apiKey
  ? new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
  : null

export class ClaudeNotConfiguredError extends Error {
  constructor() {
    super(
      'VITE_ANTHROPIC_API_KEY is not set. Copy .env.example to .env and add your key, then restart the dev server.',
    )
    this.name = 'ClaudeNotConfiguredError'
  }
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function askPeri(
  systemPrompt: string,
  messages: ChatMessage[],
): Promise<string> {
  // Scripted demo video (/film): when the app runs inside the film stage, the
  // stage supplies a prewritten response so the recording is deterministic and
  // needs no API key. Never active in normal use.
  const film = filmResponder()
  if (film) return film(systemPrompt, messages)

  if (!client) throw new ClaudeNotConfiguredError()

  const response = await client.messages.create({
    model: 'claude-sonnet-5',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  })

  const textBlock = response.content.find((block) => block.type === 'text')
  return textBlock && textBlock.type === 'text' ? textBlock.text : ''
}

type FilmResponder = (systemPrompt: string, messages: ChatMessage[]) => Promise<string>

function filmResponder(): FilmResponder | null {
  try {
    if (window.parent === window) return null
    const film = (window.parent as unknown as { __periFilm?: { respond?: FilmResponder } }).__periFilm
    return film?.respond ?? null
  } catch {
    return null
  }
}
