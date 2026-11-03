import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useClock, useSince, addPose, prog, easeOut, easeInOut, clamp, lerp, usePoseTween } from '../lib/anim.js'
import { Kid, POSES, KIDS } from '../art/Figure.jsx'
import { Polaroid } from '../art/Machine.jsx'
import { Bouncy, Pop, Sparkles, Star, useOnStep, useOnMount, useFlash } from './ui.jsx'
import { sfx, music } from '../lib/sound.js'
import { burst, party, snow } from '../lib/confetti.js'
import { useCamera, XrayVideo } from '../lib/camera.jsx'

export function dance(t, ph = 0) {
  const a = t * 5 + ph
  return addPose(POSES.hooray, {
    armA: Math.sin(a) * 45 - 30, armB: -Math.sin(a) * 45 + 30, foreA: Math.sin(a * 2) * 30, foreB: -Math.sin(a * 2) * 30,
    thighA: Math.max(0, Math.sin(a)) * 28, shinA: -Math.max(0, Math.sin(a)) * 30, thighB: -Math.max(0, -Math.sin(a)) * 28, shinB: Math.max(0, -Math.sin(a)) * 30,
    y: -Math.abs(Math.sin(a)) * 26, torso: Math.sin(a / 2) * 9, head: Math.sin(a) * 8,
  })
}

function IceBlock({ k, w = 235, top = -430, bottom = 290 }) {
  if (k <= 0) return null
  return (
    <g transform={`translate(0 ${bottom}) scale(1 ${k}) translate(0 ${-bottom})`}>
      <rect x={-w} y={top} width={w * 2} height={bottom - top} rx={44} fill="#c9f3ff" opacity={0.5} stroke="#ffffff" strokeWidth={8} />
      <path d={`M ${-w + 40} ${top + 60} L ${-w + 40} ${top + 220}`} stroke="#fff" strokeWidth={14} strokeLinecap="round" opacity={0.8} />
      <path d={`M ${-w + 70} ${top + 60} L ${-w + 70} ${top + 120}`} stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.7} />
      <path d={`M ${w - 40} ${bottom - 120} L ${w - 40} ${bottom - 40}`} stroke="#fff" strokeWidth={12} strokeLinecap="round" opacity={0.6} />
    </g>
  )
}

function Snowflake({ x, y, s = 1, rot = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} stroke="#ffffff" strokeWidth={8} strokeLinecap="round">
      {[0, 60, 120].map((a) => <line key={a} x1={-50} y1={0} x2={50} y2={0} transform={`rotate(${a})`} />)}
      {[0, 60, 120, 180, 240, 300].map((a) => <path key={'b' + a} d="M 30 0 L 44 -12 M 30 0 L 44 12" transform={`rotate(${a})`} fill="none" />)}
    </g>
  )
}

