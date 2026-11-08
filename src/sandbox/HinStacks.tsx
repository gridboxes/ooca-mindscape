import type { ReactNode } from 'react'
import Face, { type Mood } from '../components/companions/Face'
import { LICHEN, LICHEN_DARK, StoicFace } from './HinStoic'

// More takes on Hin G, the stacked stones. Balance is the Stoic idea: the stack stays up
// as long as each stone sits steady, and the head stone wobbles when Hin is worried.

interface VariantProps {
  mood: Mood
  size: number
}

const SHADE = '#B9A98D'
const LEAF = '#8AD866'
const LEAF_DARK = '#6FBF4C'

interface Stone {
  cx: number
  cy: number
  rx: number
  ry: number
  fill: string
}

function Frame({ size, label, children }: { size: number; label: string; children: ReactNode }) {
  return (
    <svg className="rock" width={size} height={size} viewBox="0 0 240 240" role="img" aria-label={label}>
      {children}
    </svg>
  )
}

const Shadow = ({ rx = 70 }: { rx?: number }) => <ellipse cx="120" cy="206" rx={rx} ry="7" fill="#26313C" opacity=".06" />

function StoneShape({ s, shine = false }: { s: Stone; shine?: boolean }) {
  return (
    <g>
      <ellipse cx={s.cx - 4} cy={s.cy + 5} rx={s.rx} ry={s.ry} fill={SHADE} />
      <ellipse cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} fill={s.fill} />
      {shine && <ellipse cx={s.cx - s.rx * 0.45} cy={s.cy - s.ry * 0.5} rx={s.rx * 0.22} ry={s.ry * 0.14} fill="#F5F0E6" transform={`rotate(-30 ${s.cx - s.rx * 0.45} ${s.cy - s.ry * 0.5})`} />}
    </g>
  )
}

function Sprout({ mood, x, y }: { mood: Mood; x: number; y: number }) {
  const tilt = mood === 'happy' ? -8 : mood === 'concerned' ? 22 : 0
  return (
    <g transform={`rotate(${tilt} ${x} ${y})`}>
      <path d={`M${x} ${y} q-1 -8 3 -12`} stroke={LEAF_DARK} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d={`M${x + 3} ${y - 8} q-16 -11 -24 1 q12 9 24 -1 z`} fill={LEAF} />
      <path d={`M${x + 4} ${y - 11} q13 -15 25 -5 q-10 13 -25 5 z`} fill={LEAF} />
    </g>
  )
}

const Arms = ({ y, spread, fill }: { y: number; spread: number; fill: string }) => (
  <g>
    <ellipse cx={120 - spread} cy={y} rx="8" ry="12" fill={fill} stroke={SHADE} strokeWidth="3" transform={`rotate(30 ${120 - spread} ${y})`} />
    <ellipse cx={120 + spread} cy={y} rx="8" ry="12" fill={fill} stroke={SHADE} strokeWidth="3" transform={`rotate(-30 ${120 + spread} ${y})`} />
  </g>
)

// The head wobbles on the stack: steady when calm, tipping when concerned
const wobble = (mood: Mood, k = 1) => (mood === 'happy' ? -3 : mood === 'concerned' ? 9 : mood === 'listening' ? -8 : 0) * k

function Head({ mood, s, pivotY, children }: { mood: Mood; s: Stone; pivotY: number; children: ReactNode }) {
  return (
    <g transform={`rotate(${wobble(mood)} ${s.cx} ${pivotY})`}>
      <StoneShape s={s} shine />
      {children}
    </g>
  )
}

/** G1 · Two stones: just a big head on one body stone, simpler and chunkier */
export function HinG1({ mood, size }: VariantProps) {
  const body: Stone = { cx: 120, cy: 172, rx: 62, ry: 28, fill: '#D3C6AF' }
  const head: Stone = { cx: 120, cy: 104, rx: 54, ry: 46, fill: '#E8E0D0' }
  return (
    <Frame size={size} label="Hin G1, two stacked stones">
      <Shadow />
      <g className="rock-body">
        <Arms y={168} spread={64} fill="#DDD1BC" />
        <StoneShape s={body} />
        <Head mood={mood} s={head} pivotY={148}>
          <Sprout mood={mood} x={120} y={59} />
          <Face mood={mood} x={120} y={106} gap={22} blink />
        </Head>
      </g>
    </Frame>
  )
}

