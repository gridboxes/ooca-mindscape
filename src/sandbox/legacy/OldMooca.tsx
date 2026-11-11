// The flat character as it was before the new mooca art style, kept for the sandbox's before-and-after.
import type { Weather } from '../../content'
import SharedFace, { type NewMood } from '../../components/companions/Face'

type Pose = 'idle' | 'wave'

interface Props {
  weather?: Weather | null
  /** a sandbox mood with no weather of its own; drawn with the shared companion face */
  mood?: NewMood
  pose?: Pose
  size?: number
  friend?: boolean
  /** the silver lining: a bright rim of light around the cloud */
  lining?: boolean
  effects?: boolean
  className?: string
  title?: string
}

const palette: Record<Weather | 'none', { body: string; shade: string }> = {
  none: { body: '#FFFFFF', shade: '#D8E2F1' },
  sunny: { body: '#FFFFFF', shade: '#D8E2F1' },
  partly: { body: '#FFFFFF', shade: '#D3DEEE' },
  foggy: { body: '#EEF0F4', shade: '#CDD3DD' },
  rainy: { body: '#D5D6EE', shade: '#B4B6DB' },
  stormy: { body: '#C3C4E2', shade: '#9EA0CC' },
}

// Cloud silhouette shared by the body and its shadow
const CLOUD =
  'M62 150 C34 150 26 116 52 104 C46 74 78 56 100 70 C108 40 150 34 166 62 C192 56 214 80 202 104 C224 116 214 150 186 150 Z'

function Face({ weather }: { weather: Weather | null }) {
  const ink = '#2E4E8F'
  switch (weather) {
    case 'sunny':
      return (
        <g stroke={ink} strokeWidth="4" strokeLinecap="round" fill="none">
          <path d="M98 106 q8 -9 16 0" />
          <path d="M150 106 q8 -9 16 0" />
          <path d="M120 116 q12 14 24 0 z" fill={ink} />
        </g>
      )
    case 'foggy':
      return (
        <g stroke={ink} strokeWidth="4" strokeLinecap="round" fill="none">
          <path d="M98 106 h15" />
          <path d="M151 106 h15" />
          <path d="M124 122 h16" />
        </g>
      )
    case 'rainy':
      return (
        <g>
          <circle cx="106" cy="106" r="5" fill={ink} />
          <circle cx="158" cy="106" r="5" fill={ink} />
          <path d="M122 124 q10 -9 20 0" stroke={ink} strokeWidth="4" strokeLinecap="round" fill="none" />
          <path className="mooca-tear" d="M165 114 q4 7 0 11 q-4 -4 0 -11 z" fill="#7FB4F0" />
        </g>
      )
    case 'stormy':
      return (
        <g>
          <path d="M98 100 l14 -5" stroke={ink} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M166 100 l-14 -5" stroke={ink} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="106" cy="109" r="5" fill={ink} />
          <circle cx="158" cy="109" r="5" fill={ink} />
          <path d="M120 126 q4 -5 8 0 q4 5 8 0 q4 -5 8 0" stroke={ink} strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M186 86 q5 8 0 12 q-5 -4 0 -12 z" fill="#7FB4F0" />
        </g>
      )
    case 'partly':
      return (
        <g>
          <circle cx="106" cy="106" r="5" fill={ink} />
          <circle cx="158" cy="106" r="5" fill={ink} />
          <path d="M124 118 q8 7 16 0" stroke={ink} strokeWidth="4" strokeLinecap="round" fill="none" />
        </g>
      )
    default:
      return (
        <g stroke={ink} strokeWidth="4" strokeLinecap="round" fill="none">
          <path d="M98 108 q8 -9 16 0" />
          <path d="M150 108 q8 -9 16 0" />
          <path d="M122 118 q10 11 20 0" />
        </g>
      )
  }
}

function Sun({ x, y, r = 22, face = true }: { x: number; y: number; r?: number; face?: boolean }) {
  const rays = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2
    return (
      <line
        key={i}
        x1={x + Math.cos(a) * (r + 4)}
        y1={y + Math.sin(a) * (r + 4)}
        x2={x + Math.cos(a) * (r + 10)}
        y2={y + Math.sin(a) * (r + 10)}
      />
    )
  })
  return (
    <g className="mooca-sun">
      <g stroke="#F2B533" strokeWidth="3" strokeLinecap="round">
        {rays}
      </g>
      <circle cx={x} cy={y} r={r} fill="#FBE36A" stroke="#F2B533" strokeWidth="2.5" />
      {face && (
        <g>
          <path d={`M${x - 9} ${y - 2} q4 -5 8 0`} stroke="#B9762B" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d={`M${x + 2} ${y - 2} q4 -5 8 0`} stroke="#B9762B" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d={`M${x - 4} ${y + 6} q4 4 8 0`} stroke="#B9762B" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <ellipse cx={x - 12} cy={y + 5} rx="4" ry="2.5" fill="#F7A9A0" opacity=".8" />
          <ellipse cx={x + 13} cy={y + 5} rx="4" ry="2.5" fill="#F7A9A0" opacity=".8" />
        </g>
      )}
    </g>
  )
}

