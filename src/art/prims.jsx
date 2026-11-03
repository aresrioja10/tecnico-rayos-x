import React, { createContext, useContext } from 'react'

// Dibuja sus hijos dos veces: primero el contorno (más grueso) y después el relleno.
// Así varias formas unidas comparten un único contorno limpio, estilo dibujo animado.
const PassCtx = createContext({ pass: 'fill', ow: 0, oc: 'none' })

export function Outlined({ ow = 5, color = '#24324d', children, opacity }) {
  return (
    <g opacity={opacity}>
      {ow > 0 && <PassCtx.Provider value={{ pass: 'outline', ow, oc: color }}><g>{children}</g></PassCtx.Provider>}
      <PassCtx.Provider value={{ pass: 'fill', ow, oc: color }}><g>{children}</g></PassCtx.Provider>
    </g>
  )
}

const usePass = () => useContext(PassCtx)

export function Line({ x1, y1, x2, y2, w = 10, fill = '#fff', noOutline, opacity, cap = 'round' }) {
  const { pass, ow, oc } = usePass()
  if (pass === 'outline' && noOutline) return null
  const o = pass === 'outline'
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={o ? oc : fill} strokeWidth={o ? w + ow * 2 : w} strokeLinecap={cap} opacity={opacity} />
}

export function Stroke({ d, w = 10, fill = '#fff', noOutline, opacity, transform }) {
  const { pass, ow, oc } = usePass()
  if (pass === 'outline' && noOutline) return null
  const o = pass === 'outline'
  return <path d={d} fill="none" stroke={o ? oc : fill} strokeWidth={o ? w + ow * 2 : w} strokeLinecap="round" strokeLinejoin="round" opacity={opacity} transform={transform} />
}

function filled(Tag) {
  return function Filled({ fill = '#fff', noOutline, opacity, ...rest }) {
    const { pass, ow, oc } = usePass()
    if (pass === 'outline' && noOutline) return null
    const o = pass === 'outline'
    return <Tag {...rest} fill={o ? oc : fill} stroke={o ? oc : 'none'} strokeWidth={o ? ow * 2 : 0} strokeLinejoin="round" opacity={opacity} />
  }
}

export const Circle = filled('circle')
export const Ellipse = filled('ellipse')
export const Rect = filled('rect')
export const Path = filled('path')
export const Polygon = filled('polygon')

// Solo se dibuja en la pasada de relleno (detalles: ojos, boca...)
export function Detail({ children }) {
  const { pass } = usePass()
  return pass === 'fill' ? <>{children}</> : null
}

// --- utilidades geométricas ---
export const rad = (d) => (d * Math.PI) / 180
export function rot([x, y], deg) {
  const a = rad(deg), c = Math.cos(a), s = Math.sin(a)
  return [x * c - y * s, x * s + y * c]
}
export const add = (a, b) => [a[0] + b[0], a[1] + b[1]]
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1]]
export const mul = (a, k) => [a[0] * k, a[1] * k]
export const len = (a) => Math.hypot(a[0], a[1])
export const norm = (a) => { const l = len(a) || 1; return [a[0] / l, a[1] / l] }
export const perp = (a) => [-a[1], a[0]]
export const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]

// Hueso de dibujo animado (con "bolitas" en los extremos)
export function CartoonBone({ a, b, w = 14, k, fill = '#fbf7ea', inset = 0 }) {
  const kk = k ?? w * 0.68
  const d = norm(sub(b, a)), p = perp(d)
  const A = add(a, mul(d, inset)), B = sub(b, mul(d, inset))
  const knobs = []
  for (const [end, s] of [[A, 1], [B, -1]]) {
    const c = add(end, mul(d, s * kk * 0.35))
    knobs.push(add(c, mul(p, kk * 0.72)), add(c, mul(p, -kk * 0.72)))
  }
  return (
    <>
      <Line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} w={w} fill={fill} />
      {knobs.map((c, i) => <Circle key={i} cx={c[0]} cy={c[1]} r={kk} fill={fill} />)}
    </>
  )
}

// Hueso "realista" para radiografías (caña + cabezas algo más anchas)
export function RealBone({ a, b, w = 14, gap = 6, fill = '#eaf6ff', marrow = 'rgba(110,150,205,0.55)', headScale = 1.3 }) {
  const d = norm(sub(b, a))
  const A = add(a, mul(d, gap)), B = sub(b, mul(d, gap))
  const L = len(sub(B, A))
  const ang = (Math.atan2(d[1], d[0]) * 180) / Math.PI
  const hw = (w * headScale) / 2
  const m1 = add(A, mul(d, Math.min(L * 0.25, hw * 1.1))), m2 = sub(B, mul(d, Math.min(L * 0.25, hw * 1.1)))
  return (
    <>
      <Line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} w={w} fill={fill} />
      <Ellipse cx={A[0] + d[0] * hw * 0.5} cy={A[1] + d[1] * hw * 0.5} rx={hw * 0.8} ry={hw} fill={fill} transform={`rotate(${ang} ${A[0] + d[0] * hw * 0.5} ${A[1] + d[1] * hw * 0.5})`} />
      <Ellipse cx={B[0] - d[0] * hw * 0.5} cy={B[1] - d[1] * hw * 0.5} rx={hw * 0.8} ry={hw} fill={fill} transform={`rotate(${ang} ${B[0] - d[0] * hw * 0.5} ${B[1] - d[1] * hw * 0.5})`} />
      <Detail>
        {L > w * 2 && <line x1={m1[0]} y1={m1[1]} x2={m2[0]} y2={m2[1]} stroke={marrow} strokeWidth={w * 0.32} strokeLinecap="round" />}
      </Detail>
    </>
  )
}
