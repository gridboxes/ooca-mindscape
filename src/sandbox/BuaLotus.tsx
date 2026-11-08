import { useEffect, useState, type ReactNode } from 'react'
import Face, { type Mood } from '../components/companions/Face'
import { CHEEK, FACE, MID, OUTER, Petal, SHADE, TIP } from './BuaVariants'

// More takes on Bua G, the true lotus (Nelumbo): a bud on its own stem rising from the water,
// with round leaves held up above the surface. Each one tries a different composition.

interface VariantProps {
  mood: Mood
  size: number
}

const LEAF = '#8AD866'
const LEAF_DARK = '#6FBF4C'
const STEM = '#6FBF4C'

function Frame({ size, label, children }: { size: number; label: string; children: ReactNode }) {
  return (
    <svg className="lotus" width={size} height={size} viewBox="0 0 240 240" role="img" aria-label={label}>
      {children}
    </svg>
  )
}

function Water() {
  return (
    <g fill="none" stroke="#8FBBEF" strokeWidth="3" strokeLinecap="round">
      <ellipse cx="120" cy="206" rx="92" ry="13" />
      <path d="M44 218 q14 -5 28 0" opacity=".7" />
      <path d="M168 220 q12 -4 24 0" opacity=".7" />
    </g>
  )
}

const Stem = ({ d }: { d: string }) => <path d={d} stroke={STEM} strokeWidth="5" strokeLinecap="round" fill="none" />

/** A round lotus leaf seen a little from above, with veins running out from its centre */
function Leaf({ cx, cy, rx, ry, tilt = 0 }: { cx: number; cy: number; rx: number; ry: number; tilt?: number }) {
  const veins = [0, 60, 120, 180, 240, 300].map((a) => {
    const r = (a * Math.PI) / 180
    return `M${cx} ${cy} L${cx + Math.cos(r) * rx * 0.86} ${cy + Math.sin(r) * ry * 0.86}`
  })
  return (
    <g transform={`rotate(${tilt} ${cx} ${cy + ry})`} style={{ transition: 'transform .6s' }}>
      <ellipse cx={cx - 4} cy={cy + 4} rx={rx} ry={ry} fill={LEAF_DARK} />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={LEAF} />
      <path d={veins.join(' ')} stroke={LEAF_DARK} strokeWidth="2" strokeLinecap="round" opacity=".55" />
      <circle cx={cx} cy={cy} r="4" fill={LEAF_DARK} />
    </g>
  )
}

/** A young lotus leaf, still rolled up like a scroll */
function YoungLeaf({ x, y, tilt = 0 }: { x: number; y: number; tilt?: number }) {
  return (
    <g transform={`rotate(${tilt} ${x} ${y})`} style={{ transition: 'transform .6s' }}>
      <path d={`M${x} ${y} C${x - 12} ${y - 20} ${x - 10} ${y - 46} ${x + 6} ${y - 58} C${x + 16} ${y - 48} ${x + 16} ${y - 22} ${x} ${y} Z`} fill={LEAF} />
      <path d={`M${x + 4} ${y - 8} C${x - 2} ${y - 22} ${x} ${y - 40} ${x + 6} ${y - 52}`} stroke={LEAF_DARK} strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </g>
  )
}

// G's bud, drawn around a base at (132, 172) and moved into place
const BUD = 'M132 64 C156 86 170 110 168 136 C166 160 152 174 132 174 C112 174 98 160 96 136 C94 110 108 86 132 64 Z'

function Bud({ mood, dx = 0, dy = 0, bloom = false }: { mood: Mood; dx?: number; dy?: number; bloom?: boolean }) {
  const open = mood === 'happy' ? 10 : mood === 'concerned' ? -6 : 0
  return (
    <g transform={`translate(${dx} ${dy})`}>
      {bloom && (
        <>
          <Petal bx={132} by={172} L={84} W={30} angle={-(62 + open)} fill={OUTER} />
          <Petal bx={132} by={172} L={84} W={30} angle={62 + open} fill={OUTER} />
        </>
      )}
      <Petal bx={132} by={172} L={88} W={34} angle={-(32 + open)} fill={bloom ? MID : OUTER} />
      <Petal bx={132} by={172} L={88} W={34} angle={32 + open} fill={bloom ? MID : OUTER} />
      <path d={BUD} fill={SHADE} transform="translate(-4 6)" />
      <path d={BUD} fill={FACE} />
      <path d="M132 64 C138 70 143 76 147 83 C137 79 127 79 117 83 C121 76 126 70 132 64 Z" fill={TIP} />
      <Face mood={mood} x={132} y={130} gap={18} cheek={CHEEK} />
    </g>
  )
}

