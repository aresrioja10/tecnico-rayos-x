import { useEffect, useRef, useState } from 'react'

// Reloj en segundos que avanza cada fotograma mientras "active" sea true.
export function useClock(active = true) {
  const [t, setT] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf
    const start = performance.now()
    const loop = (now) => { setT((now - start) / 1000); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [active])
  return t
}

// Guarda el instante (según el reloj t) en que cambió "value".
export function useSince(value, t) {
  const ref = useRef({ value, at: t })
  if (ref.current.value !== value) ref.current = { value, at: t }
  return t - ref.current.at
}

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
export const lerp = (a, b, k) => a + (b - a) * k
export const easeInOut = (k) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2)
export const easeOut = (k) => 1 - Math.pow(1 - k, 3)
export const easeOutBack = (k) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2) }
export const easeOutBounce = (x) => {
  const n1 = 7.5625, d1 = 2.75
  if (x < 1 / d1) return n1 * x * x
  if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75
  if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375
  return n1 * (x -= 2.625 / d1) * x + 0.984375
}
export const prog = (t, start, dur) => clamp((t - start) / dur)

export function mixPose(a, b, k) {
  const out = {}
  for (const key of Object.keys(a)) out[key] = lerp(a[key], b[key] ?? a[key], k)
  for (const key of Object.keys(b)) if (!(key in out)) out[key] = b[key]
  return out
}
export function addPose(a, d) {
  const out = { ...a }
  for (const key of Object.keys(d)) out[key] = (out[key] || 0) + d[key]
  return out
}

// Interpola suavemente hacia la pose objetivo cada vez que cambia.
export function usePoseTween(target, t, dur = 0.6, ease = easeInOut) {
  const ref = useRef(null)
  const key = JSON.stringify(target)
  if (!ref.current) ref.current = { from: target, to: target, at: t, key }
  if (ref.current.key !== key) {
    const k = ease(clamp((t - ref.current.at) / dur))
    const current = mixPose(ref.current.from, ref.current.to, k)
    ref.current = { from: current, to: target, at: t, key }
  }
  const k = ease(clamp((t - ref.current.at) / dur))
  return mixPose(ref.current.from, ref.current.to, k)
}
