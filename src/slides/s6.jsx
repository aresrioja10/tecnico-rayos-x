import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useClock, useSince, addPose, prog, easeOut, clamp } from '../lib/anim.js'
import { Kid, Skeleton, POSES, KIDS } from '../art/Figure.jsx'
import { XrayMachine, Table } from '../art/Machine.jsx'
import { HandSkin } from '../art/Hand.jsx'
import { Medal } from '../art/Medal.jsx'
import { Bouncy, Pop, Sparkles, Sunburst, Star, FloatingBones, useOnStep, useOnMount } from './ui.jsx'
import { sfx } from '../lib/sound.js'
import { burst, party, bones } from '../lib/confetti.js'

function Heart({ x, y, s = 1, color = '#ff5fa2' }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M 0 30 C -60 -10, -40 -60, 0 -28 C 40 -60, 60 -10, 0 30 Z" fill={color} stroke="#fff" strokeWidth={4} />
}

const HOLD = { ...POSES.stand, armA: 28, foreA: -105, armB: -12, foreB: 62, head: -8 }

// ---------------------------------------------------------------- ¡NO HAY QUE TENER MIEDO!
export function NoMiedo({ step }) {
  const t = useClock()
  const since = useSince(step, t)
  useOnStep(step, 1, () => sfx.pop())
  useOnStep(step, 2, () => { sfx.fanfare(); party() })
  const hearts = Array.from({ length: 7 }, (_, i) => {
    const p = ((t * 0.25 + i / 7) % 1)
    return { x: 900 + Math.sin(p * 8 + i) * 120 + (i - 3) * 60, y: 900 - p * 800, s: 0.6 + (i % 3) * 0.25, o: Math.sin(p * Math.PI) }
  })
  const panels = [
    { title: '¡Ay!', color: '#ff8fa3' },
    { title: '¡Clack!', color: '#ffd23f' },
    { title: '¡Curado!', color: '#7cd957' },
  ]
  const jump = Math.abs(Math.sin(t * 4)) * 30
  return (
    <>
      <svg className="full" viewBox="0 0 1920 1080">
        {step === 0 && (
          <g>
            <g transform="translate(260 180) scale(0.95)"><XrayMachine t={t} /></g>
            <g transform="translate(110 870) scale(0.85)"><Table /></g>
            <g transform="translate(1350 700) scale(0.85)"><Kid pose={addPose(POSES.hooray, { y: -Math.abs(Math.sin(t * 3)) * 20, armA: Math.sin(t * 6) * 10, armB: -Math.sin(t * 6) * 10 })} kid={KIDS.sol} expression="happy" /></g>
            {hearts.map((h, i) => <g key={i} opacity={h.o}><Heart x={h.x} y={h.y} s={h.s} color={i % 2 ? '#ff5fa2' : '#ff8fa3'} /></g>)}
          </g>
        )}
        {step >= 1 && panels.map((p, i) => (
          <motion.g key={i} initial={{ y: 700, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 110, damping: 15, delay: i * 0.45 }}
            onAnimationStart={() => setTimeout(() => (i === 1 ? sfx.clack() : i === 2 ? sfx.tada() : sfx.ouch()), i * 450 + 200)}>
            <g transform={`translate(${110 + i * 590} 240)`}>
              <rect x={0} y={0} width={520} height={660} rx={40} fill="#fffaf0" stroke={step >= 2 && i === 2 ? '#7cd957' : '#24324d'} strokeWidth={step >= 2 && i === 2 ? 14 : 7} />
              <rect x={20} y={20} width={480} height={90} rx={30} fill={p.color} />
              <text x={260} y={88} textAnchor="middle" fontSize={64} fontWeight={700} fill="#1b2b4a" style={{ fontFamily: 'var(--font)' }}>{p.title}</text>
              <svg x={20} y={120} width={480} height={520} viewBox="0 0 480 520">
                {i === 0 && <g transform="translate(240 330) scale(0.62)"><Kid pose={addPose(HOLD, { torso: Math.sin(t * 8) * 2 })} kid={KIDS.leo} expression="ouch" /></g>}
                {i === 1 && <g>
                  <g transform="translate(90 0) scale(0.6)"><XrayMachine t={t} beam={0.6 + Math.sin(t * 20) * 0.3} mood="wow" /></g>
                  <g transform="translate(-30 420) scale(0.75)"><Table /></g>
                  <g transform="translate(240 420) rotate(90) scale(0.26) translate(-300 -470)"><HandSkin /></g>
                </g>}
                {i === 2 && <g transform={`translate(240 ${330 - jump}) scale(0.62)`}><Kid pose={addPose(POSES.hooray, { armA: Math.sin(t * 6) * 10 })} kid={KIDS.leo} expression="happy" cast /></g>}
                {i === 2 && <Sparkles t={t} points={[[70, 90], [420, 120], [400, 420], [80, 420]]} color="#ffd23f" size={26} />}
              </svg>
            </g>
            {i < 2 && <path d={`M ${640 + i * 590} 570 l 40 0 m -14 -18 l 18 18 l -18 18`} stroke="#ffd23f" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
          </motion.g>
        ))}
      </svg>
      <Bouncy key={step} text={step === 0 ? '¡No hay que tener miedo!' : step === 1 ? 'Es una foto mágica…' : '¡…para curaros!'} className={step === 2 ? 'hl-green' : 'hl-orange'} style={{ top: 40, fontSize: 116 }} />
    </>
  )
}

// ---------------------------------------------------------------- LA MEDALLA
export function Medalla() {
  const t = useClock()
  useOnMount(() => sfx.whoosh(), 150)
  useOnMount(() => { sfx.fanfare(); party() }, 900)
  const click = () => { sfx.tada(); burst(0.5, 0.55) }
  return (
    <>
      <svg className="full" viewBox="0 0 1920 1080">
        <Sunburst t={t} cx={960} cy={640} color="#ffd23f" opacity={0.14} />
        <motion.g initial={{ y: -1200, rotate: -30 }} animate={{ y: 0, rotate: 0 }} transition={{ type: 'spring', stiffness: 70, damping: 9, delay: 0.2 }}>
          <g transform={`translate(${960 - 300 * 0.95} ${200}) scale(0.95) rotate(${Math.sin(t * 1.6) * 4} 300 0)`} onClick={click} style={{ cursor: 'pointer' }}>
            <Medal t={t} id="slide" />
          </g>
        </motion.g>
        <Sparkles t={t} points={[[600, 400], [1320, 420], [560, 820], [1360, 860], [720, 220], [1200, 230]]} color="#fff3b0" size={36} />
      </svg>
      <Bouncy text="¡Sois superhéroes!" className="hl" style={{ top: 30, fontSize: 124 }} />
    </>
  )
}

// ---------------------------------------------------------------- ¡ADIÓS!
export function Adios() {
  const t = useClock()
  useOnMount(() => { bones(); sfx.tada() }, 400)
  const wave = (ph) => addPose(POSES.wave, { foreB: Math.sin(t * 7 + ph) * 28, y: -Math.abs(Math.sin(t * 3 + ph)) * 14, head: Math.sin(t * 2 + ph) * 5 })
  return (
    <div style={{ position: 'absolute', inset: 0 }} onClick={() => { bones({ origin: { x: Math.random() * 0.6 + 0.2, y: 0.3 } }); sfx.boing() }}>
      <svg className="full" viewBox="0 0 1920 1080">
        <FloatingBones t={t} opacity={0.12} />
        <g transform="translate(330 720) scale(0.75)"><Skeleton pose={wave(0)} /></g>
        <g transform="translate(760 720) scale(0.8)"><Kid pose={wave(0.8)} kid={KIDS.tech} expression="happy" /></g>
        <g transform="translate(1170 740) scale(0.68)"><Kid pose={wave(1.6)} kid={KIDS.vega} expression="happy" /></g>
        <g transform="translate(1560 740) scale(0.68)"><Kid pose={wave(2.4)} kid={KIDS.nico} expression="happy" /></g>
      </svg>
      <Bouncy text="¡Gracias!" className="hl-cyan" style={{ top: 30, fontSize: 170 }} />
      <Pop delay={1.2} className="subtitle" style={{ top: 230, fontSize: 70 }}>¡Hasta pronto!</Pop>
    </div>
  )
}
