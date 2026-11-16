import React, { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useClock, useSince, addPose, prog, easeOut, easeInOut, clamp, lerp } from '../lib/anim.js'
import { Kid, POSES, KIDS } from '../art/Figure.jsx'
import { HandSkin, HandXray, FINGERS } from '../art/Hand.jsx'
import { XrayMachine, Table, CuteCamera, Lightbox } from '../art/Machine.jsx'
import { Bouncy, Pop, Sparkles, Sunburst, Star, useOnStep, useOnMount, useFlash, svgPoint } from './ui.jsx'
import { BadgeIcon } from './s2.jsx'
import { RaisedArm } from './s5.jsx'
import { sfx } from '../lib/sound.js'
import { burst, party } from '../lib/confetti.js'

// =====================================================================
// 1. ¿QUÉ ES UN TÉCNICO DE RAYOS?  La cámara hace ¡clack! y se ve el niño por dentro.
// =====================================================================
const Q = { kx: 1340, ky: 700, ks: 0.95, fx: 1070, fy: 250, fw: 540, fh: 780 }

function Brackets({ x, y, w, h, color = '#ffd23f', len = 80, sw = 14, opacity = 1 }) {
  const c = [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]
  return (
    <g opacity={opacity}>
      {c.map(([cx, cy, sx, sy], i) => (
        <path key={i} d={`M ${cx} ${cy + sy * len} L ${cx} ${cy} L ${cx + sx * len} ${cy}`} stroke={color} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </g>
  )
}

export function QueEs({ step }) {
  const t = useClock()
  const since = useSince(step, t)
  const [flash, flashEl] = useFlash()
  useOnMount(() => sfx.drum(5), 300)
  useOnStep(step, 1, () => {
    sfx.clack(); flash()
    setTimeout(() => sfx.scan(), 250)
    setTimeout(() => { sfx.tada(); burst(0.7, 0.45, { particleCount: 70 }) }, 1400)
  })
  const scanK = step >= 1 ? easeInOut(prog(since, 0.3, 1.0)) : 0
  const bar = Q.fx + Q.fw * scanK
  const pose = addPose(POSES.wave, { foreB: Math.sin(t * 7) * 28, head: Math.sin(t * 2) * 5, y: Math.sin(t * 2.4) * 4 })
  const flashAmt = step >= 1 ? clamp(1 - since / 0.4) : 0
  const cone = step >= 1 ? clamp(1 - since / 0.9) : 0
  const bob = Math.sin(t * 2.2) * 8
  const lens = [140 + 260 * 1.05, 360 + bob + 226 * 1.05]
  const nombre = 'Bea'
  return (
    <>
      <svg className="full" viewBox="0 0 1920 1080">
        <Sunburst t={t} cx={Q.kx} cy={620} color="#3fe0ff" opacity={0.07} />
        {/* trípode */}
        <g stroke="#24324d" strokeWidth={14} strokeLinecap="round">
          <line x1={lens[0]} y1={740} x2={300} y2={1010} />
          <line x1={lens[0]} y1={740} x2={520} y2={1010} />
          <line x1={lens[0]} y1={740} x2={lens[0]} y2={1020} />
        </g>
        <rect x={lens[0] - 60} y={720 + bob * 0.3} width={120} height={36} rx={12} fill="#4a5d80" stroke="#24324d" strokeWidth={6} />
        {cone > 0 && <polygon points={`${lens[0]},${lens[1] - 40} ${lens[0]},${lens[1] + 40} ${Q.fx},${Q.fy + Q.fh} ${Q.fx},${Q.fy}`} fill="#fff6a8" opacity={cone * 0.35} />}
        <g transform={`translate(140 ${360 + bob}) scale(1.05) rotate(${step >= 1 && since < 0.3 ? -4 : 0} 260 220)`}>
          <CuteCamera t={t} flash={flashAmt} />
        </g>
        {/* el niño por fuera */}
        <g transform={`translate(${Q.kx} ${Q.ky}) scale(${Q.ks})`}><Kid pose={pose} kid={KIDS.leo} expression={step >= 1 ? 'happy' : 'smile'} /></g>
        {/* y por dentro: la foto mágica */}
        {step >= 1 && (
          <g>
            <defs><clipPath id="q-scan"><rect x={Q.fx} y={Q.fy} width={bar - Q.fx} height={Q.fh} rx={30} /></clipPath></defs>
            <g clipPath="url(#q-scan)">
              <rect x={Q.fx} y={Q.fy} width={Q.fw} height={Q.fh} rx={30} fill="url(#film)" />
              <g transform={`translate(${Q.kx} ${Q.ky}) scale(${Q.ks})`}><Kid pose={pose} kid={KIDS.leo} xray /></g>
            </g>
            {scanK < 1 && <>
              <rect x={bar - 6} y={Q.fy} width={12} height={Q.fh} fill="#7ff0ff" filter="url(#glowBig)" />
              <rect x={bar - 2} y={Q.fy} width={4} height={Q.fh} fill="#fff" />
            </>}
            {scanK >= 1 && <rect x={Q.fx} y={Q.fy} width={Q.fw} height={Q.fh} rx={30} fill="none" stroke="#3fe0ff" strokeWidth={8} opacity={0.6 + Math.sin(t * 4) * 0.2} filter="url(#glowBig)" />}
          </g>
        )}
        <Brackets x={Q.fx} y={Q.fy} w={Q.fw} h={Q.fh} opacity={step >= 1 ? 1 : 0.35 + Math.sin(t * 3) * 0.15} />
        {step === 0 && [[760, 420], [880, 760], [1720, 330], [1760, 820]].map(([x, y], i) => (
          <text key={i} x={x} y={y} fontSize={130} fontWeight={700} textAnchor="middle" fill={['#ffd23f', '#3fe0ff', '#ff5fa2', '#7cd957'][i]} opacity={0.85}
            transform={`rotate(${Math.sin(t * 2 + i) * 14} ${x} ${y})`} style={{ fontFamily: 'var(--font)' }}>?</text>
        ))}
        {step >= 1 && scanK >= 1 && <Sparkles t={t} points={[[Q.fx - 30, 300], [Q.fx + Q.fw + 30, 380], [Q.fx + Q.fw + 20, 900], [Q.fx - 20, 960]]} color="#bff6ff" size={30} />}
      </svg>
      <AnimatePresence mode="wait">
        {step === 0
          ? <Bouncy key="a" text="¿Qué es un técnico de rayos?" style={{ top: 34, fontSize: 104 }} />
          : <Bouncy key="b" text="¡Una fotógrafa de huesos!" className="hl-cyan" style={{ top: 34, fontSize: 112 }} />}
      </AnimatePresence>
      {step === 0 && (
        <Pop delay={0.5} className="chip-label" style={{ left: 60, top: 230, background: '#ffd23f', fontSize: 52 }}>¡Hola! Soy {nombre}</Pop>
      )}
      {flashEl}
    </>
  )
}

// =====================================================================
// 2. LA LUPA MÁGICA: PULMONES Y TRIPA (la mano usa la diapositiva Lupa de s1)
// =====================================================================
const BODY_POSE = { ...POSES.stand, armA: 18, armB: -18 }

function Lungs({ t }) {
  const b = 1 + Math.sin(t * 2.2) * 0.05
  const beat = 1 + Math.max(0, Math.sin(t * 7)) * 0.16
  return (
    <g>
      <g stroke="#ffe3f0" strokeWidth={2.5} fill="#ff8cbc" opacity={0.72}>
        <g transform={`translate(0 -112) scale(${b}) translate(0 112)`}>
          <path d="M -12 -166 C -42 -172, -68 -150, -70 -110 C -72 -82, -66 -60, -48 -58 C -30 -56, -14 -64, -12 -80 Z" />
          <path d="M 12 -166 C 42 -172, 68 -150, 70 -110 C 72 -82, 66 -60, 48 -58 C 36 -56, 28 -62, 26 -74 C 22 -88, 14 -96, 12 -112 Z" />
        </g>
      </g>
      <g stroke="#ffd6ea" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.75}>
        <path d="M 0 -214 L 0 -160 M 0 -160 Q -10 -150 -22 -138 M 0 -160 Q 10 -150 22 -138" />
      </g>
      <g transform={`translate(20 -98) scale(${2.4 * beat})`}>
        <path d="M 0 8 C -16 -4, -12 -18, 0 -9 C 12 -18, 16 -4, 0 8 Z" fill="#ff4d6d" stroke="#ffd6ea" strokeWidth={1.2} />
      </g>
    </g>
  )
}

const FOOD_PATH = 'M 0 -205 L 4 -150 Q 10 -110 18 -92 Q 34 -84 40 -74 Q 38 -60 22 -56 Q 0 -50 -30 -30 Q 0 -36 30 -28 Q 40 -22 30 -16 Q 0 -10 -30 -16 Q -40 -10 -30 -4 Q 0 2 30 -4 Q 40 2 30 8 Q 0 14 -28 8'

function Tummy({ t }) {
  const off = -((t * 170) % 1000)
  return (
    <g transform="translate(0 -40) scale(1.2) translate(0 40)">
      <path d="M -48 22 L -48 -36 Q -48 -46 -38 -46 L 38 -46 Q 48 -46 48 -36 L 48 22" stroke="#f7a6c0" strokeWidth={15} fill="none" strokeLinecap="round" opacity={0.8} />
      <path d="M 6 -150 Q 10 -110 18 -92" stroke="#ffc2d4" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.85} />
      <ellipse cx={30} cy={-74} rx={30} ry={20} transform="rotate(-18 30 -74)" fill="#ffb3c7" stroke="#ffe0ea" strokeWidth={2} opacity={0.9} />
      <path d="M -30 -30 Q 0 -36 30 -28 Q 40 -22 30 -16 Q 0 -10 -30 -16 Q -40 -10 -30 -4 Q 0 2 30 -4 Q 40 2 30 8 Q 0 14 -28 8" stroke="#ffc2d4" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />
      <path d={FOOD_PATH} pathLength={1000} stroke="#ffd23f" strokeWidth={9} fill="none" strokeLinecap="round" strokeDasharray="26 974" strokeDashoffset={off} filter="url(#glow)" />
    </g>
  )
}

function LupaCuerpo({ step, kid, Organs, BK, focus, amp, titles, chip, chipColor = '#ffd23f' }) {
  const t = useClock()
  const svgRef = useRef(null)
  const [ptr, setPtr] = useState(null)
  const lastMove = useRef(-10)
  const since = useSince(step, t)
  const [flash, flashEl] = useFlash()
  useOnStep(step, 1, () => { sfx.magic(); flash() })
  const center = [BK.x, BK.y + focus * BK.s]
  const auto = [center[0] + amp[0] * Math.sin(t * 0.9), center[1] + amp[1] * Math.sin(t * 1.3 + 1)]
  const target = !ptr || t - lastMove.current > 2.5 ? auto : ptr
  const posRef = useRef(target)
  posRef.current = [lerp(posRef.current[0], target[0], 0.18), lerp(posRef.current[1], target[1], 0.18)]
  const [lx, ly] = posRef.current
  const R = step >= 1 ? lerp(180, 1400, easeInOut(prog(since, 0, 0.9))) : 180
  const pose = addPose(BODY_POSE, { y: Math.sin(t * 2.2) * 2 })
  const onMove = (e) => { const p = svgPoint(svgRef.current, e.clientX, e.clientY); if (p) { setPtr(p); lastMove.current = t } }
  const body = (xray) => (
    <g transform={`translate(${BK.x} ${BK.y}) scale(${BK.s})`}>
      <Kid pose={pose} kid={kid} expression="smile" xray={xray} organs={xray ? <Organs t={t} /> : null} />
    </g>
  )
  return (
    <>
      <svg ref={svgRef} className="full" viewBox="0 0 1920 1080" onPointerMove={onMove}>
        <defs><clipPath id="lupa-cuerpo"><circle cx={lx} cy={ly} r={R} /></clipPath></defs>
        {body(false)}
        <g clipPath="url(#lupa-cuerpo)">
          <rect x={0} y={0} width={1920} height={1080} fill="url(#film)" />
          {body(true)}
        </g>
        {step === 0 && (
          <g>
            <circle cx={lx} cy={ly} r={R} fill="none" stroke="#3fe0ff" strokeWidth={14} filter="url(#glowBig)" />
            <circle cx={lx} cy={ly} r={R} fill="none" stroke="#e9fbff" strokeWidth={5} />
            {[0, 90, 180, 270].map((a) => <line key={a} x1={lx} y1={ly - R + 6} x2={lx} y2={ly - R + 36} stroke="#e9fbff" strokeWidth={6} strokeLinecap="round" transform={`rotate(${a + t * 30} ${lx} ${ly})`} />)}
            <line x1={lx + R * 0.72} y1={ly + R * 0.72} x2={lx + R * 1.2} y2={ly + R * 1.2} stroke="#ffd23f" strokeWidth={34} strokeLinecap="round" />
          </g>
        )}
      </svg>
      <AnimatePresence mode="wait">
        {step === 0
          ? <Bouncy key="a" text={titles[0]} style={{ top: 30, fontSize: 104 }} />
          : <Bouncy key="b" text={titles[1]} className="hl-pink" style={{ top: 30, fontSize: 124 }} />}
      </AnimatePresence>
      {step >= 1 && chip && <Pop delay={0.9} className="chip-label" style={{ left: 70, top: 470, background: chipColor, fontSize: 56, rotate: '-4deg' }}>{chip}</Pop>}
      {flashEl}
    </>
  )
}

export const LupaPulmones = (p) => (
  <LupaCuerpo {...p} kid={KIDS.nico} Organs={Lungs} BK={{ x: 960, y: 960, s: 2.0 }} focus={-110} amp={[150, 70]}
    titles={['¿Y en el pecho?', '¡Los pulmones!']} chip="¡Se hinchan al respirar!" />
)
export const LupaTripa = (p) => (
  <LupaCuerpo {...p} kid={KIDS.sol} Organs={Tummy} BK={{ x: 960, y: 880, s: 1.8 }} focus={-45} amp={[120, 50]}
    titles={['¿Y aquí?', '¡La tripa!']} />
)

// =====================================================================
// 4. LA CÁMARA GIGANTE (sin textos): placa de la mano. El niño está sentado,
//    apoya la mano sobre la placa, ¡clack!, y la radiografía de la mano va al negatoscopio.
// =====================================================================
const CG = { tx: 300, ty: 662, tsx: 0.85, tsy: 1.4, kx: 954, ky: 848, ks: 1, ms: 0.9, lb: [1300, 190, 540, 700] }
CG.top = CG.ty + 20 * CG.tsy // superficie de la mesa
CG.hand = [CG.kx - 291 * CG.ks, CG.top - 7] // donde queda la placa, debajo de la mano
CG.mx = CG.hand[0] - 250 * CG.ms
CG.my = CG.top - 720 * CG.ms
const LB_C = [CG.lb[0] + CG.lb[2] / 2, CG.lb[1] + CG.lb[3] / 2]
const SIT = { ...POSES.stand, armA: 90, foreA: 0, armB: -14, foreB: -4, thighA: 90, shinA: -90, thighB: 87, shinB: -85 }

// La placa: antes de la foto está en blanco (un chasis gris); después lleva la radiografía de la mano.
function Placa({ fy = 1, exposed }) {
  const thin = fy < 0.3
  return (
    <g>
      <rect x={-260} y={-330} width={520} height={660} rx={18} fill={exposed ? 'url(#film)' : '#3a4a6b'} stroke={exposed ? '#9fd4ff' : '#c9d6ea'} strokeWidth={thin ? 30 : exposed ? 6 : 12} />
      {!thin && !exposed && <>
        <rect x={-210} y={-280} width={420} height={560} rx={12} fill="#24304a" />
        <rect x={-90} y={-318} width={180} height={26} rx={10} fill="#c9d6ea" />
      </>}
      {!thin && exposed && <g transform="translate(-232 -317) scale(0.775)"><HandXray /></g>}
    </g>
  )
}
const INSERT = 2.3 // segundos: aparece la placa, se pone en la mesa y el niño apoya la mano

function Taburete({ x, y, floor }) {
  return (
    <g stroke="#24324d" strokeWidth={6} strokeLinejoin="round">
      <rect x={x - 22} y={y + 18} width={18} height={floor - y - 18} rx={6} fill="#8fa0bf" transform={`rotate(6 ${x - 13} ${y + 18})`} />
      <rect x={x + 96} y={y + 18} width={18} height={floor - y - 18} rx={6} fill="#8fa0bf" transform={`rotate(-6 ${x + 105} ${y + 18})`} />
      <rect x={x - 40} y={y} width={170} height={30} rx={14} fill="#ff8a5c" />
    </g>
  )
}

export function CamaraGigante({ step }) {
  const t = useClock()
  const [run, setRun] = useState({ insertAt: 0.4, clackAt: null })
  const [flash, flashEl] = useFlash()
  const fire = (reinsert) => {
    const insertAt = reinsert ? t : run.insertAt
    const delay = Math.max(0, insertAt + INSERT - t)
    setRun({ insertAt, clackAt: t + delay })
    if (reinsert) setTimeout(() => sfx.swoosh(), 50)
    setTimeout(() => { sfx.clack(); flash() }, delay * 1000)
    setTimeout(() => sfx.whoosh(), (delay + 1.5) * 1000)
    setTimeout(() => { sfx.magic(); burst(0.82, 0.5, { particleCount: 70 }) }, (delay + 2.5) * 1000)
  }
  useOnStep(step, 1, () => fire(false))
  useOnMount(() => sfx.swoosh(), 450)
  const ct = run.clackAt == null ? -1 : t - run.clackAt
  const it = t - run.insertAt
  const before = ct < 0 || run.clackAt == null
  const beam = ct >= 0 && ct < 1.0 ? (ct < 0.8 ? 1 : 1 - (ct - 0.8) / 0.2) * (0.75 + Math.sin(t * 40) * 0.25) : 0
  // la placa
  let px, py, s = 0.42, fy = 0.09, onTable = true
  if (before) {
    const k1 = easeOut(prog(it, 0, 0.5)), k2 = easeInOut(prog(it, 0.9, 0.7))
    px = lerp(1160, CG.hand[0], k2); py = lerp(320, CG.hand[1], k2) - Math.sin(Math.PI * k2) * 120
    s = lerp(0.45 * k1, 0.42, k2); fy = lerp(1, 0.09, k2)
  } else if (ct < 1.6) { px = CG.hand[0]; py = CG.hand[1] }
  else {
    const k = easeInOut(clamp((ct - 1.6) / 0.9)); onTable = false
    px = lerp(CG.hand[0], LB_C[0], k); py = lerp(CG.hand[1], LB_C[1], k) - Math.sin(Math.PI * k) * 220
    s = lerp(0.42, 1, k); fy = lerp(0.09, 1, k)
  }
  // el brazo: levantado, se apoya en la placa para la foto y luego saluda
  const down = before ? easeInOut(prog(it, 1.6, 0.6)) : ct < 1.1 ? 1 : 1 - easeInOut(clamp((ct - 1.1) / 0.5))
  const wave = (1 - down) * Math.sin(t * 6) * 14
  const pose = addPose(SIT, { armA: (1 - down) * 60, foreA: (1 - down) * 20 + wave, y: Math.sin(t * 2.2) * 2 * (1 - down) })
  const arrived = ct >= 2.5
  const busy = (run.clackAt != null && ct < 2.6) || it < INSERT
  const plate = <g transform={`translate(${px} ${py}) scale(${s} ${s * fy})`}><Placa fy={fy} exposed={ct >= 0.2} /></g>
  const clackK = ct >= 0 && ct < 0.9 ? ct : null
  const floor = CG.ky + 135 * CG.ks
  return (
    <>
      <svg className="full" viewBox="0 0 1920 1080">
        <g transform={`translate(${CG.lb[0]} ${CG.lb[1]})`}><Lightbox w={CG.lb[2]} h={CG.lb[3]} on={arrived ? 1 : 0.25} /></g>
        {arrived && <Sparkles t={t} points={[[1290, 210], [1850, 250], [1860, 860], [1280, 880]]} color="#bff6ff" size={34} />}
        <g transform={`translate(${CG.tx} ${CG.ty}) scale(${CG.tsx} ${CG.tsy})`}><Table /></g>
        <Taburete x={CG.kx - 60 * CG.ks} y={CG.ky + 24 * CG.ks} floor={floor} />
        {onTable && plate}
        <g transform={`translate(${CG.kx} ${CG.ky}) scale(${CG.ks})`}><Kid pose={pose} kid={KIDS.leo} expression={beam > 0 ? 'wow' : 'happy'} /></g>
        <g transform={`translate(${CG.mx} ${CG.my + (beam > 0 ? 14 : 0)}) scale(${CG.ms})`} onClick={() => !busy && fire(true)} style={{ cursor: 'pointer' }}>
          <XrayMachine t={t} beam={beam} mood={beam > 0 ? 'wow' : 'smile'} look={ct > 1 ? 1 : 0} />
        </g>
        {clackK != null && (
          <g transform={`translate(1090 250) scale(${easeOut(clamp(clackK / 0.25)) * (1 - clamp((clackK - 0.6) / 0.3))}) rotate(-8)`}>
            <Star x={0} y={0} r={190} fill="#ffd23f" stroke="#e8304a" />
            <text x={0} y={30} textAnchor="middle" fontSize={92} fontWeight={700} fill="#e8304a" style={{ fontFamily: 'var(--font)' }}>¡CLACK!</text>
          </g>
        )}
        {!onTable && plate}
      </svg>
      {step >= 1 && !busy && (
        <Pop style={{ position: 'absolute', left: 1110, top: 900 }}>
          <button className="big-btn" title="Otra foto" style={{ position: 'static', width: 120, height: 120, borderRadius: 999, padding: 0, fontSize: 60 }} onClick={() => fire(true)}>📸</button>
        </Pop>
      )}
      {flashEl}
    </>
  )
}

// =====================================================================
// 5. LUZ INVISIBLE MUY POTENTE + CHALECO PROTECTOR
// =====================================================================
const LZ = { mx: 700, my: 130, ms: 0.7, kx: 1098, ky: 790, ks: 0.85 }
const LZ_SRC = [LZ.mx + 250 * LZ.ms, LZ.my + 392 * LZ.ms]
const ARM_OUT = { ...POSES.stand, armA: 88, foreA: -4 }
// manos de la clase que se levantan para probarse el chaleco
const VOLUNTARIOS = [
  { x: 200, skin: '#f6c39c', sleeve: '#3fa7ff' }, { x: 500, skin: '#a8714d', sleeve: '#7cd957' }, { x: 770, skin: '#e7ae86', sleeve: '#ff5fa2' },
  { x: 1440, skin: '#f9d3b4', sleeve: '#ffd23f' }, { x: 1740, skin: '#c98e68', sleeve: '#3fe0ff' },
]

export function LuzChaleco({ step }) {
  const t = useClock()
  const since = useSince(step, t)
  const hits = useRef({})
  useOnMount(() => sfx.magic(), 300)
  useOnStep(step, 1, () => { sfx.whoosh(); setTimeout(() => sfx.clank(), 430) })
  useOnStep(step, 2, () => { sfx.sparkle(); setTimeout(() => burst(0.58, 0.45, { particleCount: 50 }), 300) })
  useOnStep(step, 3, () => sfx.tada())

  let drop = step === 0 ? null : 0
  let pose = addPose(ARM_OUT, { foreB: Math.sin(t * 2) * 3 })
  let expression = step === 0 ? 'wow' : 'smile'
  if (step === 1) {
    drop = lerp(1, 0, clamp(since / 0.45) ** 2)
    if (since > 0.45 && since < 1.3) {
      const k = Math.sin(Math.PI * clamp((since - 0.45) / 0.85))
      pose = addPose(ARM_OUT, { y: k * 40, thighA: k * 40, shinA: -k * 60, thighB: -k * 40, shinB: k * 60, armB: -k * 16 })
      expression = 'uf'
    } else if (since >= 1.3) expression = 'happy'
  }
  if (step >= 2) { drop = 0; expression = 'happy' }
  const handPt = [LZ.kx + (-66 - 196) * LZ.ks, LZ.ky - 176 * LZ.ks]

  const rays = []
  if (step === 2) {
    for (let k = 0; k < 3; k++) {
      const P = 1.5, ph = (since - 0.4 - k * 0.5) / P
      if (ph < 0) continue
      const n = Math.floor(ph), f = ph - n
      // la luz que rebota en la mano va hacia el cuerpo… y el chaleco la para
      const src = [handPt[0] + 24, handPt[1] + 30]
      const hit = [LZ.kx - 72 * LZ.ks, LZ.ky - 100 * LZ.ks + k * 45]
      const out = [handPt[0] - 140 + k * 100, 1150]
      const head = f < 0.5 ? [lerp(src[0], hit[0], f / 0.5), lerp(src[1], hit[1], f / 0.5)] : [lerp(hit[0], out[0], (f - 0.5) / 0.5), lerp(hit[1], out[1], (f - 0.5) / 0.5)]
      const from = f < 0.5 ? src : hit
      const dx = head[0] - from[0], dy = head[1] - from[1], L = Math.hypot(dx, dy) || 1
      const tail = [head[0] - (dx / L) * Math.min(90, L), head[1] - (dy / L) * Math.min(90, L)]
      rays.push({ head, tail, hitNow: f > 0.5 && f < 0.62, hit })
      const key = `${k}-${n}`
      if (f > 0.5 && !hits.current[key]) { hits.current[key] = true; sfx.zap() }
    }
  }
  // "luz invisible": ondas brillantes que salen de la máquina
  const waves = Array.from({ length: 5 }, (_, i) => {
    const r = ((t * 260 + i * 170) % 850) + 60
    return <circle key={i} cx={LZ_SRC[0]} cy={LZ_SRC[1]} r={r} fill="none" stroke="#fff6a8" strokeWidth={10} strokeDasharray="4 26" strokeLinecap="round" opacity={Math.max(0, 0.55 - r / 1500)} />
  })
  return (
    <>
      <svg className="full" viewBox="0 0 1920 1080">
        <defs><clipPath id="lz-waves"><polygon points={`${LZ_SRC[0] - 40},${LZ_SRC[1] - 20} ${LZ_SRC[0] + 40},${LZ_SRC[1] - 20} 1700,1080 ${LZ_SRC[0] - 640},1080`} /></clipPath></defs>
        <g clipPath="url(#lz-waves)">{waves}</g>
        <g transform={`translate(${LZ.mx} ${LZ.my}) scale(${LZ.ms})`}><XrayMachine t={t} beam={step === 2 ? 0.55 + Math.sin(t * 8) * 0.1 : 0} mood={step === 0 ? 'wow' : 'smile'} look={1} /></g>
        {step === 2 && <Brackets x={handPt[0] - 70} y={handPt[1] - 70} w={140} h={140} len={34} sw={9} />}
        <g transform={`translate(${LZ.kx} ${LZ.ky}) scale(${LZ.ks})`}>
          <Kid pose={pose} kid={KIDS.vega} expression={expression} vest={drop} />
        </g>
        {step === 0 && <Sparkles t={t} points={[[560, 640], [760, 860], [1350, 860], [620, 980]]} color="#fff6a8" size={28} />}
        {rays.map((r, i) => (
          <g key={i}>
            <line x1={r.tail[0]} y1={r.tail[1]} x2={r.head[0]} y2={r.head[1]} stroke="#fff27a" strokeWidth={16} strokeLinecap="round" filter="url(#glowBig)" />
            <line x1={r.tail[0]} y1={r.tail[1]} x2={r.head[0]} y2={r.head[1]} stroke="#fffbe0" strokeWidth={8} strokeLinecap="round" />
            {r.hitNow && <Star x={r.hit[0]} y={r.hit[1]} r={46} fill="#fff27a" stroke="#ffd23f" rot={t * 200} />}
          </g>
        ))}
        {step >= 3 && VOLUNTARIOS.map((a, i) => <RaisedArm key={i} {...a} k={easeOut(prog(since, 0.2 + i * 0.12, 0.6))} t={t} ph={i} />)}
      </svg>
      <AnimatePresence mode="wait">
        <Bouncy key={step} text={['¡Luz invisible muy potente!', '¡Un chaleco protector!', '¡Protege lo que no sale en la foto!', '¿Quién se lo quiere probar?'][Math.min(step, 3)]}
          className={step === 0 ? 'hl' : 'hl-purple'} stagger={0.03} style={{ top: 40, fontSize: step >= 2 ? 96 : 108 }} />
      </AnimatePresence>
      {step === 1 && since > 1.3 && <Pop className="bubble" style={{ left: 1230, top: 330, fontSize: 64 }}>¡Pesa un poco!</Pop>}
    </>
  )
}

// =====================================================================
// 6. NO DUELE Y ES MUY RÁPIDO… ¡QUIETO COMO UNA ESTATUA!
// =====================================================================
const STONE = { skin: '#d9dde6', hair: '#aab2c2', shirt: '#c5ccd9', pants: '#b0b8c8', shoes: '#9aa3b5', style: 'curly' }

function Stopwatch({ ang }) {
  return (
    <g>
      <rect x={-30} y={-250} width={60} height={50} rx={12} fill="#ff4d5e" stroke="#24324d" strokeWidth={10} />
      <circle r={210} fill="#fff" stroke="#24324d" strokeWidth={16} />
      <circle r={180} fill="#eaf6ff" />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-160} x2={0} y2={i % 3 ? -140 : -122} stroke="#24324d" strokeWidth={i % 3 ? 7 : 12} strokeLinecap="round" transform={`rotate(${i * 30})`} />)}
      <path d={`M 0 0 L 0 -160 A 160 160 0 ${ang > 180 ? 1 : 0} 1 ${Math.sin(ang * Math.PI / 180) * 160} ${-Math.cos(ang * Math.PI / 180) * 160} Z`} fill="#ffd23f" opacity={0.6} />
      <line x1={0} y1={20} x2={0} y2={-150} stroke="#e8304a" strokeWidth={12} strokeLinecap="round" transform={`rotate(${ang})`} />
      <circle r={18} fill="#24324d" />
    </g>
  )
}

