import type { Expression } from './Face'
import { BUA_CHEEK, FLAMINGO, FLAMINGO_DARK, Frame, Paint, Scarf, SoftFace, useIds } from './soft'

interface Props {
  mood?: Expression
  size?: number
  /** how open Bua is, 0 (tight bud) to 1 (full bloom); defaults to the mood's */
  bloom?: number
  /** ripples on the water at the stems (off in the landscape's pond, which has its own) */
  ripples?: boolean
  /** a Flamingo scarf, the mark the three can share (the sandbox compares it; the flow goes without) */
  scarf?: boolean
  className?: string
  title?: string
}

// Bua is a true lotus (Nelumbo): a bud on its own stem rising from the water, with a round leaf
// held up above the surface, in the new mooca's finish (soft light and shade, no outlines, the
// shared face). Bud to bloom is the Buddhist image of awakening, so Bua's openness is its mood:
// worry closes the bud, calm is a bud, listening half-opens, happy is full bloom. At rest it sways
// a little on the water, its leaf a beat behind, and a slow ring spreads from its stem.
export const BLOOM: Record<Expression, number> = {
  concerned: 0,
  calm: 0.3,
  thinking: 0.3,
  tender: 0.45,
  listening: 0.6,
  happy: 1,
  delighted: 1,
}

// Every petal grows from the base of the flower at (BX, BY)
const BX = 120
const BY = 180

// One pointed petal of length L and width W, pointing straight up from the base
function petalPath(L: number, W: number) {
  return `M${BX} ${BY} C${BX - W} ${BY - L * 0.45} ${BX - W * 0.55} ${BY - L * 0.85} ${BX} ${BY - L} C${BX + W * 0.55} ${BY - L * 0.85} ${BX + W} ${BY - L * 0.45} ${BX} ${BY} Z`
}

// The face petal: an egg with a pointed crown, wide enough to hold the face
const BUD = `M${BX} 72 C${BX + 24} 94 ${BX + 38} 118 ${BX + 36} 144 C${BX + 34} 168 ${BX + 20} 182 ${BX} 182 C${BX - 20} 182 ${BX - 34} 168 ${BX - 36} 144 C${BX - 38} 118 ${BX - 24} 94 ${BX} 72 Z`
const BUD_TIP = `M${BX} 72 C${BX + 6} 78 ${BX + 11} 84 ${BX + 15} 91 C${BX + 5} 87 ${BX - 5} 87 ${BX - 15} 91 C${BX - 11} 84 ${BX - 6} 78 ${BX} 72 Z`

// The round leaf's veins, running out from its centre
const VEINS = [0, 60, 120, 180, 240, 300]
  .map((a) => {
    const r = (a * Math.PI) / 180
    return `M60 108 L${60 + Math.cos(r) * 43} ${108 + Math.sin(r) * 34}`
  })
  .join(' ')

export default function Lotus({ mood = 'calm', size = 220, bloom, ripples = true, scarf = false, className = '', title = 'Bua the lotus' }: Props) {
  const ids = useIds()
  const open = bloom ?? BLOOM[mood]
  const side = 20 + open * 16 // side petals: 20° tight, 36° open
  const outer = 16 + open * 48 // outer petals: hidden behind the bud at 16°, fanned to 64°
  const petal = `url(#${ids.g('petal')})`
  return (
    <Frame
      size={size}
      title={title}
      className={`lotus lotus--${mood} ${className}`}
      ground={ripples}
      ids={ids}
      defs={
        <>
          <Paint id={ids.soft} tone={{ hi: '#FFFFFF', base: '#FFEDEB', shade: '#F4CFCB' }} />
          <linearGradient id={ids.g('petal')} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#FFE6E3" />
            <stop offset="0.55" stopColor="#F9C3C0" />
            <stop offset="1" stopColor="#F09A96" />
          </linearGradient>
          <radialGradient id={ids.g('leaf')} cx="0.38" cy="0.32" r="0.8">
            <stop offset="0" stopColor="#B4EA98" />
            <stop offset="0.6" stopColor="#8AD866" />
            <stop offset="1" stopColor="#68B84A" />
          </radialGradient>
        </>
      }
    >
      {ripples && (
        <g fill="none" stroke="#A9CBF3" strokeWidth="3" strokeLinecap="round" opacity=".8">
          <ellipse cx="120" cy="212" rx="92" ry="13" />
          <path d="M44 224 q14 -5 28 0" opacity=".7" />
          <path d="M168 226 q12 -4 24 0" opacity=".7" />
        </g>
      )}
      {/* a slow ring spreads from where the stem meets the water */}
      <ellipse className="idle-ripple" cx="118" cy="214" rx="22" ry="4.5" fill="none" stroke="#A9CBF3" strokeWidth="2.5" />
      {/* the whole plant sways a little on the water, rooted at the stem's foot */}
      <g className="idle-bua">
        <g stroke="#79C257" strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M64 146 C66 174 76 198 84 214" />
          <path d={`M${BX} 186 C${BX} 196 ${BX} 206 ${BX - 2} 214`} />
        </g>
        <g transform={`rotate(${mood === 'concerned' ? 6 : 0} 60 148)`}>
          <g className="idle-leaf">
            <ellipse cx="60" cy="108" rx="50" ry="40" fill={`url(#${ids.g('leaf')})`} />
            <path d={VEINS} stroke="#68B84A" strokeWidth="1.8" strokeLinecap="round" opacity=".45" />
            <ellipse cx="44" cy="92" rx="16" ry="7" fill="#fff" opacity=".45" filter={`url(#${ids.blur})`} />
          </g>
        </g>
        <g className="lotus-flower">
          {/* each petal pivots on its own base, so it unfolds smoothly as the bloom changes */}
          {[
            { a: outer, L: 84, W: 30 },
            { a: side, L: 88, W: 34 },
          ].map(({ a, L, W }, i) =>
            [-1, 1].map((d) => (
              <g key={`${i}${d}`} className="lotus-unfold" style={{ transform: `rotate(${d * a}deg)` }}>
                <path d={petalPath(L, W)} fill={petal} />
              </g>
            )),
          )}
          <path d={BUD} fill={`url(#${ids.soft})`} />
          <ellipse cx="104" cy="104" rx="12" ry="18" fill="#fff" opacity=".8" filter={`url(#${ids.blur})`} />
          <path d={BUD_TIP} fill="#F3A5A1" />
          {scarf && <Scarf x={BX} y={170} w={64} color={FLAMINGO} dark={FLAMINGO_DARK} />}
          <SoftFace mood={mood} x={BX} y={136} gap={18} cheek={BUA_CHEEK} blinkDelay="-4.6s" />
        </g>
      </g>
    </Frame>
  )
}
