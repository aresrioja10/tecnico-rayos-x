import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useClock, useSince, addPose, prog, easeOut, easeInOut, clamp, lerp } from '../lib/anim.js'
import { Kid, Skeleton, POSES, KIDS } from '../art/Figure.jsx'
import { HandSkin, HandXray, HandSoft, HandBones } from '../art/Hand.jsx'
import { Film } from '../art/Defs.jsx'
import { Bouncy, Pop, FloatingBones, Sunburst, Sparkles, useOnStep, useOnMount, svgPoint, useFlash } from './ui.jsx'
import { sfx } from '../lib/sound.js'
import { bones, burst, party } from '../lib/confetti.js'
import { useCamera, XrayVideo } from '../lib/camera.jsx'

// ---------------------------------------------------------------- 1. PORTADA
export function Portada({ settings }) {
  const t = useClock()
  const [jumpAt, setJumpAt] = useState(-10)
  const jt = t - jumpAt
  const jumping = jt < 0.9
  const base = jumping ? POSES.hooray : POSES.wave
  const pose = addPose(base, jumping
    ? { y: -Math.sin(Math.PI * clamp(jt / 0.9)) * 160 }
    : { foreB: Math.sin(t * 7) * 28, armB: Math.sin(t * 3.5) * 6, head: Math.sin(t * 2) * 5, y: Math.sin(t * 2.4) * 4 })
  const bar = 1440 + 250 * Math.sin(t * 1.1)
  const nombre = (settings.nombre || '').trim()

  useOnMount(() => sfx.magic(), 300)

  const jump = () => { setJumpAt(t); sfx.boing(); bones({ origin: { x: 0.75, y: 0.4 } }) }

  return (
    <>
      <svg className="full" viewBox="0 0 1920 1080">
        <FloatingBones t={t} />
        <defs>
          <clipPath id="p-frame"><rect x={1180} y={140} width={520} height={860} rx={48} /></clipPath>
          <clipPath id="p-scan"><rect x={bar} y={0} width={1000} height={1080} /></clipPath>
        </defs>
        <rect x={1180} y={140} width={520} height={860} rx={48} fill="rgba(0,0,0,0.18)" />
        <g clipPath="url(#p-frame)" onClick={jump} style={{ cursor: 'pointer' }}>
          <g transform="translate(1440 650) scale(0.98)"><Kid pose={pose} kid={KIDS.leo} expression={jumping ? 'happy' : 'smile'} /></g>
          <g clipPath="url(#p-scan)">
            <rect x={1180} y={140} width={520} height={860} fill="url(#film)" />
            <g transform="translate(1440 650) scale(0.98)"><Kid pose={pose} kid={KIDS.leo} xray /></g>
          </g>
          <rect x={bar - 5} y={140} width={10} height={860} fill="#7ff0ff" filter="url(#glowBig)" />
          <rect x={bar - 2} y={140} width={4} height={860} fill="#ffffff" />
        </g>
        <rect x={1180} y={140} width={520} height={860} rx={48} fill="none" stroke="#3fe0ff" strokeWidth={8} opacity={0.75} />
        <Sparkles t={t} points={[[1150, 180], [1730, 300], [1720, 900], [1160, 820]]} color="#bff6ff" />
      </svg>

      <Pop delay={0.1} className="chip-label" style={{ left: 140, top: 150, background: '#ffd23f', fontSize: 64 }}>
        {nombre ? `¡Hola! Soy ${nombre}` : '¡Hola, peques!'}
      </Pop>
      <Bouncy text="¡Visión de" delay={0.3} style={{ left: 120, right: 'auto', width: 1000, top: 330, fontSize: 168, textAlign: 'left' }} />
      <Bouncy text="Rayos X!" delay={0.75} className="hl-cyan" style={{ left: 120, right: 'auto', width: 1000, top: 520, fontSize: 210, textAlign: 'left', textShadow: '0 8px 0 rgba(0,0,0,0.3), 0 0 60px rgba(63,224,255,0.7)' }} />
    </>
  )
}

