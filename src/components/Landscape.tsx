import { useId, type ReactNode } from 'react'
import Mooca from './Mooca'
import Rock from './companions/Rock'
import Lotus from './companions/Lotus'
import type { Expression, NewMood } from './companions/Face'
import type { Weather } from '../content'

export type Focus = 'all' | 'sky' | 'earth' | 'water'

interface Props {
  focus?: Focus
  moocaWeather?: Weather | null
  /** a mood with no weather face of its own; overrides the weather's face */
  moocaMood?: NewMood
  /** rain, sun and fog around mooca, for mooca's room */
  moocaEffects?: boolean
  /** the silver lining: mooca's cloud glows at the edge */
  moocaGlow?: boolean
  rockMood?: Expression
  /** draw a different Hin in Hin's place (used to compare candidates) */
  renderRock?: (mood: Expression, size: number) => ReactNode
  lotusMood?: Expression
  /** how open Bua is, 0 bud to 1 bloom; defaults to the mood's */
  lotusBloom?: number
  /** how muddy the pond is, 0 clear to 1; Bua's breaths let it settle */
  pondMurk?: number
  /** rising above it in Hin's room: 0 close on Hin's ground to 1 the whole landscape */
  lift?: number
  /** stepping stones laid on Hin's hill */
  hinSteps?: number
  /** kindness passed on from the pond: 1 reaches Bua, 2 reaches Hin, 3 reaches mooca */
  kindRings?: number
  /** the user's thought, carried as a paper note through the scene */
  note?: string | null
  /** how far the note has drifted off across the water, 0 resting to 1 gone */
  noteDrift?: number
  /** where the note rests: between the three, or beside one companion */
  noteAt?: Focus
  /** once the thought has been through a room, that companion's mark on the note */
  noteStamp?: Stamp | null
  /** 'slice' fills a frame of any shape, cropping the scene's edges */
  fit?: 'meet' | 'slice'
  className?: string
}

type Stamp = 'mooca' | 'hin' | 'bua'
const STAMP_COLOR: Record<Stamp, string> = { mooca: '#00C4B3', hin: '#F9A000', bua: '#EF7773' }

// One portrait scene: sky above (mooca), earth bottom-left (Rock), pond bottom-right (Lotus).
const W = 390
const H = 560

// Where the note rests in each place, in scene units
const NOTE_AT: Record<Focus, { x: number; y: number; r: number }> = {
  all: { x: 195, y: 246, r: -4 },
  sky: { x: 252, y: 236, r: 5 },
  earth: { x: 172, y: 318, r: -6 },
  water: { x: 300, y: 468, r: 3 },
}

// Break the note into short lines. Thai has no spaces, so split on word boundaries where the
// browser can find them, and fall back to characters.
type WordSegmenter = new (locale?: string, options?: { granularity: 'word' }) => {
  segment(text: string): Iterable<{ segment: string }>
}
const Segmenter = (Intl as unknown as { Segmenter?: WordSegmenter }).Segmenter

function wrap(text: string, max = 17, lines = 4): string[] {
  const words: string[] = Segmenter
    ? Array.from(new Segmenter(undefined, { granularity: 'word' }).segment(text), (s) => s.segment)
    : text.split(/(\s+)/)
  const out: string[] = []
  let cur = ''
  for (const w of words) {
    if ((cur + w).length > max && cur.trim()) {
      out.push(cur.trim())
      cur = w.trimStart()
    } else cur += w
  }
  if (cur.trim()) out.push(cur.trim())
  if (out.length > lines) {
    out.length = lines
    out[lines - 1] = out[lines - 1].replace(/.{0,1}$/, '…')
  }
  return out
}

function Note({ text, at, stamp, drift }: { text: string; at: Focus; stamp: Stamp | null; drift: number }) {
  const rest = NOTE_AT[at]
  // Drifting: it floats off to the right across the pond, turning a little, and fades
  const x = rest.x + drift * 120
  const y = rest.y - drift * 10
  const r = rest.r + drift * 10
  const lines = wrap(text)
  const w = 128
  const h = 26 + lines.length * 15
  return (
    <g className="landscape__note" style={{ transform: `translate(${x}px, ${y}px) rotate(${r}deg)`, opacity: 1 - drift }}>
      <g className="landscape__note-paper">
        <rect x={-w / 2 + 3} y={-h / 2 + 4} width={w} height={h} rx="6" fill="#26313C" opacity=".08" />
        <path
          d={`M${-w / 2 + 6} ${-h / 2} H${w / 2 - 14} L${w / 2} ${-h / 2 + 14} V${h / 2 - 6} Q${w / 2} ${h / 2} ${w / 2 - 6} ${h / 2} H${-w / 2 + 6} Q${-w / 2} ${h / 2} ${-w / 2} ${h / 2 - 6} V${-h / 2 + 6} Q${-w / 2} ${-h / 2} ${-w / 2 + 6} ${-h / 2} Z`}
          fill="#FFFDF7"
        />
        <path d={`M${w / 2 - 14} ${-h / 2} V${-h / 2 + 10} Q${w / 2 - 14} ${-h / 2 + 14} ${w / 2 - 10} ${-h / 2 + 14} H${w / 2} Z`} fill="#F1E9D6" />
        <text
          x="0"
          y={-h / 2 + 22}
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill="#3F6866"
          className="landscape__note-text"
        >
          {lines.map((l, i) => (
            <tspan key={i} x="0" dy={i === 0 ? 0 : 15}>
              {l}
            </tspan>
          ))}
        </text>
        {stamp && (
          <g transform={`translate(${-w / 2 + 4} ${-h / 2 + 2}) rotate(-12)`}>
            <g className="landscape__stamp">
              <circle r="11" fill={STAMP_COLOR[stamp]} />
              <path d="M-5 0.5 l3.5 3.5 l6.5 -7" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
        )}
      </g>
    </g>
  )
}

