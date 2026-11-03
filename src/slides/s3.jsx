import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useClock, useSince, addPose, prog, easeOut, clamp } from '../lib/anim.js'
import { Skeleton, POSES } from '../art/Figure.jsx'
import { HandXray, HandSkin, FINGERS, tipOf } from '../art/Hand.jsx'
import { Dog, Cat, Fish, Teddy, Robot } from '../art/Animals.jsx'
import { Lightbox } from '../art/Machine.jsx'
import { Bouncy, Pop, Sparkles, Sunburst, useOnStep, useOnMount } from './ui.jsx'
import { sfx } from '../lib/sound.js'
import { burst } from '../lib/confetti.js'

const BOX = { x: 360, y: 200, w: 1200, h: 730 }

function FilmArea({ children, vb, pad = 40, dark = true }) {
  const iw = BOX.w - pad * 2, ih = BOX.h - pad * 2
  return (
    <g>
      <rect x={pad - 12} y={pad - 12} width={iw + 24} height={ih + 24} rx={20} fill={dark ? 'url(#film)' : '#fff8e6'} />
      <svg x={pad} y={pad} width={iw} height={ih} viewBox={vb} preserveAspectRatio="xMidYMid meet" style={{ overflow: 'visible' }}>{children}</svg>
    </g>
  )
}

// Tarjeta que gira: delante la radiografía, detrás el dibujo en color
function FlipCard({ flipped, front, back, onClick }) {
  const face = { position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }
  return (
    <div style={{ position: 'absolute', left: BOX.x - 40, top: BOX.y - 50, width: BOX.w + 80, height: BOX.h + 90, perspective: 2400, cursor: 'pointer' }} onClick={onClick}>
      <motion.div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }} transition={{ type: 'spring', stiffness: 70, damping: 13 }}>
        <div style={face}>
          <svg viewBox={`-40 -50 ${BOX.w + 80} ${BOX.h + 90}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
            <Lightbox w={BOX.w} h={BOX.h}>{front}</Lightbox>
          </svg>
        </div>
        <div style={{ ...face, transform: 'rotateY(180deg)' }}>
          <svg viewBox={`-40 -50 ${BOX.w + 80} ${BOX.h + 90}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
            <rect x={-18} y={-18} width={BOX.w + 36} height={BOX.h + 36} rx={40} fill="#fff3c4" stroke="#24324d" strokeWidth={7} />
            {back}
          </svg>
        </div>
      </motion.div>
    </div>
  )
}

// ---------------------------------------------------------------- INTRO DEL JUEGO
export function AdivinaIntro() {
  const t = useClock()
  const think = { ...POSES.stand, armB: -150, foreB: -140, head: 8 + Math.sin(t * 2) * 4, armA: 20, foreA: 10 }
  useOnMount(() => sfx.drum(6), 200)
  return (
    <>
      <svg className="full" viewBox="0 0 1920 1080">
        <g transform="translate(330 720) scale(0.85)"><Skeleton pose={think} expression="wow" /></g>
        {[0, 1, 2].map((i) => {
          const x = 760 + i * 380, y = 330 + Math.sin(t * 3 + i * 1.3) * 22
          return (
            <motion.g key={i} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 + i * 0.25, type: 'spring' }}>
              <g transform={`translate(${x} ${y}) rotate(${Math.sin(t * 2 + i) * 5})`}>
                <rect x={0} y={0} width={320} height={420} rx={26} fill="url(#film)" stroke="#bfe6ff" strokeWidth={8} />
                <text x={160} y={290} textAnchor="middle" fontSize={260} fontWeight={700} fill={['#ffd23f', '#ff5fa2', '#3fe0ff'][i]} style={{ fontFamily: 'var(--font)' }}>?</text>
              </g>
            </motion.g>
          )
        })}
        <Sparkles t={t} points={[[700, 260], [1830, 300], [1500, 860], [820, 880]]} color="#ffd6ea" size={30} />
      </svg>
      <Bouncy text="¡Adivina el esqueleto!" className="hl-pink" style={{ top: 40, fontSize: 124 }} />
    </>
  )
}

