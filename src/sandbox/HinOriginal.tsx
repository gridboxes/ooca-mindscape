import Face, { type Mood } from '../components/companions/Face'

interface Props {
  mood?: Mood
  size?: number
  className?: string
  title?: string
}

// Warm grey stone; the earth around Hin carries the Marigo accent
const STONE = '#DDD1BC'
const SIDE = '#CFC1A8'
const SHADE = '#B9A98D'
const CRACK = '#B5A487'
const SHINE = '#EAE1D0'
const LEAF = '#8AD866'
const LEAF_DARK = '#6FBF4C'

// Mostly round, a little blocky: a river stone with flat-ish sides and big soft corners.
// The top is slightly lower on the left so it doesn't look machined.
const ROCK =
  'M88 74 C116 68 140 67 158 70 C186 74 196 96 197 122 C199 148 198 170 186 181 C174 189 150 190 120 190 C90 190 66 190 54 182 C44 173 42 150 43 128 C44 100 58 79 88 74 Z'
// A soft top plane and a shaded right side give it a hint of block
const TOP = 'M88 74 C116 68 140 67 158 70 C176 72 188 82 193 97 C160 92 116 92 50 100 C58 85 70 77 88 74 Z'
const RIGHT = 'M193 97 C196 106 197 114 197 122 C199 148 198 170 186 181 C182 185 178 187 172 188 C178 162 180 126 176 98 Z'

function Sprout({ mood }: { mood: Mood }) {
  // The sprout carries the mood: it lifts when happy, droops when concerned
  const tilt = mood === 'happy' ? -8 : mood === 'concerned' ? 22 : 0
  return (
    <g className="rock-sprout" transform={`rotate(${tilt} 120 70)`}>
      <path d="M120 70 q-1 -8 3 -12" stroke={LEAF_DARK} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M123 62 q-16 -11 -24 1 q12 9 24 -1 z" fill={LEAF} />
      <path d="M124 59 q13 -15 25 -5 q-10 13 -25 5 z" fill={LEAF} />
    </g>
  )
}

export default function HinOriginal({ mood = 'calm', size = 220, className = '', title = 'Hin the rock' }: Props) {
  const tilt = mood === 'listening' ? -4 : 0
  return (
    <svg
      className={`rock rock--${mood} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 240 240"
      role="img"
      aria-label={title}
    >
      <ellipse cx="120" cy="198" rx="78" ry="8" fill="#26313C" opacity=".06" />
      <g transform={`rotate(${tilt} 120 186)`}>
        <g className="rock-body">
          {/* feet */}
          <rect x="80" y="176" width="28" height="22" rx="11" fill={STONE} stroke={SHADE} strokeWidth="3" />
          <rect x="134" y="176" width="28" height="22" rx="11" fill={STONE} stroke={SHADE} strokeWidth="3" />
          {/* arms hang clear of the block so they read as limbs */}
          <ellipse cx="36" cy="160" rx="9" ry="14" fill={STONE} stroke={SHADE} strokeWidth="3" transform="rotate(28 36 160)" />
          <ellipse cx="206" cy="158" rx="9" ry="14" fill={STONE} stroke={SHADE} strokeWidth="3" transform="rotate(-28 206 158)" />
          {/* stone */}
          <path d={ROCK} fill={SHADE} transform="translate(-5 7)" />
          <path d={ROCK} fill={STONE} />
          <path d={TOP} fill={SHINE} />
          <path d={RIGHT} fill={SIDE} />
          {/* a few fine cracks, like weathered stone */}
          <g stroke={CRACK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M152 106 l-5 11 l7 8" />
            <path d="M58 138 l9 5 l-1 10" />
          </g>
          <Sprout mood={mood} />
          <Face mood={mood} x={120} y={136} gap={24} blink />
        </g>
      </g>
    </svg>
  )
}