export function NoDuele({ step }) {
  const t = useClock()
  const since = useSince(step, t)
  const [flash, flashEl] = useFlash()
  useOnMount(() => sfx.ding(2), 300)
  useOnStep(step, 1, () => { setTimeout(() => { sfx.clack(); flash() }, 450); setTimeout(() => sfx.tada(), 1000) })
  useOnStep(step, 2, () => { sfx.freeze(); setTimeout(() => burst(0.38, 0.6, { particleCount: 40, colors: ['#ffffff', '#c5ccd9', '#9be7ff'] }), 500) })
  const happy = addPose(POSES.hooray, { armA: Math.sin(t * 5) * 12, armB: -Math.sin(t * 5) * 12, y: -Math.abs(Math.sin(t * 3)) * 20 })
  const stoneK = step >= 2 ? easeInOut(prog(since, 0.2, 0.7)) : 0
  const pose = step >= 2 ? POSES.freeze : happy
  const ang = step === 1 ? lerp(0, 30, easeOut(prog(since, 0.1, 0.4))) : step > 1 ? 30 : 0
  const ped = step >= 2 ? easeOut(prog(since, 0, 0.4)) : 0
  const kx = 720, ky = 700 - ped * 10
  return (
    <>
      <svg className="full" viewBox="0 0 1920 1080">
        {step >= 2 && <Sunburst t={t} cx={kx} cy={600} color="#9be7ff" opacity={0.1} />}
        {ped > 0 && (
          <g transform={`translate(${kx} ${1080 - ped * 140})`}>
            <rect x={-200} y={-20} width={400} height={60} rx={10} fill="#c5ccd9" stroke="#24324d" strokeWidth={8} />
            <rect x={-160} y={36} width={320} height={130} fill="#d9dde6" stroke="#24324d" strokeWidth={8} />
          </g>
        )}
        <g transform={`translate(${kx} ${ky}) scale(0.95)`}>
          <g opacity={1 - stoneK}><Kid pose={pose} kid={KIDS.nico} expression={step >= 2 ? 'freeze' : 'happy'} /></g>
          {stoneK > 0 && <g opacity={stoneK}><Kid pose={pose} kid={STONE} expression="freeze" /></g>}
        </g>
        {step === 0 && [[480, 380], [960, 340], [520, 820], [950, 800]].map(([x, y], i) => (
          <path key={i} transform={`translate(${x} ${y + Math.sin(t * 3 + i) * 12}) scale(${1.4 + Math.sin(t * 4 + i) * 0.15})`} d="M 0 12 C -22 -4, -16 -26, 0 -13 C 16 -26, 22 -4, 0 12 Z" fill="#ff5fa2" />
        ))}
        <g transform="translate(1440 590)">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.g key="a" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 2.4, rotate: 0 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 13, delay: 0.3 }}>
                <BadgeIcon kind="tirita" />
              </motion.g>
            )}
            {step === 1 && (
              <motion.g key="b" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}>
                <Stopwatch ang={ang} />
              </motion.g>
            )}
            {step >= 2 && (
              <motion.g key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.3 }}>
                <circle r={190} fill="#9be7ff" opacity={0.25} />
                <text y={70} textAnchor="middle" fontSize={230}>🧊</text>
              </motion.g>
            )}
          </AnimatePresence>
        </g>
      </svg>
      <AnimatePresence mode="wait">
        <Bouncy key={step} text={['¡No duele!', '¡Y es muy rápido!', '¡Quieto como una estatua!'][Math.min(step, 2)]}
          className={['hl-pink', 'hl', 'hl-ice'][Math.min(step, 2)]} style={{ top: 40, fontSize: 120 }} />
      </AnimatePresence>
      {step === 1 && since > 1.0 && <Pop className="chip-label" style={{ left: 1300, top: 860, background: '#7cd957', fontSize: 60 }}>¡Ya está!</Pop>}
      {flashEl}
    </>
  )
}

