import { useId, type ReactNode } from 'react'
import type { Expression } from './Face'

// The shared drawing kit for the three friends in the new mooca art style: painted shading with
// no outlines, small navy oval eyes, a thin smile, puffed cheeks. Each friend's colours live here
// too, so the companions, the sandbox and the landscape all draw from one place.

export const INK = '#2F3F8C'

export interface Tone {
  hi: string
  base: string
  shade: string
}

/** Unique, url()-safe ids for one drawing's gradients and filters */
export type Ids = ReturnType<typeof useIds>
export function useIds() {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  return { soft: `soft${id}`, blur: `blur${id}`, glow: `glow${id}`, g: (name: string) => `${name}${id}` }
}

/** A soft painted fill: lit from the top left, falling into shade at the far edge */
export function Paint({ id, tone }: { id: string; tone: Tone }) {
  return (
    <radialGradient id={id} cx="0.36" cy="0.3" r="0.85">
      <stop offset="0" stopColor={tone.hi} />
      <stop offset="0.55" stopColor={tone.base} />
      <stop offset="1" stopColor={tone.shade} />
    </radialGradient>
  )
}

export function Frame({ size, title, ids, defs, children, ground = true, groundAt, className }: { size: number; title: string; ids: Ids; defs: ReactNode; children: ReactNode; ground?: boolean; groundAt?: ReactNode; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 240 240" role="img" aria-label={title}>
      <defs>
        <filter id={ids.blur} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        {defs}
      </defs>
      {ground && (groundAt ?? <ellipse cx="120" cy="216" rx="52" ry="6" fill="#7C83A8" opacity=".14" />)}
      {children}
    </svg>
  )
}

/** mooca's weather faces, for the skies that have no mood of their own */
export type WeatherFace = 'foggy' | 'rainy' | 'stormy'

