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
