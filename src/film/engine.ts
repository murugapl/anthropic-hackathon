// Deterministic timeline engine for the demo video.
// Visual state is a pure function of time `t`; app interactions are cues that
// fire (in order) the first time `t` passes them, so seeking forward frame by
// frame always produces the same video.

import { useSyncExternalStore } from 'react'

// ---------- time store ----------
let currentT = 0
const listeners = new Set<() => void>()
export function setFilmTime(t: number) {
  currentT = t
  listeners.forEach((l) => l())
}
export function useFilmTime(): number {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => currentT,
  )
}

// ---------- overlay store (tap ripples) ----------
export interface Tap {
  x: number
  y: number
  at: number
}
let taps: Tap[] = []
const tapListeners = new Set<() => void>()
export function addTap(tap: Tap) {
  taps = [...taps, tap]
  tapListeners.forEach((l) => l())
}
export function useTaps(): Tap[] {
  return useSyncExternalStore(
    (l) => {
      tapListeners.add(l)
      return () => tapListeners.delete(l)
    },
    () => taps,
  )
}

// ---------- easing / interpolation ----------
export const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v))
export const easeOut = (p: number) => 1 - Math.pow(1 - p, 3)
export const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2)
export const progress = (t: number, start: number, dur: number) => clamp((t - start) / dur)
/** Opacity for an element visible in [from, to] with fades at both ends. */
export function vis(t: number, from: number, to: number, fade = 0.6): number {
  if (t < from || t > to) return 0
  return Math.min(easeOut(clamp((t - from) / fade)), easeOut(clamp((to - t) / fade)))
}
/** Piecewise-linear keyframes [[t, v], ...]. */
export function keyframes(t: number, frames: [number, number][]): number {
  if (t <= frames[0][0]) return frames[0][1]
  for (let i = 1; i < frames.length; i++) {
    const [t1, v1] = frames[i]
    const [t0, v0] = frames[i - 1]
    if (t <= t1) return v0 + (v1 - v0) * easeInOut((t - t0) / (t1 - t0))
  }
  return frames[frames.length - 1][1]
}

// ---------- cues ----------
export interface Cue {
  at: number
  dur?: number // tween if set: run(p) is called with p in [0, 1]
  run: (p: number) => void | Promise<void>
}

export class Timeline {
  private cues: (Cue & { done: boolean })[]
  constructor(cues: Cue[]) {
    this.cues = cues
      .map((c) => ({ ...c, done: false }))
      .sort((a, b) => a.at - b.at)
  }
  async seek(t: number) {
    for (const cue of this.cues) {
      if (cue.done || cue.at > t) continue
      if (cue.dur && t < cue.at + cue.dur) {
        await cue.run(clamp((t - cue.at) / cue.dur))
      } else {
        await cue.run(1)
        cue.done = true
      }
    }
  }
}

// ---------- iframe helpers ----------
export function frameDoc(frame: HTMLIFrameElement): Document {
  const doc = frame.contentDocument
  if (!doc) throw new Error('iframe not ready')
  return doc
}

export function nextFrames(win: Window, n = 2): Promise<void> {
  return new Promise((resolve) => {
    const step = (left: number) => {
      if (left === 0) return resolve()
      win.requestAnimationFrame(() => step(left - 1))
    }
    step(n)
  })
}

/** Find the first element matching `selector` whose text includes `text`. */
export function find(frame: HTMLIFrameElement, selector: string, text?: string): HTMLElement | null {
  const els = Array.from(frameDoc(frame).querySelectorAll<HTMLElement>(selector))
  return els.find((el) => !text || (el.textContent ?? '').includes(text)) ?? null
}

export async function waitFor(
  frame: HTMLIFrameElement,
  selector: string,
  text?: string,
  timeoutMs = 8000,
): Promise<HTMLElement> {
  const start = performance.now()
  for (;;) {
    try {
      const el = find(frame, selector, text)
      if (el) return el
    } catch {
      // iframe still loading
    }
    if (performance.now() - start > timeoutMs) {
      throw new Error(`film: timed out waiting for ${selector} "${text ?? ''}"`)
    }
    await new Promise((r) => setTimeout(r, 30))
  }
}

export async function loadFrame(frame: HTMLIFrameElement, src: string, readySelector: string, readyText?: string) {
  frame.src = src
  await new Promise((r) => setTimeout(r, 50))
  await waitFor(frame, readySelector, readyText)
  await nextFrames(frame.contentWindow!, 3)
}

/** Set a React-controlled range input. */
export async function setRange(frame: HTMLIFrameElement, el: HTMLElement, value: number) {
  const win = frame.contentWindow as unknown as typeof window
  const input = el as HTMLInputElement
  if (input.value === String(value)) return
  const setter = Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype, 'value')!.set!
  setter.call(input, String(value))
  input.dispatchEvent(new win.Event('input', { bubbles: true }))
  await nextFrames(win)
}

/** Stage-space centre of an element inside an iframe (handles CSS scaling). */
export function stagePoint(stage: HTMLElement, frame: HTMLIFrameElement, el: HTMLElement) {
  const stageRect = stage.getBoundingClientRect()
  const stageScale = stageRect.width / stage.offsetWidth
  const frameRect = frame.getBoundingClientRect()
  const frameScale = frameRect.width / frame.offsetWidth
  const r = el.getBoundingClientRect()
  return {
    x: (frameRect.left + (r.left + r.width / 2) * frameScale - stageRect.left) / stageScale,
    y: (frameRect.top + (r.top + r.height / 2) * frameScale - stageRect.top) / stageScale,
  }
}

const HIGHLIGHT = '0 0 0 3px #bc6240, 0 0 0 10px rgba(188, 98, 64, 0.22)'
export function highlight(el: HTMLElement | null, on = true) {
  if (!el) return
  el.style.transition = 'none'
  el.style.boxShadow = on ? HIGHLIGHT : ''
  el.style.position = on ? 'relative' : el.style.position
  el.style.zIndex = on ? '1' : ''
}
