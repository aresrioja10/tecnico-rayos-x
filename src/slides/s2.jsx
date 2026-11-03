import React, { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useClock, useSince, addPose, mixPose, prog, easeOut, easeInOut, easeOutBounce, clamp, lerp } from '../lib/anim.js'
import { Kid, Skeleton, POSES, KIDS, joints } from '../art/Figure.jsx'
import { HandSkin, HandXray } from '../art/Hand.jsx'
import { XrayMachine, Table, Monitor, CuteCamera, Polaroid } from '../art/Machine.jsx'
import { Outlined, CartoonBone } from '../art/prims.jsx'
import { Bouncy, Pop, Sparkles, useOnStep, useOnMount, useFlash, Star } from './ui.jsx'
import { sfx } from '../lib/sound.js'
import { burst } from '../lib/confetti.js'

// ---------------------------------------------------------------- FOTÓGRAFA DE HUESOS
function PhotoHand() { return <g transform="translate(70 6) scale(0.29)"><HandXray /></g> }
function PhotoSkull() {
  return (
    <g transform="translate(130 250) scale(1.15)" filter="url(#glow)">
      <Skeleton pose={POSES.stand} colors={{ bone: '#eef8ff', outline: 'rgba(170,215,255,0.5)', ow: 1.5, socket: '#0a1630', eyes: false }} />
    </g>
  )
}
function PhotoLeg() {
  return (
    <g filter="url(#glow)">
      <Outlined ow={0}>
        <CartoonBone a={[70, 50]} b={[190, 200]} w={26} k={17} fill="#eef8ff" />
      </Outlined>
    </g>
  )
}

const PHOTOS = [
  { C: PhotoHand, x: 1000, y: 230, r: -9 },
  { C: PhotoSkull, x: 1420, y: 300, r: 7 },
  { C: PhotoLeg, x: 1180, y: 600, r: -3 },
]

export function Fotografa({ step }) {
  const t = useClock()
  const since = useSince(step, t)
  const [flash, flashEl] = useFlash()
  const shoot = () => { sfx.clack(); flash() }
  useOnStep(step, 1, shoot); useOnStep(step, 2, shoot); useOnStep(step, 3, shoot)
  const flashAmt = step > 0 ? clamp(1 - since / 0.4) : 0
  const bob = Math.sin(t * 2.2) * 10
  return (
    <>
      <svg className="full" viewBox="0 0 1920 1080">
        <g transform={`translate(180 ${330 + bob}) scale(1.35) rotate(${step > 0 && since < 0.3 ? -4 : 0} 260 220)`}>
          <CuteCamera t={t} flash={flashAmt} />
        </g>
        {PHOTOS.slice(0, step).map((p, i) => {
          const C = p.C
          return (
            <motion.g key={i}
              initial={{ x: 400, y: 320, rotate: 0, scale: 0.2, opacity: 0 }}
              animate={{ x: p.x, y: p.y, rotate: p.r, scale: 1.05, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 90, damping: 13 }}>
              <Polaroid><C /></Polaroid>
            </motion.g>
          )
        })}
        {step === 0 && <Sparkles t={t} points={[[260, 330], [880, 360], [900, 820], [200, 780]]} color="#fff3b0" size={26} />}
      </svg>
      <Bouncy text="¡Fotógrafa de huesos!" style={{ top: 40, fontSize: 124 }} className="hl" />
      {flashEl}
    </>
  )
}

