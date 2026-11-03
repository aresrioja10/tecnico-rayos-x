import React from 'react'
import { Outlined, Line, Stroke, Circle, Ellipse, Rect, Path, Detail, CartoonBone, rot, add, mul, sub, norm, mid } from './prims.jsx'

// Personaje (niño/a o esqueleto) dibujado a partir de una pose de ángulos.
// El origen (0,0) es la pelvis. Mide unos 640 de alto (cabeza en -400, pies en +260).
export const L = { upper: 100, fore: 92, thigh: 118, shin: 112 }

export const POSES = {
  stand: { x: 0, y: 0, torso: 0, head: 0, armA: 14, foreA: 4, armB: -14, foreB: -4, thighA: 3, shinA: -1, thighB: -3, shinB: 1 },
  wave: { x: 0, y: 0, torso: 0, head: 6, armA: 14, foreA: 4, armB: -140, foreB: 12, thighA: 3, shinA: -1, thighB: -3, shinB: 1 },
  hooray: { x: 0, y: 0, torso: 0, head: 0, armA: 150, foreA: 15, armB: -150, foreB: -15, thighA: 8, shinA: -2, thighB: -8, shinB: 2 },
  flex: { x: 0, y: 0, torso: 0, head: 0, armA: 95, foreA: 100, armB: -95, foreB: -100, thighA: 10, shinA: -3, thighB: -10, shinB: 3 },
  freeze: { x: 0, y: 0, torso: 0, head: 0, armA: 100, foreA: 60, armB: -40, foreB: -70, thighA: 20, shinA: -5, thighB: -6, shinB: 0 },
  squat: { x: 0, y: 40, torso: 0, head: 0, armA: 30, foreA: 10, armB: -30, foreB: -10, thighA: 40, shinA: -60, thighB: -40, shinB: 60 },
}

export function joints(p) {
  const P = [p.x || 0, p.y || 0]
  const T = p.torso || 0
  const W = (loc) => add(P, rot(loc, T))
  const dir = (ang, l) => rot([0, l], ang)
  const sA = W([-66, -172]), sB = W([66, -172])
  const eA = add(sA, dir(T + p.armA, L.upper)), eB = add(sB, dir(T + p.armB, L.upper))
  const wA = add(eA, dir(T + p.armA + p.foreA, L.fore)), wB = add(eB, dir(T + p.armB + p.foreB, L.fore))
  const hA = W([-36, 8]), hB = W([36, 8])
  const kA = add(hA, dir(T + p.thighA, L.thigh)), kB = add(hB, dir(T + p.thighB, L.thigh))
  const aA = add(kA, dir(T + p.thighA + p.shinA, L.shin)), aB = add(kB, dir(T + p.thighB + p.shinB, L.shin))
  const head = W([0, -216])
  return { P, T, sA, sB, eA, eB, wA, wB, hA, hB, kA, kB, aA, aB, head, headAng: T + (p.head || 0) }
}

const tr = (pt, ang) => `translate(${pt[0]} ${pt[1]}) rotate(${ang})`

// ---------- ESQUELETO ----------
const SK = { bone: '#fbf7ea', outline: '#24324d', ow: 4, socket: '#1d2a44', eyes: true }

function SkullShape({ c }) {
  return (
    <>
      <Circle cx={0} cy={-92} r={72} fill={c.bone} />
      <Path d="M -52 -78 L 52 -78 L 44 -22 Q 40 -2 22 -2 L -22 -2 Q -40 -2 -44 -22 Z" fill={c.bone} />
    </>
  )
}