/** I · Parasol: the leaf held over the bud like an umbrella. It lowers to shelter Bua when worried. */
export function BuaI({ mood, size }: VariantProps) {
  const lift = mood === 'happy' ? -8 : mood === 'concerned' ? 10 : 0
  return (
    <Frame size={size} label="Bua I, lotus under a leaf parasol">
      <Water />
      <Stem d="M120 60 C116 120 108 170 100 208" />
      <g transform={`translate(0 ${lift}) rotate(-7 120 60)`} style={{ transition: 'transform .6s' }}>
        <path d="M54 64 C66 30 174 30 186 64 C152 56 88 56 54 64 Z" fill={LEAF} />
        <path d="M54 64 C88 56 152 56 186 64 C176 70 64 70 54 64 Z" fill={LEAF_DARK} />
        <path d="M120 40 L120 58 M120 40 L80 54 M120 40 L160 54" stroke={LEAF_DARK} strokeWidth="2" strokeLinecap="round" opacity=".55" />
      </g>
      <Stem d="M132 172 C132 186 130 198 128 208" />
      <Bud mood={mood} dx={-12} dy={10} />
    </Frame>
  )
}

/** J · Bloom on a stem: the open flower raised above the water, a leaf behind it */
export function BuaJ({ mood, size }: VariantProps) {
  const leafTilt = mood === 'listening' ? -8 : mood === 'concerned' ? 6 : 0
  return (
    <Frame size={size} label="Bua J, open lotus bloom on a stem">
      <Water />
      <Stem d="M182 142 C180 168 172 190 164 208" />
      <Leaf cx={180} cy={108} rx={48} ry={38} tilt={leafTilt} />
      <Stem d="M120 178 C120 190 118 200 116 208" />
      <Bud mood={mood} dx={-12} dy={8} bloom />
    </Frame>
  )
}

/** K · Two leaves: a big open leaf and a young rolled one, the bud between them */
export function BuaK({ mood, size }: VariantProps) {
  const leafTilt = mood === 'listening' ? -8 : mood === 'concerned' ? 6 : 0
  const young = mood === 'happy' ? -10 : mood === 'concerned' ? 12 : 0
  return (
    <Frame size={size} label="Bua K, lotus between two leaves">
      <Water />
      <Stem d="M64 134 C66 164 76 190 84 208" />
      <Leaf cx={62} cy={100} rx={46} ry={36} tilt={leafTilt} />
      <Stem d="M196 150 C196 176 190 196 184 208" />
      <YoungLeaf x={196} y={152} tilt={young} />
      <Stem d="M132 172 C132 186 130 198 128 208" />
      <Bud mood={mood} dx={-6} dy={8} />
    </Frame>
  )
}

/** L · Leaf halo: one big round leaf right behind the bud, a simple, iconic circle */
export function BuaL({ mood, size }: VariantProps) {
  return (
    <Frame size={size} label="Bua L, lotus in front of a round leaf">
      <Water />
      <Stem d="M150 170 C156 186 160 198 162 208" />
      <Leaf cx={124} cy={110} rx={74} ry={66} tilt={mood === 'listening' ? -6 : 0} />
      <Stem d="M120 178 C120 190 120 200 120 208" />
      <Bud mood={mood} dx={-12} dy={10} />
    </Frame>
  )
}

/** M · Leaf hands: two small leaves on the stem work as arms, like mooca's and Hin's */
export function BuaM({ mood, size }: VariantProps) {
  // The little leaves lift when happy and droop when worried
  const arm = mood === 'happy' ? -22 : mood === 'concerned' ? 18 : mood === 'listening' ? -6 : 0
  return (
    <Frame size={size} label="Bua M, lotus with leaf hands">
      <Water />
      <Stem d="M60 140 C64 168 74 192 82 208" />
      <Leaf cx={56} cy={110} rx={40} ry={32} tilt={mood === 'concerned' ? 6 : 0} />
      <Stem d="M126 172 C126 188 124 198 122 208" />
      {/* leaf arms tuck in behind the bud's sides, like mooca's */}
      <g transform={`rotate(${arm} 100 158)`} style={{ transition: 'transform .6s' }}>
        <path d="M100 158 C88 146 72 146 62 154 C72 166 90 168 100 158 Z" fill={LEAF} />
        <path d="M98 157 C88 153 76 152 66 155" stroke={LEAF_DARK} strokeWidth="2" strokeLinecap="round" fill="none" opacity=".6" />
      </g>
      <g transform={`rotate(${-arm} 152 158)`} style={{ transition: 'transform .6s' }}>
        <path d="M152 158 C164 146 180 146 190 154 C180 166 162 168 152 158 Z" fill={LEAF} />
        <path d="M154 157 C164 153 176 152 186 155" stroke={LEAF_DARK} strokeWidth="2" strokeLinecap="round" fill="none" opacity=".6" />
      </g>
      <Bud mood={mood} dx={-8} dy={2} />
    </Frame>
  )
}

