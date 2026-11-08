import type { ReactNode } from 'react'
import { INK, type Mood } from '../components/companions/Face'

// The Stoic rethink of Hin. The idea comes from Marcus Aurelius (Meditations 4.49):
// be like the headland the waves keep breaking against; it stands firm and the water calms around it.
// So Hin is heavy, grounded and nearly still, with a small emotional range.

interface VariantProps {
  mood: Mood
  size: number
}

export const LICHEN = '#A9C98F'
export const LICHEN_DARK = '#8DB476'

function Frame({ size, label, children }: { size: number; label: string; children: ReactNode }) {
  return (
    <svg className="rock hin-stoic" width={size} height={size} viewBox="0 0 240 240" role="img" aria-label={label}>
      {children}
    </svg>
  )
}

const Shadow = () => <ellipse cx="120" cy="196" rx="88" ry="8" fill="#26313C" opacity=".06" />

/**
 * A restrained face: heavy-lidded eyes (flat-topped half circles) and a small level smile.
 * Moods change very little, which is the point. Lichen brows, when present, do most of the talking.
 */
export function StoicFace({ mood, x, y, gap = 22, brows = false }: { mood: Mood; x: number; y: number; gap?: number; brows?: boolean }) {
  const lx = x - gap
  const rx = x + gap
  const line = { stroke: INK, strokeWidth: 4, strokeLinecap: 'round' as const, fill: 'none' }
  // heavy-lidded eye: the lower half of a circle, flat on top
  const lid = (cx: number, cy: number) => <path d={`M${cx - 7} ${cy} a7 7 0 0 0 14 0 z`} fill={INK} />

  // Brow angle and lift for each mood: level and low when calm, one raised when listening
  const brow = {
    calm: { l: 0, r: 0, lift: 0 },
    happy: { l: -6, r: 6, lift: -3 },
    listening: { l: 0, r: -14, lift: 0 },
    concerned: { l: 14, r: -14, lift: 1 },
  }[mood]

  return (
    <g>
      <g opacity=".7">
        <ellipse cx={lx - 10} cy={y + 15} rx="8" ry="5" fill="#F2B3AE" />
        <ellipse cx={rx + 10} cy={y + 15} rx="8" ry="5" fill="#F2B3AE" />
      </g>
      {mood === 'happy' ? (
        <g {...line}>
          <path d={`M${lx - 7} ${y + 2} q7 -7 14 0`} />
          <path d={`M${rx - 7} ${y + 2} q7 -7 14 0`} />
        </g>
      ) : (
        <g className="face-eyes">
          {lid(lx, y)}
          {lid(rx, y)}
        </g>
      )}
      {mood === 'concerned' ? (
        <path d={`M${x - 7} ${y + 16} h14`} {...line} />
      ) : (
        <path d={`M${x - 7} ${y + 14} q7 ${mood === 'happy' ? 6 : 3} 14 0`} {...line} />
      )}
      {brows && (
        <g style={{ transition: 'transform .6s' }}>
          {/* thin tufts of lichen sitting well above the eyes */}
          <ellipse cx={lx} cy={y - 17 + brow.lift} rx="11" ry="3.6" fill={LICHEN_DARK} transform={`rotate(${brow.l} ${lx} ${y - 17})`} />
          <ellipse cx={rx} cy={y - 17 + brow.lift + (mood === 'listening' ? -5 : 0)} rx="11" ry="3.6" fill={LICHEN_DARK} transform={`rotate(${brow.r} ${rx} ${y - 17})`} />
        </g>
      )}
    </g>
  )
}

/** Waves breaking against the rock's left side. The bigger the worry, the bigger the waves. */
function Waves({ mood }: { mood: Mood }) {
  const s = mood === 'concerned' ? 1.8 : mood === 'happy' ? 0.9 : 1.25
  return (
    <g>
      {/* water line the rock stands in */}
      <ellipse cx="120" cy="194" rx="112" ry="9" fill="#C7DDF7" />
      <g transform={`translate(36 194) scale(${s}) translate(-36 -194)`} style={{ transition: 'transform .6s' }}>
        <g className="hin-wave">
          {/* a wave curling over as it breaks on the rock */}
          <path d="M4 196 C8 182 18 172 32 170 C44 168 54 174 58 184 C52 178 44 178 40 184 C38 190 44 194 50 194 L64 196 Z" fill="#8FBBEF" />
          <path d="M14 180 C20 174 28 171 36 171 C46 171 54 176 58 184" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </g>
        {mood === 'concerned' && (
          <g fill="#8FBBEF">
            <circle cx="30" cy="166" r="3" />
            <circle cx="20" cy="172" r="2.5" />
            <circle cx="40" cy="162" r="2" />
          </g>
        )}
      </g>
    </g>
  )
}