/** The shared face, drawn small and low like the new mooca's */
export function SoftFace({ mood, x, y, gap = 22, cheek = '#DCE1F0', blinkDelay = '0s' }: { mood: Expression | WeatherFace; x: number; y: number; gap?: number; cheek?: string; blinkDelay?: string }) {
  const lx = x - gap
  const rx = x + gap
  const line = { stroke: INK, strokeWidth: 2.8, strokeLinecap: 'round' as const, fill: 'none' }
  // cheeks are little cloud puffs, the new mooca's mark
  const puff = (cx: number) => (
    <g fill={cheek}>
      <circle cx={cx - 5} cy={y + 13} r="5.5" />
      <circle cx={cx + 3} cy={y + 11} r="6.5" />
      <circle cx={cx + 9} cy={y + 14} r="4.5" />
    </g>
  )
  const cheeks = (
    <g opacity={mood === 'concerned' || mood === 'rainy' || mood === 'stormy' ? 0.6 : 0.95}>
      {puff(lx - 12)}
      {puff(rx + 9)}
    </g>
  )
  const eyes = (dy = 0, dx = 0, shine = false) => (
    <g className="idle-blink" style={{ animationDelay: blinkDelay }}>
      <ellipse cx={lx + dx} cy={y + dy} rx="4.3" ry="5.4" fill={INK} />
      <ellipse cx={rx + dx} cy={y + dy} rx="4.3" ry="5.4" fill={INK} />
      {shine && (
        <g fill="#fff">
          <circle cx={lx + dx + 1.5} cy={y + dy - 2} r="1.5" />
          <circle cx={rx + dx + 1.5} cy={y + dy - 2} r="1.5" />
        </g>
      )}
    </g>
  )
  switch (mood) {
    case 'foggy':
      // a hazy sky: eyes half closed, a small level mouth
      return (
        <g>
          {cheeks}
          <g {...line}>
            <path d={`M${lx - 5} ${y + 1} h10`} />
            <path d={`M${rx - 5} ${y + 1} h10`} />
            <path d={`M${x - 5} ${y + 10} h10`} />
          </g>
        </g>
      )
    case 'rainy':
      // rain: eyes open but low, a small down-turned mouth, and one tear
      return (
        <g>
          {cheeks}
          {eyes(1)}
          <path d={`M${x - 6} ${y + 12} q6 -5 12 0`} {...line} />
          <path className="mooca-tear" d={`M${rx + 4} ${y + 7} q3.5 6 0 9.5 q-3.5 -3.5 0 -9.5 z`} fill="#8FBDF2" />
        </g>
      )
    case 'stormy':
      // a storm: worried brows, a wobbly mouth, and a drop of sweat
      return (
        <g>
          {cheeks}
          <g {...line} strokeWidth="2.4">
            <path d={`M${lx - 6} ${y - 8} l10 -4`} />
            <path d={`M${rx + 6} ${y - 8} l-10 -4`} />
          </g>
          {eyes(2)}
          <path d={`M${x - 9} ${y + 13} q3 -3.5 6 0 q3 3.5 6 0 q3 -3.5 6 0`} {...line} strokeWidth="2.4" />
          <path d={`M${rx + 20} ${y - 14} q4 6.5 0 10 q-4 -3.5 0 -10 z`} fill="#8FBDF2" />
        </g>
      )
    case 'calm':
      return (
        <g>
          {cheeks}
          <g {...line}>
            <path d={`M${lx - 5} ${y} q5 4.5 10 0`} />
            <path d={`M${rx - 5} ${y} q5 4.5 10 0`} />
            <path d={`M${x - 7} ${y + 8} q7 6 14 0`} />
          </g>
        </g>
      )
    case 'happy':
      return (
        <g>
          {cheeks}
          <g {...line}>
            <path d={`M${lx - 5} ${y + 1} q5 -6 10 0`} />
            <path d={`M${rx - 5} ${y + 1} q5 -6 10 0`} />
          </g>
          <path d={`M${x - 9} ${y + 7} q9 11 18 0 z`} fill={INK} />
        </g>
      )
    case 'concerned':
      return (
        <g>
          {cheeks}
          <g {...line} strokeWidth="2.4">
            <path d={`M${lx - 6} ${y - 9} l10 -3`} />
            <path d={`M${rx + 6} ${y - 9} l-10 -3`} />
          </g>
          {eyes(1)}
          <path d={`M${x - 6} ${y + 13} q6 -5 12 0`} {...line} />
        </g>
      )
    case 'tender':
      return (
        <g>
          {cheeks}
          {eyes(0, 0, true)}
          <path d={`M${x - 8} ${y + 8} q8 7 16 0`} {...line} />
        </g>
      )
    case 'thinking':
      return (
        <g>
          {cheeks}
          {eyes(-2, 3)}
          <path d={`M${x} ${y + 10} q5 3 10 -1`} {...line} />
        </g>
      )
    case 'delighted':
      return (
        <g>
          {cheeks}
          {eyes(-1, 0, true)}
          <path d={`M${x - 10} ${y + 6} q10 14 20 0 z`} fill={INK} />
          <ellipse cx={x} cy={y + 10.5} rx="4.5" ry="2.2" fill="#F08FA0" />
        </g>
      )
    default:
      // listening: the new mooca's resting face, eyes open and a thin smile
      return (
        <g>
          {cheeks}
          {eyes()}
          <path d={`M${x - 8} ${y + 7} q8 7 16 0`} {...line} />
        </g>
      )
  }
}

/** A knitted scarf at the neck: a curved band, a knot and one striped, fringed tail */
export function Scarf({ x, y, w, color, dark, tail = true, tailClass }: { x: number; y: number; w: number; color: string; dark: string; tail?: boolean; tailClass?: string }) {
  const l = x - w / 2
  const r = x + w / 2
  const tx = x + w * 0.16
  return (
    <g>
      <path d={`M${l} ${y - 3} Q${x} ${y + 7} ${r} ${y - 3} L${r - 1} ${y + 8} Q${x} ${y + 19} ${l + 1} ${y + 8} Z`} fill={color} />
      <path d={`M${l + 2} ${y + 6} Q${x} ${y + 16} ${r - 2} ${y + 6}`} stroke={dark} strokeWidth="2" fill="none" opacity=".45" />
      {tail && (
        <g className={tailClass}>
          <path d={`M${tx} ${y + 6} L${tx + 15} ${y + 5} L${tx + 19} ${y + 36} L${tx + 4} ${y + 38} Z`} fill={color} strokeLinejoin="round" stroke={color} strokeWidth="3" />
          <path d={`M${tx + 2} ${y + 7} L${tx + 6} ${y + 37}`} stroke={dark} strokeWidth="2" opacity=".35" />
          <g stroke={dark} strokeWidth="2.2" opacity=".7">
            <path d={`M${tx + 3} ${y + 27} l15 -1.5`} />
            <path d={`M${tx + 3.5} ${y + 31} l15 -1.5`} />
          </g>
          <g stroke={color} strokeWidth="2.2" strokeLinecap="round">
            {[0, 1, 2, 3].map((i) => (
              <path key={i} d={`M${tx + 6 + i * 4} ${y + 39} l0.6 5`} />
            ))}
          </g>
          <rect x={tx - 3} y={y + 1} width="14" height="11" rx="5" fill={dark} opacity=".9" />
        </g>
      )}
    </g>
  )
}