// How open Bua is: 0 is a tight bud, 1 is full bloom.
// Mood sets it: worry closes the bud, calm is G's bud, listening half-opens, happy is J's bloom.
const BLOOM: Record<Mood, number> = { concerned: 0, calm: 0.3, listening: 0.6, happy: 1 }

/** One lotus, bud to bloom. The outer petals emerge from behind the bud and the side petals open. */
function BudBloom({ bloom, mood, size, label }: { bloom: number; mood: Mood; size: number; label: string }) {
  const side = 20 + bloom * 16 // 20° tight, 36° open
  const outer = 16 + bloom * 48 // hidden behind the bud at 16°, fanned out at 64°
  // CSS transforms (not the SVG attribute) so the petals actually unfold; each pivots on its base
  const spin = (deg: number) => ({
    transform: `rotate(${deg}deg)`,
    transformBox: 'fill-box' as const,
    transformOrigin: '50% 100%',
    transition: 'transform .9s cubic-bezier(.22,1,.36,1)',
  })
  return (
    <Frame size={size} label={label}>
      <Water />
      <Stem d="M64 140 C66 168 76 192 84 208" />
      <Leaf cx={60} cy={102} rx={50} ry={40} tilt={mood === 'concerned' ? 6 : 0} />
      <Stem d="M120 178 C120 190 120 200 118 208" />
      <g transform="translate(-12 8)">
        {[-1, 1].map((d) => (
          <g key={`o${d}`} style={spin(d * outer)}>
            <Petal bx={132} by={172} L={84} W={30} angle={0} fill={OUTER} />
          </g>
        ))}
        {[-1, 1].map((d) => (
          <g key={`s${d}`} style={spin(d * side)}>
            <Petal bx={132} by={172} L={88} W={34} angle={0} fill={bloom > 0.5 ? MID : OUTER} />
          </g>
        ))}
        <path d={BUD} fill={SHADE} transform="translate(-4 6)" />
        <path d={BUD} fill={FACE} />
        <path d="M132 64 C138 70 143 76 147 83 C137 79 127 79 117 83 C121 76 126 70 132 64 Z" fill={TIP} />
        <Face mood={mood} x={132} y={130} gap={18} cheek={CHEEK} />
      </g>
    </Frame>
  )
}

/** The big preview plays the whole arc on a loop: bud, slowly opening, full bloom, and back */
function BloomCycle({ size }: { size: number }) {
  const steps: Mood[] = ['calm', 'listening', 'happy', 'happy', 'calm']
  const [i, setI] = useState(0)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = window.setInterval(() => setI((n) => (n + 1) % steps.length), 1400)
    return () => window.clearInterval(t)
  }, [steps.length])
  const mood = steps[i]
  return <BudBloom bloom={BLOOM[mood]} mood={mood} size={size} label="Bua N, a lotus going from bud to bloom" />
}

/** N · Bud to bloom: G and J as one character. The big preview loops the blooming. */
export function BuaN({ mood, size }: VariantProps) {
  if (size >= 150) return <BloomCycle size={size} />
  return <BudBloom bloom={BLOOM[mood]} mood={mood} size={size} label={`Bua N, ${mood}`} />
}

export const BUA_LOTUS = [
  { key: 'N', name: 'Bud to bloom', note: 'G and J as one character. Worry closes the bud, calm is the bud, listening half-opens, happy is full bloom. The big preview plays the opening.', Comp: BuaN, isNew: true },
  { key: 'I', name: 'Parasol', note: 'The leaf held over the bud like an umbrella. It lowers to shelter Bua when worried, lifts when happy.', Comp: BuaI, isNew: true },
  { key: 'J', name: 'Bloom on a stem', note: 'The open flower raised above the water, a round leaf behind. The most "lotus" of this set.', Comp: BuaJ, isNew: true },
  { key: 'K', name: 'Two leaves', note: 'A big open leaf and a young rolled one, the bud between. Old and new growth, side by side.', Comp: BuaK, isNew: true },
  { key: 'L', name: 'Leaf halo', note: 'One big round leaf right behind the bud. A simple circle-and-bud shape that reads at any size.', Comp: BuaL, isNew: true },
  { key: 'M', name: 'Leaf hands', note: 'Two little leaves on the stem work as arms, so Bua gestures like mooca and Hin.', Comp: BuaM, isNew: true },
]
