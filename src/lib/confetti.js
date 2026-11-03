import confetti from 'canvas-confetti'

let shoot = null
let boneShape = null
function get() {
  if (!shoot) {
    const canvas = document.createElement('canvas')
    canvas.className = 'confetti-canvas'
    document.body.appendChild(canvas)
    shoot = confetti.create(canvas, { resize: true, useWorker: false })
    try {
      boneShape = confetti.shapeFromPath({ path: 'M2 4 a2 2 0 1 1 3-2 h10 a2 2 0 1 1 3 2 a2 2 0 1 1 -3 2 h-10 a2 2 0 1 1 -3 -2 z' })
    } catch { boneShape = null }
  }
  return shoot
}

const COLORS = ['#ffd23f', '#ff5fa2', '#3fe0ff', '#7cff6b', '#a77bff', '#ff8c42', '#ffffff']

export function party(opts = {}) {
  const s = get()
  const base = { particleCount: 120, spread: 90, startVelocity: 55, colors: COLORS, scalar: 1.4, ticks: 260, ...opts }
  s({ ...base, angle: 60, origin: { x: 0, y: 0.9 } })
  s({ ...base, angle: 120, origin: { x: 1, y: 0.9 } })
}

export function burst(x = 0.5, y = 0.5, opts = {}) {
  get()({ particleCount: 70, spread: 360, startVelocity: 35, colors: COLORS, scalar: 1.3, origin: { x, y }, ticks: 180, ...opts })
}

export function bones(opts = {}) {
  const s = get()
  const shapes = boneShape ? [boneShape] : ['circle']
  s({ particleCount: 60, spread: 160, startVelocity: 45, scalar: 3, colors: ['#ffffff', '#e9f6ff', '#fff3c4'], shapes, origin: { x: 0.5, y: 0.3 }, ticks: 300, gravity: 0.8, ...opts })
}

export function snow(opts = {}) {
  const s = get()
  s({ particleCount: 80, spread: 180, startVelocity: 20, scalar: 1.6, colors: ['#ffffff', '#cdf3ff', '#9be7ff'], shapes: ['circle'], origin: { x: 0.5, y: 0 }, gravity: 0.4, ticks: 400, ...opts })
}
