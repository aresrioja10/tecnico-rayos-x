import React from 'react'
import { Outlined, Line, Circle, Ellipse, Rect, Path, Polygon } from './prims.jsx'

const OUT = '#24324d'

// La "cámara gigante y mágica" (tubo de rayos X con cara simpática). Caja 0 0 500 720.
export function XrayMachine({ t = 0, beam = 0, mood = 'smile', look = 0 }) {
  const blink = (t % 3.6) > 3.45
  const eyeRy = blink ? 3 : 24
  return (
    <g>
      {beam > 0 && (
        <g opacity={beam}>
          <polygon points="200,392 300,392 470,720 30,720" fill="url(#beam)" />
          <polygon points="225,392 275,392 360,720 140,720" fill="#fffbe0" opacity={0.35} />
        </g>
      )}
      <Outlined ow={6} color={OUT}>
        <Rect x={0} y={0} width={500} height={28} rx={14} fill="#4a5d80" />
        <Rect x={222} y={20} width={56} height={90} rx={8} fill="#c9d6e8" />
        <Rect x={230} y={100} width={40} height={90} rx={8} fill="#e6edf7" />
        <Rect x={84} y={178} width={332} height={156} rx={56} fill="#f4f8ff" />
        <Circle cx={84} cy={256} r={24} fill="#ffd23f" />
        <Circle cx={416} cy={256} r={24} fill="#ffd23f" />
        <Polygon points="180,332 320,332 302,394 198,394" fill="#6f80a0" />
      </Outlined>
      <rect x={136} y={204} width={228} height={104} rx={36} fill="#1b2a47" />
      <g transform={`translate(${look * 10} 0)`}>
        <ellipse cx={204} cy={250} rx={22} ry={eyeRy} fill="#3fe0ff" />
        <ellipse cx={296} cy={250} rx={22} ry={eyeRy} fill="#3fe0ff" />
        {!blink && <><circle cx={212} cy={240} r={6} fill="#fff" /><circle cx={304} cy={240} r={6} fill="#fff" /></>}
      </g>
      {mood === 'wow'
        ? <ellipse cx={250} cy={290} rx={14} ry={10} fill="#3fe0ff" />
        : <path d="M 222 284 Q 250 304 278 284" stroke="#3fe0ff" strokeWidth={7} fill="none" strokeLinecap="round" />}
      <rect x={210} y={382} width={80} height={10} rx={4} fill={beam > 0 ? '#fff6a8' : '#2b3a55'} />
      <circle cx={84} cy={256} r={8} fill="#c98a00" />
      <circle cx={416} cy={256} r={8} fill="#c98a00" />
    </g>
  )
}

// Camilla. Caja 0 0 700 200
export function Table() {
  return (
    <Outlined ow={6} color={OUT}>
      <Rect x={250} y={60} width={40} height={140} rx={8} fill="#8fa0bf" />
      <Rect x={410} y={60} width={40} height={140} rx={8} fill="#8fa0bf" />
      <Rect x={180} y={180} width={340} height={22} rx={11} fill="#6f80a0" />
      <Rect x={0} y={20} width={700} height={50} rx={25} fill="#dfe8f5" />
    </Outlined>
  )
}

// Ordenador donde "aparece la foto". Caja 0 0 600 520. El contenido va en una pantalla 0 0 520 320.
export function Monitor({ children, glow = 0 }) {
  return (
    <g>
      <Outlined ow={6} color={OUT}>
        <Polygon points="250,400 350,400 380,470 220,470" fill="#8fa0bf" />
        <Rect x={170} y={460} width={260} height={30} rx={15} fill="#6f80a0" />
        <Rect x={0} y={0} width={600} height={400} rx={36} fill="#3b4a66" />
      </Outlined>
      <rect x={40} y={40} width={520} height={320} rx={18} fill="#030912" />
      <svg x={40} y={40} width={520} height={320} viewBox="0 0 520 320" style={{ overflow: 'hidden' }}>
        {children}
      </svg>
      {glow > 0 && <rect x={40} y={40} width={520} height={320} rx={18} fill="none" stroke="#3fe0ff" strokeWidth={8} opacity={glow} filter="url(#glowBig)" />}
      <circle cx={300} cy={382} r={7} fill={glow > 0 ? '#7cff6b' : '#9fb0cc'} />
    </g>
  )
}

