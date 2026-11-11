// Sonidos sintetizados con Web Audio: no hace falta ningún archivo ni internet.
let ctx = null
let master = null
let muted = false

export function setMuted(m) { muted = m }
export function isMuted() { return muted }

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.55
    const comp = ctx.createDynamicsCompressor()
    master.connect(comp)
    comp.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function unlockAudio() { ac() }

function tone({ freq = 440, type = 'sine', dur = 0.2, vol = 0.3, attack = 0.005, freqEnd, delay = 0, curve = 'exp', release }) {
  const c = ac(); if (!c || muted) return
  const t0 = c.currentTime + delay
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, t0)
  if (freqEnd) {
    if (curve === 'exp') o.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), t0 + dur)
    else o.frequency.linearRampToValueAtTime(freqEnd, t0 + dur)
  }
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.linearRampToValueAtTime(vol, t0 + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + (release || dur))
  o.connect(g); g.connect(master)
  o.start(t0); o.stop(t0 + (release || dur) + 0.05)
  return { o, g }
}

let noiseBuf = null
function noise({ dur = 0.2, vol = 0.3, delay = 0, type = 'bandpass', freq = 1200, freqEnd, q = 1, attack = 0.003 }) {
  const c = ac(); if (!c || muted) return
  if (!noiseBuf) {
    noiseBuf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate)
    const d = noiseBuf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  }
  const t0 = c.currentTime + delay
  const s = c.createBufferSource(); s.buffer = noiseBuf
  const f = c.createBiquadFilter(); f.type = type; f.Q.value = q
  f.frequency.setValueAtTime(freq, t0)
  if (freqEnd) f.frequency.exponentialRampToValueAtTime(freqEnd, t0 + dur)
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.linearRampToValueAtTime(vol, t0 + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  s.connect(f); f.connect(g); g.connect(master)
  s.start(t0, Math.random()); s.stop(t0 + dur + 0.05)
}

const NOTE = (n) => 440 * Math.pow(2, (n - 69) / 12)