// ---------------------------------------------------------------- ¿POR QUÉ HAY QUE ESTAR QUIETO?
export function Borrosa({ step }) {
  const t = useClock()
  const since = useSince(step, t)
  const [flash, flashEl] = useFlash()
  useOnStep(step, 1, () => { sfx.clack(); flash() })
  useOnStep(step, 2, () => sfx.freeze())
  useOnStep(step, 3, () => { sfx.clack(); flash(); setTimeout(() => { sfx.tada(); burst(0.82, 0.6, { particleCount: 60 }) }, 500) })
  const frozen = step >= 2
  const live = frozen ? POSES.freeze : dance(t)
  const pose = usePoseTween(live, t, frozen ? 0.25 : 0.01)
  const iceK = frozen ? easeOut(prog(step === 2 ? since : 9, 0, 0.6)) : 0
  const figure = (p, extra = {}) => <g transform="translate(130 150) scale(0.32)"><Kid pose={p} kid={KIDS.vega} xray {...extra} /></g>
  const blurPose = dance(1.3)
  const titles = ['¡Si te mueves…', '…sale borrosa!', '¡Quieto como una estatua!', '¡Foto perfecta!']
  return (
    <>
      <svg className="full" viewBox="0 0 1920 1080">
        <rect x={660} y={210} width={600} height={580} rx={30} fill="url(#film)" />
        <defs><clipPath id="vf-clip"><rect x={660} y={210} width={600} height={580} rx={30} /></clipPath></defs>
        <g clipPath="url(#vf-clip)">
          <g transform="translate(960 570) scale(0.55)"><Kid pose={pose} kid={KIDS.vega} xray /></g>
          {iceK > 0 && <rect x={660} y={210} width={600} height={580} fill="#bdf0ff" opacity={iceK * 0.22} />}
          {iceK > 0 && <><Snowflake x={720} y={270} s={iceK * 0.7} rot={t * 20} /><Snowflake x={1200} y={730} s={iceK * 0.8} rot={-t * 20} /></>}
        </g>
        <rect x={660} y={210} width={600} height={580} rx={30} fill="none" stroke="#ffd23f" strokeWidth={8} />
        {[[690, 240, 1, 1], [1230, 240, -1, 1], [690, 760, 1, -1], [1230, 760, -1, -1]].map(([x, y, sx, sy], i) => (
          <path key={i} d={`M ${x} ${y + sy * 50} L ${x} ${y} L ${x + sx * 50} ${y}`} stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" />
        ))}
        <circle cx={1210} cy={258} r={12} fill="#ff4d5e" opacity={Math.sin(t * 5) > 0 ? 1 : 0.25} />
        {step >= 1 && (
          <motion.g initial={{ x: 960, y: 500, scale: 0.2, rotate: 0, opacity: 0 }} animate={{ x: 150, y: 430, scale: 1.15, rotate: -8, opacity: 1 }} transition={{ type: 'spring', stiffness: 90, damping: 14 }}>
            <Polaroid label="¡Borrosa!" labelColor="#e8304a">
              <g filter="url(#blurry)" opacity={0.9}>
                <g transform="translate(-16 0)" opacity={0.5}>{figure(blurPose)}</g>
                <g transform="translate(14 6)" opacity={0.5}>{figure(dance(1.6))}</g>
                {figure(dance(1.45))}
              </g>
            </Polaroid>
          </motion.g>
        )}
        {step >= 3 && (
          <motion.g initial={{ x: 960, y: 500, scale: 0.2, rotate: 0, opacity: 0 }} animate={{ x: 1420, y: 430, scale: 1.15, rotate: 7, opacity: 1 }} transition={{ type: 'spring', stiffness: 90, damping: 14 }}>
            <Polaroid label="¡Perfecta!" labelColor="#2c9a1c">{figure(POSES.freeze)}</Polaroid>
          </motion.g>
        )}
        {step >= 3 && <Sparkles t={t} points={[[1460, 440], [1800, 520], [1500, 860]]} color="#fff3b0" size={30} />}
      </svg>
      <Bouncy key={step} text={titles[step]} className={step === 1 ? 'hl-pink' : step >= 2 ? 'hl-ice' : ''} style={{ top: 40, fontSize: 110 }} />
      {flashEl}
    </>
  )
}

// ---------------------------------------------------------------- ¡JUEGO DE LA ESTATUA!
const FREEZE_SECS = 5
const DANCERS = [
  { x: 470, kid: KIDS.nico, ph: 0, freeze: { ...POSES.freeze } },
  { x: 960, kid: KIDS.vega, ph: 1.3, freeze: { ...POSES.hooray, armA: 160, armB: -100, foreB: -60, thighB: -30, shinB: 50 } },
  { x: 1450, kid: KIDS.sol, ph: 2.6, freeze: { ...POSES.flex, thighA: 30, shinA: -40 } },
]

