import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import Face, { type Mood } from '../components/companions/Face'

// Hin (the pebble) with a mood that changes the character itself, the way Bua blooms.
// Three ideas plus a combination. The big previews loop through the moods.

interface VariantProps {
  mood: Mood
  size: number
}

const LEAF = '#8AD866'
const LEAF_DARK = '#6FBF4C'
const BODY = 'M114 66 C160 64 198 94 198 134 C198 170 172 190 120 190 C68 190 42 172 42 138 C42 98 72 68 114 66 Z'
// Hin V's soft-corner outline: ten gentle sides, worn smooth by a wide round-joined stroke
const SOFT = '90,72 140,68 178,86 194,118 192,158 168,182 120,188 72,182 48,156 48,108'

type Shape = 'egg' | 'soft'

const ease = 'cubic-bezier(.22,1,.36,1)'
const move = (transform: string, opacity = 1, ms = 700): CSSProperties => ({
  transform,
  opacity,
  transformBox: 'fill-box',
  transformOrigin: 'center',
  transition: `transform ${ms}ms ${ease}, opacity ${ms}ms ${ease}`,
})

// Warm stone: stones hold the sun's heat. Cool blue-grey when worried, warm sand when happy.
const WARMTH: Record<Mood, { stone: string; shade: string; glow: number }> = {
  concerned: { stone: '#D5DAE1', shade: '#AEB5C0', glow: 0 },
  calm: { stone: '#E3DFD8', shade: '#C2BBB0', glow: 0 },
  listening: { stone: '#E7E1D7', shade: '#C6BDAF', glow: 0.12 },
  happy: { stone: '#EFE1C8', shade: '#CDB998', glow: 0.35 },
}
const PLAIN = WARMTH.calm

/** Hin B's pebble body; the extras slot carries each idea */
function Pebble({ mood, warm = false, shape = 'egg', children }: { mood: Mood; warm?: boolean; shape?: Shape; children?: ReactNode }) {
  const c = warm ? WARMTH[mood] : PLAIN
  const fill = (f: string): CSSProperties => ({ fill: f, transition: 'fill .8s ease' })
  const tilt = mood === 'listening' ? -4 : 0
  // V's longer outline would hide the feet, so they sit lower on the soft shape
  const footY = shape === 'soft' ? 186 : 176
  return (
    <g>
      {warm && <ellipse cx="120" cy="128" rx="96" ry="84" fill="#FBE36A" style={{ opacity: c.glow, transition: 'opacity .8s ease' }} />}
      <ellipse cx="120" cy={shape === 'soft' ? 208 : 198} rx="78" ry="8" fill="#26313C" opacity=".06" />
      <g transform={`rotate(${tilt} 120 186)`}>
        <g className="rock-body">
          <rect x="80" y={footY} width="28" height="22" rx="11" strokeWidth="3" style={{ ...fill(c.stone), stroke: c.shade }} />
          <rect x="134" y={footY} width="28" height="22" rx="11" strokeWidth="3" style={{ ...fill(c.stone), stroke: c.shade }} />
          <ellipse cx="38" cy="160" rx="9" ry="14" strokeWidth="3" transform="rotate(28 38 160)" style={{ ...fill(c.stone), stroke: c.shade }} />
          <ellipse cx="202" cy="160" rx="9" ry="14" strokeWidth="3" transform="rotate(-28 202 160)" style={{ ...fill(c.stone), stroke: c.shade }} />
          {shape === 'egg' ? (
            <>
              <path d={BODY} transform="translate(-5 7)" style={fill(c.shade)} />
              <path d={BODY} style={fill(c.stone)} />
            </>
          ) : (
            <>
              <polygon points={SOFT} strokeWidth="16" strokeLinejoin="round" transform="translate(-5 7)" style={{ ...fill(c.shade), stroke: c.shade, transition: 'fill .8s ease, stroke .8s ease' }} />
              <polygon points={SOFT} strokeWidth="16" strokeLinejoin="round" style={{ ...fill(c.stone), stroke: c.stone, transition: 'fill .8s ease, stroke .8s ease' }} />
            </>
          )}
          <ellipse cx="82" cy="100" rx="16" ry="9" fill="#F7F5F0" transform="rotate(-35 82 100)" />
          <g style={fill(c.shade)}>
            <circle cx="170" cy="104" r="2.5" />
            <circle cx="182" cy="150" r="2" />
            <circle cx="66" cy="160" r="2" />
          </g>
          {children}
          <Face mood={mood} x={120} y={134} gap={24} blink />
        </g>
      </g>
    </g>
  )
}