function SkullFace({ c, expression }) {
  const teeth = []
  for (let i = 0; i < 6; i++) teeth.push(<line key={i} x1={-26 + (i + 0.5) * (52 / 6)} y1={-29} x2={-26 + (i + 0.5) * (52 / 6)} y2={-15} stroke={c.socket} strokeWidth={2.5} />)
  return (
    <Detail>
      <ellipse cx={-27} cy={-80} rx={19} ry={22} fill={c.socket} />
      <ellipse cx={27} cy={-80} rx={19} ry={22} fill={c.socket} />
      {c.eyes && <>
        <circle cx={-22} cy={-86} r={6} fill="#fff" /><circle cx={32} cy={-86} r={6} fill="#fff" />
        <circle cx={-30} cy={-74} r={2.5} fill="#fff" opacity="0.8" /><circle cx={24} cy={-74} r={2.5} fill="#fff" opacity="0.8" />
      </>}
      <path d="M 0 -40 L -8 -52 Q -9 -59 -3 -59 L 0 -56 L 3 -59 Q 9 -59 8 -52 Z" fill={c.socket} />
      {expression === 'wow'
        ? <ellipse cx={0} cy={-22} rx={12} ry={10} fill={c.socket} />
        : <>
          <rect x={-26} y={-30} width={52} height={15} rx={5} fill={c.bone} stroke={c.socket} strokeWidth={2.5} />
          {teeth}
          <line x1={-26} y1={-22} x2={26} y2={-22} stroke={c.socket} strokeWidth={2} />
        </>}
    </Detail>
  )
}

function Ribcage({ c }) {
  const ribs = []
  for (let i = 0; i < 4; i++) {
    const y = -160 + i * 21
    const s = 1 - i * 0.06
    for (const side of [-1, 1]) {
      ribs.push(<Stroke key={`${i}${side}`} w={10} fill={c.bone} d={`M ${side * 6} ${y} C ${side * 40 * s} ${y - 13}, ${side * 66 * s} ${y + 4}, ${side * 58 * s} ${y + 28}`} />)
    }
  }
  return ribs
}

function Pelvis({ c }) {
  return (
    <>
      <Path fill={c.bone} d="M -6 -16 C -24 -36, -68 -32, -66 -2 C -64 20, -40 28, -18 22 L -8 10 Z" />
      <Path fill={c.bone} d="M 6 -16 C 24 -36, 68 -32, 66 -2 C 64 20, 40 28, 18 22 L 8 10 Z" />
      <Path fill={c.bone} d="M -12 -18 L 12 -18 L 0 16 Z" />
    </>
  )
}

function SkelArm({ s, e, w, c }) {
  const d1 = norm(sub(w, e)), p = [-d1[1], d1[0]]
  const palm = add(w, mul(d1, 12))
  const fingers = [-34, -12, 10, 32].map((a) => add(palm, rot(mul(d1, 26), a)))
  return (
    <>
      <CartoonBone a={s} b={e} w={14} k={9} fill={c.bone} inset={2} />
      <Line x1={e[0] + p[0] * 5} y1={e[1] + p[1] * 5} x2={w[0] + p[0] * 5} y2={w[1] + p[1] * 5} w={8} fill={c.bone} />
      <Line x1={e[0] - p[0] * 5} y1={e[1] - p[1] * 5} x2={w[0] - p[0] * 5} y2={w[1] - p[1] * 5} w={9} fill={c.bone} />
      {fingers.map((f, i) => <Line key={i} x1={palm[0]} y1={palm[1]} x2={f[0]} y2={f[1]} w={6} fill={c.bone} />)}
      <Circle cx={palm[0]} cy={palm[1]} r={11} fill={c.bone} />
    </>
  )
}

function SkelLeg({ h, k, a, side, c }) {
  const d = norm(sub(a, k)), p = [-d[1], d[0]]
  const toe = add(a, [side * 26, 16])
  return (
    <>
      <CartoonBone a={h} b={k} w={17} k={10} fill={c.bone} inset={2} />
      <CartoonBone a={k} b={a} w={13} k={8} fill={c.bone} inset={4} />
      <Line x1={k[0] + p[0] * side * 10} y1={k[1] + p[1] * side * 10 + 10} x2={a[0] + p[0] * side * 9} y2={a[1] + p[1] * side * 9 - 8} w={6} fill={c.bone} />
      <Line x1={a[0]} y1={a[1] + 8} x2={toe[0]} y2={toe[1]} w={16} fill={c.bone} />
    </>
  )
}

