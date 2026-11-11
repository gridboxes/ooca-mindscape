import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import Mooca from './Mooca'
import Rock from './companions/Rock'
import Lotus from './companions/Lotus'
import type { Expression, NewMood } from './companions/Face'
import type { Weather } from '../content'

export type Focus = 'all' | 'sky' | 'earth' | 'water'
export type SoftGround = 'hill' | 'meadow' | 'stones' | 'lake' | 'sea'

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
  /** draw a different mooca or Bua in their places (the sandbox compares the earlier characters) */
  renderMooca?: (size: number) => ReactNode
  /** a faint shadow on the hills far below mooca, breathing with its bob, so it reads as up in the air */
  moocaShadow?: boolean
  renderLotus?: (mood: Expression, size: number) => ReactNode
  /** 'soft' (the default) paints the scene in the new mooca's finish; 'flat' is the earlier look, kept for comparison */
  look?: 'flat' | 'soft'
  /** the ground in the soft look: hill and pond, a meadow pond (the default), a pond ringed with stones, an open lake, or open water all around Hin's hill */
  ground?: SoftGround
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
const STAMP_COLOR: Record<Stamp, string> = { mooca: '#00C4B3', hin: '#E9A400', bua: '#EF7773' }

// One portrait scene: sky above (mooca), earth bottom-left (Rock), pond bottom-right (Lotus).
const W = 390
const H = 560

// Where the note rests in each place, in scene units. On a short stage (a small phone) it's
// nudged to stay inside what the camera shows (see `keepInView`).
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

