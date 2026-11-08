import type { ReactNode } from 'react'
import Face, { type Mood } from '../components/companions/Face'

// Hin I, the weathered pebble, with corners added at three strengths.
// Each shape is a polygon; a wide round-joined stroke in the same colour wears every corner soft.

interface VariantProps {
  mood: Mood
  size: number
}

// I's stone
const STONE = '#DDD1BC'
const SIDE = '#CFC1A8'
const SHADE = '#B9A98D'
const CRACK = '#B5A487'
const SHINE = '#EAE1D0'
const LEAF = '#8AD866'
const LEAF_DARK = '#6FBF4C'

type Pt = [number, number]
const pts = (p: Pt[]) => p.map(([x, y]) => `${x},${y}`).join(' ')

interface Shape {
  body: Pt[]
  /** the lit top plane: shares the body's upper corners, cut across by a faceted line */
  top: Pt[]
  /** the shaded right side */
  right: Pt[]
  /** how soft the corners are (stroke width of the round join) */
  wear: number
  sprout: Pt
}

function Frame({ size, label, children }: { size: number; label: string; children: ReactNode }) {
  return (
    <svg className="rock" width={size} height={size} viewBox="0 0 240 240" role="img" aria-label={label}>
      {children}
    </svg>
  )
}

function Sprout({ mood, at }: { mood: Mood; at: Pt }) {
  const [x, y] = at
  const tilt = mood === 'happy' ? -8 : mood === 'concerned' ? 22 : 0
  return (
    <g transform={`rotate(${tilt} ${x} ${y})`} style={{ transition: 'transform .6s' }}>
      <path d={`M${x} ${y} q-1 -8 3 -12`} stroke={LEAF_DARK} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d={`M${x + 3} ${y - 8} q-16 -11 -24 1 q12 9 24 -1 z`} fill={LEAF} />
      <path d={`M${x + 4} ${y - 11} q13 -15 25 -5 q-10 13 -25 5 z`} fill={LEAF} />
    </g>
  )
}