// ---------------------------------------------------------------- LA MANO: CONTAR DEDOS
export function ContarDedos({ step }) {
  const t = useClock()
  const count = clamp(step - 1, 0, 5)
  useOnStep(step, 1, () => { sfx.tada(); burst(0.5, 0.4, { particleCount: 50 }) })
  ;[2, 3, 4, 5, 6].forEach((k) => useOnStep(step, k, () => sfx.ding(k - 2))) // eslint-disable-line react-hooks/rules-of-hooks
  useOnStep(step, 7, () => { sfx.fanfare(); burst(0.5, 0.5) })
  // la mano (600x820) cabe en la película: escala y desplazamiento
  const iw = BOX.w - 80, ih = BOX.h - 80
  const s = Math.min(iw / 600, ih / 820)
  const ox = BOX.x + 40 + (iw - 600 * s) / 2, oy = BOX.y + 40 + (ih - 820 * s) / 2
  const tips = FINGERS.map((f, i) => tipOf(f, i === 0 ? 40 : 70 + Math.abs(i - 2) * 6)).map(([x, y]) => [ox + x * s, oy + y * s])
  const title = step === 0 ? '¿Qué es esto?' : step === 1 ? '¡Una mano!' : step < 7 ? '¿Cuántos dedos?' : '¡Cinco dedos!'
  const wave = Math.sin(t * 6) * 12
  return (
    <>
      <svg className="full" viewBox="0 0 1920 1080">
        <g transform={`translate(${BOX.x} ${BOX.y})`}>
          <Lightbox w={BOX.w} h={BOX.h}>
            <FilmArea vb="0 0 600 820"><HandXray /></FilmArea>
          </Lightbox>
        </g>
        {tips.slice(0, count).map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 12 }}>
              <circle cx={0} cy={0} r={38} fill="#ffd23f" stroke="#c98a00" strokeWidth={6} />
              <text x={0} y={17} textAnchor="middle" fontSize={50} fontWeight={700} fill="#1b2b4a" style={{ fontFamily: 'var(--font)' }}>{i + 1}</text>
            </motion.g>
          </g>
        ))}
        {step >= 7 && (
          <>
            <g transform={`translate(1560 520) rotate(${wave} 150 700) scale(0.5)`}><HandSkin /></g>
            <g transform={`translate(60 520) rotate(${-wave} 150 700) scale(0.5) translate(600 0) scale(-1 1)`}><HandSkin /></g>
          </>
        )}
      </svg>
      <Bouncy key={title} text={title} className={step >= 1 ? 'hl-pink' : ''} style={{ top: 40, fontSize: 116 }} />
      {step >= 7 && <Pop className="chip-label" delay={0.5} style={{ left: 0, right: 0, margin: '0 auto', width: 'fit-content', top: 940, background: '#ffd23f', fontSize: 60 }}>¿Y vosotros?</Pop>}
      {step >= 2 && step < 7 && (
        <Pop key={count} className="chip-label" style={{ left: 1650, top: 740, background: '#fff', fontSize: 120, padding: '10px 50px' }}>{count}</Pop>
      )}
    </>
  )
}