// Glints of light at the edge of mooca's cloud when the silver lining is found: x, y, size
const GLINTS: [number, number, number][] = [
  [112, 78, 7],
  [282, 92, 9],
  [140, 40, 5],
  [262, 150, 6],
]

// Stepping stones from Hin's side up the hill, smaller as they lead away: x, y, size
const HIN_STEPS: [number, number, number][] = [
  [192, 448, 12],
  [210, 435, 11],
  [226, 423, 10],
  [240, 412, 9],
  [252, 402, 8],
]

// Kindness ripples out from the lotus: the first ring holds Bua, the second reaches Hin, the third mooca
const KIND_AT = { x: 300, y: 430 }
const KIND_RINGS = [70, 230, 360]
// where each reached friend's heart floats: just above Bua's bud, Hin's shoulder, mooca's cloud
const KIND_HEARTS: [number, number][] = [
  [338, 352],
  [150, 336],
  [270, 66],
]
const HEART = 'M0 9 C-15 -3 -12 -18 0 -10.5 C12 -18 15 -3 0 9 Z'

// Where the camera looks for each room, and how close
const CAMERA: Record<Focus, { x: number; y: number; s: number }> = {
  all: { x: W / 2, y: H / 2, s: 1 },
  sky: { x: 195, y: 150, s: 1.55 },
  earth: { x: 100, y: 390, s: 1.9 },
  water: { x: 292, y: 405, s: 1.7 },
}

function camera(focus: Focus, lift = 0) {
  // Rising from Hin's ground eases the camera from close on the earth to the whole landscape
  const from = CAMERA[focus]
  const to = CAMERA.all
  const x = from.x + (to.x - from.x) * lift
  const y = from.y + (to.y - from.y) * lift
  const s = from.s + (to.s - from.s) * lift
  // Centre the target, then clamp so the scene's edges never come into view
  const tx = Math.min(0, Math.max(W - s * W, W / 2 - s * x))
  const ty = Math.min(0, Math.max(H - s * H, H / 2 - s * y))
  return `translate(${tx}px, ${ty}px) scale(${s})`
}