// =====================================================================
// 7. ¿QUÉ VES EN ESTA RADIOGRAFÍA?  (las placas se enseñan de verdad)
// =====================================================================
export function QueVes({ step, setStep }) {
  const t = useClock()
  const since = useSince(step, t)
  useOnMount(() => sfx.drum(6), 300)
  useOnStep(step, 1, () => sfx.magic())
  const on = clamp(prog(t, 0.4, 0.2)) * (t < 0.9 && Math.sin(t * 60) > 0.3 ? 0.3 : 1)
  if (step >= 1) {
    const k = easeInOut(prog(since, 0, 0.6))
    return (
      <>
        <div style={{ position: 'absolute', inset: 0, background: '#f4fbff', opacity: k, boxShadow: 'inset 0 0 160px rgba(160,215,255,0.8)' }} onClick={() => setStep(0)} />
        {k < 1 && <svg className="full" viewBox="0 0 1920 1080" style={{ opacity: 1 - k }} />}
      </>
    )
  }
  const marks = [[700, 520], [960, 470], [1220, 540]]
  return (
    <>
      <svg className="full" viewBox="0 0 1920 1080">
        <g transform="translate(410 220)" onClick={() => { sfx.drum(4); burst(0.5, 0.55, { particleCount: 30 }) }} style={{ cursor: 'pointer' }}>
          <Lightbox w={1100} h={700} on={on}>
            <rect x={60} y={60} width={980} height={580} rx={18} fill="url(#film)" opacity={0.92} />
          </Lightbox>
          {[220, 880].map((x) => <rect key={x} x={x} y={-44} width={70} height={56} rx={12} fill="#8fa0bf" stroke="#24324d" strokeWidth={7} />)}
        </g>
        {marks.map(([x, y], i) => (
          <text key={i} x={x} y={y + 120 + Math.sin(t * 2.5 + i) * 18} fontSize={260} fontWeight={700} textAnchor="middle" fill={['#ffd23f', '#3fe0ff', '#ff5fa2'][i]} opacity={on}
            transform={`rotate(${Math.sin(t * 2 + i) * 10} ${x} ${y})`} style={{ fontFamily: 'var(--font)' }}>?</text>
        ))}
        <Sparkles t={t} points={[[380, 200], [1540, 220], [1560, 940], [360, 930]]} color="#ffd6ea" size={28} />
      </svg>
      <Bouncy text="¿Qué ves en esta radiografía?" className="hl-pink" style={{ top: 40, fontSize: 108 }} />
    </>
  )
}