export function Skeleton({ pose, colors, expression = 'smile', filter }) {
  const c = { ...SK, ...colors }
  const j = joints(pose)
  return (
    <g filter={filter}>
      <Outlined ow={c.ow} color={c.outline}>
        <SkelLeg h={j.hA} k={j.kA} a={j.aA} side={-1} c={c} />
        <SkelLeg h={j.hB} k={j.kB} a={j.aB} side={1} c={c} />
        <g transform={tr(j.P, j.T)}>
          {Array.from({ length: 8 }, (_, i) => <Rect key={i} x={-12} y={-30 - i * 21} width={24} height={15} rx={6} fill={c.bone} />)}
          <Rect x={-9} y={-214} width={18} height={12} rx={5} fill={c.bone} />
          <Rect x={-9} y={-200} width={18} height={12} rx={5} fill={c.bone} />
          <Ribcage c={c} />
          <Line x1={0} y1={-166} x2={0} y2={-104} w={13} fill={c.bone} />
          <Line x1={-8} y1={-178} x2={-62} y2={-172} w={10} fill={c.bone} />
          <Line x1={8} y1={-178} x2={62} y2={-172} w={10} fill={c.bone} />
          <Pelvis c={c} />
        </g>
        <SkelArm s={j.sA} e={j.eA} w={j.wA} c={c} />
        <SkelArm s={j.sB} e={j.eB} w={j.wB} c={c} />
        <g transform={tr(j.head, j.headAng)}>
          <SkullShape c={c} />
          <SkullFace c={c} expression={expression} />
        </g>
      </Outlined>
    </g>
  )
}

// ---------- NIÑO / NIÑA ----------
export const KIDS = {
  leo: { skin: '#f6c39c', hair: '#6b3e26', shirt: '#3fa7ff', pants: '#2d4b8c', shoes: '#ff5a5f', style: 'short' },
  vega: { skin: '#e7ae86', hair: '#2b1b14', shirt: '#ff5fa2', pants: '#6c5ce7', shoes: '#ffd23f', style: 'pigtails' },
  nico: { skin: '#a8714d', hair: '#1e130e', shirt: '#7cd957', pants: '#3a3a5c', shoes: '#ff8c42', style: 'curly' },
  sol: { skin: '#f9d3b4', hair: '#e8a33b', shirt: '#ffd23f', pants: '#ff7a59', shoes: '#3fa7ff', style: 'bob' },
  // la técnica de rayos X (pijama de hospital)
  tech: { skin: '#f3c09a', hair: '#5a3422', shirt: '#2ec4b6', pants: '#1f9d91', shoes: '#ffffff', style: 'bun' },
}

function Cape({ j, t = 0 }) {
  const w = Math.sin(t * 5) * 18
  return (
    <g transform={`translate(${j.P[0]} ${j.P[1]}) rotate(${j.T})`}>
      <Outlined ow={5} color="#8c1d2b">
        <Path fill="#ff4d5e" d={`M -70 -196 L 70 -196 Q 130 40 ${150 + w} 230 Q 0 ${270 - w} ${-150 - w} 230 Q -130 40 -70 -196 Z`} />
      </Outlined>
    </g>
  )
}

function Emblem() {
  return (
    <g transform="translate(0 -112)">
      <circle r={44} fill="#ffd23f" stroke="#c98a00" strokeWidth={6} />
      <path d="M -20 -20 L 20 20 M 20 -20 L -20 20" stroke="#0b1a33" strokeWidth={12} strokeLinecap="round" />
    </g>
  )
}

function Cast({ e, w }) {
  const d = norm(sub(w, e))
  const a = add(e, mul(d, 18)), b = add(w, mul(d, 8))
  const pts = [0.2, 0.45, 0.7].map((k) => add(a, mul(sub(b, a), k)))
  return (
    <g>
      <Outlined ow={5} color="#4a2e22">
        <Line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} w={50} fill="#ffffff" />
      </Outlined>
      {pts.map((p, i) => (
        <g key={i} transform={`translate(${p[0]} ${p[1]})`}>
          {i === 1 ? <path d="M 0 -12 L 4 -4 L 13 -3 L 6 3 L 8 12 L 0 7 L -8 12 L -6 3 L -13 -3 L -4 -4 Z" fill="#ffd23f" /> : <circle r={8} fill={i ? '#3fa7ff' : '#ff5fa2'} />}
        </g>
      ))}
    </g>
  )
}