// ---------------------------------------------------------------- ADIVINANZA GENÉRICA
function GuessSlide({ step, setStep, Art, vb, answer, sound, extras = [], color = 'hl-pink' }) {
  const t = useClock()
  const flipped = step === 1
  const extra = step >= 2 ? extras[step - 2] : null
  useOnStep(step, 1, () => { sfx.tada(); setTimeout(() => sound?.(), 500); setTimeout(() => burst(0.5, 0.45), 300) })
  extras.forEach((e, i) => useOnStep(step, i + 2, () => e.sound?.())) // eslint-disable-line react-hooks/rules-of-hooks
  const title = step === 0 ? '¿Quién es?' : step === 1 ? answer : extra?.title
  return (
    <>
      <FlipCard
        flipped={flipped}
        onClick={() => setStep(flipped ? 0 : 1)}
        front={<FilmArea vb={vb}><Art xray t={t} /></FilmArea>}
        back={
          <g>
            <clipPath id="g-back"><rect x={0} y={0} width={BOX.w} height={BOX.h} rx={24} /></clipPath>
            <g clipPath="url(#g-back)"><Sunburst t={t} cx={BOX.w / 2} cy={BOX.h / 2} color="#ffb02e" opacity={0.18} /></g>
            <FilmArea vb={vb} dark={false}><Art t={t} /></FilmArea>
          </g>
        }
      />
      <Bouncy key={title} text={title} className={step >= 1 ? color : ''} style={{ top: 40, fontSize: 116 }} />
      {extra?.chip && <Pop className="chip-label" delay={0.4} style={{ left: 0, right: 0, margin: '0 auto', width: 'fit-content', top: 940, background: '#ffd23f', fontSize: 56 }}>{extra.chip}</Pop>}
    </>
  )
}

export const Perro = (p) => <GuessSlide {...p} Art={Dog} vb="60 20 820 500" answer="¡Un perro!" sound={sfx.guau} />
export const Gato = (p) => <GuessSlide {...p} Art={Cat} vb="60 20 820 500" answer="¡Un gato!" sound={sfx.miau} />
export const Pez = (p) => <GuessSlide {...p} Art={Fish} vb="80 40 760 440" answer="¡Un pez!" sound={sfx.blup} />
export const Osito = (p) => <GuessSlide {...p} Art={Teddy} vb="20 60 560 620" answer="¡Un osito!" sound={sfx.squeak}
  extras={[{ title: '¡No tiene huesos!', chip: 'Solo algodón… ¡y un corazón!', sound: sfx.heart }]} />
export const RobotSlide = (p) => <GuessSlide {...p} Art={Robot} vb="40 10 520 740" answer="¡Un robot!" sound={sfx.robot} color="hl-cyan"
  extras={[{ title: '¡Tiene engranajes!', chip: '¡y una pila!', sound: sfx.robot }]} />

// ---------------------------------------------------------------- TUS RADIOGRAFÍAS (fotos añadidas en Ajustes)
export function Galeria({ step, setStep, photos }) {
  const idx = Math.floor(step / 2)
  const revealed = step % 2 === 1
  const p = photos[Math.min(idx, photos.length - 1)]
  const [url, setUrl] = useState('')
  useEffect(() => {
    if (!p) return
    const u = URL.createObjectURL(p.blob); setUrl(u)
    return () => URL.revokeObjectURL(u)
  }, [p])
  useEffect(() => { if (revealed) { sfx.tada(); burst(0.5, 0.45) } else sfx.swoosh() }, [revealed, idx])
  if (!p) return null
  const title = revealed ? (p.name ? `¡${p.name.replace(/^¡|!$/g, '')}!` : '¡Sorpresa!') : '¿Qué es esto?'
  return (
    <>
      <svg className="full" viewBox="0 0 1920 1080">
        <g transform={`translate(${BOX.x} ${BOX.y})`}>
          <Lightbox w={BOX.w} h={BOX.h}>
            <rect x={28} y={28} width={BOX.w - 56} height={BOX.h - 56} rx={20} fill="#000" />
            <AnimatePresence mode="wait">
              <motion.image key={idx} href={url} x={40} y={40} width={BOX.w - 80} height={BOX.h - 80} preserveAspectRatio="xMidYMid meet"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            </AnimatePresence>
          </Lightbox>
        </g>
      </svg>
      <Bouncy key={title} text={title} className={revealed ? 'hl-pink' : ''} style={{ top: 40, fontSize: 116 }} />
    </>
  )
}
