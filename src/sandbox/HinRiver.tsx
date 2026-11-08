import { useId, type ReactNode } from 'react'
import Face, { type Mood } from '../components/companions/Face'
import { LICHEN, LICHEN_DARK, StoicFace } from './HinStoic'

// More takes on Hin A, the river stone. Each one changes a single idea:
// the face, the setting, a signature mark, the brows, or the proportions.

interface VariantProps {
  mood: Mood
  size: number
}

// A's stone
const STONE = '#DDD1BC'
const SIDE = '#CFC1A8'
const SHADE = '#B9A98D'
const CRACK = '#B5A487'
const SHINE = '#EAE1D0'
const LEAF = '#8AD866'
const LEAF_DARK = '#6FBF4C'

// A's silhouette: mostly round, flat-ish sides, a lit top plane and a shaded right side
const ROCK =
  'M88 74 C116 68 140 67 158 70 C186 74 196 96 197 122 C199 148 198 170 186 181 C174 189 150 190 120 190 C90 190 66 190 54 182 C44 173 42 150 43 128 C44 100 58 79 88 74 Z'
const TOP = 'M88 74 C116 68 140 67 158 70 C176 72 188 82 193 97 C160 92 116 92 50 100 C58 85 70 77 88 74 Z'
const RIGHT = 'M193 97 C196 106 197 114 197 122 C199 148 198 170 186 181 C182 185 178 187 172 188 C178 162 180 126 176 98 Z'

function Frame({ size, label, children }: { size: number; label: string; children: ReactNode }) {
  return (
    <svg className="rock" width={size} height={size} viewBox="0 0 240 240" role="img" aria-label={label}>
      {children}
    </svg>
  )
}

const Shadow = () => <ellipse cx="120" cy="198" rx="78" ry="8" fill="#26313C" opacity=".06" />

function Sprout({ mood, x = 120, y = 70 }: { mood: Mood; x?: number; y?: number }) {
  const tilt = mood === 'happy' ? -8 : mood === 'concerned' ? 22 : 0
  return (
    <g transform={`rotate(${tilt} ${x} ${y})`} style={{ transition: 'transform .6s' }}>
      <path d={`M${x} ${y} q-1 -8 3 -12`} stroke={LEAF_DARK} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d={`M${x + 3} ${y - 8} q-16 -11 -24 1 q12 9 24 -1 z`} fill={LEAF} />
      <path d={`M${x + 4} ${y - 11} q13 -15 25 -5 q-10 13 -25 5 z`} fill={LEAF} />
    </g>
  )
}

function Stone({ body = ROCK, top = TOP, right = RIGHT, children }: { body?: string; top?: string; right?: string; children?: ReactNode }) {
  return (
    <g>
      <path d={body} fill={SHADE} transform="translate(-5 7)" />
      <path d={body} fill={STONE} />
      <path d={top} fill={SHINE} />
      <path d={right} fill={SIDE} />
      {children}
    </g>
  )
}