const XR = { skin: '#86bfff', hair: 'rgba(0,0,0,0)', shirt: '#86bfff', pants: '#86bfff', shoes: '#86bfff' }

function Hair({ style, color }) {
  if (color === 'rgba(0,0,0,0)') return null
  const cap = <Path fill={color} d="M -86 -86 C -94 -176, 94 -176, 86 -86 C 74 -118, 36 -134, 4 -126 C -28 -136, -72 -122, -86 -86 Z" />
  if (style === 'pigtails') return <>{cap}<Circle cx={-96} cy={-118} r={26} fill={color} /><Circle cx={96} cy={-118} r={26} fill={color} /></>
  if (style === 'curly') return <>{[-70, -42, -14, 14, 42, 70].map((x, i) => <Circle key={i} cx={x} cy={-148 + Math.abs(x) * 0.45} r={28} fill={color} />)}{cap}</>
  if (style === 'bob') return <><Path fill={color} d="M -92 -60 C -110 -190, 110 -190, 92 -60 L 70 -60 C 72 -110, 40 -128, 0 -124 C -40 -128, -72 -110, -70 -60 Z" /></>
  if (style === 'bun') return <><Circle cx={0} cy={-176} r={34} fill={color} />{cap}</>
  return <>{cap}<Path fill={color} d="M -10 -160 C 0 -190, 30 -185, 22 -165 Z" /></>
}

function Face({ expression }) {
  const ink = '#2b1d16'
  const eyes = {
    smile: <><ellipse cx={-30} cy={-86} rx={9} ry={12} fill={ink} /><ellipse cx={30} cy={-86} rx={9} ry={12} fill={ink} /><circle cx={-27} cy={-90} r={3.5} fill="#fff" /><circle cx={33} cy={-90} r={3.5} fill="#fff" /></>,
    happy: <><path d="M -42 -84 Q -30 -98 -18 -84" stroke={ink} strokeWidth={6} fill="none" strokeLinecap="round" /><path d="M 18 -84 Q 30 -98 42 -84" stroke={ink} strokeWidth={6} fill="none" strokeLinecap="round" /></>,
    ouch: <><path d="M -42 -96 L -20 -86 L -42 -76" stroke={ink} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d="M 42 -96 L 20 -86 L 42 -76" stroke={ink} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" /></>,
    wow: <><circle cx={-30} cy={-88} r={13} fill="#fff" stroke={ink} strokeWidth={4} /><circle cx={30} cy={-88} r={13} fill="#fff" stroke={ink} strokeWidth={4} /><circle cx={-30} cy={-86} r={6} fill={ink} /><circle cx={30} cy={-86} r={6} fill={ink} /></>,
  }
  const mouths = {
    smile: <path d="M -24 -54 Q 0 -22 24 -54 Z" fill="#9b2c3a" stroke={ink} strokeWidth={4} strokeLinejoin="round" />,
    happy: <path d="M -26 -56 Q 0 -18 26 -56 Z" fill="#9b2c3a" stroke={ink} strokeWidth={4} strokeLinejoin="round" />,
    ouch: <path d="M -22 -40 Q -11 -54 0 -42 Q 11 -54 22 -40" fill="none" stroke={ink} strokeWidth={5} strokeLinecap="round" />,
    wow: <ellipse cx={0} cy={-44} rx={12} ry={15} fill="#9b2c3a" stroke={ink} strokeWidth={4} />,
    freeze: <line x1={-18} y1={-46} x2={18} y2={-46} stroke={ink} strokeWidth={5} strokeLinecap="round" />,
    uf: <path d="M -18 -40 Q 0 -54 18 -40" fill="none" stroke={ink} strokeWidth={5} strokeLinecap="round" />,
  }
  const eyeKey = expression === 'freeze' ? 'wow' : expression === 'uf' ? 'happy' : (eyes[expression] ? expression : 'smile')
  return (
    <>
      <circle cx={-52} cy={-58} r={13} fill="#ff8f8f" opacity={0.5} />
      <circle cx={52} cy={-58} r={13} fill="#ff8f8f" opacity={0.5} />
      {eyes[eyeKey]}
      {mouths[expression] || mouths.smile}
      {expression === 'uf' && <path d="M 70 -130 q 10 16 0 22 q -10 -6 0 -22 Z" fill="#7fd3ff" stroke="#3a8fc4" strokeWidth={3} />}
    </>
  )
}

