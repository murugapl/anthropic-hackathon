// Renders the scripted demo (/film) to an MP4, frame by frame (no audio).
//   npm run film:record                      -> film-out/peri-demo.mp4
//   npm run film:record -- --from 95 --to 140 -> render a slice
//   npm run film:record -- --stills 10,100   -> PNG stills only
// Requires Google Chrome and ffmpeg on PATH.
import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright-core'
import { createServer } from 'vite'

const args = process.argv.slice(2)
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : fallback
}
const fps = Number(arg('fps', 30))
const stills = arg('stills', null)
const out = arg('out', 'film-out/peri-demo.mp4')
mkdirSync('film-out', { recursive: true })

const server = await createServer({ server: { port: 5199, strictPort: true }, logLevel: 'error' })
await server.listen()
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })
page.on('pageerror', (e) => console.error('[page error]', e.message))
page.on('console', (m) => m.type() === 'error' && console.error('[console]', m.text()))

try {
  await page.goto('http://localhost:5199/film?render=1')
  await page.waitForFunction(() => window.__filmReady === true, null, { timeout: 60000 })
  const duration = await page.evaluate(() => window.__filmDuration)
  const from = Number(arg('from', 0))
  const to = Math.min(Number(arg('to', duration)), duration)

  if (stills) {
    const times = stills.split(',').map(Number).sort((a, b) => a - b)
    for (const t of times) {
      await page.evaluate((t) => window.__filmSeek(t), t)
      await page.screenshot({ path: `film-out/still-${String(t).padStart(6, '0')}.png` })
      console.log(`still ${t}s`)
    }
  } else {
    const ffmpeg = spawn('ffmpeg', [
      '-y', '-loglevel', 'error',
      '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
      out,
    ], { stdio: ['pipe', 'inherit', 'inherit'] })
    const done = new Promise((res, rej) => ffmpeg.on('close', (c) => (c === 0 ? res() : rej(new Error(`ffmpeg exited ${c}`)))))
    const total = Math.round((to - from) * fps)
    const started = Date.now()
    for (let i = 0; i < total; i++) {
      const t = from + i / fps
      await page.evaluate((t) => window.__filmSeek(t), t)
      const buf = await page.screenshot({ type: 'jpeg', quality: 92 })
      if (!ffmpeg.stdin.write(buf)) await new Promise((r) => ffmpeg.stdin.once('drain', r))
      if (i % (fps * 5) === 0) {
        const el = (Date.now() - started) / 1000
        console.log(`${t.toFixed(1)}s / ${to}s  (${Math.round((i / total) * 100)}%, ${el.toFixed(0)}s elapsed)`)
      }
    }
    ffmpeg.stdin.end()
    await done
    console.log(`wrote ${out}`)
  }
} finally {
  await browser.close()
  await server.close()
}