// ---------------------------------------------------------------- EN EL PATIO
function Playground({ t }) {
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill="url(#sky)" />
      <g transform={`translate(1700 170) rotate(${t * 12})`}>
        {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-8} y={-150} width={16} height={46} rx={8} fill="#ffd23f" transform={`rotate(${i * 30})`} />)}
      </g>
      <circle cx={1700} cy={170} r={86} fill="#ffd23f" stroke="#f0a800" strokeWidth={8} />
      <path d="M 1668 180 Q 1700 210 1732 180" stroke="#c97a00" strokeWidth={8} fill="none" strokeLinecap="round" />
      <circle cx={1672} cy={150} r={9} fill="#c97a00" /><circle cx={1728} cy={150} r={9} fill="#c97a00" />
      {[[200, 160, 1], [760, 110, 0.8], [1250, 230, 0.9]].map(([x, y, s], i) => {
        const xx = ((x + t * (18 + i * 6)) % 2200) - 140
        return (
          <g key={i} transform={`translate(${xx} ${y}) scale(${s})`} fill="#fff">
            <circle cx={0} cy={0} r={52} /><circle cx={60} cy={-22} r={66} /><circle cx={130} cy={0} r={52} /><rect x={0} y={0} width={130} height={52} />
          </g>
        )
      })}
      <path d="M 0 840 Q 480 790 960 830 T 1920 820 L 1920 1080 L 0 1080 Z" fill="#7cd957" />
      <path d="M 0 900 Q 480 860 960 900 T 1920 890 L 1920 1080 L 0 1080 Z" fill="#62c043" />
      <g transform="translate(150 840)">
        <rect x={-26} y={-260} width={52} height={270} rx={14} fill="#a0663a" stroke="#5e3a1d" strokeWidth={6} />
        <circle cx={-70} cy={-300} r={100} fill="#3fb52a" stroke="#23751a" strokeWidth={6} />
        <circle cx={60} cy={-320} r={110} fill="#3fb52a" stroke="#23751a" strokeWidth={6} />
        <circle cx={-10} cy={-410} r={110} fill="#4fc63a" stroke="#23751a" strokeWidth={6} />
        <circle cx={-50} cy={-330} r={14} fill="#ff4d5e" /><circle cx={40} cy={-400} r={14} fill="#ff4d5e" /><circle cx={80} cy={-300} r={14} fill="#ff4d5e" />
      </g>
      <g transform="translate(1500 860)" stroke="#24324d" strokeWidth={6}>
        <rect x={0} y={-330} width={16} height={330} fill="#3fa7ff" />
        <rect x={90} y={-330} width={16} height={330} fill="#3fa7ff" />
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={10} y={-60 - i * 60} width={86} height={12} fill="#ffd23f" />)}
        <rect x={-10} y={-350} width={130} height={26} rx={8} fill="#ff5fa2" />
        <path d="M 110 -340 Q 220 -320 260 -120 Q 280 -20 380 -10 L 380 20 Q 250 20 230 -110 Q 200 -300 110 -300 Z" fill="#ff8c42" />
      </g>
      {[[420, 950], [700, 990], [1120, 960], [1360, 1010], [1800, 960]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          {[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={Math.cos(a * Math.PI / 180) * 14} cy={Math.sin(a * Math.PI / 180) * 14} r={11} fill={['#fff', '#ffd23f', '#ff8fa3'][i % 3]} />)}
          <circle r={9} fill="#ff8c42" />
        </g>
      ))}
    </g>
  )
}

const SIT = { x: 0, y: 150, torso: 0, head: -6, armA: 28, foreA: -105, armB: -12, foreB: 62, thighA: 72, shinA: -142, thighB: -72, shinB: 142 }