export function Vest({ drop = 0, color = '#6c5ce7', trim = '#3d2f99' }) {
  // drop: 0 = puesto; 1 = muy arriba (fuera de la pantalla)
  return (
    <g transform={`translate(0 ${-drop * 900})`}>
      <Outlined ow={5} color={trim}>
        <Path fill={color} d="M -72 -198 L -38 -198 Q 0 -150 38 -198 L 72 -198 Q 88 -192 88 -160 L 84 64 Q 0 82 -84 64 L -88 -160 Q -88 -192 -72 -198 Z" />
        <Rect x={-30} y={-212} width={60} height={18} rx={9} fill={color} />
      </Outlined>
      <path d="M -70 -182 L -40 -182 Q 0 -138 40 -182 L 70 -182" fill="none" stroke="#fff" strokeOpacity={0.35} strokeWidth={4} strokeDasharray="10 8" />
      <path d="M 0 -122 L 13 -95 L 43 -91 L 21 -70 L 27 -40 L 0 -55 L -27 -40 L -21 -70 L -43 -91 L -13 -95 Z" fill="#ffd23f" stroke="#c98a00" strokeWidth={4} strokeLinejoin="round" />
      <path d="M -60 20 L 60 20" stroke="#fff" strokeOpacity={0.25} strokeWidth={6} strokeLinecap="round" />
    </g>
  )
}