/* ---------------------------------------------------------------- mooca */

// The new mooca, rebuilt in code from the ooca character sheet: a wide puffy cloud for a head,
// a small white body, and the turquoise scarf. The lobes are one shape (a clip of circles), so
// the shading runs across them without seams; soft lavender shadows sit under the lower lobes.
export const LOBES: [number, number, number][] = [
  [120, 60, 40],
  [82, 76, 32],
  [158, 76, 32],
  [58, 106, 27],
  [182, 106, 27],
  [88, 126, 30],
  [152, 126, 30],
  [120, 118, 40],
]
export const CLOUD: Tone = { hi: '#FFFFFF', base: '#FBFBFE', shade: '#DADEEE' }
export const TURQ = '#4FC3B1'
export const TURQ_DARK = '#2E9C8B'
export const MOOCA_CHEEK = '#DDE2F1'
export const bobOf = (m: Expression) => (m === 'listening' ? -3 : m === 'thinking' ? 4 : 0)

/* ------------------------------------------------------------------ Hin */

// A warm, smooth river stone; it cools to blue-grey when worried, as before
export const STONE: Record<Expression, Tone> = {
  concerned: { hi: '#F1F3F6', base: '#D9DDE4', shade: '#AFB6C2' },
  calm: { hi: '#F7F4EF', base: '#E6E0D7', shade: '#C4BAAC' },
  thinking: { hi: '#F7F4EF', base: '#E6E0D7', shade: '#C4BAAC' },
  listening: { hi: '#F8F4EE', base: '#E9E1D5', shade: '#C7BBAA' },
  happy: { hi: '#FAF5EC', base: '#ECE2D2', shade: '#CBBDA6' },
  tender: { hi: '#FAF4F0', base: '#ECE0D8', shade: '#CBB9AD' },
  delighted: { hi: '#FCF6EA', base: '#F0E3CB', shade: '#D0BC98' },
}
export const MARIGO = '#F6A81C'
export const MARIGO_DARK = '#D98A06'
export const HIN_CHEEK = '#EDD3C6'

// The old Hin's sprout kept as its signature: it leans with the mood and flowers when happy
export const LEAN: Record<Expression, number> = { delighted: -12, happy: -8, tender: -4, calm: 0, listening: 0, thinking: 14, concerned: 22 }

export function SoftSprout({ mood }: { mood: Expression }) {
  const glad = mood === 'happy' || mood === 'delighted'
  return (
    <g transform={`rotate(${LEAN[mood]} 120 44)`}>
      <path d="M120 44 q-1 -8 3 -13" stroke="#6FBF4C" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M122 35 q-15 -11 -23 1 q12 9 23 -1 z" fill="#8AD866" />
      <path d="M123 33 q12 -14 24 -5 q-10 12 -24 5 z" fill="#9BE07A" />
      {glad && (
        <g>
          <g fill="#F7A9A0">
            <circle cx="123" cy="20" r="4.5" />
            <circle cx="118" cy="24" r="4.5" />
            <circle cx="128" cy="24" r="4.5" />
            <circle cx="120" cy="29" r="4.5" />
            <circle cx="126" cy="29" r="4.5" />
          </g>
          <circle cx="123" cy="25" r="3.5" fill="#FBE36A" />
        </g>
      )}
    </g>
  )
}

/* ------------------------------------------------------------------ Bua */

export const FLAMINGO = '#EF7773'
export const FLAMINGO_DARK = '#D45C58'
export const BUA_CHEEK = '#F9C9C6'
