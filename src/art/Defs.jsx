import React from 'react'

// Filtros y degradados compartidos por todas las ilustraciones.
export default function Defs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b" />
          <feColorMatrix in="b" type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.85  0 0 0 0 1  0 0 0 1.1 0" result="c" />
          <feMerge><feMergeNode in="c" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glowBig" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="soft" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <filter id="blurry" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#000" floodOpacity="0.35" />
        </filter>
        <radialGradient id="film" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="#13284d" />
          <stop offset="70%" stopColor="#081428" />
          <stop offset="100%" stopColor="#040a16" />
        </radialGradient>
        <radialGradient id="gold" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#fff6b0" />
          <stop offset="45%" stopColor="#ffd23f" />
          <stop offset="100%" stopColor="#d48a00" />
        </radialGradient>
        <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff7b0" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffe14d" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5ec8ff" />
          <stop offset="100%" stopColor="#bdf0ff" />
        </linearGradient>
        <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#c9d6e8" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// Película de radiografía (fondo oscuro con brillo)
export function Film({ x = 0, y = 0, w, h, r = 28, stroke = '#2b4a7a' }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r} fill="url(#film)" stroke={stroke} strokeWidth={6} />
      <rect x={x + 14} y={y + 14} width={w - 28} height={h - 28} rx={r - 8} fill="none" stroke="#ffffff" strokeOpacity={0.05} strokeWidth={3} />
    </g>
  )
}