export default function Landscape({
  focus = 'all',
  moocaWeather = null,
  moocaMood,
  moocaEffects = false,
  moocaGlow = false,
  rockMood = 'calm',
  renderRock,
  lotusMood = 'calm',
  lotusBloom,
  pondMurk = 0,
  kindRings = 0,
  lift = 0,
  hinSteps = 0,
  note = null,
  noteDrift = 0,
  noteAt = 'all',
  noteStamp = null,
  fit = 'meet',
  className = '',
}: Props) {
  const id = useId().replace(/:/g, '')
  return (
    <svg
      className={`landscape landscape--${focus} ${className}`}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio={fit === 'slice' ? 'xMidYMid slice' : 'xMidYMid meet'}
      role="img"
      aria-label="A landscape of sky, earth and water, with mooca in the sky, Hin the rock on the ground and Bua the lotus in a pond"
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D6F4F1" />
          <stop offset=".55" stopColor="#F2FBFA" />
          <stop offset="1" stopColor="#FFFFFF" />
        </linearGradient>
        <radialGradient id={`${id}-lining`}>
          <stop offset="0" stopColor="#FFF8DC" stopOpacity="1" />
          <stop offset=".55" stopColor="#FFE9A8" stopOpacity=".75" />
          <stop offset="1" stopColor="#FFE9A8" stopOpacity="0" />
        </radialGradient>
        {/* the kindness wave: warm at its edge, clear in the middle, like a ripple of light */}
        <radialGradient id={`${id}-kind`}>
          <stop offset=".6" stopColor="#FBD5D3" stopOpacity="0" />
          <stop offset=".9" stopColor="#FBD5D3" stopOpacity=".55" />
          <stop offset="1" stopColor="#FBD5D3" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}-frame`}>
          <rect width={W} height={H} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id}-frame)`}>
        <g className={`landscape__camera${lift > 0 ? ' is-lifting' : ''}`} style={{ transform: camera(focus, lift) }}>
          {/* sky */}
          <rect width={W} height={H} fill={`url(#${id}-sky)`} />
          <g className="landscape__clouds" fill="#FFFFFF">
            <ellipse cx="54" cy="70" rx="34" ry="12" />
            <ellipse cx="74" cy="62" rx="20" ry="12" />
            <ellipse cx="340" cy="150" rx="30" ry="10" />
            <ellipse cx="356" cy="143" rx="16" ry="10" />
          </g>

          {/* far hills */}
          <path d="M0 290 C70 262 140 272 200 286 C260 300 330 280 390 262 L390 560 L0 560 Z" fill="#DBF0EE" />

          {/* earth: a warm hill on the left */}
          <path d="M0 330 C60 310 140 322 200 362 C232 384 244 430 236 560 L0 560 Z" fill="#F1D58F" />
          <path d="M0 342 C60 322 136 334 192 372 C222 392 230 436 224 560 L0 560 Z" fill="#F8E4B3" />
          <g fill="#E9CD8C">
            <ellipse cx="160" cy="508" rx="9" ry="5" />
            <ellipse cx="176" cy="514" rx="6" ry="3.5" />
            <ellipse cx="34" cy="530" rx="7" ry="4" />
          </g>

          {/* water: a pond on the right */}
          <ellipse cx="300" cy="452" rx="132" ry="58" fill="#C7DDF7" />
          <ellipse cx="300" cy="446" rx="120" ry="50" fill="#E4EFFB" />
          <ellipse className="landscape__mud" cx="300" cy="449" rx="124" ry="54" fill="#C9AE82" style={{ opacity: pondMurk * 0.6 }} />
          <g fill="none" stroke="#8FBBEF" strokeWidth="2.5" strokeLinecap="round" opacity=".7">
            <path d="M200 470 q14 -6 28 0" />
            <path d="M350 486 q12 -5 24 0" />
          </g>

          {/* kindness passed on: a soft wave of warmth from the lotus, each reaching further, then fading */}
          <g className="landscape__kind" aria-hidden="true">
            {KIND_RINGS.slice(0, kindRings).map((r) => (
              <circle key={r} className="landscape__kind-ring" cx={KIND_AT.x} cy={KIND_AT.y} r={r} fill={`url(#${id}-kind)`} />
            ))}
          </g>

          {/* stepping stones up Hin's hill: what's yours to move, turned into a path */}
          <g className="landscape__steps">
            {HIN_STEPS.slice(0, hinSteps).map(([x, y, rx], i) => (
              <g key={i} className="landscape__step" style={{ animationDelay: `${i * 0.18}s` }}>
                <ellipse cx={x + 1.5} cy={y + 2.5} rx={rx} ry={rx * 0.42} fill="#C9B07A" />
                <ellipse cx={x} cy={y} rx={rx} ry={rx * 0.42} fill="#E3DFD8" />
                <ellipse cx={x - rx * 0.3} cy={y - rx * 0.12} rx={rx * 0.35} ry={rx * 0.12} fill="#FFFFFF" opacity=".7" />
              </g>
            ))}
          </g>

          {/* grass tufts tie earth and water together */}
          <g stroke="#8AD866" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M214 404 l-4 -12 M218 404 l1 -14 M222 404 l5 -11" />
            <path d="M18 362 l-3 -10 M22 362 l1 -12 M26 362 l4 -9" />
            <path d="M372 404 l-3 -10 M376 404 l1 -12 M380 404 l4 -9" />
          </g>

          {/* companions */}
          {/* the silver lining: light from behind mooca's cloud, and a few glints at its edge */}
          {moocaGlow && (
            <g className="landscape__lining" aria-hidden="true">
              <ellipse cx="195" cy="116" rx="132" ry="96" fill={`url(#${id}-lining)`} />
            </g>
          )}
          <g className={`landscape__mooca${moocaGlow ? ' is-glowing' : ''}`} transform="translate(95 34)">
            <Mooca weather={moocaWeather} mood={moocaMood} size={200} effects={moocaEffects} lining={moocaGlow} title="mooca" />
          </g>
          {moocaGlow && (
            <g className="landscape__glints" fill="#FFFFFF" aria-hidden="true">
              {GLINTS.map(([x, y, r], i) => (
                <path
                  key={i}
                  d={`M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r} Z`}
                  style={{ animationDelay: `${0.4 + i * 0.5}s` }}
                />
              ))}
            </g>
          )}
          <g className="landscape__rock" transform="translate(-6 286)">
            {renderRock ? renderRock(rockMood, 200) : <Rock mood={rockMood} size={200} title="Hin the rock" />}
          </g>
          <g className="landscape__lotus" transform="translate(204 302)">
            <Lotus mood={lotusMood} bloom={lotusBloom} size={180} ripples={false} title="Bua the lotus" />
          </g>

          {/* and a little heart stays with each friend it reached: Bua, then Hin, then mooca */}
          <g className="landscape__hearts" aria-hidden="true">
            {KIND_HEARTS.slice(0, kindRings).map(([x, y], i) => (
              <g key={i} transform={`translate(${x} ${y})`}>
                <path className="landscape__heart" d={HEART} fill="#F28C9B" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
              </g>
            ))}
          </g>

          {note && noteDrift < 1 && <Note text={note} at={noteAt} stamp={noteStamp} drift={noteDrift} />}
        </g>
      </g>
    </svg>
  )
}