// =====================================================================
// 8a. JUEGO: PUZZLE DE RADIOGRAFÍAS (desarmado: lo montan los peques en la mesa)
// =====================================================================
const PZ = { s: 1.3 }
// r: trozo del esqueleto (coordenadas del niño); at: dónde queda en la pantalla [x, y, giro]
const PIECES = [
  { id: 'cabeza', r: [-150, -395, 150, -200], at: [400, 420, -10] },
  { id: 'pecho', r: [-150, -200, 150, -40], at: [1520, 410, 8] },
  { id: 'tripa', r: [-45, -40, 45, 80], at: [960, 360, 10] },
  { id: 'piernas', r: [-150, 80, 150, 305], at: [980, 760, -4] },
  { id: 'manoA', r: [-150, -40, -45, 80], at: [380, 840, 14] },
  { id: 'manoB', r: [45, -40, 150, 80], at: [1560, 830, -12] },
]

function PuzzlePiece({ p }) {
  const [x0, y0, x1, y1] = p.r
  const pcx = (x0 + x1) / 2, pcy = (y0 + y1) / 2
  return (
    <g transform={`scale(${PZ.s}) translate(${-pcx} ${-pcy})`}>
      <defs><clipPath id={`pz-${p.id}`}><rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} rx={10} /></clipPath></defs>
      <g clipPath={`url(#pz-${p.id})`}>
        <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill="url(#film)" />
        <Kid pose={POSES.stand} kid={KIDS.leo} xray />
      </g>
      <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} rx={10} fill="none" stroke="#bfe6ff" strokeWidth={3} />
    </g>
  )
}

