import Face, { type Expression } from './Face'

interface Props {
  mood?: Expression
  size?: number
  /** how open Bua is, 0 (tight bud) to 1 (full bloom); defaults to the mood's */
  bloom?: number
  /** ripples on the water at the stems */
  ripples?: boolean
  className?: string
  title?: string
}

// Bua is a true lotus (Nelumbo): a bud on its own stem rising from the water, with a round leaf
// held up above the surface. Bud to bloom is the Buddhist image of awakening, so Bua's openness
// is its mood: worry closes the bud, calm is a bud, listening half-opens, happy is full bloom.
export const BLOOM: Record<Expression, number> = {
  concerned: 0,
  calm: 0.3,
  thinking: 0.3,
  tender: 0.45,
  listening: 0.6,
  happy: 1,
  delighted: 1,
}

// Flamingo petals, Guava leaf
const FACE = '#FFE6E5'
const MID = '#FAD0CE'
const OUTER = '#F6B9B6'
const TIP = '#F49C98'
const SHADE = '#EDB4B1'
const CHEEK = '#F2918D'
const LEAF = '#8AD866'
const LEAF_DARK = '#6FBF4C'

// Every petal grows from the base of the flower at (BX, BY)
const BX = 120
const BY = 180

// One pointed petal of length L and width W, pointing straight up from the base
function petalPath(L: number, W: number) {
  return `M${BX} ${BY} C${BX - W} ${BY - L * 0.45} ${BX - W * 0.55} ${BY - L * 0.85} ${BX} ${BY - L} C${BX + W * 0.55} ${BY - L * 0.85} ${BX + W} ${BY - L * 0.45} ${BX} ${BY} Z`
}
// The blush at a petal's tip, following its outline
function tipPath(L: number, W: number) {
  return `M${BX - W * 0.4} ${BY - L * 0.8} C${BX - W * 0.3} ${BY - L * 0.89} ${BX - W * 0.12} ${BY - L * 0.96} ${BX} ${BY - L} C${BX + W * 0.12} ${BY - L * 0.96} ${BX + W * 0.3} ${BY - L * 0.89} ${BX + W * 0.4} ${BY - L * 0.8} C${BX + W * 0.15} ${BY - L * 0.84} ${BX - W * 0.15} ${BY - L * 0.84} ${BX - W * 0.4} ${BY - L * 0.8} Z`
}

// The face petal: an egg with a pointed crown, wide enough to hold the face
const BUD = `M${BX} 72 C${BX + 24} 94 ${BX + 38} 118 ${BX + 36} 144 C${BX + 34} 168 ${BX + 20} 182 ${BX} 182 C${BX - 20} 182 ${BX - 34} 168 ${BX - 36} 144 C${BX - 38} 118 ${BX - 24} 94 ${BX} 72 Z`
const BUD_TIP = `M${BX} 72 C${BX + 6} 78 ${BX + 11} 84 ${BX + 15} 91 C${BX + 5} 87 ${BX - 5} 87 ${BX - 15} 91 C${BX - 11} 84 ${BX - 6} 78 ${BX} 72 Z`

/** A petal that pivots on its own base, so it unfolds smoothly as the bloom changes */
function Petal({ L, W, angle, fill }: { L: number; W: number; angle: number; fill: string }) {
  return (
    <g className="lotus-unfold" style={{ transform: `rotate(${angle}deg)` }}>
      <path d={petalPath(L, W)} fill={fill} />
      <path d={tipPath(L, W)} fill={TIP} />
    </g>
  )
}

/** The round leaf held up above the water, its veins running out from the centre */
function Leaf({ tilt }: { tilt: number }) {
  const cx = 60
  const cy = 108
  const rx = 50
  const ry = 40
  const veins = [0, 60, 120, 180, 240, 300]
    .map((a) => {
      const r = (a * Math.PI) / 180
      return `M${cx} ${cy} L${cx + Math.cos(r) * rx * 0.86} ${cy + Math.sin(r) * ry * 0.86}`
    })
    .join(' ')
  return (
    <g transform={`rotate(${tilt} ${cx} ${cy + ry})`}>
      <ellipse cx={cx - 4} cy={cy + 4} rx={rx} ry={ry} fill={LEAF_DARK} />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={LEAF} />
      <path d={veins} stroke={LEAF_DARK} strokeWidth="2" strokeLinecap="round" opacity=".55" />
      <circle cx={cx} cy={cy} r="4" fill={LEAF_DARK} />
    </g>
  )
}

export default function Lotus({
  mood = 'calm',
  size = 220,
  bloom,
  ripples = true,
  className = '',
  title = 'Bua the lotus',
}: Props) {
  const open = bloom ?? BLOOM[mood]
  const side = 20 + open * 16 // side petals: 20° tight, 36° open
  const outer = 16 + open * 48 // outer petals: hidden behind the bud at 16°, fanned to 64°
  return (
    <svg
      className={`lotus lotus--${mood} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 240 240"
      role="img"
      aria-label={title}
    >
      {ripples && (
        <g fill="none" stroke="#8FBBEF" strokeWidth="3" strokeLinecap="round">
          <ellipse cx="120" cy="212" rx="92" ry="13" />
          <path d="M44 224 q14 -5 28 0" opacity=".7" />
          <path d="M168 226 q12 -4 24 0" opacity=".7" />
        </g>
      )}
      {/* stems rise from the water */}
      <g stroke={LEAF_DARK} strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M64 146 C66 174 76 198 84 214" />
        <path d={`M${BX} 186 C${BX} 196 ${BX} 206 ${BX - 2} 214`} />
      </g>
      <Leaf tilt={mood === 'concerned' ? 6 : 0} />

      <g className="lotus-flower">
        {[-1, 1].map((d) => (
          <Petal key={`outer${d}`} L={84} W={30} angle={d * outer} fill={OUTER} />
        ))}
        {[-1, 1].map((d) => (
          <Petal key={`side${d}`} L={88} W={34} angle={d * side} fill={open > 0.5 ? MID : OUTER} />
        ))}
        <path d={BUD} fill={SHADE} transform="translate(-4 6)" />
        <path d={BUD} fill={FACE} />
        <path d={BUD_TIP} fill={TIP} />
        <Face mood={mood} x={BX} y={138} gap={18} cheek={CHEEK} />
      </g>
    </svg>
  )
}
