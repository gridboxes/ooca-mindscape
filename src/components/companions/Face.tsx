// Shared face for the companions, drawn to mooca's rules:
// navy ink, 4px round strokes, r5 dot eyes, soft pink cheeks.

export type Mood = 'calm' | 'happy' | 'listening' | 'concerned'
/** Moods added after the first four, each for one moment: tender for something hard, thinking before a reply, delighted for an aha */
export type NewMood = 'tender' | 'thinking' | 'delighted'
export type Expression = Mood | NewMood

export const INK = '#2E4E8F'

interface Props {
  mood: Expression
  /** centre point between the eyes */
  x: number
  y: number
  /** half the distance between the eyes */
  gap?: number
  cheek?: string
  /** slow blink on open eyes (Rock) */
  blink?: boolean
}

export default function Face({ mood, x, y, gap = 24, cheek = '#F7B6BE', blink = false }: Props) {
  const lx = x - gap
  const rx = x + gap
  const line = { stroke: INK, strokeWidth: 4, strokeLinecap: 'round' as const, fill: 'none' }

  const cheeks = (
    <g opacity={mood === 'tender' || mood === 'delighted' ? 1 : 0.8}>
      <ellipse cx={x - gap - 12} cy={y + 16} rx="9" ry="5.5" fill={cheek} />
      <ellipse cx={x + gap + 12} cy={y + 16} rx="9" ry="5.5" fill={cheek} />
    </g>
  )

  switch (mood) {
    case 'happy':
      return (
        <g>
          {cheeks}
          <g {...line}>
            <path d={`M${lx - 8} ${y + 2} q8 -9 16 0`} />
            <path d={`M${rx - 8} ${y + 2} q8 -9 16 0`} />
          </g>
          <path d={`M${x - 11} ${y + 10} q11 13 22 0 z`} fill={INK} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        </g>
      )
    case 'listening':
      return (
        <g>
          {cheeks}
          <g className={blink ? 'face-eyes' : undefined}>
            <circle cx={lx} cy={y} r="5" fill={INK} />
            <circle cx={rx} cy={y} r="5" fill={INK} />
          </g>
          <path d={`M${x - 6} ${y + 14} q6 5 12 0`} {...line} />
        </g>
      )
    case 'concerned':
      return (
        <g>
          {cheeks}
          <g stroke={INK} strokeWidth="3.5" strokeLinecap="round">
            <path d={`M${lx - 8} ${y - 9} l14 -5`} />
            <path d={`M${rx + 8} ${y - 9} l-14 -5`} />
          </g>
          <g className={blink ? 'face-eyes' : undefined}>
            <circle cx={lx} cy={y + 2} r="5" fill={INK} />
            <circle cx={rx} cy={y + 2} r="5" fill={INK} />
          </g>
          <path d={`M${x - 7} ${y + 18} q7 -6 14 0`} {...line} />
        </g>
      )
    case 'tender':
      // the warm face for something hard: soft raised brows, eyes open and kind, a gentle smile
      return (
        <g>
          {cheeks}
          <g stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" opacity=".6">
            <path d={`M${lx - 7} ${y - 9} q7 -3 14 -4`} />
            <path d={`M${rx + 7} ${y - 9} q-7 -3 -14 -4`} />
          </g>
          <g className={blink ? 'face-eyes' : undefined}>
            <circle cx={lx} cy={y + 1} r="5" fill={INK} />
            <circle cx={rx} cy={y + 1} r="5" fill={INK} />
            <circle cx={lx + 1.8} cy={y - 1} r="1.6" fill="#fff" />
            <circle cx={rx + 1.8} cy={y - 1} r="1.6" fill="#fff" />
          </g>
          <path d={`M${x - 7} ${y + 14} q7 7 14 0`} {...line} />
        </g>
      )
    case 'thinking':
      // curious, not doubtful: eyes glance up and aside under two soft lifted brows, a small sideways smile
      return (
        <g>
          {cheeks}
          <g stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" opacity=".6">
            <path d={`M${lx - 5} ${y - 11} q6 -4 12 -1`} />
            <path d={`M${rx - 5} ${y - 13} q6 -4 12 -1`} />
          </g>
          <g className={blink ? 'face-eyes' : undefined}>
            <circle cx={lx + 3} cy={y - 2} r="5" fill={INK} />
            <circle cx={rx + 3} cy={y - 2} r="5" fill={INK} />
          </g>
          <path d={`M${x - 1} ${y + 15} q5 4 10 0`} {...line} />
        </g>
      )
    case 'delighted':
      // the peak: eyes wide open with a single small shine, and a wide open smile
      return (
        <g>
          {cheeks}
          <circle cx={lx} cy={y - 1} r="5.5" fill={INK} />
          <circle cx={rx} cy={y - 1} r="5.5" fill={INK} />
          <circle cx={lx + 1.8} cy={y - 3} r="1.7" fill="#fff" />
          <circle cx={rx + 1.8} cy={y - 3} r="1.7" fill="#fff" />
          <path d={`M${x - 13} ${y + 9} q13 18 26 0 z`} fill={INK} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <ellipse cx={x} cy={y + 14.5} rx="5" ry="2.6" fill="#F28C9B" />
        </g>
      )
    default:
      // calm: eyes resting closed, a small soft smile
      return (
        <g>
          {cheeks}
          <g {...line}>
            <path d={`M${lx - 8} ${y} q8 6 16 0`} />
            <path d={`M${rx - 8} ${y} q8 6 16 0`} />
            <path d={`M${x - 7} ${y + 14} q7 6 14 0`} />
          </g>
        </g>
      )
  }
}
