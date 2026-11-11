import type { Weather } from '../content'
import type { Expression } from './companions/Face'
import { bobOf, CLOUD, Frame, LOBES, MOOCA_CHEEK, Paint, Scarf, SoftFace, TURQ, TURQ_DARK, useIds, type Ids, type Tone, type WeatherFace } from './companions/soft'

type Pose = 'idle' | 'wave'

interface Props {
  weather?: Weather | null
  /** a mood with no weather of its own; overrides the weather's face */
  mood?: Expression
  pose?: Pose
  size?: number
  /** a smiling sun beside mooca, for company on a heavy day */
  friend?: boolean
  /** the silver lining: a bright rim of light around the cloud */
  lining?: boolean
  effects?: boolean
  /** a faint shadow far below, for mooca on its own (the landscape draws its own on the hills) */
  shadow?: boolean
  className?: string
  title?: string
}

// mooca in the new ooca art style: a wide puffy cloud for a head on a small white body, with the
// turquoise scarf. It floats, as our mooca always has: legs hanging loose, arms lifted a little for
// balance, a slow bob with a slight sway, the legs and the scarf's tail trailing a beat behind.
// The weather still shows in its face and the colour of its cloud, with soft rain, sun and fog.

// The cloud's colour for each sky: white in fair weather, greying with fog, lavender in rain and storm
const SKY: Record<Weather | 'none', Tone> = {
  none: CLOUD,
  sunny: CLOUD,
  partly: CLOUD,
  foggy: { hi: '#F7F8FA', base: '#ECEEF2', shade: '#C9CED8' },
  rainy: { hi: '#EDEEF9', base: '#DADBF1', shade: '#B3B5DB' },
  stormy: { hi: '#E1E2F3', base: '#C9CAE7', shade: '#9FA1CD' },
}
const COOL: Tone = { hi: '#FAFBFE', base: '#EEF0F7', shade: '#C9CEE2' }

// The face each sky brings, when no mood is given
const SKY_FACE: Record<Weather | 'none', Expression | WeatherFace> = {
  none: 'calm',
  sunny: 'happy',
  partly: 'listening',
  foggy: 'foggy',
  rainy: 'rainy',
  stormy: 'stormy',
}

function Sun({ x, y, r = 22, face = true }: { x: number; y: number; r?: number; face?: boolean }) {
  const rays = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2
    return (
      <line
        key={i}
        x1={x + Math.cos(a) * (r + 5)}
        y1={y + Math.sin(a) * (r + 5)}
        x2={x + Math.cos(a) * (r + 10)}
        y2={y + Math.sin(a) * (r + 10)}
      />
    )
  })
  return (
    <g className="mooca-sun">
      <circle cx={x} cy={y} r={r * 1.9} fill="#FFE9A8" opacity=".35" />
      <g stroke="#F8CF5A" strokeWidth="3.2" strokeLinecap="round" opacity=".9">
        {rays}
      </g>
      <circle cx={x} cy={y} r={r} fill="#FBD960" />
      <circle cx={x - r * 0.25} cy={y - r * 0.25} r={r * 0.62} fill="#FFF1A8" opacity=".85" />
      {face && (
        <g stroke="#B9762B" strokeWidth="2.2" fill="none" strokeLinecap="round">
          <path d={`M${x - 9} ${y - 1} q4 -4.5 8 0`} />
          <path d={`M${x + 2} ${y - 1} q4 -4.5 8 0`} />
          <path d={`M${x - 4} ${y + 6} q4 4 8 0`} />
        </g>
      )}
    </g>
  )
}

const drop = (x: number, y: number) => `M${x} ${y} q4 7 0 10.5 q-4 -3.5 0 -10.5 z`

/** Weather around mooca, behind it: sun, rainbow, rain, lightning */
function SkyBehind({ weather, ids }: { weather: Weather; ids: Ids }) {
  const rain = (spots: [number, number][]) => (
    <g className="mooca-rain" fill="#9CC6F4" opacity=".9">
      {spots.map(([x, y]) => (
        <path key={`${x}-${y}`} d={drop(x, y)} />
      ))}
    </g>
  )
  switch (weather) {
    case 'sunny':
      return (
        <g>
          <g className="mooca-rainbow" fill="none" strokeWidth="7" strokeLinecap="round" opacity=".75" filter={`url(#${ids.g('soft')})`}>
            <path d="M150 64 a44 44 0 0 1 82 0" stroke="#F8C2BE" />
            <path d="M158 64 a36 36 0 0 1 66 0" stroke="#FBE7A8" />
            <path d="M166 64 a28 28 0 0 1 50 0" stroke="#BDEBDD" />
          </g>
          <Sun x={40} y={92} r={20} />
        </g>
      )
    case 'partly':
      return <Sun x={194} y={50} r={17} face={false} />
    case 'rainy':
      return rain([
        [38, 158],
        [212, 148],
        [26, 194],
        [222, 184],
      ])
    case 'stormy':
      return (
        <g>
          <g className="mooca-bolt">
            <path d="M206 40 l-14 24 h12 l-10 22 l24 -30 h-12 l10 -16 z" fill="#FFE08A" filter={`url(#${ids.blur})`} />
            <path d="M206 40 l-14 24 h12 l-10 22 l24 -30 h-12 l10 -16 z" fill="#FFC23C" strokeLinejoin="round" stroke="#FFC23C" strokeWidth="2" />
          </g>
          {rain([
            [32, 158],
            [20, 192],
            [218, 174],
          ])}
        </g>
      )
    default:
      return null
  }
}

