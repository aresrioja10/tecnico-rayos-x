import React from 'react'
import { Star } from '../slides/ui.jsx'

// Medalla de superhéroe. Caja 0 0 600 800. mode: 'color' o 'outline' (para colorear)
export function Medal({ mode = 'color', t = 0, id = 'm', top = 'SÚPER VALIENTE', bottom = 'RAYOS X' }) {
  const col = mode === 'color'
  const ink = col ? '#24324d' : '#111'
  const f = (c) => (col ? c : '#fff')
  return (
    <g>
      <defs>
        <path id={`${id}-top`} d={`M ${300 - 186} 520 A 186 186 0 0 1 ${300 + 186} 520`} />
        <path id={`${id}-bot`} d={`M ${300 - 222} 520 A 222 222 0 0 0 ${300 + 222} 520`} />
      </defs>
      <polygon points="150,0 280,0 340,330 240,330" fill={f('#ff4d5e')} stroke={ink} strokeWidth={8} strokeLinejoin="round" />
      <polygon points="320,0 450,0 360,330 260,330" fill={f('#3fa7ff')} stroke={ink} strokeWidth={8} strokeLinejoin="round" />
      {col && <polygon points="190,0 215,0 285,330 262,330" fill="#ffd23f" opacity={0.8} />}
      {col && <polygon points="385,0 410,0 338,330 315,330" fill="#ffd23f" opacity={0.8} />}
      <circle cx={300} cy={520} r={250} fill={col ? 'url(#gold)' : '#fff'} stroke={ink} strokeWidth={10} />
      <circle cx={300} cy={520} r={160} fill={col ? '#ffe680' : '#fff'} stroke={ink} strokeWidth={6} />
      <circle cx={300} cy={520} r={236} fill="none" stroke={col ? '#c98a00' : ink} strokeWidth={4} strokeDasharray="4 14" strokeLinecap="round" />
      <Star x={300} y={520} r={128} fill={f('#ffd23f')} stroke={ink} rot={col ? Math.sin(t * 2) * 6 : 0} />
      <g transform="translate(300 528)">
        <path d="M -36 -36 L 36 36 M 36 -36 L -36 36" stroke={col ? '#0b1a33' : ink} strokeWidth={22} strokeLinecap="round" fill="none" />
        {!col && <path d="M -36 -36 L 36 36 M 36 -36 L -36 36" stroke="#fff" strokeWidth={8} strokeLinecap="round" fill="none" />}
      </g>
      <text fontSize={46} fontWeight={700} fill={col ? '#7a4a00' : '#fff'} stroke={col ? 'none' : ink} strokeWidth={col ? 0 : 2.5} letterSpacing={3} style={{ fontFamily: 'var(--font)' }}>
        <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">{top}</textPath>
      </text>
      <text fontSize={48} fontWeight={700} fill={col ? '#7a4a00' : '#fff'} stroke={col ? 'none' : ink} strokeWidth={col ? 0 : 2.5} letterSpacing={6} style={{ fontFamily: 'var(--font)' }}>
        <textPath href={`#${id}-bot`} startOffset="50%" textAnchor="middle">{bottom}</textPath>
      </text>
      {col && <ellipse cx={220} cy={410} rx={60} ry={26} fill="#fff" opacity={0.35} transform="rotate(-35 220 410)" />}
    </g>
  )
}