function Frame({ size, label, children }: { size: number; label: string; children: ReactNode }) {
  return (
    <svg className="rock" width={size} height={size} viewBox="0 0 240 240" role="img" aria-label={label} style={{ overflow: 'visible' }}>
      {children}
    </svg>
  )
}

/**
 * Balancing pebbles. Calm: one pebble steady. Happy: a neat stack of three.
 * Listening: the pebble tilts as Hin leans in. Concerned: the stack wobbles and a pebble slides off.
 */
function Pebbles({ mood }: { mood: Mood }) {
  const bottom = {
    calm: 'none',
    happy: 'none',
    listening: 'translate(3px, 0) rotate(14deg)',
    concerned: 'translate(-4px, 2px) rotate(-18deg)',
  }[mood]
  const middle = {
    calm: move('translate(0, -8px)', 0),
    happy: move('none'),
    listening: move('translate(0, -8px)', 0),
    concerned: move('translate(46px, 18px) rotate(40deg)'),
  }[mood]
  const top = {
    calm: move('translate(0, -8px)', 0),
    happy: move('none'),
    listening: move('translate(0, -8px)', 0),
    concerned: move('translate(76px, 150px) rotate(12deg)'),
  }[mood]
  const pebble = (cx: number, cy: number, rx: number, ry: number, f: string) => (
    <g>
      <ellipse cx={cx - 2} cy={cy + 3} rx={rx} ry={ry} fill="#B9B2A6" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={f} />
    </g>
  )
  return (
    <g>
      <g style={move(bottom)}>{pebble(116, 60, 18, 9, '#D9D4CB')}</g>
      <g style={middle}>{pebble(118, 45, 13, 7, '#CFC9BE')}</g>
      <g style={top}>{pebble(117, 34, 9, 5, '#E1DDD5')}</g>
    </g>
  )
}

/** Growing sprout. Concerned: a seed tucked in. Calm: a sprout. Listening: taller, three leaves. Happy: a little flower. */
function GrowingSprout({ mood }: { mood: Mood }) {
  const stage = { concerned: 0, calm: 1, listening: 2, happy: 3 }[mood]
  const grow = (from: number, ms = 600): CSSProperties => ({
    transform: stage >= from ? 'none' : 'scale(0)',
    opacity: stage >= from ? 1 : 0,
    transformBox: 'fill-box',
    transformOrigin: '50% 100%',
    transition: `transform ${ms}ms ${ease}, opacity ${ms}ms ${ease}`,
  })
  return (
    <g>
      {/* the seed, visible when everything is tucked away */}
      <ellipse cx="116" cy="64" rx="7" ry="5" fill="#C49A5A" style={{ opacity: stage === 0 ? 1 : 0, transition: 'opacity .5s' }} />
      <g style={grow(1)}>
        <path d="M116 66 q-1 -8 3 -12" stroke={LEAF_DARK} strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M119 58 q-16 -11 -24 1 q12 9 24 -1 z" fill={LEAF} />
        <path d="M120 55 q13 -15 25 -5 q-10 13 -25 5 z" fill={LEAF} />
      </g>
      <g style={grow(2)}>
        <path d="M119 55 q1 -10 -2 -18" stroke={LEAF_DARK} strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M118 44 q-14 -8 -20 2 q10 6 20 -2 z" fill={LEAF} />
      </g>
      <g style={grow(3)}>
        <g fill="#F7A9A0">
          <circle cx="117" cy="30" r="5" />
          <circle cx="111" cy="35" r="5" />
          <circle cx="123" cy="35" r="5" />
          <circle cx="114" cy="41" r="5" />
          <circle cx="121" cy="41" r="5" />
        </g>
        <circle cx="117" cy="36" r="4" fill="#FBE36A" />
      </g>
    </g>
  )
}

function Sprout({ mood }: { mood: Mood }) {
  const tilt = mood === 'happy' ? -8 : mood === 'concerned' ? 22 : 0
  return (
    <g transform={`rotate(${tilt} 116 66)`}>
      <path d="M116 66 q-1 -8 3 -12" stroke={LEAF_DARK} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M119 58 q-16 -11 -24 1 q12 9 24 -1 z" fill={LEAF} />
      <path d="M120 55 q13 -15 25 -5 q-10 13 -25 5 z" fill={LEAF} />
    </g>
  )
}

