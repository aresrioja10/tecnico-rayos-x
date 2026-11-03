import React from 'react'
import { Outlined, Line, Stroke, Circle, Ellipse, Rect, Path, Polygon, Detail, RealBone, add, sub, mul, norm } from './prims.jsx'
import { gearPath } from './Machine.jsx'

// Colores de la versión "radiografía"
// (se pintan opacos dentro de un grupo semitransparente para que no se noten los solapes)
export const SOFT = '#86bfff'
export const SOFT_LINE = '#d4ebff'
export const SOFT_OP = 0.2
export const BONE = '#eaf6ff'

const bez2 = (p0, c, p1, t) => [
  (1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * c[0] + t * t * p1[0],
  (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * c[1] + t * t * p1[1],
]
const bez3 = (p0, c1, c2, p1, t) => {
  const u = 1 - t
  return [
    u * u * u * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p1[0],
    u * u * u * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p1[1],
  ]
}
const angOf = (a, b) => (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI

function Chain({ pts, w, gap = 5 }) {
  return pts.slice(1).map((p, i) => <RealBone key={i} a={pts[i]} b={p} w={Array.isArray(w) ? w[i] : w} gap={gap} fill={BONE} />)
}

function LegSkin({ pts, ws, fill, paw }) {
  return (
    <>
      {pts.slice(1, -1).map((p, i) => <Line key={i} x1={pts[i][0]} y1={pts[i][1]} x2={p[0]} y2={p[1]} w={ws[i]} fill={fill} />)}
      <Ellipse cx={paw[0]} cy={paw[1]} rx={paw[2]} ry={paw[3]} fill={fill} />
    </>
  )
}

function Vertebrae({ pts, r = [12, 9], spikes = false }) {
  return pts.map((p, i) => {
    const n = pts[Math.min(i + 1, pts.length - 1)], pr = pts[Math.max(i - 1, 0)]
    const a = angOf(pr, n)
    const rr = Array.isArray(r[0]) ? r[i] : r
    return (
      <g key={i}>
        <Ellipse cx={p[0]} cy={p[1]} rx={rr[0]} ry={rr[1]} fill={BONE} transform={`rotate(${a} ${p[0]} ${p[1]})`} />
        {spikes && <Line x1={p[0]} y1={p[1]} x2={p[0] - 3} y2={p[1] - 16} w={6} fill={BONE} />}
      </g>
    )
  })
}

// ======================= PERRO =======================
const DOG = {
  spine: [[250, 214], [420, 196], [585, 214]],
  neck: [[592, 208], [662, 148]],
  front: [[566, 286], [552, 372], [560, 448], [580, 470], [600, 480]],
  hind: [[272, 236], [318, 326], [276, 404], [290, 466], [312, 480]],
  far: [-30, -4],
  tail: [[238, 206], [180, 190], [142, 118]],
}

function DogSkin({ xray }) {
  const c = xray
    ? { body: SOFT, dark: SOFT, line: SOFT_LINE, ow: 3 }
    : { body: '#e3a35e', dark: '#c07a35', line: '#6e4119', ow: 6 }
  const off = (pts) => pts.map((p) => add(p, DOG.far))
  const tailD = `M ${DOG.tail[0][0]} ${DOG.tail[0][1]} Q ${DOG.tail[1][0]} ${DOG.tail[1][1]} ${DOG.tail[2][0]} ${DOG.tail[2][1]}`
  return (
    <g opacity={xray ? SOFT_OP : 1}>
      <Outlined ow={c.ow} color={c.line}>
        <LegSkin pts={off(DOG.front)} ws={[46, 38, 32]} fill={c.dark} paw={[...add([586, 474], DOG.far), 28, 14]} />
        <LegSkin pts={off(DOG.hind.slice(1))} ws={[40, 32, 30]} fill={c.dark} paw={[...add([306, 476], DOG.far), 28, 14]} />
        <Stroke d={tailD} w={24} fill={c.body} />
      </Outlined>
      <Outlined ow={c.ow} color={c.line}>
        <Path fill={c.body} d="M 596 196 C 540 180, 420 186, 300 190 C 246 192, 222 218, 226 252 C 232 296, 276 322, 336 330 C 410 342, 530 348, 592 330 C 640 312, 646 236, 596 196 Z" />
        <Line x1={586} y1={232} x2={668} y2={152} w={96} fill={c.body} />
        <LegSkin pts={DOG.front} ws={[50, 40, 34]} fill={c.body} paw={[586, 474, 30, 15]} />
        <Ellipse cx={290} cy={268} rx={56} ry={68} fill={c.body} transform="rotate(-20 290 268)" />
        <LegSkin pts={DOG.hind.slice(1)} ws={[42, 34, 32]} fill={c.body} paw={[306, 476, 30, 15]} />
        <Circle cx={695} cy={135} r={62} fill={c.body} />
        <Ellipse cx={762} cy={168} rx={52} ry={32} fill={c.body} />
      </Outlined>
      <Outlined ow={c.ow} color={c.line}>
        <Ellipse cx={664} cy={150} rx={26} ry={54} fill={c.dark} transform="rotate(18 664 150)" />
      </Outlined>
      {!xray && (
        <g>
          <ellipse cx={420} cy={228} rx={60} ry={30} fill="#c07a35" opacity={0.7} />
          <rect x={-10} y={-54} width={22} height={108} rx={10} fill="#ff4d5e" stroke={c.line} strokeWidth={5} transform="translate(624 196) rotate(-44)" />
          <circle cx={648} cy={226} r={14} fill="#ffd23f" stroke={c.line} strokeWidth={4} />
          <ellipse cx={810} cy={158} rx={15} ry={11} fill="#2b1d16" />
          <circle cx={806} cy={154} r={4} fill="#fff" opacity={0.7} />
          <circle cx={716} cy={120} r={10} fill="#2b1d16" />
          <circle cx={719} cy={116} r={3.5} fill="#fff" />
          <path d="M 700 98 Q 716 90 732 98" stroke="#6e4119" strokeWidth={5} fill="none" strokeLinecap="round" />
          <path d="M 812 176 Q 790 196 764 186" stroke="#6e4119" strokeWidth={5} fill="none" strokeLinecap="round" />
          <path d="M 782 190 Q 786 214 798 210 Q 806 204 798 188 Z" fill="#ff7a8a" stroke="#6e4119" strokeWidth={4} />
        </g>
      )}
    </g>
  )
}

function DogBones() {
  const sp = Array.from({ length: 14 }, (_, i) => bez2(DOG.spine[0], DOG.spine[1], DOG.spine[2], i / 13))
  const neck = Array.from({ length: 5 }, (_, i) => [DOG.neck[0][0] + (DOG.neck[1][0] - DOG.neck[0][0]) * (i / 4), DOG.neck[0][1] + (DOG.neck[1][1] - DOG.neck[0][1]) * (i / 4)])
  const tail = Array.from({ length: 11 }, (_, i) => bez2(DOG.tail[0], DOG.tail[1], DOG.tail[2], i / 10))
  const ribs = []
  for (let k = 0; k < 9; k++) {
    const tt = 0.5 + k * 0.055
    const [sx, sy] = bez2(DOG.spine[0], DOG.spine[1], DOG.spine[2], tt)
    const h = 92 + k * 3
    ribs.push(<Stroke key={k} w={8} fill={BONE} d={`M ${sx} ${sy + 6} C ${sx + 30} ${sy + 30}, ${sx + 30} ${sy + h * 0.7}, ${sx + 12} ${sy + h}`} />)
  }
  const off = (pts) => pts.map((p) => add(p, DOG.far))
  return (
    <g filter="url(#glow)">
      <Outlined ow={0}>
        <g opacity={0.55}>
          <Chain pts={off(DOG.front)} w={[18, 13, 9, 7]} />
          <Chain pts={off(DOG.hind)} w={[18, 14, 10, 7]} />
        </g>
        <Vertebrae pts={tail} r={tail.map((_, i) => [9 - i * 0.45, 7 - i * 0.35])} />
        <Path fill={BONE} d="M 228 200 L 300 214 Q 306 232 292 246 L 252 262 Q 236 256 232 240 Z" />
        <Vertebrae pts={sp} r={[13, 9]} spikes />
        <Vertebrae pts={neck} r={[13, 10]} />
        {ribs}
        <Line x1={588} y1={318} x2={476} y2={330} w={9} fill={BONE} />
        <Path fill={BONE} d="M 545 205 L 595 222 L 572 292 Q 560 300 552 290 Z" />
        <Chain pts={DOG.front} w={[18, 13, 9, 7]} />
        <Chain pts={DOG.hind} w={[18, 14, 10, 7]} />
        <Ellipse cx={690} cy={128} rx={46} ry={38} fill={BONE} />
        <Path fill={BONE} d="M 712 112 L 806 154 Q 812 168 800 176 L 712 170 Z" />
        <Path fill={BONE} d="M 690 176 L 798 184 Q 806 192 796 197 L 700 198 Q 686 190 690 176 Z" />
      </Outlined>
      <ellipse cx={712} cy={124} rx={15} ry={12} fill="#0a1630" />
      <path d="M 740 180 l 6 -9 l 6 9 M 760 181 l 6 -9 l 6 9 M 780 182 l 6 -9 l 6 9" stroke="#0a1630" strokeWidth={2} fill="none" />
    </g>
  )
}

export function Dog({ xray = false }) {
  return <g><DogSkin xray={xray} />{xray && <DogBones />}</g>
}

// ======================= GATO =======================
const CAT = {
  spine: [[256, 232], [420, 204], [590, 226]],
  neck: [[594, 220], [664, 168]],
  front: [[574, 290], [562, 376], [570, 456], [586, 474], [604, 482]],
  hind: [[282, 252], [328, 336], [286, 412], [300, 468], [320, 482]],
  far: [-26, -4],
  tail: [[246, 228], [150, 224], [118, 140], [176, 70]],
}

function CatSkin({ xray }) {
  const c = xray
    ? { body: SOFT, dark: SOFT, light: SOFT, line: SOFT_LINE, ow: 3 }
    : { body: '#8d97ad', dark: '#6f7890', light: '#eef1f7', line: '#353b4f', ow: 6 }
  const off = (pts) => pts.map((p) => add(p, CAT.far))
  const T = CAT.tail
  const tailD = `M ${T[0][0]} ${T[0][1]} C ${T[1][0]} ${T[1][1]}, ${T[2][0]} ${T[2][1]}, ${T[3][0]} ${T[3][1]}`
  return (
    <g opacity={xray ? SOFT_OP : 1}>
      <Outlined ow={c.ow} color={c.line}>
        <LegSkin pts={off(CAT.front)} ws={[36, 30, 26]} fill={c.dark} paw={[...add([594, 478], CAT.far), 24, 12]} />
        <LegSkin pts={off(CAT.hind.slice(1))} ws={[32, 26, 24]} fill={c.dark} paw={[...add([314, 478], CAT.far), 24, 12]} />
        <Stroke d={tailD} w={22} fill={c.body} />
      </Outlined>
      <Outlined ow={c.ow} color={c.line}>
        <Path fill={c.body} d="M 600 214 C 540 196, 420 200, 300 214 C 252 220, 232 240, 236 266 C 242 300, 280 318, 340 320 C 420 330, 530 332, 590 316 C 630 300, 638 236, 600 214 Z" />
        <Line x1={590} y1={236} x2={668} y2={170} w={78} fill={c.body} />
        <LegSkin pts={CAT.front} ws={[40, 32, 28]} fill={c.body} paw={[594, 478, 26, 13]} />
        <Ellipse cx={298} cy={282} rx={46} ry={60} fill={c.body} transform="rotate(-20 298 282)" />
        <LegSkin pts={CAT.hind.slice(1)} ws={[34, 28, 26]} fill={c.body} paw={[314, 478, 26, 13]} />
        <Polygon points="646,120 660,46 704,100" fill={c.body} />
        <Polygon points="696,98 734,40 746,116" fill={c.body} />
        <Circle cx={694} cy={152} r={60} fill={c.body} />
        <Ellipse cx={744} cy={176} rx={30} ry={22} fill={c.light} />
      </Outlined>
      {!xray && (
        <g>
          <path d="M 660 64 L 668 104 L 690 100 Z" fill="#ff9fb5" />
          <path d="M 730 56 L 712 100 L 736 108 Z" fill="#ff9fb5" />
          {[[380, 205], [430, 202], [480, 204], [530, 208]].map(([x, y], i) => <path key={i} d={`M ${x} ${y} q 10 30 0 52`} stroke="#6f7890" strokeWidth={10} fill="none" strokeLinecap="round" />)}
          <ellipse cx={700} cy={140} rx={14} ry={17} fill="#7cd957" stroke="#353b4f" strokeWidth={3} />
          <ellipse cx={742} cy={138} rx={12} ry={15} fill="#7cd957" stroke="#353b4f" strokeWidth={3} />
          <ellipse cx={702} cy={141} rx={4} ry={12} fill="#1b2030" />
          <ellipse cx={744} cy={139} rx={3.5} ry={10} fill="#1b2030" />
          <path d="M 760 168 L 772 168 L 766 177 Z" fill="#ff8fa3" stroke="#353b4f" strokeWidth={3} strokeLinejoin="round" />
          <path d="M 766 178 Q 762 190 750 188 M 766 178 Q 770 190 782 186" stroke="#353b4f" strokeWidth={3.5} fill="none" strokeLinecap="round" />
          {[-1, 0, 1].map((k) => <line key={k} x1={782} y1={176 + k * 7} x2={840} y2={168 + k * 14} stroke="#353b4f" strokeWidth={2.5} strokeLinecap="round" />)}
          {[-1, 0, 1].map((k) => <line key={'l' + k} x1={730} y1={180 + k * 7} x2={680} y2={178 + k * 14} stroke="#353b4f" strokeWidth={2.5} strokeLinecap="round" />)}
        </g>
      )}
    </g>
  )
}

function CatBones() {
  const sp = Array.from({ length: 15 }, (_, i) => bez2(CAT.spine[0], CAT.spine[1], CAT.spine[2], i / 14))
  const neck = Array.from({ length: 5 }, (_, i) => [CAT.neck[0][0] + (CAT.neck[1][0] - CAT.neck[0][0]) * (i / 4), CAT.neck[0][1] + (CAT.neck[1][1] - CAT.neck[0][1]) * (i / 4)])
  const T = CAT.tail
  const tail = Array.from({ length: 20 }, (_, i) => bez3(T[0], T[1], T[2], T[3], i / 19))
  const ribs = []
  for (let k = 0; k < 10; k++) {
    const tt = 0.48 + k * 0.05
    const [sx, sy] = bez2(CAT.spine[0], CAT.spine[1], CAT.spine[2], tt)
    const h = 74 + k * 2.5
    ribs.push(<Stroke key={k} w={6} fill={BONE} d={`M ${sx} ${sy + 5} C ${sx + 24} ${sy + 24}, ${sx + 24} ${sy + h * 0.7}, ${sx + 10} ${sy + h}`} />)
  }
  const off = (pts) => pts.map((p) => add(p, CAT.far))
  return (
    <g filter="url(#glow)">
      <Outlined ow={0}>
        <g opacity={0.55}>
          <Chain pts={off(CAT.front)} w={[14, 11, 7, 6]} />
          <Chain pts={off(CAT.hind)} w={[15, 12, 8, 6]} />
        </g>
        <Vertebrae pts={tail} r={tail.map((_, i) => [8 - i * 0.2, 6 - i * 0.16])} />
        <Path fill={BONE} d="M 236 216 L 304 230 Q 310 246 296 258 L 260 272 Q 244 266 240 252 Z" />
        <Vertebrae pts={sp} r={[11, 8]} spikes />
        <Vertebrae pts={neck} r={[11, 9]} />
        {ribs}
        <Line x1={592} y1={308} x2={486} y2={318} w={8} fill={BONE} />
        <Path fill={BONE} d="M 552 222 L 598 236 L 578 300 Q 566 306 558 296 Z" />
        <Chain pts={CAT.front} w={[14, 11, 7, 6]} />
        <Chain pts={CAT.hind} w={[15, 12, 8, 6]} />
        <Ellipse cx={692} cy={146} rx={46} ry={40} fill={BONE} />
        <Path fill={BONE} d="M 716 130 L 768 160 Q 772 174 762 180 L 716 178 Z" />
        <Path fill={BONE} d="M 690 182 L 760 186 Q 766 194 756 198 L 698 198 Q 686 192 690 182 Z" />
      </Outlined>
      <ellipse cx={716} cy={140} rx={18} ry={17} fill="#0a1630" />
      <path d="M 726 184 l 5 -10 l 5 10" stroke="#0a1630" strokeWidth={2.5} fill="none" />
    </g>
  )
}

export function Cat({ xray = false }) {
  return <g><CatSkin xray={xray} />{xray && <CatBones />}</g>
}

// ======================= PEZ =======================
const FISH_C = [475, 262], FISH_R = [245, 125]
const hh = (x) => FISH_R[1] * Math.sqrt(Math.max(0, 1 - ((x - FISH_C[0]) / FISH_R[0]) ** 2))

function FishSkin({ xray }) {
  const c = xray
    ? { body: SOFT, fin: SOFT, line: SOFT_LINE, ow: 3 }
    : { body: '#ffd23f', fin: '#ff8c42', line: '#9c4a10', ow: 6 }
  return (
    <g>
      <g opacity={xray ? SOFT_OP : 1}>
      <Outlined ow={c.ow} color={c.line}>
        <Path fill={c.fin} d="M 262 262 L 112 150 Q 88 262 112 374 Z" />
        <Path fill={c.fin} d="M 400 156 Q 470 52 600 146 Z" />
        <Path fill={c.fin} d="M 430 368 Q 480 446 552 378 Z" />
        <Path fill={c.body} d="M 724 262 C 694 150, 520 124, 380 150 C 300 166, 250 212, 236 262 C 250 312, 300 358, 380 374 C 520 400, 694 374, 724 262 Z" />
      </Outlined>
      </g>
      {!xray && (
        <g>
          {[[420, 220, 22], [480, 300, 18], [360, 290, 16], [540, 210, 14], [420, 330, 12]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#ffb02e" />)}
          <path d="M 602 178 Q 570 262 602 346" stroke="#e0a000" strokeWidth={6} fill="none" strokeLinecap="round" />
          <ellipse cx={555} cy={292} rx={46} ry={20} fill="#ff8c42" stroke="#9c4a10" strokeWidth={5} transform="rotate(28 555 292)" />
          <circle cx={652} cy={232} r={26} fill="#fff" stroke="#9c4a10" strokeWidth={5} />
          <circle cx={658} cy={234} r={13} fill="#1b2030" />
          <circle cx={662} cy={229} r={4.5} fill="#fff" />
          <path d="M 708 276 Q 696 292 680 286" stroke="#9c4a10" strokeWidth={5} fill="none" strokeLinecap="round" />
          {[[150, 200], [140, 262], [150, 324]].map(([x, y], i) => <path key={i} d={`M ${x + 70} ${y > 262 ? y - 30 : y > 261 ? y : y + 30} L ${x} ${y}`} stroke="#d96a1c" strokeWidth={4} strokeLinecap="round" />)}
          {[0, 1, 2, 3].map((i) => <circle key={'b' + i} cx={780 + i * 18} cy={200 - i * 40} r={8 + i * 3} fill="none" stroke="#bfe6ff" strokeWidth={4} opacity={0.8} />)}
        </g>
      )}
    </g>
  )
}

function FishBones() {
  const vs = Array.from({ length: 18 }, (_, i) => [258 + i * 20.5, 262 - i * 0.4])
  const ribs = []
  for (let x = 300; x <= 590; x += 24) {
    const h = hh(x - 20)
    ribs.push(<Stroke key={'u' + x} w={5} fill={BONE} d={`M ${x} 256 Q ${x - 8} ${262 - h * 0.5} ${x - 26} ${262 - h + 18}`} />)
    ribs.push(<Stroke key={'d' + x} w={5} fill={BONE} d={`M ${x} 268 Q ${x - 8} ${262 + h * 0.5} ${x - 26} ${262 + h - 18}`} />)
  }
  const tailRays = [150, 180, 215, 262, 309, 344, 374].map((y, i) => <Line key={'t' + i} x1={262} y1={262} x2={118} y2={y} w={4} fill={BONE} />)
  const finRays = [0, 1, 2, 3, 4, 5].map((i) => <Line key={'f' + i} x1={420 + i * 30} y1={158 - i * 0.5} x2={440 + i * 26} y2={100 + Math.abs(i - 2.5) * 12} w={4} fill={BONE} />)
  return (
    <g filter="url(#glow)">
      <Outlined ow={0}>
        {tailRays}
        {finRays}
        {ribs}
        <Vertebrae pts={vs} r={[10, 8]} />
        <Path fill={BONE} d="M 616 196 Q 664 184 714 248 Q 724 282 700 304 Q 664 330 616 322 Q 630 262 616 196 Z" />
      </Outlined>
      <circle cx={652} cy={234} r={21} fill="#0a1630" />
      <path d="M 712 276 Q 696 290 680 286" stroke="#0a1630" strokeWidth={4} fill="none" />
    </g>
  )
}

export function Fish({ xray = false }) {
  return <g><FishSkin xray={xray} />{xray && <FishBones />}</g>
}

// ======================= OSITO DE PELUCHE (¡no tiene huesos!) =======================
export function Teddy({ xray = false, t = 0 }) {
  const c = xray
    ? { fur: SOFT, light: SOFT, line: SOFT_LINE, ow: 3 }
    : { fur: '#c8874f', light: '#f2d1a8', line: '#6b3e1f', ow: 7 }
  const beat = 1 + Math.max(0, Math.sin(t * 7)) * 0.12
  return (
    <g>
      <g opacity={xray ? SOFT_OP : 1}>
      <Outlined ow={c.ow} color={c.line}>
        <Circle cx={190} cy={140} r={52} fill={c.fur} />
        <Circle cx={410} cy={140} r={52} fill={c.fur} />
        <Ellipse cx={220} cy={600} rx={72} ry={60} fill={c.fur} />
        <Ellipse cx={380} cy={600} rx={72} ry={60} fill={c.fur} />
        <Ellipse cx={150} cy={430} rx={52} ry={96} fill={c.fur} transform="rotate(28 150 430)" />
        <Ellipse cx={450} cy={430} rx={52} ry={96} fill={c.fur} transform="rotate(-28 450 430)" />
        <Ellipse cx={300} cy={455} rx={150} ry={170} fill={c.fur} />
        <Circle cx={300} cy={235} r={132} fill={c.fur} />
      </Outlined>
      </g>
      {!xray ? (
        <g>
          <circle cx={190} cy={140} r={28} fill={c.light} />
          <circle cx={410} cy={140} r={28} fill={c.light} />
          <ellipse cx={300} cy={480} rx={92} ry={105} fill={c.light} />
          <ellipse cx={220} cy={618} rx={38} ry={28} fill={c.light} />
          <ellipse cx={380} cy={618} rx={38} ry={28} fill={c.light} />
          <ellipse cx={300} cy={286} rx={62} ry={46} fill={c.light} />
          <ellipse cx={300} cy={266} rx={24} ry={16} fill="#3b2314" />
          <path d="M 300 282 L 300 300 M 300 300 Q 284 316 270 304 M 300 300 Q 316 316 330 304" stroke="#3b2314" strokeWidth={5} fill="none" strokeLinecap="round" />
          <circle cx={248} cy={214} r={14} fill="#1b1410" /><circle cx={352} cy={214} r={14} fill="#1b1410" />
          <circle cx={253} cy={209} r={4.5} fill="#fff" /><circle cx={357} cy={209} r={4.5} fill="#fff" />
          <path d="M 300 380 L 260 356 L 260 404 Z M 300 380 L 340 356 L 340 404 Z" fill="#ff4d5e" stroke="#9e1830" strokeWidth={4} strokeLinejoin="round" />
          <circle cx={300} cy={380} r={12} fill="#ff4d5e" stroke="#9e1830" strokeWidth={4} />
          <path d="M 300 410 L 300 580" stroke="#9a6236" strokeWidth={4} strokeDasharray="10 10" />
        </g>
      ) : (
        <g>
          {Array.from({ length: 70 }, (_, i) => {
            const a = i * 2.39996, r = 20 + ((i * 53) % 150)
            const x = 300 + Math.cos(a) * r * 0.9, y = 455 + Math.sin(a) * r
            return <circle key={i} cx={x} cy={y} r={10 + (i % 4) * 4} fill="#cfe9ff" opacity={0.07} />
          })}
          {Array.from({ length: 26 }, (_, i) => {
            const a = i * 2.39996, r = 10 + ((i * 41) % 110)
            return <circle key={'h' + i} cx={300 + Math.cos(a) * r} cy={235 + Math.sin(a) * r * 0.9} r={9 + (i % 3) * 4} fill="#cfe9ff" opacity={0.07} />
          })}
          <g filter="url(#glow)">
            {[248, 352].map((x) => (
              <g key={x}>
                <circle cx={x} cy={214} r={17} fill={BONE} />
                {[[-5, -5], [5, -5], [-5, 5], [5, 5]].map(([dx, dy], k) => <circle key={k} cx={x + dx} cy={214 + dy} r={3} fill="#0a1630" />)}
              </g>
            ))}
            <ellipse cx={300} cy={266} rx={24} ry={16} fill={BONE} opacity={0.85} />
            <g transform={`translate(300 440) scale(${beat})`}>
              <path d="M 0 40 C -70 -10, -50 -70, 0 -36 C 50 -70, 70 -10, 0 40 Z" fill="#ffd6e2" stroke="#fff" strokeWidth={4} />
            </g>
            <ellipse cx={300} cy={540} rx={34} ry={22} fill={BONE} opacity={0.7} />
            <ellipse cx={300} cy={540} rx={18} ry={10} fill="#0a1630" opacity={0.6} />
          </g>
        </g>
      )}
    </g>
  )
}

// ======================= ROBOT (el truco final) =======================
export function Robot({ xray = false, t = 0 }) {
  const c = xray
    ? { body: SOFT, head: SOFT, dark: SOFT, metal: SOFT, line: SOFT_LINE, ow: 3 }
    : { body: '#7fd6e8', head: '#9fe3f0', dark: '#3b4a66', metal: '#c9d6e8', line: '#1f4f66', ow: 7 }
  const blink = (t % 1.2) < 0.6
  return (
    <g>
      <g opacity={xray ? SOFT_OP : 1}>
      <Outlined ow={c.ow} color={c.line}>
        <Line x1={300} y1={98} x2={300} y2={48} w={10} fill={c.metal} />
        <Circle cx={300} cy={40} r={20} fill={xray ? SOFT : blink ? '#ff4d5e' : '#ffd23f'} />
        <Line x1={160} y1={346} x2={92} y2={470} w={34} fill={c.metal} />
        <Line x1={92} y1={470} x2={110} y2={560} w={30} fill={c.metal} />
        <Line x1={440} y1={346} x2={508} y2={470} w={34} fill={c.metal} />
        <Line x1={508} y1={470} x2={490} y2={560} w={30} fill={c.metal} />
        <Path fill={c.dark} d="M 84 560 Q 110 610 136 560 L 124 588 Q 110 600 96 588 Z" />
        <Path fill={c.dark} d="M 464 560 Q 490 610 516 560 L 504 588 Q 490 600 476 588 Z" />
        <Rect x={196} y={570} width={74} height={120} rx={14} fill={c.metal} />
        <Rect x={330} y={570} width={74} height={120} rx={14} fill={c.metal} />
        <Rect x={172} y={678} width={116} height={48} rx={22} fill={c.dark} />
        <Rect x={312} y={678} width={116} height={48} rx={22} fill={c.dark} />
        <Rect x={268} y={270} width={64} height={44} rx={10} fill={c.dark} />
        <Rect x={150} y={300} width={300} height={282} rx={40} fill={c.body} />
        <Rect x={148} y={158} width={26} height={62} rx={10} fill={c.dark} />
        <Rect x={426} y={158} width={26} height={62} rx={10} fill={c.dark} />
        <Rect x={166} y={92} width={268} height={184} rx={44} fill={c.head} />
      </Outlined>
      </g>
      {!xray ? (
        <g>
          <circle cx={240} cy={176} r={36} fill="#fff" stroke="#1f4f66" strokeWidth={6} />
          <circle cx={360} cy={176} r={36} fill="#fff" stroke="#1f4f66" strokeWidth={6} />
          <circle cx={244} cy={180} r={17} fill="#1b2a47" /><circle cx={364} cy={180} r={17} fill="#1b2a47" />
          <circle cx={250} cy={173} r={6} fill="#fff" /><circle cx={370} cy={173} r={6} fill="#fff" />
          <rect x={236} y={226} width={128} height={30} rx={12} fill="#1b2a47" />
          {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={246 + i * 23} y={232} width={14} height={18} rx={3} fill="#fff" />)}
          <rect x={206} y={342} width={188} height={150} rx={22} fill="#1b2a47" />
          {['#ff4d5e', '#ffd23f', '#7cd957'].map((col, i) => <circle key={i} cx={246 + i * 54} cy={378} r={16} fill={col} opacity={(Math.floor(t * 3) + i) % 3 === 0 ? 1 : 0.35} />)}
          <path d="M 300 470 C 260 440, 268 410, 300 428 C 332 410, 340 440, 300 470 Z" fill="#ff5fa2" />
          <rect x={226} y={518} width={148} height={20} rx={10} fill="#3b4a66" />
        </g>
      ) : (
        <g filter="url(#glow)">
          <g transform={`translate(250 420) rotate(${t * 40})`}><path d={gearPath(64, 10)} fill={BONE} /><circle r={18} fill="#0a1630" /></g>
          <g transform={`translate(358 486) rotate(${-t * 40 * 1.3 + 9})`}><path d={gearPath(48, 8)} fill={BONE} /><circle r={13} fill="#0a1630" /></g>
          <g transform={`translate(356 360) rotate(${-t * 60})`}><path d={gearPath(30, 7)} fill={BONE} opacity={0.85} /><circle r={9} fill="#0a1630" /></g>
          <path d="M 270 292 l 60 0 M 270 300 l 60 0 M 270 286 q 30 8 60 0 q -30 8 -60 16 q 30 8 60 0" stroke={BONE} strokeWidth={5} fill="none" />
          <rect x={232} y={526} width={136} height={46} rx={10} fill="none" stroke={BONE} strokeWidth={6} />
          <rect x={368} y={538} width={12} height={22} rx={4} fill={BONE} />
          <path d="M 262 549 h 24 M 274 537 v 24 M 320 549 h 24" stroke={BONE} strokeWidth={6} strokeLinecap="round" />
          <circle cx={240} cy={176} r={34} fill="none" stroke={BONE} strokeWidth={7} />
          <circle cx={360} cy={176} r={34} fill="none" stroke={BONE} strokeWidth={7} />
          <circle cx={240} cy={176} r={12} fill={BONE} /><circle cx={360} cy={176} r={12} fill={BONE} />
          <path d="M 220 260 C 180 320, 300 320, 220 400" stroke="#ffd23f" strokeWidth={5} fill="none" opacity={0.8} />
          <path d="M 380 260 C 420 320, 300 330, 400 420" stroke="#ff8fa3" strokeWidth={5} fill="none" opacity={0.8} />
          {[[160, 346], [440, 346], [92, 470], [508, 470], [233, 600], [367, 600]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={11} fill={BONE} /><path d={`M ${x - 6} ${y} h 12`} stroke="#0a1630" strokeWidth={3} /></g>)}
          <line x1={300} y1={92} x2={300} y2={50} stroke={BONE} strokeWidth={5} />
          <circle cx={300} cy={40} r={12} fill={BONE} opacity={blink ? 1 : 0.4} />
        </g>
      )}
    </g>
  )
}