// Cámara de fotos simpática. Caja 0 0 520 380
export function CuteCamera({ t = 0, flash = 0 }) {
  const blink = (t % 3.2) > 3.05
  return (
    <g>
      <Outlined ow={7} color={OUT}>
        <Rect x={340} y={34} width={100} height={60} rx={18} fill="#ff4d5e" />
        <Rect x={70} y={50} width={130} height={60} rx={18} fill="#4a5d80" />
        <Rect x={20} y={80} width={480} height={280} rx={60} fill="#ffd23f" />
        <Circle cx={260} cy={226} r={118} fill="#4a5d80" />
      </Outlined>
      <rect x={20} y={176} width={480} height={30} fill="#f0b400" opacity={0.6} />
      <circle cx={260} cy={226} r={118} fill="#4a5d80" stroke={OUT} strokeWidth={7} />
      <circle cx={260} cy={226} r={90} fill="#24324d" />
      <circle cx={260} cy={226} r={64} fill="#0b1a33" />
      {!blink ? <>
        <circle cx={260} cy={226} r={34} fill="#3fe0ff" opacity={0.85} />
        <circle cx={278} cy={206} r={13} fill="#fff" />
        <circle cx={244} cy={244} r={6} fill="#fff" opacity={0.7} />
      </> : <rect x={200} y={222} width={120} height={8} rx={4} fill="#3fe0ff" />}
      <rect x={88} y={112} width={70} height={46} rx={10} fill={flash > 0 ? '#fff' : '#e8f4ff'} stroke={OUT} strokeWidth={5} />
      {flash > 0 && <circle cx={123} cy={135} r={140} fill="#fff" opacity={flash * 0.8} filter="url(#glowBig)" />}
      <circle cx={70} cy={300} r={20} fill="#ff8fa3" opacity={0.7} />
      <circle cx={450} cy={300} r={20} fill="#ff8fa3" opacity={0.7} />
    </g>
  )
}

// Foto tipo polaroid. Caja 0 0 300 350. Contenido en 0 0 260 250.
export function Polaroid({ children, label, labelColor = '#1b2b4a' }) {
  return (
    <g filter="url(#shadow)">
      <rect x={0} y={0} width={300} height={350} rx={12} fill="#fffdf6" />
      <rect x={20} y={20} width={260} height={250} rx={6} fill="#030912" />
      <svg x={20} y={20} width={260} height={250} viewBox="0 0 260 250">{children}</svg>
      {label && <text x={150} y={322} textAnchor="middle" fontSize={40} fontWeight={700} fill={labelColor} fontFamily="var(--font)">{label}</text>}
    </g>
  )
}

// Negatoscopio: la pantalla de luz donde se miran las radiografías. Caja 0 0 W H.
export function Lightbox({ w = 900, h = 760, children, on = 1 }) {
  return (
    <g>
      <rect x={-18} y={-18} width={w + 36} height={h + 36} rx={40} fill="#d6e0ee" stroke={OUT} strokeWidth={7} />
      <rect x={0} y={0} width={w} height={h} rx={24} fill={on ? '#eef7ff' : '#9aa9bf'} />
      <rect x={0} y={0} width={w} height={h} rx={24} fill="#bfe6ff" opacity={on * 0.25} filter="url(#glowBig)" />
      {children}
      {[w * 0.3, w * 0.7].map((x) => (
        <g key={x}>
          <rect x={x - 34} y={-34} width={68} height={40} rx={10} fill="#8fa0bf" stroke={OUT} strokeWidth={5} />
          <rect x={x - 20} y={-4} width={40} height={18} rx={6} fill="#6f80a0" stroke={OUT} strokeWidth={4} />
        </g>
      ))}
    </g>
  )
}

// Balanza. El brazo gira "tilt" grados (positivo = baja la izquierda). Los platillos se pasan como hijos.
export function Scale({ tilt = 0, left, right }) {
  const a = (tilt * Math.PI) / 180
  const L = 360
  const pl = [600 - Math.cos(a) * L, 250 - Math.sin(a) * L]
  const pr = [600 + Math.cos(a) * L, 250 + Math.sin(a) * L]
  const Pan = ({ p, children }) => (
    <g transform={`translate(${p[0]} ${p[1]})`}>
      <line x1={0} y1={0} x2={-110} y2={230} stroke={OUT} strokeWidth={5} />
      <line x1={0} y1={0} x2={110} y2={230} stroke={OUT} strokeWidth={5} />
      <g transform="translate(0 230)">{children}</g>
      <Outlined ow={6} color={OUT}>
        <Path d="M -150 230 L 150 230 Q 140 275 0 278 Q -140 275 -150 230 Z" fill="#ffd23f" />
      </Outlined>
      <circle cx={0} cy={0} r={12} fill="#ffd23f" stroke={OUT} strokeWidth={5} />
    </g>
  )
  return (
    <g>
      <Outlined ow={7} color={OUT}>
        <Polygon points="470,760 730,760 680,690 520,690" fill="#a77bff" />
        <Rect x={585} y={240} width={30} height={460} rx={12} fill="#c9b3ff" />
      </Outlined>
      <g transform={`rotate(${tilt} 600 250)`}>
        <Outlined ow={7} color={OUT}>
          <Rect x={600 - L - 10} y={238} width={2 * L + 20} height={24} rx={12} fill="#c9b3ff" />
        </Outlined>
      </g>
      <circle cx={600} cy={250} r={26} fill="#ffd23f" stroke={OUT} strokeWidth={6} />
      <Pan p={pl}>{left}</Pan>
      <Pan p={pr}>{right}</Pan>
    </g>
  )
}

// Rueda dentada
export function gearPath(r, teeth = 10, depth = 0.22) {
  const pts = []
  const n = teeth * 4
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const rr = i % 4 < 2 ? r : r * (1 - depth)
    pts.push(`${(Math.cos(a) * rr).toFixed(1)},${(Math.sin(a) * rr).toFixed(1)}`)
  }
  return `M ${pts.join(' L ')} Z`
}
