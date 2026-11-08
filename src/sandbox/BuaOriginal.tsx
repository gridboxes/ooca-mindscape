import Face, { type Mood } from '../components/companions/Face'

interface Props {
  mood?: Mood
  size?: number
  /** ripples on the water around the pad */
  ripples?: boolean
  className?: string
  title?: string
}

// Flamingo petals on a Guava pad
const PETAL_FACE = '#FFE6E5'
const PETAL_FACE_SHADE = '#F3B9B7'
const PETAL_SIDE = '#FAD0CE'
const PETAL_BACK = '#F5ABA8'
const PETAL_TIP = '#F49C98'
const PAD = '#8AD866'
const PAD_SHADE = '#6FBF4C'

// The face petal, shared by the body and its shadow
const CENTER =
  'M120 52 C150 80 168 110 166 138 C164 164 146 178 120 178 C94 178 76 164 74 138 C72 110 90 80 120 52 Z'

export default function BuaOriginal({ mood = 'calm', size = 220, ripples = true, className = '', title = 'Bua the lotus' }: Props) {
  // The side petals carry the mood: open wide when happy, fold in when concerned
  const open = mood === 'happy' ? 12 : mood === 'concerned' ? -8 : 0
  const tilt = mood === 'listening' ? 5 : 0
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
        <g className="lotus-ripples" fill="none" stroke="#8FBBEF" strokeWidth="3" strokeLinecap="round">
          <ellipse cx="120" cy="196" rx="96" ry="22" />
          <ellipse cx="120" cy="196" rx="96" ry="22" />
        </g>
      )}
      {/* lily pad with its notch */}
      <ellipse cx="116" cy="196" rx="84" ry="19" fill={PAD_SHADE} />
      <path d="M120 188 L198 180 C204 198 170 208 120 208 C68 208 34 200 36 188 C38 174 78 168 120 168 C150 168 176 172 190 178 Z" fill={PAD} />
      <path d="M120 188 L56 192" stroke={PAD_SHADE} strokeWidth="2" strokeLinecap="round" opacity=".7" />

      <g className="lotus-flower" transform={`rotate(${tilt} 120 178)`}>
        {/* back petals */}
        <path d="M116 162 C90 138 78 100 86 64 C106 80 118 114 120 142 Z" fill={PETAL_BACK} />
        <path d="M124 162 C150 138 162 100 154 64 C134 80 122 114 120 142 Z" fill={PETAL_BACK} />
        {/* side petals tuck in behind the face petal, then open and close around the base */}
        <g className="lotus-petal lotus-petal--l" style={{ transform: `rotate(${-open}deg)` }}>
          <path d="M118 178 C84 180 50 162 42 126 C38 108 44 94 48 86 C64 90 84 98 104 108 L112 176 Z" fill={PETAL_SIDE} />
          <path d="M48 86 C46 96 46 104 48 112 C54 104 60 98 66 94 C60 90 54 88 48 86 Z" fill={PETAL_TIP} />
        </g>
        <g className="lotus-petal lotus-petal--r" style={{ transform: `rotate(${open}deg)` }}>
          <path d="M122 178 C156 180 190 162 198 126 C202 108 196 94 192 86 C176 90 156 98 136 108 L128 176 Z" fill={PETAL_SIDE} />
          <path d="M192 86 C194 96 194 104 192 112 C186 104 180 98 174 94 C180 90 186 88 192 86 Z" fill={PETAL_TIP} />
        </g>
        {/* face petal */}
        <path d={CENTER} fill={PETAL_FACE_SHADE} transform="translate(-5 7)" />
        <path d={CENTER} fill={PETAL_FACE} />
        <path d="M120 52 C128 60 135 68 140 77 C128 72 112 72 100 77 C105 68 112 60 120 52 Z" fill={PETAL_TIP} />
        <Face mood={mood} x={120} y={130} gap={22} cheek="#F2918D" />
      </g>
    </svg>
  )
}