// ---------------------------------------------------------------- 2. LA PREGUNTA
export function Pregunta({ step }) {
  const t = useClock()
  const wob = step >= 2 ? Math.sin(t * 3) * 2 : 0
  useOnStep(step, 1, () => sfx.pop())
  useOnStep(step, 2, () => sfx.boing())
  const qs = [[520, 300], [1420, 380], [600, 760], [1380, 820]]
  return (
    <>
      <svg className="full" viewBox="0 0 1920 1080">
        <motion.g initial={{ y: 700 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 14 }}>
          <g transform={`translate(660 170) scale(1.1) rotate(${wob} 300 600)`} onClick={() => sfx.pop()} style={{ cursor: 'pointer' }}>
            <HandSkin />
          </g>
        </motion.g>
        {step === 1 && (
          <g>
            <motion.path d="M 470 610 Q 620 640 760 640" stroke="#ffd23f" strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray="1 22"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.2 }} />
            <motion.path d="M 1450 300 Q 1250 220 1010 300" stroke="#ff5fa2" strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray="1 22"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.8 }} />
          </g>
        )}
        {step >= 2 && qs.map(([x, y], i) => (
          <motion.text key={i} x={x} y={y} fontSize={190} fontWeight={700} textAnchor="middle" fill={['#ffd23f', '#3fe0ff', '#ff5fa2', '#7cd957'][i]}
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', delay: i * 0.12 }}
            transform={`rotate(${Math.sin(t * 2 + i) * 14} ${x} ${y})`} style={{ fontFamily: 'var(--font)' }}>?</motion.text>
        ))}
      </svg>
      <AnimatePresence mode="wait">
        {step < 2
          ? <Bouncy key="a" text="¿Qué vemos?" style={{ top: 30 }} />
          : <Bouncy key="b" text="¿Y por dentro?" className="hl-cyan" style={{ top: 30 }} />}
      </AnimatePresence>
      {step === 1 && <>
        <Pop className="chip-label" delay={0.1} style={{ left: 170, top: 560, background: '#ffd23f', fontSize: 72 }}>Piel</Pop>
        <Pop className="chip-label" delay={0.7} style={{ left: 1440, top: 240, background: '#ff5fa2', color: '#fff', fontSize: 72 }}>Uñas</Pop>
      </>}
    </>
  )
}

// ---------------------------------------------------------------- 3. LA LUPA DE RAYOS X
export function Lupa({ step }) {
  const t = useClock()
  const svgRef = useRef(null)
  const [ptr, setPtr] = useState(null)
  const lastMove = useRef(-10)
  const since = useSince(step, t)
  const [flash, flashEl] = useFlash()
  useOnStep(step, 1, () => { sfx.magic(); flash() })

  const auto = [990 + 230 * Math.sin(t * 0.9), 560 + 250 * Math.sin(t * 1.3 + 1)]
  const useAuto = !ptr || t - lastMove.current > 2.5
  const target = useAuto ? auto : ptr
  const posRef = useRef(target)
  posRef.current = [lerp(posRef.current[0], target[0], 0.18), lerp(posRef.current[1], target[1], 0.18)]
  const [lx, ly] = posRef.current
  const R = step >= 1 ? lerp(170, 1300, easeInOut(prog(since, 0, 0.9))) : 170

  const onMove = (e) => {
    const p = svgPoint(svgRef.current, e.clientX, e.clientY)
    if (p) { setPtr(p); lastMove.current = t }
  }

  return (
    <>
      <svg ref={svgRef} className="full" viewBox="0 0 1920 1080" onPointerMove={onMove}>
        <defs><clipPath id="lupa-clip"><circle cx={lx} cy={ly} r={R} /></clipPath></defs>
        <g transform="translate(660 170) scale(1.1)"><HandSkin /></g>
        <g clipPath="url(#lupa-clip)">
          <rect x={0} y={0} width={1920} height={1080} fill="url(#film)" />
          <g transform="translate(660 170) scale(1.1)"><HandXray /></g>
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
          ? <Bouncy key="a" text="¡Mi lupa mágica!" style={{ top: 30 }} />
          : <Bouncy key="b" text="¡HUESOS!" className="hl-cyan" style={{ top: 30, fontSize: 150 }} />}
      </AnimatePresence>
      {flashEl}
    </>
  )
}

