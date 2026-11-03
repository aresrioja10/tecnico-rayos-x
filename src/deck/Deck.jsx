import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Stage } from './Stage.jsx'
import { SECTIONS } from './sections.js'
import { SLIDES } from '../slides/index.js'
import { unlockAudio, sfx } from '../lib/sound.js'
import { useSettings } from '../lib/settings.jsx'
import { listPhotos, onGalleryChange } from '../lib/gallery.js'
import Settings from './Settings.jsx'

function readHash() {
  const m = location.hash.match(/^#\/?(\d+)(?:\.(\d+))?/)
  return m ? { i: Math.max(0, parseInt(m[1], 10) - 1), s: m[2] ? parseInt(m[2], 10) : 0 } : { i: 0, s: 0 }
}

const Icon = {
  prev: <svg viewBox="0 0 24 24"><path d="M15 5 L8 12 L15 19" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  next: <svg viewBox="0 0 24 24"><path d="M9 5 L16 12 L9 19" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  full: <svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>,
  gear: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="2.4" /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>,
  notes: <svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="2.4" /><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>,
  grid: <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7.5" height="7.5" rx="2" fill="currentColor" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="2" fill="currentColor" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="2" fill="currentColor" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" fill="currentColor" /></svg>,
  soundOn: <svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" /><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>,
  soundOff: <svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" /><path d="M16 9l6 6M22 9l-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>,
}

export default function Deck() {
  const [settings, update] = useSettings()
  const [photos, setPhotos] = useState([])
  useEffect(() => {
    const load = () => listPhotos().then(setPhotos)
    load()
    return onGalleryChange(load)
  }, [])

  const slides = useMemo(() => SLIDES.filter((s) => !s.skipIf || !s.skipIf({ photos })), [photos])
  const initial = useRef(readHash())
  const [index, setIndex] = useState(() => Math.min(initial.current.i, SLIDES.length - 1))
  const [step, setStep] = useState(initial.current.s)
  const [dir, setDir] = useState(1)
  const [overview, setOverview] = useState(false)
  const [blackout, setBlackout] = useState(false)
  const [panel, setPanel] = useState(false)
  const [banner, setBanner] = useState(null)
  const [idle, setIdle] = useState(false)
  const startTime = useRef(Date.now())
  const [, force] = useState(0)

  const i = Math.min(index, slides.length - 1)
  const slide = slides[i]
  const steps = typeof slide.steps === 'function' ? slide.steps({ photos }) : slide.steps || 1

  useEffect(() => { history.replaceState(null, '', `#${i + 1}${step ? '.' + step : ''}`) }, [i, step])

  const goto = useCallback((n, s = 0) => {
    const target = Math.max(0, Math.min(slides.length - 1, n))
    if (target === i) { setStep(s); return }
    setDir(target > i ? 1 : -1)
    if (target > i && slides[target].section !== slides[i].section) {
      setBanner(slides[target].section)
    } else setBanner(null)
    setIndex(target); setStep(s)
  }, [i, slides])

  const next = useCallback(() => {
    if (step < steps - 1) setStep(step + 1)
    else if (i < slides.length - 1) { goto(i + 1, 0); sfx.swoosh() }
  }, [step, steps, i, slides.length, goto])

  const prev = useCallback(() => {
    if (step > 0) setStep(step - 1)
    else if (i > 0) {
      const p = slides[i - 1]
      const ps = typeof p.steps === 'function' ? p.steps({ photos }) : p.steps || 1
      goto(i - 1, ps - 1)
    }
  }, [step, i, slides, goto, photos])

  useEffect(() => {
    if (banner == null) return
    const id = setTimeout(() => setBanner(null), 2200)
    return () => clearTimeout(id)
  }, [banner, index])

  useEffect(() => {
    const onKey = (e) => {
      if (panel) { if (e.key === 'Escape') setPanel(false); return }
      if (e.target.closest && e.target.closest('input, textarea')) return
      unlockAudio()
      const k = e.key
      if (blackout && !['b', 'B', '.'].includes(k)) { setBlackout(false); e.preventDefault(); return }
      if (['ArrowRight', 'PageDown', ' ', 'Enter', 'ArrowDown'].includes(k)) { e.preventDefault(); if (overview) setOverview(false); else next() }
      else if (['ArrowLeft', 'PageUp', 'Backspace', 'ArrowUp'].includes(k)) { e.preventDefault(); prev() }
      else if (k === 'Home') goto(0)
      else if (k === 'End') goto(slides.length - 1)
      else if (k === 'f' || k === 'F' || k === 'F5') { e.preventDefault(); toggleFull() }
      else if (k === 'n' || k === 'N') update({ notas: !settings.notas })
      else if (k === 'm' || k === 'M') update({ sonido: !settings.sonido })
      else if (k === 'g' || k === 'G' || k === 'Escape' || k === 'Tab') { e.preventDefault(); setOverview((o) => !o) }
      else if (k === 'b' || k === 'B' || k === '.') setBlackout((b) => !b)
      else if (k === 's' || k === 'S' || k === ',') setPanel(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, goto, slides.length, overview, blackout, panel, settings, update])

  // Gesto de deslizar en pantallas táctiles
  useEffect(() => {
    let x0 = null, y0 = null
    const down = (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY }
    const up = (e) => {
      if (x0 == null) return
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0
      if (Math.abs(dx) > 90 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? next : prev)()
      x0 = null
    }
    window.addEventListener('touchstart', down, { passive: true })
    window.addEventListener('touchend', up)
    return () => { window.removeEventListener('touchstart', down); window.removeEventListener('touchend', up) }
  }, [next, prev])

  // Ocultar ratón y controles cuando no se mueve
  useEffect(() => {
    let id
    const move = () => { setIdle(false); clearTimeout(id); id = setTimeout(() => setIdle(true), 2500) }
    window.addEventListener('mousemove', move); window.addEventListener('mousedown', move)
    move()
    return () => { clearTimeout(id); window.removeEventListener('mousemove', move); window.removeEventListener('mousedown', move) }
  }, [])

  useEffect(() => { const id = setInterval(() => force((x) => x + 1), 1000); return () => clearInterval(id) }, [])

  const toggleFull = () => {
    if (document.fullscreenElement) document.exitFullscreen?.()
    else document.documentElement.requestFullscreen?.().catch(() => {})
  }

  const sec = SECTIONS[slide.section]
  const C = slide.C
  const secSlides = (n) => slides.filter((s) => s.section === n)
  const elapsed = Math.floor((Date.now() - startTime.current) / 1000)
  const mmss = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`

  return (
    <div className={`viewport ${idle && !overview && !panel ? 'hide-cursor' : ''}`} onPointerDown={unlockAudio}>
      <Stage>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={slide.id}
            className="slide"
            custom={dir}
            initial={{ opacity: 0, x: dir * 120, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: dir * -120, scale: 0.98 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <C step={step} setStep={setStep} next={next} prev={prev} photos={photos} settings={settings} />
          </motion.div>
        </AnimatePresence>

        <div className="chrome">
          {slide.id !== 'portada' && (
            <div className="section-chip">
              <span className="num" style={{ background: sec.color }}>{slide.section}</span>
              <span>{sec.name}</span>
            </div>
          )}
          <div className="progress">
            {Object.keys(SECTIONS).map((n) => {
              const list = secSlides(+n)
              const pos = list.findIndex((s) => s.id === slide.id)
              const done = slide.section > +n ? 1 : slide.section < +n ? 0 : (pos + 1) / list.length
              return <div className="seg" key={n} style={{ flex: Math.max(1, SECTIONS[n].mins) }}><i style={{ width: `${done * 100}%`, background: SECTIONS[n].color }} /></div>
            })}
          </div>
          <div className={`controls ${idle ? 'hidden' : ''}`}>
            <button className="ctl" title="Sonido (M)" onClick={() => update({ sonido: !settings.sonido })}>{settings.sonido ? Icon.soundOn : Icon.soundOff}</button>
            <button className="ctl" title="Notas (N)" onClick={() => update({ notas: !settings.notas })}>{Icon.notes}</button>
            <button className="ctl" title="Todas las diapositivas (G)" onClick={() => setOverview(true)}>{Icon.grid}</button>
            <button className="ctl" title="Ajustes (S)" onClick={() => setPanel(true)}>{Icon.gear}</button>
            <button className="ctl" title="Pantalla completa (F)" onClick={toggleFull}>{Icon.full}</button>
            <button className="ctl" title="Anterior (←)" onClick={prev}>{Icon.prev}</button>
            <button className="ctl" title="Siguiente (→)" onClick={next}>{Icon.next}</button>
          </div>
        </div>

        <AnimatePresence>
          {banner != null && (
            <motion.div className="section-banner" key={'b' + banner}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="card" style={{ background: SECTIONS[banner].color }}
                initial={{ scale: 0.3, rotate: -8, y: 200 }} animate={{ scale: 1, rotate: 0, y: 0 }} exit={{ scale: 1.3, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 14 }}>
                <div className="i">{SECTIONS[banner].icon}</div>
                <div className="t">{SECTIONS[banner].name}</div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {settings.notas && !overview && (
          <div className="notes">
            <h4>
              <span>{i + 1}/{slides.length} · {sec.name} (≈{sec.mins} min) · paso {step + 1}/{steps}</span>
              <span>⏱ {mmss}</span>
            </h4>
            {(slide.notes || '').split('\n').filter(Boolean).map((line, k) => (
              <p key={k} className={line.startsWith('·') ? 'tip' : ''}>{line}</p>
            ))}
          </div>
        )}

        {overview && (
          <div className="overview">
            <h2>Todas las diapositivas <span style={{ fontSize: 28, opacity: 0.7 }}>(clic para ir · Esc para cerrar)</span></h2>
            <div className="overview-grid">
              {slides.map((s, k) => (
                <button key={s.id} className={`ov-card ${k === i ? 'current' : ''}`} style={{ borderLeft: `12px solid ${SECTIONS[s.section].color}` }}
                  onClick={() => { goto(k); setOverview(false) }}>
                  <small>{k + 1} · {SECTIONS[s.section].name}</small>
                  <span>{s.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {blackout && <div className="blackout" onClick={() => setBlackout(false)} />}
      </Stage>
      {panel && <Settings onClose={() => setPanel(false)} photos={photos} />}
    </div>
  )
}
