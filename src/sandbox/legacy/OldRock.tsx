// The flat character as it was before the new mooca art style, kept for the sandbox's before-and-after.
import type { CSSProperties } from 'react'
import Face, { type Expression } from '../../components/companions/Face'

interface Props {
  mood?: Expression
  size?: number
  className?: string
  title?: string
}

// Hin, the warm stone: a smooth pebble with soft corners. Stones hold the sun's heat, so Hin's
// colour cools to blue-grey when worried and warms slightly when listening or happy. When happy, its sprout flowers; when worried, a small
// crack shows (and closes again as Hin settles).

export const WARMTH: Record<Expression, { stone: string; shade: string }> = {
  concerned: { stone: '#D5DAE1', shade: '#AEB5C0' },
  calm: { stone: '#E3DFD8', shade: '#C2BBB0' },
  thinking: { stone: '#E3DFD8', shade: '#C2BBB0' },
  listening: { stone: '#E7E1D7', shade: '#C6BDAF' },
  happy: { stone: '#E7E1D7', shade: '#C6BDAF' },
  tender: { stone: '#EADFD8', shade: '#C9B9AF' },
  delighted: { stone: '#EFE1C8', shade: '#CDB998' },
}

// The sprout leans with the mood: up when glad, over like a question when thinking, down when worried
const LEAN: Record<Expression, number> = { delighted: -12, happy: -8, tender: -4, calm: 0, listening: 0, thinking: 14, concerned: 22 }

const SHINE = '#F7F5F0'
const PETAL = '#F7A9A0'
const POLLEN = '#FBE36A'
const LEAF = '#8AD866'
const LEAF_DARK = '#6FBF4C'

// Ten gentle sides; a wide round-joined stroke in the same colour wears every corner smooth
const BODY = '90,72 140,68 178,86 194,118 192,158 168,182 120,188 72,182 48,156 48,108'

// Grow in from a point when shown, shrink away when hidden
const appear = (show: boolean, origin: string): CSSProperties => ({
  opacity: show ? 1 : 0,
  transform: show ? 'none' : 'scale(0.2)',
  transformBox: 'fill-box',
  transformOrigin: origin,
  transition: 'opacity .6s ease, transform .6s cubic-bezier(.22,1,.36,1)',
})

const warmFill = (fill: string, stroke?: string): CSSProperties => ({
  fill,
  stroke,
  transition: 'fill .8s ease, stroke .8s ease',
})

function Sprout({ mood }: { mood: Expression }) {
  const glad = mood === 'happy' || mood === 'delighted'
  return (
    <g className="rock-sprout" transform={`rotate(${LEAN[mood]} 116 66)`}>
      <path d="M116 66 q-1 -8 3 -12" stroke={LEAF_DARK} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M119 58 q-16 -11 -24 1 q12 9 24 -1 z" fill={LEAF} />
      <path d="M120 55 q13 -15 25 -5 q-10 13 -25 5 z" fill={LEAF} />
      {/* when happy, the sprout grows a little and flowers */}
      <g style={appear(glad, '50% 100%')}>
        <path d="M119 55 q1 -10 -2 -18" stroke={LEAF_DARK} strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M118 44 q-14 -8 -20 2 q10 6 20 -2 z" fill={LEAF} />
        <g fill={PETAL}>
          <circle cx="117" cy="30" r="5" />
          <circle cx="111" cy="35" r="5" />
          <circle cx="123" cy="35" r="5" />
          <circle cx="114" cy="41" r="5" />
          <circle cx="121" cy="41" r="5" />
        </g>
        <circle cx="117" cy="36" r="4" fill={POLLEN} />
      </g>
    </g>
  )
}

/** A small crack that opens when Hin is worried and closes again as it settles */
function Crack({ show, color }: { show: boolean; color: string }) {
  return (
    <path
      d="M166 90 l-8 12 l8 8 l-7 11"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      style={appear(show, '50% 0%')}
    />
  )
}

export default function OldRock({ mood = 'calm', size = 220, className = '', title = 'Hin the rock' }: Props) {
  const c = WARMTH[mood]
  const tilt = mood === 'listening' ? -4 : mood === 'thinking' ? 5 : 0
  return (
    <svg
      className={`rock rock--${mood} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 240 240"
      role="img"
      aria-label={title}
    >
      {/* Hin is drawn at 90%, anchored on the ground line, so it sits a touch smaller than its friends */}
      <g transform="translate(12 20.8) scale(0.9)">
      <ellipse cx="120" cy="208" rx="78" ry="8" fill="#26313C" opacity=".06" />
      <g transform={`rotate(${tilt} 120 196)`}>
        <g className="rock-body">
          {/* feet and arms */}
          <rect x="80" y="186" width="28" height="22" rx="11" strokeWidth="3" style={warmFill(c.stone, c.shade)} />
          <rect x="134" y="186" width="28" height="22" rx="11" strokeWidth="3" style={warmFill(c.stone, c.shade)} />
          <ellipse cx="36" cy="160" rx="9" ry="14" strokeWidth="3" transform="rotate(28 36 160)" style={warmFill(c.stone, c.shade)} />
          <ellipse cx="204" cy="160" rx="9" ry="14" strokeWidth="3" transform="rotate(-28 204 160)" style={warmFill(c.stone, c.shade)} />
          {/* the stone */}
          <polygon points={BODY} strokeWidth="16" strokeLinejoin="round" transform="translate(-5 7)" style={warmFill(c.shade, c.shade)} />
          <polygon points={BODY} strokeWidth="16" strokeLinejoin="round" style={warmFill(c.stone, c.stone)} />
          <ellipse cx="84" cy="94" rx="16" ry="9" fill={SHINE} transform="rotate(-35 84 94)" />
          <g style={warmFill(c.shade)}>
            <circle cx="170" cy="102" r="2.5" />
            <circle cx="182" cy="150" r="2" />
            <circle cx="66" cy="160" r="2" />
          </g>
          <Crack show={mood === 'concerned'} color="#8F97A3" />
          <Sprout mood={mood} />
          <Face mood={mood} x={120} y={136} gap={24} blink />
        </g>
      </g>
      </g>
    </svg>
  )
}