/** Large previews loop through the moods so the change can be seen moving */
function useCycle(enabled: boolean, start: Mood) {
  const steps: Mood[] = ['calm', 'listening', 'happy', 'calm', 'concerned']
  const [i, setI] = useState(0)
  useEffect(() => {
    if (!enabled || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = window.setInterval(() => setI((n) => (n + 1) % steps.length), 1600)
    return () => window.clearInterval(t)
  }, [enabled, steps.length])
  return enabled ? steps[i] : start
}

export function HinMoodPebbles({ mood, size, shape = 'egg' }: VariantProps & { shape?: Shape }) {
  const m = useCycle(size >= 150, mood)
  return (
    <Frame size={size} label={`Hin with balancing pebbles, ${m}`}>
      <Pebble mood={m} shape={shape}>
        <Pebbles mood={m} />
      </Pebble>
    </Frame>
  )
}

export function HinMoodSprout({ mood, size, shape = 'egg' }: VariantProps & { shape?: Shape }) {
  const m = useCycle(size >= 150, mood)
  return (
    <Frame size={size} label={`Hin with a growing sprout, ${m}`}>
      <Pebble mood={m} shape={shape}>
        <GrowingSprout mood={m} />
      </Pebble>
    </Frame>
  )
}

export function HinMoodWarm({ mood, size, shape = 'egg' }: VariantProps & { shape?: Shape }) {
  const m = useCycle(size >= 150, mood)
  return (
    <Frame size={size} label={`Hin as a warm stone, ${m}`}>
      <Pebble mood={m} warm shape={shape}>
        <Sprout mood={m} />
      </Pebble>
    </Frame>
  )
}

export function HinMoodCombo({ mood, size, shape = 'egg' }: VariantProps & { shape?: Shape }) {
  const m = useCycle(size >= 150, mood)
  return (
    <Frame size={size} label={`Hin with balancing pebbles and warmth, ${m}`}>
      <Pebble mood={m} warm shape={shape}>
        <Pebbles mood={m} />
      </Pebble>
    </Frame>
  )
}

export const HIN_MOODS = [
  { key: 'M1', name: 'Balancing pebbles', note: 'Calm: one pebble steady. Happy: a neat stack of three. Listening: it tilts. Concerned: the stack wobbles and pebbles slide off. Balance is the Stoic idea.', Comp: HinMoodPebbles, isNew: true },
  { key: 'M2', name: 'Growing sprout', note: 'Concerned: a seed tucked in. Calm: a sprout. Listening: taller with a third leaf. Happy: a little flower. Something growing out of rock.', Comp: HinMoodSprout, isNew: true },
  { key: 'M3', name: 'Warm stone', note: 'Stones hold the sun’s heat. Cool blue-grey when worried, warm sand with a soft glow when happy. Quiet and calm.', Comp: HinMoodWarm, isNew: true },
  { key: 'M4', name: 'Pebbles + warmth', note: 'The recommended mix: the balancing pebbles carry the mood, and the stone warms up as Hin settles.', Comp: HinMoodCombo, isNew: true },
]

// The same four ideas on Hin V's soft-corner body
const onV = (Comp: (p: VariantProps & { shape?: Shape }) => ReactNode) => (p: VariantProps) => <Comp {...p} shape="soft" />

export const HIN_MOODS_V = [
  { key: 'V1', name: 'V · Balancing pebbles', note: 'Hin V with the balancing pebbles: one steady, a stack of three when happy, sliding off when worried.', Comp: onV(HinMoodPebbles), isNew: true },
  { key: 'V2', name: 'V · Growing sprout', note: 'Hin V with the growing sprout: seed, sprout, three leaves, a little flower.', Comp: onV(HinMoodSprout), isNew: true },
  { key: 'V3', name: 'V · Warm stone', note: 'Hin V warming from cool blue-grey to warm sand as it settles.', Comp: onV(HinMoodWarm), isNew: true },
  { key: 'V4', name: 'V · Pebbles + warmth', note: 'Hin V with the recommended mix: balancing pebbles and a stone that warms up.', Comp: onV(HinMoodCombo), isNew: true },
]