export function Kid({ pose, kid = KIDS.leo, expression = 'smile', xray = false, vest = null, highlightArm = 0, skeletonFilter = 'url(#glow)', cape = false, capeT = 0, emblem = false, cast = false }) {
  const j = joints(pose)
  const c = xray ? { ...kid, ...XR } : kid
  const oc = xray ? '#d4ebff' : '#4a2e22'
  const ow = xray ? 3 : 5
  const sleeveEnd = (s, e) => add(s, mul(sub(e, s), 0.55))
  const hand = (e, w) => add(w, mul(norm(sub(w, e)), 12))
  const sA2 = sleeveEnd(j.sA, j.eA), sB2 = sleeveEnd(j.sB, j.eB)
  const hA = hand(j.eA, j.wA), hB = hand(j.eB, j.wB)
  return (
    <g>
      <g opacity={xray ? 0.2 : 1}>
      {cape && <Cape j={j} t={capeT} />}
      <Outlined ow={ow} color={oc}>
        {/* piernas */}
        <Line x1={j.kA[0]} y1={j.kA[1]} x2={j.aA[0]} y2={j.aA[1]} w={38} fill={c.skin} />
        <Line x1={j.kB[0]} y1={j.kB[1]} x2={j.aB[0]} y2={j.aB[1]} w={38} fill={c.skin} />
        <Ellipse cx={j.aA[0] - 14} cy={j.aA[1] + 18} rx={36} ry={19} fill={c.shoes} />
        <Ellipse cx={j.aB[0] + 14} cy={j.aB[1] + 18} rx={36} ry={19} fill={c.shoes} />
        <Line x1={j.hA[0]} y1={j.hA[1]} x2={add(j.hA, mul(sub(j.kA, j.hA), 0.75))[0]} y2={add(j.hA, mul(sub(j.kA, j.hA), 0.75))[1]} w={52} fill={c.pants} />
        <Line x1={j.hB[0]} y1={j.hB[1]} x2={add(j.hB, mul(sub(j.kB, j.hB), 0.75))[0]} y2={add(j.hB, mul(sub(j.kB, j.hB), 0.75))[1]} w={52} fill={c.pants} />
        {/* cuerpo */}
        <g transform={tr(j.P, j.T)}>
          <Rect x={-64} y={-20} width={128} height={56} rx={22} fill={c.pants} />
          <Line x1={0} y1={-178} x2={0} y2={-214} w={42} fill={c.skin} />
          <Path fill={c.shirt} d="M -62 -194 Q 0 -206 62 -194 Q 84 -186 82 -150 L 68 22 Q 0 36 -68 22 L -82 -150 Q -84 -186 -62 -194 Z" />
        </g>
        {/* brazos */}
        <Line x1={j.eA[0]} y1={j.eA[1]} x2={j.wA[0]} y2={j.wA[1]} w={34} fill={c.skin} />
        <Line x1={j.eB[0]} y1={j.eB[1]} x2={j.wB[0]} y2={j.wB[1]} w={34} fill={c.skin} />
        <Line x1={j.sA[0]} y1={j.sA[1]} x2={j.eA[0]} y2={j.eA[1]} w={36} fill={c.skin} />
        <Line x1={j.sB[0]} y1={j.sB[1]} x2={j.eB[0]} y2={j.eB[1]} w={36} fill={c.skin} />
        <Line x1={j.sA[0]} y1={j.sA[1]} x2={sA2[0]} y2={sA2[1]} w={48} fill={c.shirt} />
        <Line x1={j.sB[0]} y1={j.sB[1]} x2={sB2[0]} y2={sB2[1]} w={48} fill={c.shirt} />
        <Circle cx={hA[0]} cy={hA[1]} r={23} fill={c.skin} />
        <Circle cx={hB[0]} cy={hB[1]} r={23} fill={c.skin} />
        {/* cabeza */}
        <g transform={tr(j.head, j.headAng)}>
          <Circle cx={-82} cy={-80} r={20} fill={c.skin} />
          <Circle cx={82} cy={-80} r={20} fill={c.skin} />
          <Circle cx={0} cy={-86} r={84} fill={c.skin} />
          {!xray && <Hair style={kid.style} color={kid.hair} />}
        </g>
      </Outlined>
      </g>
      {!xray && <g transform={tr(j.head, j.headAng)}><Face expression={expression} /></g>}
      {emblem && !xray && <g transform={tr(j.P, j.T)}><Emblem /></g>}
      {cast && !xray && <Cast e={j.eB} w={j.wB} />}
      {highlightArm > 0 && (
        <g opacity={highlightArm}>
          <circle cx={j.eB[0]} cy={j.eB[1]} r={60} fill="none" stroke="#ff3b3b" strokeWidth={8} strokeDasharray="12 10" />
        </g>
      )}
      {xray && <Skeleton pose={pose} filter={skeletonFilter} colors={{ bone: '#eef8ff', outline: 'rgba(170,215,255,0.55)', ow: 1.5, socket: '#0a1630', eyes: false }} />}
      {vest !== null && (
        <g transform={tr(j.P, j.T)} opacity={xray ? 0.9 : 1}>
          <Vest drop={vest} />
        </g>
      )}
      {vest !== null && <>
        {/* los brazos van por encima del chaleco */}
        <Outlined ow={ow} color={oc}>
          <Line x1={j.sA[0]} y1={j.sA[1]} x2={j.eA[0]} y2={j.eA[1]} w={36} fill={c.skin} />
          <Line x1={j.sB[0]} y1={j.sB[1]} x2={j.eB[0]} y2={j.eB[1]} w={36} fill={c.skin} />
          <Line x1={j.sA[0]} y1={j.sA[1]} x2={sA2[0]} y2={sA2[1]} w={48} fill={c.shirt} />
          <Line x1={j.sB[0]} y1={j.sB[1]} x2={sB2[0]} y2={sB2[1]} w={48} fill={c.shirt} />
          <Line x1={j.eA[0]} y1={j.eA[1]} x2={j.wA[0]} y2={j.wA[1]} w={34} fill={c.skin} />
          <Line x1={j.eB[0]} y1={j.eB[1]} x2={j.wB[0]} y2={j.wB[1]} w={34} fill={c.skin} />
          <Circle cx={hA[0]} cy={hA[1]} r={23} fill={c.skin} />
          <Circle cx={hB[0]} cy={hB[1]} r={23} fill={c.skin} />
        </Outlined>
      </>}
    </g>
  )
}