// ---------------------------------------------------------------- 4. ¡SUPERPODER!
export function Superpoder() {
  const t = useClock()
  const [spinAt, setSpinAt] = useState(-10)
  const st = t - spinAt
  const fly = easeOut(prog(t, 0.2, 0.9))
  const pose = addPose(POSES.flex, { foreA: Math.sin(t * 4) * 8, foreB: -Math.sin(t * 4) * 8, y: (1 - fly) * 900 + Math.sin(t * 2.5) * 8 + (st < 0.8 ? -Math.sin(Math.PI * st / 0.8) * 120 : 0) })
  useOnMount(() => sfx.whoosh(), 200)
  useOnMount(() => { sfx.fanfare(); burst(0.5, 0.55) }, 1000)
  const click = () => { setSpinAt(t); sfx.magic(); burst(0.5, 0.5) }
  return (
    <>
      <svg className="full" viewBox="0 0 1920 1080">
        <Sunburst t={t} cx={960} cy={650} color="#ffd23f" opacity={0.12} />
        <circle cx={960} cy={640} r={330} fill="#3fe0ff" opacity={0.08 + Math.sin(t * 3) * 0.03} />
        <g transform="translate(960 700) scale(0.95)" onClick={click} style={{ cursor: 'pointer' }}>
          <g transform={st < 0.8 ? `scale(${Math.cos(st / 0.8 * Math.PI * 2)} 1)` : undefined}>
            <Kid pose={pose} kid={KIDS.tech} cape capeT={t} emblem expression="happy" />
          </g>
        </g>
        <Sparkles t={t} points={[[560, 420], [1360, 380], [480, 800], [1460, 820], [700, 260], [1240, 250]]} color="#ffe98a" size={30} />
      </svg>
      <Bouncy text="¡Visión de Rayos X!" style={{ top: 30, fontSize: 130 }} className="hl-cyan" />
      <Pop delay={1.2} className="subtitle" style={{ top: 190 }}>¡como los superhéroes!</Pop>
    </>
  )
}

// ---------------------------------------------------------------- 5. ESPEJO DE RAYOS X (cámara)
export function Espejo({ step, setStep }) {
  const t = useClock()
  const cam = useCamera()
  useOnStep(step, 1, () => { cam.start(); sfx.scan() })
  const on = step >= 1 && cam.status === 'on'
  const fallback = step >= 1 && cam.status === 'error'
  const dancers = [
    { x: 640, kid: KIDS.vega, ph: 0 }, { x: 960, kid: KIDS.nico, ph: 1.2 }, { x: 1280, kid: KIDS.sol, ph: 2.4 },
  ]
  return (
    <>
      <svg className="full" viewBox="0 0 1920 1080">
        <rect x={290} y={190} width={1340} height={770} rx={56} fill="url(#film)" />
        {!on && step === 0 && (
          <g transform="translate(960 900) scale(0.75)">
            <Skeleton pose={addPose(POSES.wave, { foreB: Math.sin(t * 6) * 25, y: Math.sin(t * 3) * 6 })} />
          </g>
        )}
        {fallback && dancers.map((d, i) => {
          const ph = t * 4 + d.ph
          const pose = addPose(POSES.hooray, { armA: Math.sin(ph) * 40 - 20, armB: -Math.sin(ph) * 40 + 20, thighA: Math.max(0, Math.sin(ph)) * 30, thighB: -Math.max(0, -Math.sin(ph)) * 30, y: -Math.abs(Math.sin(ph)) * 30, torso: Math.sin(ph / 2) * 8 })
          return <g key={i} transform={`translate(${d.x} 640) scale(0.62)`}><Kid pose={pose} kid={d.kid} xray /></g>
        })}
      </svg>
      {on && <XrayVideo style={{ left: 290, top: 190, width: 1340, height: 770, clipPath: 'inset(0 round 56px)' }} />}
      <svg className="full" viewBox="0 0 1920 1080" style={{ pointerEvents: 'none' }}>
        <rect x={290} y={190} width={1340} height={770} rx={56} fill="none" stroke="#3fe0ff" strokeWidth={12} filter="url(#glowBig)" />
        <rect x={290} y={190} width={1340} height={770} rx={56} fill="none" stroke="#e9fbff" strokeWidth={5} />
        {[[330, 230, 1, 1], [1590, 230, -1, 1], [330, 920, 1, -1], [1590, 920, -1, -1]].map(([x, y, sx, sy], i) => (
          <path key={i} d={`M ${x} ${y + sy * 70} L ${x} ${y} L ${x + sx * 70} ${y}`} stroke="#ffd23f" strokeWidth={12} fill="none" strokeLinecap="round" />
        ))}
        {on && <circle cx={1560} cy={260} r={16} fill="#ff4d5e" opacity={Math.sin(t * 5) > 0 ? 1 : 0.2} />}
      </svg>
      <Bouncy text={step === 0 ? '¿Os miro con mis rayos X?' : '¡Os veo por dentro!'} key={step === 0 ? 'a' : 'b'} style={{ top: 40, fontSize: 104 }} className={step ? 'hl-cyan' : ''} />
      {step === 0 && (
        <Pop delay={0.6} style={{ position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', justifyContent: 'center' }}>
          <button className="big-btn blue" style={{ position: 'static' }} onClick={() => setStep(1)}>¡Encender rayos X!</button>
        </Pop>
      )}
      {step >= 1 && cam.status === 'asking' && <div className="subtitle" style={{ top: 520 }}>Encendiendo…</div>}
    </>
  )
}