function CorneredPebble({ mood, size, label, shape }: VariantProps & { label: string; shape: Shape }) {
  const worn = (fill: string) => ({ fill, stroke: fill, strokeWidth: shape.wear, strokeLinejoin: 'round' as const })
  const tilt = mood === 'listening' ? -4 : 0
  return (
    <Frame size={size} label={label}>
      <ellipse cx="120" cy="208" rx="80" ry="8" fill="#26313C" opacity=".06" />
      <g transform={`rotate(${tilt} 120 196)`}>
        <g className="rock-body">
          <rect x="80" y="188" width="28" height="20" rx="10" fill={STONE} stroke={SHADE} strokeWidth="3" />
          <rect x="132" y="188" width="28" height="20" rx="10" fill={STONE} stroke={SHADE} strokeWidth="3" />
          <ellipse cx="36" cy="160" rx="9" ry="14" fill={STONE} stroke={SHADE} strokeWidth="3" transform="rotate(28 36 160)" />
          <ellipse cx="204" cy="160" rx="9" ry="14" fill={STONE} stroke={SHADE} strokeWidth="3" transform="rotate(-28 204 160)" />
          <polygon points={pts(shape.body)} {...worn(SHADE)} transform="translate(-5 7)" />
          <polygon points={pts(shape.body)} {...worn(STONE)} />
          <polygon points={pts(shape.top)} {...worn(SHINE)} />
          <polygon points={pts(shape.right)} {...worn(SIDE)} />
          <ellipse cx="86" cy="88" rx="13" ry="6" fill="#F4EEE3" transform="rotate(-25 86 88)" />
          <g stroke={CRACK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M156 110 l-5 11 l7 8" />
            <path d="M58 142 l9 5 l-1 10" />
          </g>
          <g fill={SHADE}>
            <circle cx="170" cy="162" r="2" />
            <circle cx="98" cy="178" r="2" />
          </g>
          <Sprout mood={mood} at={shape.sprout} />
          <Face mood={mood} x={120} y={138} gap={24} blink />
        </g>
      </g>
    </Frame>
  )
}

// S · a few soft corners: nine sides, close to the pebble
const SOFT: Shape = {
  body: [[90, 72], [140, 68], [178, 86], [194, 118], [192, 158], [168, 182], [120, 188], [72, 182], [48, 156], [48, 108]],
  top: [[90, 72], [140, 68], [178, 86], [192, 108], [120, 102], [48, 112], [48, 108]],
  right: [[192, 108], [194, 118], [192, 158], [168, 182], [160, 184], [176, 152], [180, 112]],
  wear: 16,
  sprout: [118, 64],
}

// T · clearly cornered: eight sides, still balanced
const CORNERED: Shape = {
  body: [[82, 76], [148, 68], [188, 98], [194, 146], [174, 182], [112, 190], [56, 178], [46, 124]],
  top: [[82, 76], [148, 68], [188, 98], [191, 110], [120, 102], [51, 112]],
  right: [[191, 110], [194, 146], [174, 182], [162, 185], [174, 148], [178, 112]],
  wear: 14,
  sprout: [116, 66],
}

// U · chunky: seven uneven sides, the most stone-like
const CHUNKY: Shape = {
  body: [[88, 72], [156, 70], [194, 116], [184, 176], [122, 190], [58, 178], [46, 112]],
  top: [[88, 72], [156, 70], [190, 111], [122, 104], [50, 114], [46, 112]],
  right: [[190, 111], [194, 116], [184, 176], [166, 181], [176, 148], [178, 114]],
  wear: 12,
  sprout: [122, 66],
}

/** V · B's smooth cool-grey pebble on the soft-corner shape: no planes, no cracks */
export function HinV({ mood, size }: VariantProps) {
  const GREY = '#E3DFD8'
  const GREY_SHADE = '#C2BBB0'
  const worn = (fill: string) => ({ fill, stroke: fill, strokeWidth: SOFT.wear, strokeLinejoin: 'round' as const })
  const tilt = mood === 'listening' ? -4 : 0
  return (
    <Frame size={size} label="Hin V, smooth pebble with soft corners">
      <ellipse cx="120" cy="208" rx="80" ry="8" fill="#26313C" opacity=".06" />
      <g transform={`rotate(${tilt} 120 196)`}>
        <g className="rock-body">
          <rect x="80" y="188" width="28" height="20" rx="10" fill={GREY} stroke={GREY_SHADE} strokeWidth="3" />
          <rect x="132" y="188" width="28" height="20" rx="10" fill={GREY} stroke={GREY_SHADE} strokeWidth="3" />
          <ellipse cx="36" cy="160" rx="9" ry="14" fill={GREY} stroke={GREY_SHADE} strokeWidth="3" transform="rotate(28 36 160)" />
          <ellipse cx="204" cy="160" rx="9" ry="14" fill={GREY} stroke={GREY_SHADE} strokeWidth="3" transform="rotate(-28 204 160)" />
          <polygon points={pts(SOFT.body)} {...worn(GREY_SHADE)} transform="translate(-5 7)" />
          <polygon points={pts(SOFT.body)} {...worn(GREY)} />
          <ellipse cx="84" cy="94" rx="16" ry="9" fill="#F3F1EC" transform="rotate(-35 84 94)" />
          <g fill={GREY_SHADE}>
            <circle cx="170" cy="102" r="2.5" />
            <circle cx="182" cy="150" r="2" />
            <circle cx="66" cy="160" r="2" />
          </g>
          <Sprout mood={mood} at={SOFT.sprout} />
          <Face mood={mood} x={120} y={136} gap={24} blink />
        </g>
      </g>
    </Frame>
  )
}

export const HinS = (p: VariantProps) => <CorneredPebble {...p} label="Hin S, weathered pebble with soft corners" shape={SOFT} />
export const HinT = (p: VariantProps) => <CorneredPebble {...p} label="Hin T, cornered weathered pebble" shape={CORNERED} />
export const HinU = (p: VariantProps) => <CorneredPebble {...p} label="Hin U, chunky weathered pebble" shape={CHUNKY} />

export const HIN_CORNERS = [
  { key: 'S', name: 'Soft corners', note: 'Hin I with nine gentle sides. Still a pebble, just a little more stone-like.', Comp: HinS, isNew: true },
  { key: 'T', name: 'Cornered', note: 'Eight clear sides, still balanced. Corners you can see, worn soft.', Comp: HinT, isNew: true },
  { key: 'U', name: 'Chunky', note: 'Seven uneven sides. The most like a real broken-off stone.', Comp: HinU, isNew: true },
  { key: 'V', name: 'Smooth, soft corners', note: 'Hin B’s smooth cool-grey pebble on the soft-corner shape. No planes or cracks: clean and friendly, just less round.', Comp: HinV, isNew: true },
]