export function Puzzle() {
  const t = useClock()
  const [wig, setWig] = useState({})
  useOnMount(() => PIECES.forEach((_, i) => setTimeout(() => sfx.blip(i * 3), 900 + i * 150)), 0)
  const poke = (id) => { sfx.boing(); setWig((w) => ({ ...w, [id]: t })) }
  return (
    <>
      <svg className="full" viewBox="0 0 1920 1080">
        {PIECES.map((p, i) => {
          const [x, y, rot] = p.at
          const bob = Math.sin(t * 1.8 + i * 1.3) * 12
          const w = wig[p.id] != null ? t - wig[p.id] : 9
          const shake = w < 0.6 ? Math.sin(w * 40) * 10 * (1 - w / 0.6) : 0
          return (
            <motion.g key={p.id} initial={{ x: 960, y: 600, rotate: rot - 90, scale: 0 }} animate={{ x, y, rotate: rot, scale: 1 }}
              transition={{ type: 'spring', stiffness: 110, damping: 13, delay: 0.9 + i * 0.15 }}>
              <g transform={`translate(0 ${bob}) rotate(${shake})`} filter="url(#shadow)" onClick={() => poke(p.id)} style={{ cursor: 'pointer' }}>
                <PuzzlePiece p={p} />
              </g>
            </motion.g>
          )
        })}
      </svg>
      <Bouncy text="¡Puzzle de radiografías!" className="hl" style={{ top: 34, fontSize: 112 }} />
    </>
  )
}