export function Estatua({ step, setStep }) {
  const t = useClock()
  const since = useSince(step, t)
  const cam = useCamera()
  const videoRef = useRef(null)
  const [snap, setSnap] = useState(null)
  const [flash, flashEl] = useFlash()
  const doneRef = useRef(false)

  useEffect(() => {
    if (step < 3) { music.start(); doneRef.current = false; setSnap(null) } else music.stop()
  }, [step])
  useEffect(() => () => music.stop(), [])
  useOnStep(step, 1, () => sfx.beep())
  useOnStep(step, 2, () => sfx.beep())
  useOnStep(step, 3, () => { sfx.beep(true); setTimeout(() => sfx.freeze(), 200); setTimeout(() => snow(), 300) })

  const frozenT = step >= 3 ? since : -1
  const done = step >= 3 && frozenT > FREEZE_SECS + 0.8
  useEffect(() => {
    if (done && !doneRef.current) {
      doneRef.current = true
      sfx.clack(); flash()
      const v = videoRef.current
      if (cam.status === 'on' && v && v.videoWidth) {
        const c = document.createElement('canvas'); c.width = v.videoWidth; c.height = v.videoHeight
        const g = c.getContext('2d'); g.translate(c.width, 0); g.scale(-1, 1); g.drawImage(v, 0, 0)
        try { setSnap(c.toDataURL('image/jpeg', 0.85)) } catch { /* nada */ }
      }
      setTimeout(() => { sfx.fanfare(); party() }, 500)
    }
  }, [done]) // eslint-disable-line react-hooks/exhaustive-deps

  const iceK = step >= 3 ? easeOut(prog(frozenT, 0.15, 0.7)) : 0
  const remaining = Math.max(0, Math.ceil(FREEZE_SECS + 0.8 - frozenT))
  const ringK = clamp((frozenT - 0.8) / FREEZE_SECS)
  const bigNum = step === 1 ? '1' : step === 2 ? '2' : null
  const title = step === 0 ? '¡Juego de la estatua!' : step >= 3 ? (done ? '¡Perfecto! ¡Qué valientes!' : '¡Estatuas de hielo!') : ''

  return (
    <>
      {cam.status === 'on' && <XrayVideo videoRef={videoRef} style={{ inset: 0, opacity: 0.35 }} />}
      <svg className="full" viewBox="0 0 1920 1080">
        {DANCERS.map((d, i) => {
          const pose = step >= 3 ? d.freeze : dance(t, d.ph)
          return (
            <g key={i} transform={`translate(${d.x} 700) scale(0.68)`}>
              <Kid pose={pose} kid={d.kid} expression={step >= 3 ? (done ? 'happy' : 'freeze') : 'happy'} />
              <IceBlock k={done ? 0 : iceK} />
            </g>
          )
        })}
        {step >= 3 && !done && frozenT > 0.8 && (
          <g transform="translate(1700 200)">
            <circle r={96} fill="rgba(5,12,25,0.6)" />
            <circle r={84} fill="none" stroke="#ffffff22" strokeWidth={18} />
            <circle r={84} fill="none" stroke="#9be7ff" strokeWidth={18} strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 84}`} strokeDashoffset={2 * Math.PI * 84 * ringK} transform="rotate(-90)" />
            <text y={34} textAnchor="middle" fontSize={96} fontWeight={700} fill="#fff" style={{ fontFamily: 'var(--font)' }}>{remaining}</text>
          </g>
        )}
        {done && [[300, 260], [1600, 300], [960, 180], [200, 760], [1720, 780]].map(([x, y], i) => <Star key={i} x={x} y={y} r={46} rot={t * 40 + i * 20} />)}
      </svg>
      {iceK > 0 && !done && <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: iceK, boxShadow: 'inset 0 0 220px 90px rgba(200,245,255,0.85)' }} />}
      <AnimatePresence>
        {bigNum && (
          <motion.div key={bigNum} className="title" style={{ top: 160, fontSize: 520, color: '#ffd23f', lineHeight: 1 }}
            initial={{ scale: 0.2, opacity: 0, rotate: -20 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: 2, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 14 }}>{bigNum}</motion.div>
        )}
      </AnimatePresence>
      {title && <Bouncy key={title} text={title} className={step >= 3 ? 'hl-ice' : ''} style={{ top: 40, fontSize: 116 }} />}
      {step === 0 && <Pop delay={0.8} className="subtitle" style={{ top: 190 }}>¡A bailar!</Pop>}
      {snap && (
        <motion.div initial={{ scale: 0.2, rotate: 0, opacity: 0 }} animate={{ scale: 1, rotate: 5, opacity: 1 }} transition={{ type: 'spring', stiffness: 90, damping: 13, delay: 0.3 }}
          style={{ position: 'absolute', right: 70, top: 230, width: 520, background: '#fffdf6', padding: '18px 18px 70px', borderRadius: 12, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
          <div className="xray-video is-xray" style={{ position: 'relative', width: '100%', aspectRatio: '16 / 10' }}>
            <img src={snap} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) invert(1) contrast(1.6) brightness(1.05)' }} />
            <div className="xray-video-tint" />
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 14, textAlign: 'center', color: '#1b2b4a', fontSize: 40, fontWeight: 700 }}>¡Nuestra radiografía!</div>
        </motion.div>
      )}
      {done && (
        <Pop delay={1.5} style={{ position: 'absolute', left: 80, bottom: 120 }}>
          <button className="big-btn blue" style={{ position: 'static', fontSize: 48, padding: '18px 44px' }} onClick={() => setStep(0)}>¡Otra vez!</button>
        </Pop>
      )}
      {flashEl}
    </>
  )
}