const Cracks = () => (
  <g stroke={CRACK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
    <path d="M152 106 l-5 11 l7 8" />
    <path d="M58 138 l9 5 l-1 10" />
  </g>
)

/** N · Stoic river stone: A without limbs or sprout, a heavy-lidded calm face */
export function HinN({ mood, size }: VariantProps) {
  return (
    <Frame size={size} label="Hin N, Stoic river stone">
      <Shadow />
      <g className="hin-breathe">
        <Stone>
          <Cracks />
        </Stone>
        <StoicFace mood={mood} x={120} y={138} gap={24} />
      </g>
    </Frame>
  )
}

/** O · In the stream: A sitting in shallow water, its lower half wet and darker */
export function HinO({ mood, size }: VariantProps) {
  const id = useId().replace(/:/g, '')
  return (
    <Frame size={size} label="Hin O, river stone in a stream">
      <defs>
        <clipPath id={`${id}-body`}>
          <path d={ROCK} />
        </clipPath>
      </defs>
      <ellipse cx="120" cy="190" rx="104" ry="14" fill="#C7DDF7" />
      <g className="rock-body">
        <Stone>
          {/* the wet part darkens where the water reaches */}
          <rect x="30" y="150" width="180" height="50" fill="#A99B82" opacity=".35" clipPath={`url(#${id}-body)`} />
          <Cracks />
        </Stone>
        <Sprout mood={mood} />
        <Face mood={mood} x={120} y={130} gap={24} blink />
      </g>
      {/* the stream flowing past the front */}
      <path d="M22 186 C52 178 188 178 218 186 C218 198 182 206 120 206 C58 206 22 198 22 186 Z" fill="#C7DDF7" />
      <g className="hin-wave" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round">
        <path d="M44 190 q14 -5 28 0" />
        <path d="M150 194 q14 -5 28 0" />
      </g>
    </Frame>
  )
}

/** P · Quartz vein: A with a white quartz line across it, a signature like mooca's scarf */
export function HinP({ mood, size }: VariantProps) {
  const id = useId().replace(/:/g, '')
  return (
    <Frame size={size} label="Hin P, river stone with a quartz vein">
      <defs>
        <clipPath id={`${id}-body`}>
          <path d={ROCK} />
        </clipPath>
      </defs>
      <Shadow />
      <g className="rock-body">
        <rect x="80" y="176" width="28" height="22" rx="11" fill={STONE} stroke={SHADE} strokeWidth="3" />
        <rect x="134" y="176" width="28" height="22" rx="11" fill={STONE} stroke={SHADE} strokeWidth="3" />
        <Stone>
          <path
            d="M30 146 C70 158 150 178 210 176 L210 187 C150 190 70 170 30 157 Z"
            fill="#FAF8F4"
            clipPath={`url(#${id}-body)`}
          />
        </Stone>
        <Sprout mood={mood} />
        <Face mood={mood} x={120} y={130} gap={24} blink />
      </g>
    </Frame>
  )
}

/** Q · Old river stone: A with lichen brows and a patch of lichen, the Stoic face, no limbs */
export function HinQ({ mood, size }: VariantProps) {
  return (
    <Frame size={size} label="Hin Q, old river stone with lichen brows">
      <Shadow />
      <g className="hin-breathe">
        <Stone>
          <g fill={LICHEN}>
            <circle cx="160" cy="80" r="7" />
            <circle cx="171" cy="86" r="5" />
            <circle cx="150" cy="77" r="4" />
          </g>
          <circle cx="165" cy="81" r="2" fill={LICHEN_DARK} />
          <Cracks />
        </Stone>
        <StoicFace mood={mood} x={120} y={140} gap={24} brows />
      </g>
    </Frame>
  )
}

/** R · Standing river stone: A taller than wide, upright and a little dignified */
export function HinR({ mood, size }: VariantProps) {
  const BODY =
    'M96 56 C118 50 140 50 154 56 C176 64 184 90 184 122 C186 152 184 172 174 182 C164 190 146 191 120 191 C94 191 76 190 66 182 C56 172 54 150 56 122 C58 88 72 62 96 56 Z'
  const BODY_TOP = 'M96 56 C118 50 140 50 154 56 C168 61 177 72 181 86 C150 80 110 80 60 90 C66 72 78 60 96 56 Z'
  const BODY_RIGHT = 'M181 86 C183 96 184 108 184 122 C186 152 184 172 174 182 C170 186 166 188 160 189 C166 160 170 120 166 88 Z'
  return (
    <Frame size={size} label="Hin R, standing river stone">
      <Shadow />
      <g className="rock-body">
        <rect x="84" y="178" width="26" height="20" rx="10" fill={STONE} stroke={SHADE} strokeWidth="3" />
        <rect x="130" y="178" width="26" height="20" rx="10" fill={STONE} stroke={SHADE} strokeWidth="3" />
        <ellipse cx="50" cy="150" rx="9" ry="14" fill={STONE} stroke={SHADE} strokeWidth="3" transform="rotate(26 50 150)" />
        <ellipse cx="190" cy="150" rx="9" ry="14" fill={STONE} stroke={SHADE} strokeWidth="3" transform="rotate(-26 190 150)" />
        <Stone body={BODY} top={BODY_TOP} right={BODY_RIGHT}>
          <path d="M150 104 l-5 11 l7 8" stroke={CRACK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </Stone>
        <Sprout mood={mood} x={120} y={52} />
        <Face mood={mood} x={120} y={124} gap={22} blink />
      </g>
    </Frame>
  )
}

export const HIN_RIVER = [
  { key: 'N', name: 'Stoic river stone', note: 'A without arms or sprout, a heavy-lidded calm face. Still and grounded.', Comp: HinN, isNew: true },
  { key: 'O', name: 'In the stream', note: 'A sitting in shallow water, its lower half wet and darker, the stream flowing past.', Comp: HinO, isNew: true },
  { key: 'P', name: 'Quartz vein', note: 'A with a white quartz line across it: one signature mark, like mooca’s scarf.', Comp: HinP, isNew: true },
  { key: 'Q', name: 'Old river stone', note: 'A with lichen brows and a lichen patch, the Stoic face, no limbs. Wise and dry.', Comp: HinQ, isNew: true },
  { key: 'R', name: 'Standing river stone', note: 'A taller than wide: upright, a little dignified, still soft.', Comp: HinR, isNew: true },
]