// =====================================================================
// 8b. JUEGO: TU RADIOGRAFÍA DE LA MANO CON BASTONCILLOS
// =====================================================================
const PAPER = { x: 830, y: 190, w: 640, h: 820, s: 0.84 }

function Swab({ a, b, gap = 8 }) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1
  const ux = dx / L, uy = dy / L
  const A = [a[0] + ux * gap, a[1] + uy * gap], B = [b[0] - ux * gap, b[1] - uy * gap]
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI
  return (
    <g>
      <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke="#cfd6e2" strokeWidth={11} strokeLinecap="round" />
      <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke="#ffffff" strokeWidth={7} strokeLinecap="round" />
      {[A, B].map((p, i) => <ellipse key={i} cx={p[0]} cy={p[1]} rx={15} ry={11} fill="#ffffff" stroke="#d8dde6" strokeWidth={2} transform={`rotate(${ang} ${p[0]} ${p[1]})`} />)}
    </g>
  )
}

const SWABS = (() => {
  const list = [{ a: [276, 690], b: [266, 850] }, { a: [346, 692], b: [352, 850] }]
  for (let lvl = 0; lvl < 4; lvl++) FINGERS.forEach((f) => { if (lvl + 1 < f.pts.length) list.push({ a: f.pts[lvl], b: f.pts[lvl + 1], gap: lvl === 0 ? 12 : 9 }) })
  return list
})()
const COTTON = [[262, 630], [291, 624], [320, 626], [348, 632], [268, 657], [297, 654], [325, 656], [351, 660]]

