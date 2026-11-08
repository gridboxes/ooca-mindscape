import type { ReactNode } from 'react'
import HinOriginal from './HinOriginal'
import Face, { type Mood } from '../components/companions/Face'

// Four takes on Hin for the sandbox. A is the current Rock; B–D are alternatives.

interface VariantProps {
  mood: Mood
  size: number
}

const LEAF = '#8AD866'
const LEAF_DARK = '#6FBF4C'

function Frame({ size, label, children }: { size: number; label: string; children: ReactNode }) {
  return (
    <svg className="rock" width={size} height={size} viewBox="0 0 240 240" role="img" aria-label={label}>
      {children}
    </svg>
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

function Limbs({ fill, stroke, arms }: { fill: string; stroke: string; arms: [number, number, number, number] }) {
  const [lx, ly, rx, ry] = arms
  return (
    <g>
      <rect x="80" y="176" width="28" height="22" rx="11" fill={fill} stroke={stroke} strokeWidth="3" />
      <rect x="134" y="176" width="28" height="22" rx="11" fill={fill} stroke={stroke} strokeWidth="3" />
      <ellipse cx={lx} cy={ly} rx="9" ry="14" fill={fill} stroke={stroke} strokeWidth="3" transform={`rotate(28 ${lx} ${ly})`} />
      <ellipse cx={rx} cy={ry} rx="9" ry="14" fill={fill} stroke={stroke} strokeWidth="3" transform={`rotate(-28 ${rx} ${ry})`} />
    </g>
  )
}

const Shadow = () => <ellipse cx="120" cy="198" rx="78" ry="8" fill="#26313C" opacity=".06" />

/** A · River stone: mostly round with a hint of block (current) */
export function HinA({ mood, size }: VariantProps) {
  return <HinOriginal mood={mood} size={size} title="Hin A, river stone" />
}

/** B · Pebble: a smooth, cool-grey egg with no facets */
export function HinB({ mood, size }: VariantProps) {
  const STONE = '#E3DFD8'
  const SHADE = '#C2BBB0'
  const BODY = 'M114 66 C160 64 198 94 198 134 C198 170 172 190 120 190 C68 190 42 172 42 138 C42 98 72 68 114 66 Z'
  const tilt = mood === 'listening' ? -4 : 0
  return (
    <Frame size={size} label="Hin B, pebble">
      <Shadow />
      <g transform={`rotate(${tilt} 120 186)`}>
        <g className="rock-body">
          <Limbs fill={STONE} stroke={SHADE} arms={[38, 160, 202, 160]} />
          <path d={BODY} fill={SHADE} transform="translate(-5 7)" />
          <path d={BODY} fill={STONE} />
          <ellipse cx="82" cy="100" rx="16" ry="9" fill="#F3F1EC" transform="rotate(-35 82 100)" />
          <g fill={SHADE}>
            <circle cx="170" cy="104" r="2.5" />
            <circle cx="182" cy="150" r="2" />
            <circle cx="66" cy="160" r="2" />
          </g>
          <Sprout mood={mood} x={116} y={66} />
          <Face mood={mood} x={120} y={134} gap={24} blink />
        </g>
      </g>
    </Frame>
  )
}

/** C · Cairn: a rounded block with a flat stone balanced on its head */
export function HinC({ mood, size }: VariantProps) {
  const STONE = '#DDD1BC'
  const SHADE = '#B9A98D'
  const CAP = '#CFC0A6'
  const CAP_SHADE = '#B3A285'
  const BODY =
    'M86 88 C114 82 140 81 158 84 C186 88 196 108 197 132 C199 156 198 174 186 183 C174 190 150 191 120 191 C90 191 66 191 54 184 C44 176 42 156 43 136 C44 110 58 92 86 88 Z'
  const TOP = 'M86 88 C114 82 140 81 158 84 C176 86 188 96 193 109 C160 104 116 104 50 112 C58 98 70 90 86 88 Z'
  const STACK = 'M88 64 C106 56 146 56 160 64 C168 70 164 80 152 83 C132 87 104 87 90 82 C78 78 78 68 88 64 Z'
  // The balanced stone carries the mood: level when calm, tipping when concerned
  const cap = mood === 'happy' ? -3 : mood === 'concerned' ? 9 : mood === 'listening' ? -6 : 0
  const tilt = mood === 'listening' ? -3 : 0
  return (
    <Frame size={size} label="Hin C, cairn">
      <Shadow />
      <g transform={`rotate(${tilt} 120 186)`}>
        <g className="rock-body">
          <Limbs fill={STONE} stroke={SHADE} arms={[36, 162, 206, 160]} />
          <path d={BODY} fill={SHADE} transform="translate(-5 7)" />
          <path d={BODY} fill={STONE} />
          <path d={TOP} fill="#EAE1D0" />
          <g transform={`rotate(${cap} 124 84)`} style={{ transition: 'transform .6s' }}>
            <path d={STACK} fill={CAP_SHADE} transform="translate(-4 5)" />
            <path d={STACK} fill={CAP} />
            <path d="M96 66 C112 60 138 60 152 65" stroke="#E2D6C1" strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>
          <Face mood={mood} x={120} y={142} gap={24} blink />
        </g>
      </g>
    </Frame>
  )
}

/** D · Standing stone: taller and upright, with a soft cap of moss */
export function HinD({ mood, size }: VariantProps) {
  const STONE = '#D9D3C7'
  const SHADE = '#B7AE9E'
  const BODY =
    'M90 60 C108 52 140 52 156 60 C176 70 184 96 184 128 C184 160 180 180 168 186 C150 192 92 192 74 186 C62 180 56 160 56 128 C56 96 66 70 90 60 Z'
  const MOSS =
    'M84 68 C98 52 142 50 160 64 C166 70 162 76 154 74 C148 80 138 74 130 78 C122 82 114 76 106 80 C98 82 92 76 86 78 C78 78 78 72 84 68 Z'
  const tilt = mood === 'listening' ? -4 : 0
  return (
    <Frame size={size} label="Hin D, standing stone">
      <Shadow />
      <g transform={`rotate(${tilt} 120 186)`}>
        <g className="rock-body">
          <Limbs fill={STONE} stroke={SHADE} arms={[50, 160, 190, 160]} />
          <path d={BODY} fill={SHADE} transform="translate(-5 7)" />
          <path d={BODY} fill={STONE} />
          <path d="M156 60 C176 70 184 96 184 128 C184 160 180 180 168 186 C172 160 174 110 164 72 Z" fill="#CCC4B5" />
          <path d={MOSS} fill={LEAF_DARK} transform="translate(-2 4)" />
          <path d={MOSS} fill={LEAF} />
          {mood === 'happy' && (
            <g>
              <circle cx="146" cy="60" r="5" fill="#FBE36A" />
              <circle cx="146" cy="60" r="2" fill="#F2B533" />
            </g>
          )}
          <Face mood={mood} x={120} y={130} gap={22} blink />
        </g>
      </g>
    </Frame>
  )
}

/** E · Mochi stone: a soft dome with the face set low (baby-schema proportions) */
export function HinE({ mood, size }: VariantProps) {
  const STONE = '#E6DCCB'
  const SHADE = '#C9BBA4'
  const BODY = 'M120 74 C164 74 196 112 198 156 C199 178 186 190 160 190 L80 190 C54 190 41 178 42 156 C44 112 76 74 120 74 Z'
  const tilt = mood === 'listening' ? -4 : 0
  return (
    <Frame size={size} label="Hin E, mochi stone">
      <Shadow />
      <g transform={`rotate(${tilt} 120 190)`}>
        <g className="rock-body">
          <rect x="84" y="180" width="26" height="18" rx="9" fill={STONE} stroke={SHADE} strokeWidth="3" />
          <rect x="130" y="180" width="26" height="18" rx="9" fill={STONE} stroke={SHADE} strokeWidth="3" />
          <ellipse cx="44" cy="170" rx="8" ry="12" fill={STONE} stroke={SHADE} strokeWidth="3" transform="rotate(35 44 170)" />
          <ellipse cx="196" cy="170" rx="8" ry="12" fill={STONE} stroke={SHADE} strokeWidth="3" transform="rotate(-35 196 170)" />
          <path d={BODY} fill={SHADE} transform="translate(-5 7)" />
          <path d={BODY} fill={STONE} />
          <ellipse cx="88" cy="104" rx="18" ry="10" fill="#F5EFE5" transform="rotate(-32 88 104)" />
          <Sprout mood={mood} x={120} y={74} />
          <Face mood={mood} x={120} y={152} gap={20} blink />
        </g>
      </g>
    </Frame>
  )
}

/** F · Quartz band: a wide river pebble lying down, with a white quartz vein like a scarf */
export function HinF({ mood, size }: VariantProps) {
  const STONE = '#D6D3CC'
  const SHADE = '#ABA59A'
  const BODY = 'M120 92 C170 90 206 118 206 148 C206 176 176 192 120 192 C64 192 34 176 34 148 C34 118 70 94 120 92 Z'
  const tilt = mood === 'listening' ? -4 : 0
  return (
    <Frame size={size} label="Hin F, quartz band">
      <Shadow />
      <g transform={`rotate(${tilt} 120 192)`}>
        <g className="rock-body">
          <rect x="82" y="182" width="26" height="16" rx="8" fill={STONE} stroke={SHADE} strokeWidth="3" />
          <rect x="132" y="182" width="26" height="16" rx="8" fill={STONE} stroke={SHADE} strokeWidth="3" />
          <path d={BODY} fill={SHADE} transform="translate(-5 7)" />
          <path d={BODY} fill={STONE} />
          <ellipse cx="78" cy="112" rx="16" ry="7" fill="#ECEAE5" transform="rotate(-18 78 112)" />
          {/* the quartz vein: Hin's one distinctive mark, like mooca's scarf */}
          <path d="M40 164 C84 178 156 178 200 164 L197 176 C152 190 88 190 44 177 Z" fill="#FAF8F4" />
          {mood === 'happy' && (
            <path d="M184 92 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 z" fill="#FBE36A" />
          )}
          <Face mood={mood} x={120} y={138} gap={26} blink />
        </g>
      </g>
    </Frame>
  )
}

/** G · Stacked stones: the head is its own stone, balanced on a body and a base */
export function HinG({ mood, size }: VariantProps) {
  const HEAD = 'M120 40 C146 40 162 58 162 80 C162 100 144 112 120 112 C96 112 78 100 78 80 C78 58 94 40 120 40 Z'
  const BODY = 'M74 140 C74 122 96 114 120 114 C144 114 166 122 166 140 C166 156 146 162 120 162 C94 162 74 156 74 140 Z'
  const BASE = 'M60 174 C60 162 90 158 120 158 C150 158 180 162 180 174 C180 188 150 194 120 194 C90 194 60 188 60 174 Z'
  const SHADE = '#B9A98D'
  // The head wobbles on the stack: steady when calm, tipping when concerned
  const head = mood === 'happy' ? -3 : mood === 'concerned' ? 9 : mood === 'listening' ? -8 : 0
  return (
    <Frame size={size} label="Hin G, stacked stones">
      <Shadow />
      <g className="rock-body">
        <path d={BASE} fill={SHADE} transform="translate(-4 5)" />
        <path d={BASE} fill="#CFC3AD" />
        <ellipse cx="66" cy="136" rx="8" ry="12" fill="#DDD1BC" stroke={SHADE} strokeWidth="3" transform="rotate(30 66 136)" />
        <ellipse cx="174" cy="136" rx="8" ry="12" fill="#DDD1BC" stroke={SHADE} strokeWidth="3" transform="rotate(-30 174 136)" />
        <path d={BODY} fill={SHADE} transform="translate(-4 5)" />
        <path d={BODY} fill="#DDD1BC" />
        <g transform={`rotate(${head} 120 112)`} style={{ transition: 'transform .6s' }}>
          <path d={HEAD} fill={SHADE} transform="translate(-5 6)" />
          <path d={HEAD} fill="#E8E0D0" />
          <ellipse cx="98" cy="62" rx="10" ry="6" fill="#F5F0E6" transform="rotate(-35 98 62)" />
          <Sprout mood={mood} x={120} y={41} />
          <Face mood={mood} x={120} y={80} gap={20} blink />
        </g>
      </g>
    </Frame>
  )
}

/** H · Hex stone: a short hexagonal prism seen from slightly above, edges worn round */
export function HinH({ mood, size }: VariantProps) {
  // Light comes from the top left: top face brightest, right face darkest
  const TOP = '#F2EFE9'
  const LEFT = '#E8E4DC'
  const FRONT = '#DEDAD1'
  const RIGHT = '#C9C3B7'
  const EDGE = '#D6D1C7'
  const SHADE = '#B9B2A5'
  // Top hexagon (foreshortened) and the three side faces that face us. Points are
  // nudged a little off-true so it reads as a worn stone, not a machined nut.
  const OUTLINE = 'M48 80 L85 55 L157 57 L192 80 L191 160 L156 185 L84 184 L49 159 Z'
  const TOP_FACE = 'M48 80 L85 55 L157 57 L192 80 L156 104 L84 104 Z'
  const LEFT_FACE = 'M48 80 L84 104 L84 184 L49 159 Z'
  const FRONT_FACE = 'M84 104 L156 104 L156 185 L84 184 Z'
  const RIGHT_FACE = 'M156 104 L192 80 L191 160 L156 185 Z'
  const tilt = mood === 'listening' ? -4 : 0
  return (
    <Frame size={size} label="Hin H, hexagonal stone">
      <Shadow />
      <g transform={`rotate(${tilt} 120 186)`}>
        <g className="rock-body">
          <Limbs fill={LEFT} stroke={SHADE} arms={[36, 150, 204, 150]} />
          {/* a wide round-joined stroke wears every outer corner and leaves a bevel rim */}
          <path d={OUTLINE} fill={SHADE} stroke={SHADE} strokeWidth="14" strokeLinejoin="round" transform="translate(-5 7)" />
          <path d={OUTLINE} fill={EDGE} stroke={EDGE} strokeWidth="14" strokeLinejoin="round" />
          <path d={LEFT_FACE} fill={LEFT} />
          <path d={FRONT_FACE} fill={FRONT} />
          <path d={RIGHT_FACE} fill={RIGHT} />
          <path d={TOP_FACE} fill={TOP} />
          {/* soft highlight on the top face, specks on the sides */}
          <ellipse cx="96" cy="72" rx="16" ry="6" fill="#FBFAF7" transform="rotate(-12 96 72)" />
          <g fill={SHADE}>
            <circle cx="64" cy="128" r="2" />
            <circle cx="176" cy="118" r="2.5" />
            <circle cx="172" cy="150" r="2" />
          </g>
          <Sprout mood={mood} x={122} y={80} />
          <Face mood={mood} x={120} y={142} gap={18} blink />
        </g>
      </g>
    </Frame>
  )
}

/** I · Weathered pebble: B's soft egg shape with A's lived-in stone (warm tone, lit top, cracks) */
export function HinI({ mood, size }: VariantProps) {
  const STONE = '#DDD1BC'
  const SIDE = '#CFC1A8'
  const SHADE = '#B9A98D'
  const CRACK = '#B5A487'
  const SHINE = '#EAE1D0'
  const BODY = 'M114 66 C160 64 198 94 198 134 C198 170 172 190 120 190 C68 190 42 172 42 138 C42 98 72 68 114 66 Z'
  // The lit top and the shaded right side, as on A, but following the pebble's curve
  const TOP = 'M114 66 C146 65 176 80 190 102 C160 96 120 95 52 104 C62 82 84 68 114 66 Z'
  const RIGHT = 'M190 102 C196 112 198 122 198 134 C198 170 172 190 120 190 C150 186 172 170 180 146 C184 130 186 116 190 102 Z'
  const tilt = mood === 'listening' ? -4 : 0
  return (
    <Frame size={size} label="Hin I, weathered pebble">
      <Shadow />
      <g transform={`rotate(${tilt} 120 186)`}>
        <g className="rock-body">
          <Limbs fill={STONE} stroke={SHADE} arms={[38, 160, 202, 160]} />
          <path d={BODY} fill={SHADE} transform="translate(-5 7)" />
          <path d={BODY} fill={STONE} />
          <path d={TOP} fill={SHINE} />
          <path d={RIGHT} fill={SIDE} />
          <ellipse cx="84" cy="88" rx="14" ry="7" fill="#F4EEE3" transform="rotate(-25 84 88)" />
          {/* a few fine cracks and pits from years of weather */}
          <g stroke={CRACK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M158 108 l-5 11 l7 8" />
            <path d="M60 140 l9 5 l-1 10" />
          </g>
          <g fill={SHADE}>
            <circle cx="172" cy="160" r="2" />
            <circle cx="96" cy="176" r="2" />
          </g>
          <Sprout mood={mood} x={116} y={66} />
          <Face mood={mood} x={120} y={136} gap={24} blink />
        </g>
      </g>
    </Frame>
  )
}

export const HIN_VARIANTS = [
  { key: 'A', name: 'River stone', note: 'Current. Mostly round with a hint of block: flat-ish sides, a lit top, a sprout.', Comp: HinA },
  { key: 'B', name: 'Pebble', note: 'Smooth cool-grey egg, no facets. The softest and most "friend-like".', Comp: HinB },
  { key: 'C', name: 'Cairn', note: 'A flat stone balanced on its head. Balance is the Stoic idea; the stone tips when worried.', Comp: HinC },
  { key: 'D', name: 'Standing stone', note: 'Taller and upright with a moss cap. Reads as steady and a little wise.', Comp: HinD },
  { key: 'E', name: 'Mochi stone', note: 'New. A soft dome with the face set low: the "baby schema" proportions that read as cute fastest.', Comp: HinE, isNew: true },
  { key: 'F', name: 'Quartz band', note: 'New. A wide river pebble with a white quartz vein, a distinctive mark that reads even at icon size.', Comp: HinF, isNew: true },
  { key: 'G', name: 'Stacked stones', note: 'New. Head, body and base are three balanced stones. Balance is the Stoic idea; the head wobbles when worried.', Comp: HinG, isNew: true },
  { key: 'H', name: 'Hex stone', note: 'New. A worn hexagonal stone in 3D: a lit top and three sides. Each face is a side of a thought, turned over to look at it.', Comp: HinH, isNew: true },
  { key: 'I', name: 'Weathered pebble', note: 'New. B’s soft pebble with A’s lived-in stone: warmer tone, a lit top, a shaded side and fine cracks. A pebble with some years on it.', Comp: HinI, isNew: true },
]
