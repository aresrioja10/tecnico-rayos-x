import React from 'react'
import { Outlined, Line, Ellipse, Path, Detail, RealBone, sub, norm, add, mul, perp } from './prims.jsx'

// Mano derecha vista por el dorso (se ven las uñas). viewBox 0 0 600 820.
// La piel y los huesos salen de la misma geometría, así encajan siempre.
export const FINGERS = [
  { name: 'pulgar', pts: [[232, 612], [156, 496], [112, 414], [88, 352]], w: 66, bw: [24, 21, 17] },
  { name: 'índice', pts: [[258, 602], [234, 392], [222, 296], [216, 236], [212, 192]], w: 60, bw: [21, 19, 16, 13] },
  { name: 'corazón', pts: [[296, 600], [296, 374], [296, 268], [296, 200], [296, 152]], w: 62, bw: [22, 20, 17, 14] },
  { name: 'anular', pts: [[334, 602], [358, 384], [372, 286], [380, 224], [385, 180]], w: 58, bw: [21, 19, 16, 13] },
  { name: 'meñique', pts: [[368, 608], [414, 416], [436, 342], [448, 294], [455, 258]], w: 50, bw: [18, 16, 13, 11] },
]

export function tipOf(f, extra = 0) {
  const n = f.pts.length
  const d = norm(sub(f.pts[n - 1], f.pts[n - 2]))
  return add(f.pts[n - 1], mul(d, 22 + extra))
}

const CARPALS = [[262, 630, 16, 12], [291, 624, 15, 12], [320, 626, 15, 12], [348, 632, 14, 11], [268, 657, 15, 11], [297, 654, 14, 11], [325, 656, 14, 11], [351, 660, 12, 10]]

const SKIN = { skin: '#f6c39c', outline: '#b9744f', nail: '#ffe1d6', nailEdge: '#e2a08e', crease: '#d99674' }

export function HandSkin({ colors, ow = 6 }) {
  const c = { ...SKIN, ...colors }
  return (
    <g>
      <Outlined ow={ow} color={c.outline}>
        <Path fill={c.skin} d="M 224 650 L 388 650 L 396 840 L 216 840 Z" />
        <Path fill={c.skin} d="M 214 646 C 196 600, 192 520, 204 462 C 214 412, 226 376, 250 360 C 290 342, 350 346, 382 358 C 420 374, 446 410, 450 462 C 454 540, 432 620, 402 670 C 362 706, 250 706, 214 646 Z" />
        <Line x1={238} y1={606} x2={156} y2={496} w={84} fill={c.skin} />
        {FINGERS.map((f) => {
          const start = f.name === 'pulgar' ? f.pts[1] : f.pts[1]
          const tip = tipOf(f)
          const pts = [start, ...f.pts.slice(2, -1), tip]
          return pts.slice(1).map((p, i) => <Line key={f.name + i} x1={pts[i][0]} y1={pts[i][1]} x2={p[0]} y2={p[1]} w={f.w} fill={c.skin} />)
        })}
      </Outlined>
      <Detail>
        {FINGERS.map((f) => {
          const n = f.pts.length
          const d = norm(sub(f.pts[n - 1], f.pts[n - 2]))
          const tip = tipOf(f, -24)
          const ang = (Math.atan2(d[1], d[0]) * 180) / Math.PI + 90
          const creases = f.pts.slice(2, -1).map((p, i) => {
            const pp = perp(d)
            const a = add(p, mul(pp, f.w * 0.2)), b = add(p, mul(pp, -f.w * 0.2))
            return <path key={i} d={`M ${a[0]} ${a[1]} Q ${p[0] + d[0] * 6} ${p[1] + d[1] * 6} ${b[0]} ${b[1]}`} stroke={c.crease} strokeWidth={3} fill="none" strokeLinecap="round" />
          })
          return (
            <g key={f.name}>
              {creases}
              <rect x={tip[0] - f.w * 0.3} y={tip[1] - f.w * 0.36} width={f.w * 0.6} height={f.w * 0.62} rx={f.w * 0.26} fill={c.nail} stroke={c.nailEdge} strokeWidth={3} transform={`rotate(${ang} ${tip[0]} ${tip[1]})`} />
            </g>
          )
        })}
      </Detail>
    </g>
  )
}

export function HandSoft({ fill = '#86bfff', outline = '#d4ebff', opacity = 0.26 }) {
  return <g opacity={opacity}><HandSkin colors={{ skin: fill, outline, nail: 'rgba(0,0,0,0)', nailEdge: 'rgba(0,0,0,0)', crease: 'rgba(0,0,0,0)' }} ow={3} /></g>
}

export function HandBones({ fill = '#eaf6ff', filter = 'url(#glow)', crack = false }) {
  return (
    <g filter={filter}>
      <Outlined ow={0}>
        <RealBone a={[276, 690]} b={[266, 860]} w={38} fill={fill} gap={0} />
        <RealBone a={[346, 692]} b={[352, 860]} w={28} fill={fill} gap={0} />
        {CARPALS.map(([x, y, rx, ry], i) => <Ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill={fill} />)}
        {FINGERS.map((f) => f.pts.slice(1).map((p, i) => <RealBone key={f.name + i} a={f.pts[i]} b={p} w={f.bw[i]} fill={fill} gap={i === 0 ? 10 : 7} />))}
      </Outlined>
      {crack && <path d="M 262 760 L 284 768 L 268 778 L 290 788" stroke="#0b1a33" strokeWidth={5} fill="none" strokeLinejoin="round" />}
    </g>
  )
}

// Mano en versión radiografía completa (tejido blando + huesos)
export function HandXray({ crack }) {
  return (
    <g>
      <HandSoft />
      <HandBones crack={crack} />
    </g>
  )
}