/** G2 · Stoic stack: heavy-lidded calm face and lichen brows instead of a sprout */
export function HinG2({ mood, size }: VariantProps) {
  const base: Stone = { cx: 120, cy: 182, rx: 62, ry: 16, fill: '#CFC3AD' }
  const body: Stone = { cx: 120, cy: 146, rx: 46, ry: 22, fill: '#DDD1BC' }
  const head: Stone = { cx: 120, cy: 86, rx: 44, ry: 38, fill: '#E8E0D0' }
  return (
    <Frame size={size} label="Hin G2, Stoic stacked stones">
      <Shadow />
      <g className="rock-body">
        <StoneShape s={base} />
        <Arms y={146} spread={50} fill="#DDD1BC" />
        <StoneShape s={body} />
        <Head mood={mood} s={head} pivotY={124}>
          <g fill={LICHEN}>
            <circle cx="138" cy="54" r="6" />
            <circle cx="147" cy="59" r="4" />
          </g>
          <StoicFace mood={mood} x={120} y={90} gap={18} brows />
        </Head>
      </g>
    </Frame>
  )
}

/** G3 · Leaning balance: each stone sits off-centre, yet the stack holds. Steady through imbalance. */
export function HinG3({ mood, size }: VariantProps) {
  const base: Stone = { cx: 112, cy: 184, rx: 60, ry: 15, fill: '#CFC3AD' }
  const body: Stone = { cx: 132, cy: 150, rx: 44, ry: 20, fill: '#DDD1BC' }
  const head: Stone = { cx: 114, cy: 94, rx: 42, ry: 36, fill: '#E8E0D0' }
  return (
    <Frame size={size} label="Hin G3, a leaning but balanced stack">
      <Shadow />
      <g className="rock-body">
        <StoneShape s={base} />
        <ellipse cx="82" cy="148" rx="8" ry="12" fill="#DDD1BC" stroke={SHADE} strokeWidth="3" transform="rotate(30 82 148)" />
        <ellipse cx="180" cy="146" rx="8" ry="12" fill="#DDD1BC" stroke={SHADE} strokeWidth="3" transform="rotate(-30 180 146)" />
        <StoneShape s={body} />
        <g transform={`rotate(${wobble(mood, 1.4)} 124 130)`}>
          <StoneShape s={head} shine />
          <Sprout mood={mood} x={114} y={59} />
          <Face mood={mood} x={114} y={96} gap={18} blink />
        </g>
      </g>
    </Frame>
  )
}

/** G4 · Tall cairn: four stones, a trail marker that shows the way. The smallest stone is the head. */
export function HinG4({ mood, size }: VariantProps) {
  const stones: Stone[] = [
    { cx: 120, cy: 190, rx: 58, ry: 13, fill: '#CABEA7' },
    { cx: 118, cy: 162, rx: 46, ry: 16, fill: '#D3C6AF' },
    { cx: 122, cy: 130, rx: 38, ry: 17, fill: '#DDD1BC' },
  ]
  const head: Stone = { cx: 120, cy: 82, rx: 34, ry: 30, fill: '#E8E0D0' }
  return (
    <Frame size={size} label="Hin G4, a tall cairn">
      <Shadow rx={62} />
      <g className="rock-body">
        <StoneShape s={stones[0]} />
        <StoneShape s={stones[1]} />
        <Arms y={130} spread={42} fill="#DDD1BC" />
        <StoneShape s={stones[2]} />
        <Head mood={mood} s={head} pivotY={112}>
          <Sprout mood={mood} x={120} y={53} />
          <Face mood={mood} x={120} y={84} gap={15} blink />
        </Head>
      </g>
    </Frame>
  )
}

