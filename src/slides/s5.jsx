import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { useClock, useSince, addPose, prog, easeOut, easeInOut, clamp, lerp } from '../lib/anim.js'
import { Kid, Vest, POSES, KIDS } from '../art/Figure.jsx'
import { XrayMachine, Scale } from '../art/Machine.jsx'
import { Cat } from '../art/Animals.jsx'
import { Outlined, Line, Circle } from '../art/prims.jsx'
import { Bouncy, Pop, Sparkles, Star, useOnStep } from './ui.jsx'
import { sfx } from '../lib/sound.js'
import { burst } from '../lib/confetti.js'

// ---------------------------------------------------------------- LA ARMADURA MÁGICA
const KX = 1080, KY = 780, KS = 0.75
const SRC = [110 + 250 * 0.62, 120 + 392 * 0.62]

export function Armadura({ step }) {
  const t = useClock()
  const since = useSince(step, t)
  const hits = useRef({})
  useOnStep(step, 1, () => { sfx.whoosh(); setTimeout(() => sfx.clank(), 430) })
  useOnStep(step, 2, () => { sfx.magic(); setTimeout(() => burst(0.56, 0.45, { particleCount: 60 }), 300) })

  let drop = 0.57 + Math.sin(t * 2.5) * 0.012
  let pose = addPose(POSES.stand, { foreB: Math.sin(t * 2) * 3 })
  let expression = 'smile'
  if (step === 1) {
    drop = lerp(0.57, 0, clamp(since / 0.45) ** 2)
    if (since > 0.45 && since < 1.3) { pose = POSES.squat; expression = 'uf' }
    else if (since >= 1.3) expression = 'happy'
  }
  if (step >= 2) { drop = 0; pose = addPose(POSES.flex, { foreA: Math.sin(t * 4) * 6, foreB: -Math.sin(t * 4) * 6 }); expression = 'happy' }
  if (step === 1 && since > 0.45 && since < 1.3) {
    const k = Math.sin(Math.PI * clamp((since - 0.45) / 0.85))
    pose = addPose(POSES.stand, { y: k * 40, thighA: k * 40, shinA: -k * 60, thighB: -k * 40, shinB: k * 60, armA: k * 16, armB: -k * 16 })
  }

  // rayos que rebotan en el chaleco
  const rays = []
  if (step >= 2) {
    for (let k = 0; k < 3; k++) {
      const P = 1.5, ph = (since - 0.4 - k * 0.5) / P
      if (ph < 0) continue
      const n = Math.floor(ph), f = ph - n
      const hit = [KX - 40, KY - 150 * KS + (k - 1) * 60]
      const out = [SRC[0] + 120 + k * 120, 1150]
      const head = f < 0.5 ? [lerp(SRC[0], hit[0], f / 0.5), lerp(SRC[1], hit[1], f / 0.5)] : [lerp(hit[0], out[0], (f - 0.5) / 0.5), lerp(hit[1], out[1], (f - 0.5) / 0.5)]
      const from = f < 0.5 ? SRC : hit
      const dx = head[0] - from[0], dy = head[1] - from[1], L = Math.hypot(dx, dy) || 1
      const tail = [head[0] - (dx / L) * Math.min(160, L), head[1] - (dy / L) * Math.min(160, L)]
      rays.push({ head, tail, hitNow: f > 0.5 && f < 0.62, hit })
      const key = `${k}-${n}`
      if (f > 0.5 && !hits.current[key]) { hits.current[key] = true; sfx.zap() }
    }
  }
  return (
    <>
      <svg className="full" viewBox="0 0 1920 1080">
        <g transform="translate(110 120) scale(0.62)"><XrayMachine t={t} beam={step >= 2 ? 0.35 : 0} mood={step >= 2 ? 'wow' : 'smile'} look={1} /></g>
        {step >= 2 && (
          <g>
            <ellipse cx={KX} cy={KY - 60} rx={250 + Math.sin(t * 6) * 8} ry={420} fill="#3fe0ff" opacity={0.1} />
            <ellipse cx={KX} cy={KY - 60} rx={250 + Math.sin(t * 6) * 8} ry={420} fill="none" stroke="#3fe0ff" strokeWidth={8} opacity={0.6} strokeDasharray="30 18" transform={`rotate(${t * 10} ${KX} ${KY - 60})`} />
          </g>
        )}
        <g transform={`translate(${KX} ${KY}) scale(${KS})`}>
          <Kid pose={pose} kid={KIDS.vega} expression={expression} vest={drop} />
        </g>
        {step === 0 && <Sparkles t={t} points={[[KX - 160, 260], [KX + 170, 300], [KX - 120, 420], [KX + 140, 440]]} color="#e3d6ff" size={30} />}
        {rays.map((r, i) => (
          <g key={i}>
            <line x1={r.tail[0]} y1={r.tail[1]} x2={r.head[0]} y2={r.head[1]} stroke="#fff27a" strokeWidth={22} strokeLinecap="round" filter="url(#glowBig)" />
            <line x1={r.tail[0]} y1={r.tail[1]} x2={r.head[0]} y2={r.head[1]} stroke="#fffbe0" strokeWidth={8} strokeLinecap="round" />
            {r.hitNow && <Star x={r.hit[0]} y={r.hit[1]} r={60} fill="#fff27a" stroke="#ffd23f" rot={t * 200} />}
          </g>
        ))}
      </svg>
      <Bouncy key={step >= 2 ? 'b' : 'a'} text={step >= 2 ? '¡INVENCIBLE!' : '¡Una armadura mágica!'} className={step >= 2 ? 'hl' : 'hl-purple'} style={{ top: 40, fontSize: step >= 2 ? 150 : 116 }} />
      {step === 1 && since > 1.3 && <Pop className="bubble right" style={{ left: 1280, top: 230, fontSize: 64 }}>¡Pesa un poco!</Pop>}
    </>
  )
}