function Material({ y, label, children, delay }) {
  return (
    <motion.g initial={{ x: -500, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 15, delay }}>
      <g transform={`translate(190 ${y})`}>{children}</g>
      <text x={300} y={y + 18} fontSize={52} fontWeight={700} fill="#fff" style={{ fontFamily: 'var(--font)' }}>{label}</text>
    </motion.g>
  )
}

export function Bastoncillos({ step }) {
  const t = useClock()
  const since = useSince(step, t)
  useOnMount(() => sfx.magic(), 300)
  useOnStep(step, 1, () => sfx.scan())
  useOnStep(step, 2, () => SWABS.forEach((_, i) => setTimeout(() => sfx.blip(i), 300 + i * 120)))
  useOnStep(step, 3, () => { sfx.fanfare(); party() })
  const traceK = step === 1 ? easeInOut(prog(since, 0.2, 1.8)) : step > 1 ? 1 : 0
  const handH = 880
  const clipY = handH * (1 - traceK)
  const glow = step >= 3 ? 1 : 0
  return (
    <>
      <svg className="full" viewBox="0 0 1920 1080">
        <Material y={330} label="Cartulina negra" delay={0.3}>
          <rect x={-60} y={-44} width={120} height={88} rx={8} fill="#11131a" stroke="#5a6478" strokeWidth={4} transform="rotate(-6)" />
        </Material>
        <Material y={490} label="Lápiz blanco" delay={0.55}>
          <g transform="rotate(-30)">
            <rect x={-70} y={-12} width={110} height={24} rx={4} fill="#f4f6fb" stroke="#24324d" strokeWidth={4} />
            <path d="M 40 -12 L 72 0 L 40 12 Z" fill="#f6d7a7" stroke="#24324d" strokeWidth={4} strokeLinejoin="round" />
            <path d="M 62 -4 L 72 0 L 62 4 Z" fill="#fff" />
          </g>
        </Material>
        <Material y={650} label="Bastoncillos" delay={0.8}>
          <g transform="rotate(-20)"><Swab a={[-70, -10]} b={[70, -10]} gap={0} /></g>
          <g transform="rotate(20)"><Swab a={[-70, 10]} b={[70, 10]} gap={0} /></g>
        </Material>
        <Material y={810} label="Pegamento" delay={1.05}>
          <rect x={-26} y={-60} width={52} height={96} rx={10} fill="#ffd23f" stroke="#24324d" strokeWidth={5} />
          <rect x={-30} y={-78} width={60} height={30} rx={8} fill="#3fa7ff" stroke="#24324d" strokeWidth={5} />
          <rect x={-18} y={-30} width={36} height={40} rx={6} fill="#fff" opacity={0.7} />
        </Material>

        {glow > 0 && <rect x={PAPER.x - 30} y={PAPER.y - 30} width={PAPER.w + 60} height={PAPER.h + 60} rx={36} fill="#bfe6ff" opacity={0.35 + Math.sin(t * 3) * 0.1} filter="url(#glowBig)" />}
        <g transform={`rotate(-2 ${PAPER.x + PAPER.w / 2} ${PAPER.y + PAPER.h / 2})`}>
          <rect x={PAPER.x} y={PAPER.y} width={PAPER.w} height={PAPER.h} rx={14} fill={glow ? 'url(#film)' : '#11131a'} stroke={glow ? '#bfe6ff' : '#3a4256'} strokeWidth={6} filter="url(#shadow)" />
          <svg x={PAPER.x} y={PAPER.y} width={PAPER.w} height={PAPER.h} viewBox="-20 0 640 880" style={{ overflow: 'hidden' }}>
            <defs>
              <clipPath id="trazo"><rect x={-40} y={clipY} width={720} height={handH} /></clipPath>
              <filter id="contorno" x="-10%" y="-10%" width="120%" height="120%">
                <feMorphology in="SourceAlpha" operator="erode" radius="5" result="dentro" />
                <feComposite in="SourceGraphic" in2="dentro" operator="out" />
              </filter>
            </defs>
            <g clipPath="url(#trazo)">
              <g filter="url(#contorno)">
                <HandSkin ow={2} colors={{ skin: '#f4f4f4', outline: '#f4f4f4', nail: '#f4f4f4', nailEdge: '#f4f4f4', crease: '#f4f4f4' }} />
              </g>
            </g>
            {step === 1 && traceK < 1 && (
              <g transform={`translate(${300 + Math.sin(since * 9) * 160} ${clipY}) rotate(-35)`}>
                <rect x={-12} y={-130} width={24} height={110} rx={4} fill="#f4f6fb" stroke="#24324d" strokeWidth={4} />
                <path d="M -12 -20 L 0 6 L 12 -20 Z" fill="#f6d7a7" stroke="#24324d" strokeWidth={4} strokeLinejoin="round" />
              </g>
            )}
            {step >= 2 && (
              <g filter={glow ? 'url(#glow)' : undefined}>
                {COTTON.map(([x, y], i) => (
                  <motion.circle key={'c' + i} cx={x} cy={y} r={12} fill="#fff" stroke="#d8dde6" strokeWidth={2}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 0.3 + 2 * 0.12 + i * 0.04 }} />
                ))}
                {SWABS.map((sw, i) => (
                  <motion.g key={i} initial={{ y: -500, opacity: 0, rotate: 25 }} animate={{ y: 0, opacity: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 160, damping: 15, delay: 0.3 + (i < 2 ? i : i + 3) * 0.12 }}>
                    <Swab {...sw} />
                  </motion.g>
                ))}
              </g>
            )}
          </svg>
        </g>
        {glow > 0 && <Sparkles t={t} points={[[PAPER.x - 40, PAPER.y + 60], [PAPER.x + PAPER.w + 40, PAPER.y + 120], [PAPER.x + PAPER.w + 30, PAPER.y + PAPER.h - 80], [PAPER.x - 30, PAPER.y + PAPER.h - 120]]} color="#bff6ff" size={34} />}
      </svg>
      <AnimatePresence mode="wait">
        <Bouncy key={step} text={['¡Haz tu radiografía!', 'Dibuja tu mano', 'Pega los bastoncillos', '¡Tu radiografía de la mano!'][Math.min(step, 3)]}
          className={step >= 3 ? 'hl-cyan' : 'hl'} style={{ top: 40, fontSize: step >= 3 ? 104 : 116 }} />
      </AnimatePresence>
    </>
  )
}