function Note({ text, at, stamp, drift, rest = NOTE_AT[at] }: { text: string; at: Focus; stamp: Stamp | null; drift: number; rest?: { x: number; y: number; r: number; k?: number } }) {
  // Drifting: it floats off to the right across the pond, turning a little, and fades
  const x = rest.x + drift * 120
  const y = rest.y - drift * 10
  const r = rest.r + drift * 10
  const lines = wrap(text)
  const w = 128
  const h = 26 + lines.length * 15
  return (
    <g className="landscape__note" style={{ transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(${rest.k ?? 1})`, opacity: 1 - drift }}>
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

function cameraAt(focus: Focus, lift = 0) {
  // Rising from Hin's ground eases the camera from close on the earth to the whole landscape
  const from = CAMERA[focus]
  const to = CAMERA.all
  const x = from.x + (to.x - from.x) * lift
  const y = from.y + (to.y - from.y) * lift
  const s = from.s + (to.s - from.s) * lift
  // Centre the target, then clamp so the scene's edges never come into view
  const tx = Math.min(0, Math.max(W - s * W, W / 2 - s * x))
  const ty = Math.min(0, Math.max(H - s * H, H / 2 - s * y))
  return { tx, ty, s }
}

function camera(focus: Focus, lift = 0) {
  const { tx, ty, s } = cameraAt(focus, lift)
  return `translate(${tx}px, ${ty}px) scale(${s})`
}

// How far the card overlaps the bottom of the stage, in screen pixels (see .ms__card)
const CARD_OVERLAP = 28

/**
 * Keep the note's resting place inside the part of the scene that's actually on screen: the stage
 * crops the scene to its shape ('slice'), the camera zooms in, and the card covers the bottom edge.
 */
function keepInView(at: Focus, view: Focus, lift: number, box: { w: number; h: number }, lines: number) {
  const rest = NOTE_AT[at]
  const k = Math.max(box.w / W, box.h / H)
  const { tx, ty, s } = cameraAt(view, lift)
  // the visible window in scene units, before the camera
  const vx0 = W / 2 - box.w / (2 * k)
  const vx1 = W / 2 + box.w / (2 * k)
  const vy0 = H / 2 - box.h / (2 * k)
  const vy1 = H / 2 + box.h / (2 * k) - CARD_OVERLAP / k
  // ...and in the scene's own units, inside the camera
  const x0 = (vx0 - tx) / s
  const x1 = (vx1 - tx) / s
  const y0 = (vy0 - ty) / s
  const y1 = (vy1 - ty) / s
  // on a short stage the zoomed-in note would cover the companion's face, so it shrinks a little
  const k2 = Math.min(1, Math.max(0.62, box.h / 380))
  const halfW = 64 * k2 + 6
  const halfH = ((26 + lines * 15) / 2) * k2 + 6
  const clamp = (v: number, lo: number, hi: number) => (lo > hi ? (lo + hi) / 2 : Math.min(hi, Math.max(lo, v)))
  return { ...rest, k: k2, x: clamp(rest.x, x0 + halfW, x1 - halfW), y: clamp(rest.y, y0 + halfH, y1 - halfH) }
}

export default function Landscape({
  focus = 'all',
  moocaWeather = null,
  moocaMood,
  moocaEffects = false,
  moocaGlow = false,
  rockMood = 'calm',
  renderRock,
  renderMooca,
  moocaShadow = true,
  renderLotus,
  look = 'soft',
  ground = 'meadow',
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
  // The stage's size on screen, so the note can stay inside the part of the scene it shows
  const ref = useRef<SVGSVGElement>(null)
  const [box, setBox] = useState<{ w: number; h: number } | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || fit !== 'slice' || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [fit])
  const noteRest = note && box && box.w > 0 && box.h > 0 ? keepInView(noteAt, focus, lift, box, wrap(note).length) : undefined
  return (
    <svg
      ref={ref}
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
        <radialGradient id={`${id}-halo`}>
          <stop offset="0" stopColor="#FFF6D6" stopOpacity=".95" />
          <stop offset=".6" stopColor="#FFF1C2" stopOpacity=".45" />
          <stop offset="1" stopColor="#FFF1C2" stopOpacity="0" />
        </radialGradient>
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
{look === 'soft' ? (
            <SoftScenery id={id} pondMurk={pondMurk} variant={ground} />
          ) : (
            <>
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
            </>
          )}

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
          <g stroke={look === 'soft' ? '#93CF78' : '#8AD866'} strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M18 362 l-3 -10 M22 362 l1 -12 M26 362 l4 -9" />
            {/* the tufts on the right stand on land, so they go where the soft ground is water */}
            {!(look === 'soft' && (ground === 'sea' || ground === 'lake')) && (
              <>
                <path d="M214 404 l-4 -12 M218 404 l1 -14 M222 404 l5 -11" />
                <path d="M372 404 l-3 -10 M376 404 l1 -12 M380 404 l4 -9" />
              </>
            )}
          </g>

          {/* the halo that blooms behind a friend in the moment before the card (shown by the page's CSS) */}
          {(
            [
              ['mooca', 195, 128, 84],
              ['hin', 94, 392, 78],
              ['bua', 296, 388, 72],
            ] as const
          ).map(([who, x, y, r]) => (
            <g key={who} className={`landscape__halo landscape__halo--${who}`} transform={`translate(${x} ${y})`} aria-hidden="true">
              <circle r={r} fill={`url(#${id}-halo)`} />
              {[
                [-r * 0.95, -r * 0.55, 9],
                [r * 0.92, -r * 0.7, 7],
                [r * 1.02, r * 0.25, 6],
                [-r * 0.8, r * 0.45, 5],
                [r * 0.1, -r * 1.05, 6],
              ].map(([sx, sy, k], i) => (
                <path
                  key={i}
                  className="landscape__spark"
                  style={{ animationDelay: `${0.55 + i * 0.12}s` }}
                  d={`M${sx} ${sy - k} Q${sx} ${sy} ${sx + k} ${sy} Q${sx} ${sy} ${sx} ${sy + k} Q${sx} ${sy} ${sx - k} ${sy} Q${sx} ${sy} ${sx} ${sy - k} Z`}
                  fill="#FFFFFF"
                />
              ))}
            </g>
          ))}
          {/* companions */}
          {/* the silver lining: light from behind mooca's cloud, and a few glints at its edge */}
          {moocaGlow && (
            <g className="landscape__lining" aria-hidden="true">
              <ellipse cx="195" cy="116" rx="132" ry="96" fill={`url(#${id}-lining)`} />
            </g>
          )}
          {moocaShadow && <ellipse className="float-shadow" cx="194" cy="300" rx="34" ry="4.5" fill="#5E8F88" opacity=".12" />}
          <g className={`landscape__mooca${moocaGlow ? ' is-glowing' : ''}`} transform="translate(95 34)">
            {/* the cheer wrapper lets a friend celebrate at the end without moving its place */}
            <g className="landscape__cheer">
              {renderMooca ? (
                renderMooca(200)
              ) : (
                <Mooca weather={moocaWeather} mood={moocaMood} size={200} effects={moocaEffects} lining={moocaGlow} title="mooca" />
              )}
            </g>
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
            <g className="landscape__cheer">
              {renderRock ? renderRock(rockMood, 200) : <Rock mood={rockMood} size={200} title="Hin the rock" />}
            </g>
          </g>
          <g className="landscape__lotus" transform="translate(204 302)">
            <g className="landscape__cheer">
              {renderLotus ? renderLotus(lotusMood, 180) : <Lotus mood={lotusMood} bloom={lotusBloom} size={180} ripples={false} title="Bua the lotus" />}
            </g>
          </g>

          {/* and a little heart stays with each friend it reached: Bua, then Hin, then mooca */}
          <g className="landscape__hearts" aria-hidden="true">
            {KIND_HEARTS.slice(0, kindRings).map(([x, y], i) => (
              <g key={i} transform={`translate(${x} ${y})`}>
                <path className="landscape__heart" d={HEART} fill="#F28C9B" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
              </g>
            ))}
          </g>

          {note && noteDrift < 1 && <Note text={note} at={noteAt} stamp={noteStamp} drift={noteDrift} rest={noteRest} />}
        </g>
      </g>
    </svg>
  )
}

