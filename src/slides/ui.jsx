import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Título con letras que saltan una a una
export function Bouncy({ text, delay = 0, className = '', style, stagger = 0.04, as = 'h1' }) {
  const Tag = motion[as]
  const words = text.split(' ')
  let n = 0
  return (
    <Tag className={`title ${className}`} style={style}>
      {words.map((w, wi) => (
        <span key={wi} className="word" style={{ whiteSpace: 'nowrap' }}>
          {[...w].map((ch, ci) => {
            const k = n++
            return (
              <motion.span key={ci} style={{ display: 'inline-block' }}
                initial={{ y: -160, opacity: 0, rotate: -20, scale: 0.4 }}
                animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 420, damping: 13, delay: delay + k * stagger }}>
                {ch}
              </motion.span>
            )
          })}
          {wi < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </Tag>
  )
}

export function Pop({ children, delay = 0, style, className, onClick, from = 0.2 }) {
  return (
    <motion.div className={className} style={style} onClick={onClick}
      initial={{ scale: from, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.2, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 380, damping: 15, delay }}>
      {children}
    </motion.div>
  )
}

export function FadeUp({ children, delay = 0, style, className }) {
  return (
    <motion.div className={className} style={style}
      initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -40, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18, delay }}>
      {children}
    </motion.div>
  )
}

// Destello blanco de "foto"
export function useFlash() {
  const [key, setKey] = useState(0)
  const fire = () => setKey((k) => k + 1)
  const el = (
    <AnimatePresence>
      {key > 0 && (
        <motion.div key={key} className="flash" initial={{ opacity: 0.95 }} animate={{ opacity: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} />
      )}
    </AnimatePresence>
  )
  return [fire, el]
}

// Ejecuta fn una sola vez cuando el paso llega a "when" (avanzando)
export function useOnStep(step, when, fn) {
  const prev = useRef(step)
  useEffect(() => {
    const was = prev.current
    prev.current = step
    if (step === when && was !== when) fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])
}

export function useOnMount(fn, delay = 0) {
  useEffect(() => {
    const id = setTimeout(fn, delay)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

// Huesos flotando de fondo
const BONE_D = 'M -40 -6 L 40 -6 A 11 11 0 1 1 46 -18 A 11 11 0 1 1 52 6 A 11 11 0 1 1 46 18 A 11 11 0 1 1 40 6 L -40 6 A 11 11 0 1 1 -46 18 A 11 11 0 1 1 -52 6 A 11 11 0 1 1 -46 -18 A 11 11 0 1 1 -40 -6 Z'
export const BonePath = BONE_D

export function FloatingBones({ t, count = 14, opacity = 0.16, color = '#bfe6ff' }) {
  const items = useRef(Array.from({ length: count }, (_, i) => ({
    x: (i * 1973) % 1920, y: (i * 787) % 1080, s: 0.6 + ((i * 37) % 10) / 10, sp: 10 + ((i * 13) % 20), r: (i * 47) % 360, rs: ((i % 2) ? 1 : -1) * (8 + (i % 5) * 4),
  }))).current
  return (
    <g opacity={opacity}>
      {items.map((b, i) => {
        const y = ((b.y - t * b.sp) % 1200 + 1200) % 1200 - 60
        return <path key={i} d={BONE_D} fill={color} transform={`translate(${b.x} ${y}) rotate(${b.r + t * b.rs}) scale(${b.s})`} />
      })}
    </g>
  )
}

// Rayos girando (fondo de "superpoder")
export function Sunburst({ cx = 960, cy = 540, t = 0, n = 18, r = 1400, color = '#ffffff', opacity = 0.08, speed = 6 }) {
  const rays = []
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * 2 * Math.PI, a1 = a0 + Math.PI / n
    rays.push(`M 0 0 L ${Math.cos(a0) * r} ${Math.sin(a0) * r} L ${Math.cos(a1) * r} ${Math.sin(a1) * r} Z`)
  }
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${t * speed})`} opacity={opacity}>
      {rays.map((d, i) => <path key={i} d={d} fill={color} />)}
    </g>
  )
}

// Estrellitas que parpadean
export function Sparkles({ t, points, color = '#fff', size = 22 }) {
  return points.map(([x, y], i) => {
    const k = (Math.sin(t * 4 + i * 1.7) + 1) / 2
    const s = size * (0.5 + k * 0.7)
    return <path key={i} transform={`translate(${x} ${y}) scale(${s / 20}) rotate(${t * 40 + i * 30})`} d="M 0 -20 Q 3 -3 20 0 Q 3 3 0 20 Q -3 3 -20 0 Q -3 -3 0 -20 Z" fill={color} opacity={0.4 + k * 0.6} />
  })
}

export function Star({ x, y, r = 40, fill = '#ffd23f', stroke = '#c98a00', rot = 0 }) {
  const pts = []
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2
    const rr = i % 2 ? r * 0.45 : r
    pts.push(`${Math.cos(a) * rr},${Math.sin(a) * rr}`)
  }
  return <polygon points={pts.join(' ')} transform={`translate(${x} ${y}) rotate(${rot})`} fill={fill} stroke={stroke} strokeWidth={r * 0.1} strokeLinejoin="round" />
}

// Convierte coordenadas del puntero a coordenadas de un <svg>
export function svgPoint(svg, clientX, clientY) {
  if (!svg) return null
  const m = svg.getScreenCTM(); if (!m) return null
  const p = new DOMPoint(clientX, clientY).matrixTransform(m.inverse())
  return [p.x, p.y]
}