export default function Mooca({
  weather = null,
  mood,
  pose = 'idle',
  size = 220,
  friend = false,
  effects = true,
  lining = false,
  shadow = false,
  className = '',
  title = 'mooca',
}: Props) {
  const ids = useIds()
  const sky = weather ?? 'none'
  const tone = mood ? (mood === 'concerned' ? COOL : CLOUD) : SKY[sky]
  const face = mood ?? SKY_FACE[sky]
  const tilt = mood ? bobOf(mood) : weather === 'partly' ? bobOf('listening') : 0
  const fill = `url(#${ids.soft})`
  const clip = ids.g('cloud')
  return (
    <Frame
      size={size}
      title={title}
      className={`mooca mooca--${sky} ${className}`}
      ids={ids}
      ground={false}
      defs={
        <>
          <Paint id={ids.soft} tone={tone} />
          <filter id={ids.g('soft')} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
          <clipPath id={clip}>
            {LOBES.map(([cx, cy, r]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
            ))}
          </clipPath>
        </>
      }
    >
      {shadow && <ellipse className="float-shadow" cx="120" cy="222" rx="40" ry="5" fill="#7C83A8" opacity=".12" />}
      {weather && effects && <SkyBehind weather={weather} ids={ids} />}
      {friend && <Sun x={44} y={96} r={22} />}

      <g className="float-bob">
        <g transform={`translate(9.6 -2) scale(0.92) rotate(${tilt} 120 150)`}>
          <g fill={fill}>
            {/* legs hang from the hips, toes down, splayed a little */}
            <g className="float-dangle">
              <rect x="99" y="184" width="15" height="26" rx="7.5" transform="rotate(10 106 186)" />
            </g>
            <g className="float-dangle float-dangle--late">
              <rect x="126" y="184" width="15" height="26" rx="7.5" transform="rotate(-10 134 186)" />
            </g>
            <rect x="96" y="142" width="48" height="56" rx="19" />
            {/* arms lifted a little, for balance in the air; one waves hello in the wave pose */}
            <ellipse cx="90" cy="162" rx="8" ry="12.5" transform="rotate(48 90 162)" />
            {pose === 'wave' ? (
              <g className="mooca-wave" style={{ transformBox: 'fill-box', transformOrigin: '15% 95%' }}>
                <ellipse cx="160" cy="136" rx="8" ry="14" transform="rotate(30 160 136)" />
              </g>
            ) : (
              <ellipse cx="150" cy="162" rx="8" ry="12.5" transform="rotate(-48 150 162)" />
            )}
          </g>
          {/* the silver lining: light around the cloud's edge, drawn under it so only the rim shows */}
          {lining && (
            <g className="mooca-lining" aria-hidden="true">
              {LOBES.map(([cx, cy, r]) => (
                <circle key={`l${cx}-${cy}`} cx={cx} cy={cy} r={r + 8} fill="#FFE39A" opacity=".55" />
              ))}
              {LOBES.map(([cx, cy, r]) => (
                <circle key={`w${cx}-${cy}`} cx={cx} cy={cy} r={r + 4} fill="#FFFDF2" />
              ))}
            </g>
          )}
          {/* the cloud: one shape, so the light runs across its lobes without seams */}
          <g clipPath={`url(#${clip})`}>
            <rect x="20" y="10" width="200" height="160" fill={fill} />
            <g fill={tone === CLOUD ? '#C9CFE4' : tone.shade} opacity=".55" filter={`url(#${ids.blur})`}>
              <ellipse cx="120" cy="160" rx="62" ry="12" />
              <ellipse cx="66" cy="132" rx="14" ry="8" />
              <ellipse cx="176" cy="132" rx="14" ry="8" />
            </g>
            <ellipse cx="92" cy="54" rx="30" ry="14" fill="#fff" opacity=".9" filter={`url(#${ids.blur})`} />
          </g>
          <Scarf x={120} y={148} w={58} color={TURQ} dark={TURQ_DARK} tailClass="float-tail" />
          <SoftFace mood={face} x={120} y={104} cheek={MOOCA_CHEEK} />
        </g>
      </g>

      {weather === 'foggy' && effects && (
        <g className="mooca-fog" fill="#E3E7EE" opacity=".9" filter={`url(#${ids.blur})`}>
          <ellipse cx="58" cy="178" rx="42" ry="6" />
          <ellipse cx="188" cy="196" rx="40" ry="6" />
          <ellipse cx="82" cy="212" rx="44" ry="6" />
        </g>
      )}
    </Frame>
  )
}