function Effects({ weather }: { weather: Weather }) {
  switch (weather) {
    case 'sunny':
      return (
        <g>
          <g className="mooca-rainbow" fill="none" strokeWidth="7" strokeLinecap="round" opacity=".8">
            <path d="M150 64 a44 44 0 0 1 82 0" stroke="#F8B7B3" />
            <path d="M158 64 a36 36 0 0 1 66 0" stroke="#FBE3A0" />
            <path d="M166 64 a28 28 0 0 1 50 0" stroke="#B9EBDD" />
          </g>
          <Sun x={44} y={88} r={20} />
        </g>
      )
    case 'partly':
      return <Sun x={190} y={58} r={18} face={false} />
    case 'foggy':
      return null
    case 'rainy':
      return (
        <g className="mooca-rain" stroke="#8FBBEF" strokeWidth="3.5" strokeLinecap="round">
          <line x1="40" y1="160" x2="36" y2="172" />
          <line x1="212" y1="150" x2="208" y2="162" />
          <line x1="28" y1="196" x2="24" y2="208" />
          <line x1="222" y1="186" x2="218" y2="198" />
        </g>
      )
    case 'stormy':
      return (
        <g>
          <path className="mooca-bolt" d="M206 40 l-14 24 h12 l-10 22 l24 -30 h-12 l10 -16 z" fill="#F9A000" />
          <g className="mooca-rain" stroke="#8FBBEF" strokeWidth="3.5" strokeLinecap="round">
            <line x1="34" y1="160" x2="30" y2="172" />
            <line x1="22" y1="194" x2="18" y2="206" />
            <line x1="218" y1="176" x2="214" y2="188" />
          </g>
        </g>
      )
  }
}

export default function OldMooca({
  weather = null,
  mood,
  pose = 'idle',
  size = 220,
  friend = false,
  effects = true,
  lining = false,
  className = '',
  title = 'mooca',
}: Props) {
  const c = palette[weather ?? 'none']
  return (
    <svg
      className={`mooca mooca--${weather ?? 'none'} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 240 240"
      role="img"
      aria-label={title}
    >
      {weather && effects && <Effects weather={weather} />}
      {friend && <Sun x={46} y={92} r={24} />}

      <g className="mooca-body">
        {/* legs */}
        <rect x="104" y="160" width="20" height="40" rx="10" fill="#fff" stroke={c.shade} strokeWidth="3" />
        <rect x="140" y="160" width="20" height="40" rx="10" fill="#fff" stroke={c.shade} strokeWidth="3" />
        {/* arms */}
        <ellipse cx="82" cy="160" rx="9" ry="14" fill="#fff" stroke={c.shade} strokeWidth="3" transform="rotate(25 82 160)" />
        {pose !== 'wave' && (
          <ellipse cx="182" cy="160" rx="9" ry="14" fill="#fff" stroke={c.shade} strokeWidth="3" transform="rotate(-25 182 160)" />
        )}
        {/* the silver lining: light around the cloud's edge, drawn under it so only the rim shows */}
        {lining && (
          <g className="mooca-lining" aria-hidden="true">
            <path d={CLOUD} fill="none" stroke="#FFE39A" strokeWidth="26" strokeLinejoin="round" opacity=".55" />
            <path d={CLOUD} fill="none" stroke="#FFFDF2" strokeWidth="13" strokeLinejoin="round" />
          </g>
        )}
        {/* cloud */}
        <path d={CLOUD} fill={c.shade} transform="translate(-5 7)" />
        <path d={CLOUD} fill={c.body} className="mooca-cloud" />
        {/* scarf */}
        <path d="M80 146 q52 18 104 0 l2 14 q-54 18 -108 0 z" fill="#F2B533" />
        <path d="M150 154 l4 30 l14 -4 l-6 -28 z" fill="#E9A400" />
        <path d="M86 152 q48 14 96 0" stroke="#E0951F" strokeWidth="2" fill="none" opacity=".6" />
        {pose === 'wave' && (
          <g className="mooca-wave">
            <ellipse cx="206" cy="120" rx="10" ry="17" fill="#fff" stroke={c.shade} strokeWidth="3" transform="rotate(35 206 120)" />
          </g>
        )}
        {mood ? (
          // the shared face, placed so its eyes and cheeks land where mooca's own do
          <SharedFace mood={mood} x={132} y={106} gap={26} />
        ) : (
          <>
            {/* cheeks */}
            <ellipse cx="94" cy="122" rx="9" ry="5.5" fill="#F7B6BE" opacity=".8" />
            <ellipse cx="170" cy="122" rx="9" ry="5.5" fill="#F7B6BE" opacity=".8" />
            <Face weather={weather} />
          </>
        )}
      </g>

      {weather === 'foggy' && effects && (
        <g className="mooca-fog" stroke="#C9D0DA" strokeWidth="7" strokeLinecap="round" opacity=".85">
          <line x1="20" y1="176" x2="96" y2="176" />
          <line x1="150" y1="196" x2="226" y2="196" />
          <line x1="40" y1="212" x2="120" y2="212" />
        </g>
      )}
    </svg>
  )
}
