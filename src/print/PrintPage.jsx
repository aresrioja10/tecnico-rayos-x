import React, { useState } from 'react'
import { Skeleton, POSES } from '../art/Figure.jsx'
import { Medal } from '../art/Medal.jsx'
import { Star, BonePath } from '../slides/ui.jsx'

// Hojas A4 para imprimir: dibujo para colorear y medallas para recortar.
function ColoringSheet() {
  const deco = [[260, 520, 0], [1840, 600, 30], [230, 1500, -20], [1860, 1450, 15], [300, 2350, 40], [1800, 2300, -30]]
  return (
    <svg viewBox="0 0 2100 2970">
      <rect width={2100} height={2970} fill="#fff" />
      <text x={1050} y={300} textAnchor="middle" fontSize={170} fontWeight={700} fill="#fff" stroke="#111" strokeWidth={9} strokeLinejoin="round" style={{ fontFamily: 'var(--font)' }}>¡Colorea a Esqueletín!</text>
      {deco.map(([x, y, r], i) => (i % 2
        ? <Star key={i} x={x} y={y} r={110} fill="#fff" stroke="#111" rot={r} />
        : <path key={i} d={BonePath} transform={`translate(${x} ${y}) rotate(${r}) scale(2.4)`} fill="#fff" stroke="#111" strokeWidth={3} />))}
      <g transform="translate(1050 1700) scale(2.9)">
        <Skeleton pose={POSES.wave} colors={{ bone: '#ffffff', outline: '#111111', ow: 2.4, socket: '#111111', eyes: true }} />
      </g>
      <text x={250} y={2760} fontSize={90} fontWeight={600} fill="#111" style={{ fontFamily: 'var(--font)' }}>Me llamo:</text>
      <line x1={720} y1={2770} x2={1850} y2={2770} stroke="#111" strokeWidth={6} strokeDasharray="4 22" strokeLinecap="round" />
    </svg>
  )
}

function MedalSheet({ color }) {
  const pos = []
  for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) pos.push([550 + c * 1000, 120 + r * 950])
  return (
    <svg viewBox="0 0 2100 2970">
      <rect width={2100} height={2970} fill="#fff" />
      {pos.map(([x, y], i) => (
        <g key={i} transform={`translate(${x - 330} ${y}) scale(1.1)`}>
          <Medal mode={color ? 'color' : 'outline'} id={`pm${i}`} />
        </g>
      ))}
    </svg>
  )
}

export default function PrintPage() {
  const [color, setColor] = useState(true)
  const [sheets, setSheets] = useState({ colorear: true, medallas: true })
  return (
    <div className="print-page">
      <div className="print-bar">
        <button onClick={() => { location.hash = '#1' }}>← Volver a la presentación</button>
        <button onClick={() => window.print()}>🖨 Imprimir</button>
        <label><input type="checkbox" checked={sheets.colorear} onChange={(e) => setSheets({ ...sheets, colorear: e.target.checked })} /> Dibujo para colorear</label>
        <label><input type="checkbox" checked={sheets.medallas} onChange={(e) => setSheets({ ...sheets, medallas: e.target.checked })} /> Medallas (6 por hoja)</label>
        <label><input type="checkbox" checked={color} onChange={(e) => setColor(e.target.checked)} /> Medallas en color (si no, para colorear)</label>
        <span style={{ opacity: 0.75 }}>Consejo: en el diálogo de imprimir elige A4, sin márgenes y el número de copias que necesites.</span>
      </div>
      {sheets.colorear && <div className="sheet"><ColoringSheet /></div>}
      {sheets.medallas && <div className="sheet"><MedalSheet color={color} /></div>}
    </div>
  )
}