/**
 * The same sky, hills, earth and pond, painted in the new mooca's finish: soft gradients, a warm
 * glow, puffy clouds with lavender undersides, and light on the water. Shapes and places stay
 * where the flat scene has them, so the camera, the note and every room effect still line up.
 */
function SoftScenery({ id, pondMurk, variant }: { id: string; pondMurk: number; variant: SoftGround }) {
  const flowers = (spots: [number, number, string][]) => (
    <g>
      {spots.map(([x, y, c]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
          <g fill={c}>
            <circle cx="0" cy="-3" r="2.6" />
            <circle cx="3" cy="0" r="2.6" />
            <circle cx="0" cy="3" r="2.6" />
            <circle cx="-3" cy="0" r="2.6" />
          </g>
          <circle r="1.8" fill="#FBD86A" />
        </g>
      ))}
    </g>
  )
  const g = (n: string) => `${id}-soft-${n}`
  const puff = (x: number, y: number, k: number) => (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <ellipse cx="2" cy="16" rx="44" ry="9" fill="#C9D3EC" opacity=".55" filter={`url(#${g('blur')})`} />
      <g fill={`url(#${g('puff')})`}>
        <circle cx="-22" cy="4" r="14" />
        <circle cx="-2" cy="-6" r="20" />
        <circle cx="22" cy="2" r="15" />
        <rect x="-36" y="0" width="72" height="18" rx="9" />
      </g>
    </g>
  )
  return (
    <g>
      <defs>
        <filter id={g('blur')} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <linearGradient id={g('sky')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B9E7E1" />
          <stop offset=".42" stopColor="#E2F5F1" />
          <stop offset=".62" stopColor="#FBF8EF" />
        </linearGradient>
        <radialGradient id={g('glow')}>
          <stop offset="0" stopColor="#FFF4D2" stopOpacity=".95" />
          <stop offset="1" stopColor="#FFF4D2" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={g('puff')} cx=".4" cy=".25" r=".9">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset=".7" stopColor="#FAFBFE" />
          <stop offset="1" stopColor="#E3E8F4" />
        </radialGradient>
        <linearGradient id={g('far')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C6EAE3" />
          <stop offset=".5" stopColor="#E4F5F1" />
        </linearGradient>
        <linearGradient id={g('near')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B4E1D6" />
          <stop offset=".45" stopColor="#D9F0EA" />
        </linearGradient>
        <linearGradient id={g('earth')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FBEBC4" />
          <stop offset=".55" stopColor="#F5DCA2" />
          <stop offset="1" stopColor="#EBC889" />
        </linearGradient>
        <linearGradient id={g('mint')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C2E6DD" />
          <stop offset=".3" stopColor="#DCF1EC" />
        </linearGradient>
        <linearGradient id={g('meadow')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D8F0C8" />
          <stop offset="1" stopColor="#B6DDA1" />
        </linearGradient>
        <linearGradient id={g('lake')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E3EFFC" />
          <stop offset=".5" stopColor="#CBE0F8" />
          <stop offset="1" stopColor="#A9C8EE" />
        </linearGradient>
        <radialGradient id={g('pond')} cx=".45" cy=".4" r=".7">
          <stop offset="0" stopColor="#F1F7FE" />
          <stop offset=".65" stopColor="#D8E8FA" />
          <stop offset="1" stopColor="#B9D3F2" />
        </radialGradient>
      </defs>

      {/* sky: mint to warm cream, with the morning light top right */}
      <rect width={W} height={H} fill={`url(#${g('sky')})`} />
      <ellipse cx="320" cy="70" rx="140" ry="110" fill={`url(#${g('glow')})`} />
      <g className="landscape__clouds">
        {puff(60, 64, 0.9)}
        {puff(344, 146, 0.75)}
        {puff(36, 214, 0.5)}
      </g>

      {/* hills, far and near, fading into the haze */}
      <path d="M0 280 C70 250 140 262 200 278 C260 294 330 270 390 250 L390 560 L0 560 Z" fill={`url(#${g('far')})`} />
      {variant === 'lake' ? (
        <>
      {/* water: an open lake from Hin's beach to the scene's edge, with foam where it meets the sand */}
      <path d="M390 318 C340 326 286 344 252 380 C228 406 222 470 238 560 L390 560 Z" fill={`url(#${g('lake')})`} />
      <path d="M390 330 C344 338 300 352 270 376" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".55" filter={`url(#${g('blur')})`} />
      <ellipse cx="318" cy="420" rx="56" ry="8" fill="#FFFFFF" opacity=".55" filter={`url(#${g('blur')})`} />
      <ellipse className="landscape__mud" cx="304" cy="452" rx="104" ry="70" fill="#C9AE82" style={{ opacity: pondMurk * 0.6 }} />
      <g fill="none" stroke="#9EC3EF" strokeWidth="2.5" strokeLinecap="round" opacity=".6">
        <path d="M262 500 q14 -6 28 0" />
        <path d="M340 520 q12 -5 24 0" />
        <path d="M330 372 q10 -4 20 0" />
      </g>
      <path d="M200 362 C232 384 244 430 236 560" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" fill="none" opacity=".75" filter={`url(#${g('blur')})`} />
      {/* earth: the warm hill, lit along its top edge */}
      <path d="M0 330 C60 310 140 322 200 362 C232 384 244 430 236 560 L0 560 Z" fill={`url(#${g('earth')})`} />
      <path d="M0 336 C60 316 138 328 194 366" stroke="#FFF6DE" strokeWidth="6" strokeLinecap="round" fill="none" opacity=".8" filter={`url(#${g('blur')})`} />
      <ellipse cx="96" cy="500" rx="70" ry="18" fill="#E3BD7C" opacity=".35" filter={`url(#${g('blur')})`} />
      <g fill="#E6C589" opacity=".8">
        <ellipse cx="160" cy="508" rx="9" ry="5" />
        <ellipse cx="176" cy="514" rx="6" ry="3.5" />
        <ellipse cx="34" cy="530" rx="7" ry="4" />
      </g>
          {flowers([[30, 372, '#F7B6BE'], [150, 360, '#FFFFFF']])}
        </>
      ) : variant === 'hill' ? (
        <>
      <path d="M150 312 C220 290 300 296 390 284 L390 560 L150 560 Z" fill={`url(#${g('near')})`} opacity=".8" />
      {/* earth: the warm hill, lit along its top edge */}
      <path d="M0 330 C60 310 140 322 200 362 C232 384 244 430 236 560 L0 560 Z" fill={`url(#${g('earth')})`} />
      <path d="M0 336 C60 316 138 328 194 366" stroke="#FFF6DE" strokeWidth="6" strokeLinecap="round" fill="none" opacity=".8" filter={`url(#${g('blur')})`} />
      <ellipse cx="96" cy="500" rx="70" ry="18" fill="#E3BD7C" opacity=".35" filter={`url(#${g('blur')})`} />
      <g fill="#E6C589" opacity=".8">
        <ellipse cx="160" cy="508" rx="9" ry="5" />
        <ellipse cx="176" cy="514" rx="6" ry="3.5" />
        <ellipse cx="34" cy="530" rx="7" ry="4" />
      </g>
          {flowers([[30, 372, '#F7B6BE'], [186, 392, '#FFFFFF'], [362, 410, '#F7B6BE']])}

      {/* water: a soft-lit pond with a glint across it */}
      <ellipse cx="302" cy="458" rx="134" ry="58" fill="#A9C8EE" opacity=".6" filter={`url(#${g('blur')})`} />
      <ellipse cx="300" cy="448" rx="126" ry="54" fill={`url(#${g('pond')})`} />
      <ellipse cx="258" cy="428" rx="48" ry="8" fill="#FFFFFF" opacity=".7" filter={`url(#${g('blur')})`} />
      <ellipse className="landscape__mud" cx="300" cy="449" rx="124" ry="54" fill="#C9AE82" style={{ opacity: pondMurk * 0.6 }} />
      <g fill="none" stroke="#9EC3EF" strokeWidth="2.5" strokeLinecap="round" opacity=".6">
        <path d="M200 470 q14 -6 28 0" />
        <path d="M350 486 q12 -5 24 0" />
      </g>
        </>
      ) : (
        <>
      {variant === 'sea' ? (
        <>
          {/* open water all around Hin's hill, out to the horizon */}
          <path d="M0 318 C90 300 180 306 260 300 C320 296 360 292 390 288 L390 560 L0 560 Z" fill={`url(#${g('lake')})`} />
          <path d="M200 308 C270 302 330 298 390 294" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".6" filter={`url(#${g('blur')})`} />
          <ellipse cx="318" cy="420" rx="56" ry="8" fill="#FFFFFF" opacity=".55" filter={`url(#${g('blur')})`} />
          <ellipse className="landscape__mud" cx="304" cy="452" rx="104" ry="70" fill="#C9AE82" style={{ opacity: pondMurk * 0.6 }} />
          <g fill="none" stroke="#9EC3EF" strokeWidth="2.5" strokeLinecap="round" opacity=".6">
            <path d="M262 500 q14 -6 28 0" />
            <path d="M340 520 q12 -5 24 0" />
            <path d="M320 360 q10 -4 20 0" />
          </g>
          {/* foam where the water meets the sand */}
          <path d="M184 356 C208 374 206 440 192 560" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" fill="none" opacity=".75" filter={`url(#${g('blur')})`} />
        </>
      ) : (
        <>
          {/* the ground on the right: A's soft mint for the meadow pond, green grass around the stone-ringed one */}
          <path d="M0 318 C90 300 180 306 260 300 C320 296 360 292 390 288 L390 560 L0 560 Z" fill={`url(#${g(variant === 'meadow' ? 'mint' : 'meadow')})`} />
        </>
      )}
      {/* earth: Hin's sandy hill, ending before the water so the pond sits in the grass */}
      <path d="M0 330 C60 310 136 322 184 356 C208 374 206 440 192 560 L0 560 Z" fill={`url(#${g('earth')})`} />
      <path d="M0 336 C60 316 134 328 180 360" stroke="#FFF6DE" strokeWidth="6" strokeLinecap="round" fill="none" opacity=".8" filter={`url(#${g('blur')})`} />
      <ellipse cx="92" cy="500" rx="66" ry="18" fill="#E3BD7C" opacity=".35" filter={`url(#${g('blur')})`} />
      <g fill="#E6C589" opacity=".8">
        <ellipse cx="150" cy="508" rx="9" ry="5" />
        <ellipse cx="166" cy="516" rx="6" ry="3.5" />
        <ellipse cx="34" cy="530" rx="7" ry="4" />
      </g>
      {variant !== 'sea' && (
        <>
      {/* the pond, sunk into the grass: a darker bank, then the water */}
      {variant === 'stones' ? (
        // the stone-ringed pond keeps a grassy bank
        <ellipse cx="304" cy="458" rx="118" ry="58" fill="#9FCF88" opacity=".75" filter={`url(#${g('blur')})`} />
      ) : (
        // the meadow pond is coloured like A's: a solid blue rim, so the green never tints the water
        <>
          <ellipse cx="306" cy="460" rx="122" ry="58" fill="#A9C8EE" opacity=".6" filter={`url(#${g('blur')})`} />
          <ellipse cx="305" cy="454" rx="114" ry="55" fill="#B7D2F2" />
        </>
      )}
      <ellipse cx="304" cy="448" rx={variant === 'stones' ? 106 : 112} ry={variant === 'stones' ? 50 : 52} fill={`url(#${g('pond')})`} />
      <ellipse cx="270" cy="430" rx="40" ry="7" fill="#FFFFFF" opacity=".7" filter={`url(#${g('blur')})`} />
      <ellipse className="landscape__mud" cx="304" cy="449" rx="104" ry="49" fill="#C9AE82" style={{ opacity: pondMurk * 0.6 }} />
      <g fill="none" stroke="#9EC3EF" strokeWidth="2.5" strokeLinecap="round" opacity=".6">
        <path d="M232 472 q14 -6 28 0" />
        <path d="M340 484 q12 -5 24 0" />
      </g>
        </>
      )}
          {variant === 'stones' && (
            <>
      {/* a ring of soft river stones around the pond, and reeds at its far edge */}
      <g>
        {Array.from({ length: 22 }, (_, i) => {
          const a = (i / 22) * Math.PI * 2
          const x = 304 + Math.cos(a) * 108
          const y = 449 + Math.sin(a) * 51
          const k = 0.75 + ((i * 37) % 10) / 25
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${k})`}>
              <ellipse cx="1" cy="2" rx="10" ry="6" fill="#BFB6A8" />
              <ellipse rx="10" ry="6" fill="#E9E4DC" />
              <ellipse cx="-3" cy="-2" rx="4" ry="1.6" fill="#FFFFFF" opacity=".75" />
            </g>
          )
        })}
      </g>
      <g strokeLinecap="round">
        <g stroke="#8CC870" strokeWidth="3" fill="none">
          <path d="M372 438 q-2 -26 2 -44" />
          <path d="M380 440 q2 -22 -1 -38" />
          <path d="M366 440 q-6 -16 -10 -26" />
        </g>
        <g fill="#B98A5E">
          <rect x="370" y="388" width="7" height="16" rx="3.5" />
          <rect x="376" y="396" width="6" height="13" rx="3" />
        </g>
      </g>
      {/* lily pads */}
      <g fill="#8FD06F">
        <ellipse cx="244" cy="462" rx="12" ry="5.5" />
        <ellipse cx="352" cy="438" rx="10" ry="4.5" />
      </g>
            </>
          )}
          {variant === 'sea' ? flowers([[30, 372, '#F7B6BE'], [150, 360, '#FFFFFF']]) : flowers([[30, 372, '#F7B6BE'], [214, 396, '#FFFFFF'], [232, 420, '#F7B6BE'], [370, 500, '#FFFFFF']])}
        </>
      )}
    </g>
  )
}