/** G5 · Bearded stack: the head stone wears a moss beard, a philosopher on a pedestal of stones */
export function HinG5({ mood, size }: VariantProps) {
  const base: Stone = { cx: 120, cy: 184, rx: 60, ry: 15, fill: '#CFC3AD' }
  const body: Stone = { cx: 120, cy: 150, rx: 46, ry: 21, fill: '#DDD1BC' }
  const head: Stone = { cx: 120, cy: 86, rx: 46, ry: 40, fill: '#E8E0D0' }
  return (
    <Frame size={size} label="Hin G5, stacked stones with a moss beard">
      <Shadow />
      <g className="rock-body">
        <StoneShape s={base} />
        <Arms y={150} spread={50} fill="#DDD1BC" />
        <StoneShape s={body} />
        <Head mood={mood} s={head} pivotY={126}>
          <StoicFace mood={mood} x={120} y={80} gap={18} brows />
          {/* moss beard below the mouth */}
          <g fill={LICHEN}>
            <path d="M94 100 C98 112 108 122 120 123 C132 122 142 112 146 100 C138 106 130 108 120 108 C110 108 102 106 94 100 Z" />
            <circle cx="102" cy="114" r="5" />
            <circle cx="111" cy="120" r="5" />
            <circle cx="120" cy="122" r="5" />
            <circle cx="129" cy="120" r="5" />
            <circle cx="138" cy="114" r="5" />
          </g>
          <circle cx="114" cy="114" r="1.8" fill={LICHEN_DARK} />
          <circle cx="128" cy="116" r="1.8" fill={LICHEN_DARK} />
        </Head>
      </g>
    </Frame>
  )
}

/** G6 · River stack: the stack stands in a stream; the water rises around the base when worried */
export function HinG6({ mood, size }: VariantProps) {
  const base: Stone = { cx: 120, cy: 182, rx: 62, ry: 16, fill: '#CFC3AD' }
  const body: Stone = { cx: 120, cy: 146, rx: 46, ry: 22, fill: '#DDD1BC' }
  const head: Stone = { cx: 120, cy: 88, rx: 44, ry: 38, fill: '#E8E0D0' }
  const water = mood === 'concerned' ? 172 : mood === 'happy' ? 190 : 182
  return (
    <Frame size={size} label="Hin G6, stacked stones in a stream">
      <g className="rock-body">
        <StoneShape s={base} />
        <Arms y={146} spread={50} fill="#DDD1BC" />
        <StoneShape s={body} />
        <Head mood={mood} s={head} pivotY={124}>
          <Sprout mood={mood} x={120} y={51} />
          <Face mood={mood} x={120} y={90} gap={18} blink />
        </Head>
      </g>
      {/* the stream in front of the base */}
      <path d={`M24 ${water + 8} C60 ${water - 2} 180 ${water - 2} 216 ${water + 8} C216 ${water + 34} 24 ${water + 34} 24 ${water + 8} Z`} fill="#C7DDF7" opacity=".9" />
      <g className="hin-wave" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d={`M40 ${water + 14} q14 -5 28 0`} />
        <path d={`M160 ${water + 16} q14 -5 28 0`} />
      </g>
    </Frame>
  )
}

export const HIN_STACKS = [
  { key: 'G1', name: 'Two stones', note: 'A big head on one body stone. Simpler and chunkier, the face reads larger.', Comp: HinG1, isNew: true },
  { key: 'G2', name: 'Stoic stack', note: 'Heavy-lidded calm face and lichen brows instead of a sprout. The Stoic version of G.', Comp: HinG2, isNew: true },
  { key: 'G3', name: 'Leaning balance', note: 'Each stone sits off-centre, yet the stack holds: steady through imbalance. The head wobbles more.', Comp: HinG3, isNew: true },
  { key: 'G4', name: 'Tall cairn', note: 'Four stones, like a trail marker that shows the way. The smallest stone is the head.', Comp: HinG4, isNew: true },
  { key: 'G5', name: 'Bearded stack', note: 'The head stone wears a moss beard: a philosopher on a pedestal of stones.', Comp: HinG5, isNew: true },
  { key: 'G6', name: 'River stack', note: 'The stack stands in a stream. The water rises around it when worried; Hin stays put.', Comp: HinG6, isNew: true },
]