export function Patio({ step }) {
  const t = useClock()
  const since = useSince(step, t)
  const xRef = useRef(960)
  const ph = t * 9
  const run = { x: 0, y: -Math.abs(Math.sin(ph)) * 18, torso: Math.sin(ph) * 4, head: 0, armA: 20 + Math.sin(ph) * 35, foreA: -30, armB: -20 + Math.sin(ph) * 35, foreB: 30, thighA: Math.sin(ph) * 28, shinA: -Math.max(0, -Math.sin(ph)) * 40, thighB: -Math.sin(ph) * 28, shinB: Math.max(0, Math.sin(ph)) * 40 }
  if (step === 0) xRef.current = 960 + 430 * Math.sin(t * 0.8)
  const x = xRef.current
  let pose = run, fall = 0, expression = 'happy'
  if (step >= 1) {
    const s = step === 1 ? since : 10
    fall = s < 0.45 ? easeOutBounce(clamp(s / 0.45)) * 80 : s < 1.1 ? 80 : lerp(80, 0, easeInOut(prog(s, 1.1, 0.5)))
    pose = s < 1.1 ? mixPose(run, POSES.stand, 0.5) : SIT
    if (s >= 1.1) pose = addPose(SIT, { torso: Math.sin(t * 9) * 1.5 })
    expression = s < 0.4 ? 'wow' : 'ouch'
  }
  useOnStep(step, 1, () => { setTimeout(() => sfx.thud(), 320); setTimeout(() => sfx.ouch(), 650) })
  useOnStep(step, 2, () => sfx.scan())
  const footY = 640 + 260 * 0.85
  const j = joints(SIT)
  const armC = [x + ((j.eB[0] + j.wB[0]) / 2) * 0.85, 640 + ((j.eB[1] + j.wB[1]) / 2) * 0.85]
  const lensR = step >= 2 ? lerp(0, 190, easeOut(prog(since, 0, 0.5))) : 0
  const pulse = 0.5 + Math.sin(t * 8) * 0.5
  return (
    <>
      <svg className="full" viewBox="0 0 1920 1080">
        <Playground t={t} />
        <ellipse cx={x} cy={footY + 6} rx={140} ry={20} fill="#000" opacity={0.15} />
        <g transform={`rotate(${fall} ${x + 40} ${footY})`}>
          <g transform={`translate(${x} 640) scale(0.85)`}>
            <Kid pose={pose} kid={KIDS.leo} expression={expression} />
          </g>
        </g>
        {step >= 1 && since > 1.1 && step < 2 && (
          <circle cx={armC[0]} cy={armC[1]} r={70 + pulse * 14} fill="none" stroke="#ff3b3b" strokeWidth={10} opacity={0.4 + pulse * 0.5} />
        )}
        {step >= 2 && (
          <g>
            <defs><clipPath id="patio-lens"><circle cx={armC[0]} cy={armC[1]} r={lensR} /></clipPath></defs>
            <g clipPath="url(#patio-lens)">
              <rect x={0} y={0} width={1920} height={1080} fill="url(#film)" />
              <g transform={`translate(${x} 640) scale(0.85)`}><Kid pose={SIT} kid={KIDS.leo} xray /></g>
            </g>
            <circle cx={armC[0]} cy={armC[1]} r={lensR} fill="none" stroke="#3fe0ff" strokeWidth={12} filter="url(#glowBig)" />
            <circle cx={armC[0]} cy={armC[1]} r={lensR} fill="none" stroke="#fff" strokeWidth={5} />
          </g>
        )}
      </svg>
      {step >= 1 && since > 0.5 && step < 2 && (
        <Pop className="bubble" style={{ left: x - 330, top: 250, fontSize: 90, color: '#e8304a' }}>¡Ay!</Pop>
      )}
      <AnimatePresence mode="wait">
        {step === 0 && <Bouncy key="a" text="¡A jugar al patio!" style={{ top: 40, fontSize: 110, color: '#1b2b4a', textShadow: '0 5px 0 rgba(255,255,255,0.6)' }} />}
        {step === 2 && <Bouncy key="b" text="¿Cómo está el hueso?" style={{ top: 40, fontSize: 110, color: '#1b2b4a', textShadow: '0 5px 0 rgba(255,255,255,0.6)' }} />}
      </AnimatePresence>
    </>
  )
}

// ---------------------------------------------------------------- LA CÁMARA GIGANTE Y MÁGICA
const BADGES = [
  { text: '¡No hace daño!', icon: 'tirita', color: '#ffd23f' },
  { text: '¡No toca!', icon: 'mano', color: '#3fe0ff' },
  { text: '¡No pincha!', icon: 'jeringa', color: '#ff8fa3' },
]

function BadgeIcon({ kind }) {
  return (
    <g>
      <circle cx={0} cy={0} r={70} fill="#fff" />
      {kind === 'tirita' && <g transform="rotate(-35)">
        <rect x={-58} y={-22} width={116} height={44} rx={22} fill="#f6c39c" stroke="#b9744f" strokeWidth={5} />
        <rect x={-20} y={-22} width={40} height={44} fill="#ffe1d6" stroke="#b9744f" strokeWidth={4} />
        {[-40, 30].map((x) => [[-6, -8], [4, 6]].map(([dx, dy], k) => <circle key={x + '' + k} cx={x + dx} cy={dy} r={3} fill="#b9744f" />))}
      </g>}
      {kind === 'mano' && <g transform="translate(-24 -36) scale(0.1)"><HandSkin /></g>}
      {kind === 'jeringa' && <g transform="rotate(-40)" stroke="#24324d" strokeWidth={5} strokeLinejoin="round">
        <rect x={-38} y={-14} width={64} height={28} rx={6} fill="#bfe6ff" />
        <rect x={-38} y={-14} width={30} height={28} fill="#ff8fa3" />
        <line x1={-38} y1={0} x2={-60} y2={0} />
        <line x1={-60} y1={-14} x2={-60} y2={14} />
        <line x1={26} y1={0} x2={56} y2={0} strokeWidth={4} />
      </g>}
      <circle cx={0} cy={0} r={62} fill="none" stroke="#e8304a" strokeWidth={13} />
      <line x1={-44} y1={-44} x2={44} y2={44} stroke="#e8304a" strokeWidth={13} strokeLinecap="round" />
    </g>
  )
}