// ---------------------------------------------------------------- ¡PESA COMO UN GATO!
function Feather({ rot = 0 }) {
  return (
    <g transform={`rotate(${rot})`}>
      <path d="M 0 -10 C 40 -60, 120 -70, 160 -40 C 120 -20, 60 -10, 0 -10 Z" fill="#fff" stroke="#24324d" strokeWidth={5} strokeLinejoin="round" />
      <path d="M -10 -4 L 150 -42" stroke="#24324d" strokeWidth={4} strokeLinecap="round" />
    </g>
  )
}

function RaisedArm({ x, k, skin, sleeve, t, ph }) {
  const ang = Math.sin(t * 5 + ph) * 12
  const y = 1080 + (1 - k) * 420
  return (
    <g transform={`translate(${x} ${y}) rotate(${ang})`}>
      <Outlined ow={6} color="#4a2e22">
        <Line x1={0} y1={0} x2={0} y2={-300} w={60} fill={skin} />
        <Line x1={0} y1={40} x2={0} y2={-120} w={84} fill={sleeve} />
        <Circle cx={0} cy={-330} r={44} fill={skin} />
        {[-26, -9, 9, 26].map((dx, i) => <Line key={i} x1={dx} y1={-350} x2={dx * 1.2} y2={-400 + Math.abs(dx) * 0.6} w={20} fill={skin} />)}
        <Line x1={-40} y1={-320} x2={-70} y2={-360} w={22} fill={skin} />
      </Outlined>
    </g>
  )
}

export function Balanza({ step }) {
  const t = useClock()
  const since = useSince(step, t)
  const sim = useRef({ a: -14, v: 0, last: t })
  const catK = step >= 2 ? clamp((step === 2 ? since : 9) / 0.8) : 0
  const featherK = step >= 1 ? clamp((step === 1 ? since : 9) / 1.6) : 0
  const target = step >= 2 && catK >= 1 ? 0 : step >= 1 && featherK >= 1 ? -12.5 : -14
  const s = sim.current
  const dt = Math.min(0.05, Math.max(0, t - s.last)); s.last = t
  for (let i = 0; i < 4; i++) {
    const h = dt / 4
    const acc = -26 * (s.a - target) - 3.2 * s.v
    s.v += acc * h; s.a += s.v * h
  }
  useOnStep(step, 1, () => sfx.whoosh())
  useOnStep(step, 2, () => { sfx.boing(); setTimeout(() => { sfx.miau(); burst(0.7, 0.5, { particleCount: 50 }) }, 800) })
  useOnStep(step, 3, () => sfx.tada())

  const catX = 700 * (1 - catK), catY = -420 * (1 - catK) - 260 * Math.sin(Math.PI * catK)
  const titles = ['¡Pesa un poco!', '¿Y una pluma?', '¡Pesa como un gato!', '¿Quién se lo prueba?']
  const arms = [
    { x: 260, skin: '#f6c39c', sleeve: '#3fa7ff' }, { x: 640, skin: '#a8714d', sleeve: '#7cd957' }, { x: 1000, skin: '#e7ae86', sleeve: '#ff5fa2' },
    { x: 1360, skin: '#f9d3b4', sleeve: '#ffd23f' }, { x: 1700, skin: '#c98e68', sleeve: '#a77bff' },
  ]
  return (
    <>
      <svg className="full" viewBox="0 0 1920 1080">
        <g transform="translate(360 150)">
          <Scale tilt={s.a}
            left={<g transform="translate(0 -46) scale(0.56)"><Vest /></g>}
            right={
              <g>
                {step >= 1 && <g transform={`translate(${Math.sin(featherK * 7) * 50 * (1 - featherK) - 70} ${lerp(-520, -6, featherK)})`}><Feather rot={Math.sin(featherK * 9) * 25 * (1 - featherK)} /></g>}
                {step >= 2 && <g transform={`translate(${catX} ${catY})`}><g transform="translate(-141 -150) scale(0.31)"><Cat /></g></g>}
              </g>
            } />
        </g>
        {step >= 3 && arms.map((a, i) => <RaisedArm key={i} {...a} k={easeOut(prog(since, i * 0.12, 0.6))} t={t} ph={i} />)}
      </svg>
      <Bouncy key={step} text={titles[step]} className={step === 2 ? 'hl' : 'hl-purple'} style={{ top: 40, fontSize: 116 }} />
    </>
  )
}