// A broad, low headland: wide at the base, sloped shoulders, a flatter wave-worn face on the left
const HEADLAND = 'M34 192 C32 160 42 130 62 110 C78 94 94 80 118 76 C142 72 168 82 184 102 C198 120 206 150 208 192 Z'
const HEADLAND_TOP = 'M62 110 C78 94 94 80 118 76 C142 72 168 82 184 102 C152 94 100 96 62 110 Z'
const HEADLAND_WORN = 'M34 192 C32 160 42 130 62 110 C70 122 74 156 72 192 Z'

function Headland({ children }: { children?: ReactNode }) {
  return (
    <g className="hin-breathe">
      <path d={HEADLAND} fill="#B3A68F" transform="translate(-5 6)" />
      <path d={HEADLAND} fill="#D8CEBE" />
      <path d={HEADLAND_TOP} fill="#E6DDCE" />
      <path d={HEADLAND_WORN} fill="#C9BDA8" />
      <g stroke="#B5A487" strokeWidth="2.5" strokeLinecap="round" fill="none">
        <path d="M168 120 l-6 10 l6 9" />
        <path d="M48 150 l8 4" />
      </g>
      {children}
    </g>
  )
}

/** J · Headland: the rock the waves break against */
export function HinJ({ mood, size }: VariantProps) {
  return (
    <Frame size={size} label="Hin J, headland">
      <Headland>
        <StoicFace mood={mood} x={130} y={140} gap={22} />
      </Headland>
      <Waves mood={mood} />
    </Frame>
  )
}

/** K · Old Stone: an elder rock that never moves; lichen brows carry the mood */
export function HinK({ mood, size }: VariantProps) {
  const BODY = 'M38 190 C36 142 66 84 120 82 C174 80 204 142 202 190 Z'
  return (
    <Frame size={size} label="Hin K, old stone">
      <Shadow />
      <g className="hin-breathe">
        <path d={BODY} fill="#B9AE9C" transform="translate(-5 6)" />
        <path d={BODY} fill="#DCD4C6" />
        <path d="M64 116 C80 96 98 86 120 85 C146 84 166 96 180 114 C150 106 96 106 64 116 Z" fill="#E9E3D8" />
        {/* lichen growing on the old stone */}
        <g fill={LICHEN}>
          <circle cx="160" cy="98" r="7" />
          <circle cx="170" cy="104" r="5" />
          <circle cx="152" cy="94" r="4" />
          <circle cx="58" cy="172" r="5" />
        </g>
        <StoicFace mood={mood} x={120} y={142} gap={24} brows />
      </g>
    </Frame>
  )
}

/** L · Cornerstone: a squarer, dependable block to build on */
export function HinL({ mood, size }: VariantProps) {
  const BODY = 'M58 82 L182 82 Q196 82 196 96 L198 176 Q198 190 184 190 L56 190 Q42 190 42 176 L44 96 Q44 82 58 82 Z'
  return (
    <Frame size={size} label="Hin L, cornerstone">
      <Shadow />
      <g className="hin-breathe">
        <path d={BODY} fill="#B3A68F" transform="translate(-5 6)" />
        <path d={BODY} fill="#D9CFBE" />
        <path d="M58 82 L182 82 Q196 82 196 96 L184 102 L56 102 L44 96 Q44 82 58 82 Z" fill="#E8E0D2" />
        <path d="M184 102 L196 96 L198 176 Q198 190 184 190 Z" fill="#C8BBA5" />
        <path d="M64 176 l12 -6" stroke="#B5A487" strokeWidth="2.5" strokeLinecap="round" />
        <StoicFace mood={mood} x={114} y={142} gap={24} />
      </g>
    </Frame>
  )
}

/** M · Headland with lichen brows: the recommended mix */
export function HinM({ mood, size }: VariantProps) {
  return (
    <Frame size={size} label="Hin M, headland with lichen brows">
      <Headland>
        <g fill={LICHEN}>
          <circle cx="150" cy="86" r="6" />
          <circle cx="160" cy="90" r="4" />
        </g>
        <StoicFace mood={mood} x={130} y={142} gap={22} brows />
      </Headland>
      <Waves mood={mood} />
    </Frame>
  )
}

export const HIN_STOIC = [
  { key: 'J', name: 'Headland', note: 'The rock the waves break against. Broad, low, a wave-worn side. The waves grow with the worry; Hin doesn’t move.', Comp: HinJ, isNew: true },
  { key: 'K', name: 'Old Stone', note: 'An elder rock that never moves. Lichen eyebrows carry the mood: low when calm, one raised in dry amusement.', Comp: HinK, isNew: true },
  { key: 'L', name: 'Cornerstone', note: 'A squarer, dependable block. "What’s in your control is your foundation." Solid but less poetic.', Comp: HinL, isNew: true },
  { key: 'M', name: 'Headland + brows', note: 'Recommended mix: the headland and its waves, with the Old Stone’s lichen brows for expression.', Comp: HinM, isNew: true },
]