function ArmOnTable() {
  return (
    <g transform="translate(410 792) rotate(90) scale(0.4) translate(-300 -470)">
      <HandSkin />
      <rect x={196} y={770} width={220} height={120} rx={30} fill="#3fa7ff" stroke="#24324d" strokeWidth={14} />
    </g>
  )
}

export function CamaraMagica({ step }) {
  const t = useClock()
  const [clackAt, setClackAt] = useState(null)
  const [flash, flashEl] = useFlash()
  const clack = () => {
    setClackAt(t); sfx.clack(); flash()
    setTimeout(() => sfx.magic(), 700)
    setTimeout(() => burst(0.75, 0.4, { particleCount: 50 }), 700)
  }
  useOnStep(step, 1, () => sfx.pop()); useOnStep(step, 2, () => sfx.pop()); useOnStep(step, 3, () => sfx.pop())
  useOnStep(step, 4, clack)
  const ct = clackAt == null ? 99 : t - clackAt
  const beam = step >= 4 && ct < 1.1 ? (ct < 0.9 ? 1 : 1 - (ct - 0.9) / 0.2) * (0.75 + Math.sin(t * 40) * 0.25) : 0
  const reveal = step >= 4 ? easeInOut(prog(ct, 0.5, 1.2)) : 0
  return (
    <>
      <svg className="full" viewBox="0 0 1920 1080">
        <g transform="translate(150 140)"><XrayMachine t={t} beam={beam} mood={beam > 0 ? 'wow' : 'smile'} look={step >= 4 ? 1 : 0} /></g>
        <g transform="translate(50 840)"><Table /></g>
        <ArmOnTable />
        {step >= 4 && (
          <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 140, damping: 14 }}>
            <g transform="translate(1040 250) scale(1.25)">
              <Monitor glow={reveal}>
                <g opacity={reveal} style={{ filter: reveal < 0.95 ? `blur(${(1 - reveal) * 8}px)` : 'none' }}>
                  <g transform="translate(260 160) rotate(90) scale(0.4) translate(-300 -470)"><HandXray /></g>
                </g>
              </Monitor>
            </g>
            {reveal > 0.9 && <Sparkles t={t} points={[[1050, 260], [1800, 240], [1820, 700], [1020, 720]]} color="#bff6ff" size={34} />}
          </motion.g>
        )}
        {step >= 1 && step < 4 && BADGES.slice(0, step).map((b, i) => (
          <motion.g key={i} initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 160, damping: 15 }}>
            <rect x={940} y={250 + i * 250} width={900} height={190} rx={95} fill={b.color} />
            <g transform={`translate(${1040} ${345 + i * 250})`}><BadgeIcon kind={b.icon} /></g>
            <text x={1150} y={372 + i * 250} fontSize={84} fontWeight={700} fill="#1b2b4a" style={{ fontFamily: 'var(--font)' }}>{b.text}</text>
          </motion.g>
        ))}
      </svg>
      <Bouncy text={step >= 4 ? '¡Clack! ¡Magia!' : '¡Una cámara gigante!'} key={step >= 4 ? 'b' : 'a'} style={{ top: 30, fontSize: 116 }} className={step >= 4 ? 'hl' : ''} />
      {step >= 4 && ct > 1.4 && (
        <Pop style={{ position: 'absolute', left: 1300, top: 880 }}>
          <button className="big-btn" style={{ position: 'static' }} onClick={clack}>¡CLACK!</button>
        </Pop>
      )}
      {flashEl}
    </>
  )
}