export const sfx = {
  pop() { tone({ freq: 900, freqEnd: 300, dur: 0.12, vol: 0.35, type: 'sine' }) },
  blip(n = 0) { tone({ freq: NOTE(62 + n), dur: 0.09, vol: 0.2, type: 'triangle' }) },
  tick() { tone({ freq: 1400, dur: 0.05, vol: 0.15, type: 'triangle' }) },
  click() { tone({ freq: 600, freqEnd: 900, dur: 0.07, vol: 0.2, type: 'triangle' }) },
  // ¡Clack! de la cámara
  clack() {
    noise({ dur: 0.05, vol: 0.9, freq: 2500, q: 0.8 })
    tone({ freq: 180, freqEnd: 80, dur: 0.08, vol: 0.5, type: 'square' })
    noise({ dur: 0.07, vol: 0.7, freq: 1800, q: 0.8, delay: 0.09 })
    tone({ freq: 140, freqEnd: 70, dur: 0.08, vol: 0.4, type: 'square', delay: 0.09 })
  },
  whoosh() { noise({ dur: 0.5, vol: 0.5, freq: 300, freqEnd: 3500, q: 2, attack: 0.15 }) },
  swoosh() { noise({ dur: 0.35, vol: 0.4, freq: 2500, freqEnd: 400, q: 1.5, attack: 0.05 }) },
  magic() {
    ;[84, 88, 91, 96, 100, 103].forEach((n, i) => tone({ freq: NOTE(n), dur: 0.5, vol: 0.12, type: 'triangle', delay: i * 0.06 }))
    noise({ dur: 0.6, vol: 0.12, freq: 6000, q: 3, attack: 0.1 })
  },
  ding(n = 0) {
    const f = NOTE(72 + [0, 2, 4, 7, 9, 12, 14][n % 7])
    tone({ freq: f, dur: 0.6, vol: 0.3, type: 'sine' })
    tone({ freq: f * 2, dur: 0.3, vol: 0.08, type: 'sine' })
  },
  boing() { tone({ freq: 140, freqEnd: 520, dur: 0.35, vol: 0.35, type: 'sine', curve: 'lin' }); tone({ freq: 520, freqEnd: 260, dur: 0.25, vol: 0.2, type: 'sine', delay: 0.3 }) },
  freeze() {
    ;[96, 100, 103, 107, 108].forEach((n, i) => tone({ freq: NOTE(n), dur: 1.4, vol: 0.07, type: 'sine', delay: i * 0.04, attack: 0.05 }))
    noise({ dur: 1.0, vol: 0.25, freq: 7000, freqEnd: 3000, q: 2, attack: 0.02 })
  },
  fanfare() {
    const seq = [[67, 0, 0.15], [72, 0.15, 0.15], [76, 0.3, 0.15], [79, 0.45, 0.5], [76, 0.85, 0.15], [79, 1.0, 0.8]]
    seq.forEach(([n, d, len]) => {
      tone({ freq: NOTE(n), dur: len, vol: 0.18, type: 'square', delay: d, release: len + 0.1 })
      tone({ freq: NOTE(n - 12), dur: len, vol: 0.15, type: 'triangle', delay: d, release: len + 0.1 })
    })
  },
  tada() {
    ;[[72, 0], [76, 0.08], [79, 0.16], [84, 0.24]].forEach(([n, d]) => tone({ freq: NOTE(n), dur: 0.7, vol: 0.16, type: 'triangle', delay: d }))
    noise({ dur: 0.5, vol: 0.15, freq: 8000, q: 2, delay: 0.24 })
  },
  clank() {
    ;[523, 1187, 1755, 2390].forEach((f, i) => tone({ freq: f, dur: 0.8 - i * 0.12, vol: 0.18 - i * 0.03, type: 'sine' }))
    noise({ dur: 0.12, vol: 0.6, freq: 900, q: 1 })
  },
  beep(hi = false) { tone({ freq: hi ? 1320 : 660, dur: hi ? 0.5 : 0.18, vol: 0.3, type: 'square', release: hi ? 0.5 : 0.18 }) },
  zap() { tone({ freq: 1600, freqEnd: 200, dur: 0.25, vol: 0.15, type: 'sawtooth' }) },
  ouch() { tone({ freq: 700, freqEnd: 350, dur: 0.35, vol: 0.25, type: 'triangle' }); tone({ freq: 720, freqEnd: 340, dur: 0.35, vol: 0.12, type: 'sine' }) },
  thud() { tone({ freq: 120, freqEnd: 40, dur: 0.25, vol: 0.6, type: 'sine' }); noise({ dur: 0.12, vol: 0.4, freq: 400, q: 1 }) },
  scan() { tone({ freq: 300, freqEnd: 900, dur: 1.2, vol: 0.06, type: 'sawtooth', curve: 'lin', attack: 0.2 }) },
  wrong() { tone({ freq: 300, freqEnd: 200, dur: 0.3, vol: 0.2, type: 'square' }) },
  step() { tone({ freq: 220, freqEnd: 120, dur: 0.06, vol: 0.12, type: 'sine' }) },
  // Voces de animales "de dibujo animado"
  guau() {
    const c = ac(); if (!c || muted) return
    for (let k = 0; k < 2; k++) {
      const d = k * 0.32
      noise({ dur: 0.16, vol: 0.5, freq: 900, q: 1.2, delay: d })
      tone({ freq: 420, freqEnd: 200, dur: 0.18, vol: 0.35, type: 'sawtooth', delay: d })
      tone({ freq: 210, freqEnd: 110, dur: 0.18, vol: 0.3, type: 'square', delay: d })
    }
  },
  miau() {
    const c = ac(); if (!c || muted) return
    const t0 = c.currentTime
    const o = c.createOscillator(); o.type = 'sawtooth'
    o.frequency.setValueAtTime(520, t0)
    o.frequency.linearRampToValueAtTime(820, t0 + 0.25)
    o.frequency.linearRampToValueAtTime(560, t0 + 0.75)
    const f = c.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 4
    f.frequency.setValueAtTime(900, t0)
    f.frequency.linearRampToValueAtTime(2200, t0 + 0.3)
    f.frequency.linearRampToValueAtTime(1100, t0 + 0.75)
    const g = c.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.linearRampToValueAtTime(0.6, t0 + 0.08)
    g.gain.linearRampToValueAtTime(0.45, t0 + 0.5)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.8)
    o.connect(f); f.connect(g); g.connect(master)
    o.start(t0); o.stop(t0 + 0.85)
  },
  blup() { [0, 0.15, 0.27].forEach((d, i) => tone({ freq: 300 + i * 120, freqEnd: 900 + i * 200, dur: 0.1, vol: 0.25, type: 'sine', delay: d })) },
  squeak() { tone({ freq: 1200, freqEnd: 1800, dur: 0.15, vol: 0.15, type: 'sine' }); tone({ freq: 1800, freqEnd: 1100, dur: 0.2, vol: 0.12, type: 'sine', delay: 0.15 }) },
  robot() { [[600, 0], [900, 0.12], [450, 0.24], [1200, 0.36]].forEach(([f, d]) => tone({ freq: f, dur: 0.1, vol: 0.15, type: 'square', delay: d })) },
  heart() { [0, 0.18].forEach((d) => tone({ freq: 90, freqEnd: 50, dur: 0.15, vol: 0.6, type: 'sine', delay: d })) },
  sparkle() { [0, 0.07, 0.14].forEach((d, i) => tone({ freq: NOTE(96 + i * 4), dur: 0.25, vol: 0.08, type: 'sine', delay: d })) },
  drum(n = 3) { for (let i = 0; i < n; i++) { noise({ dur: 0.08, vol: 0.3, freq: 300, q: 1, delay: i * 0.09 }) } },
}

// Musiquilla alegre en bucle para bailar en el juego de la estatua
let musicTimer = null
export const music = {
  start() {
    const c = ac(); if (!c || musicTimer) return
    const bpm = 132, beat = 60 / bpm
    const melody = [76, 79, 81, 79, 76, 72, 74, 76, 79, 76, 74, 72, 74, 76, 72, null]
    const bass = [48, 55, 52, 55, 50, 57, 53, 57]
    let i = 0
    const tick = () => {
      if (muted) { i++; return }
      const n = melody[i % melody.length]
      if (n) tone({ freq: NOTE(n), dur: beat * 0.45, vol: 0.09, type: 'square', release: beat * 0.45 })
      if (i % 2 === 0) tone({ freq: NOTE(bass[(i / 2) % bass.length]), dur: beat * 0.9, vol: 0.14, type: 'triangle', release: beat * 0.9 })
      if (i % 4 === 2) noise({ dur: 0.06, vol: 0.12, freq: 5000, q: 1 })
      i++
    }
    tick()
    musicTimer = setInterval(tick, (beat * 1000) / 2)
  },
  stop() { clearInterval(musicTimer); musicTimer = null },
}
