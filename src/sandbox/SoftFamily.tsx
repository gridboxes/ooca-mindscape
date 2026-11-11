import type { ReactNode } from 'react'
import type { Expression } from '../components/companions/Face'
import Mooca from '../components/Mooca'
import Rock from '../components/companions/Rock'
import Lotus from '../components/companions/Lotus'
import {
  BUA_CHEEK,
  bobOf,
  CLOUD,
  FLAMINGO,
  FLAMINGO_DARK,
  Frame,
  HIN_CHEEK,
  LOBES,
  MARIGO,
  MARIGO_DARK,
  MOOCA_CHEEK,
  Paint,
  Scarf,
  SoftFace,
  SoftSprout,
  STONE,
  TURQ,
  TURQ_DARK,
  useIds,
  type Tone,
} from '../components/companions/soft'

// The design drafts for the new mooca art style, kept for review: mooca on the ground and its
// floating options, and Hin and Bua on a small body like mooca's (S1 to S3). The chosen three
// (mooca Version 2, our own Hin and Bua repainted) are now the app's own components; they're
// wrapped at the bottom so the sandbox can show them beside the drafts.


/** shadow: the floating moocas' shadow below (off in the landscape's sky); ripples: Bua's water rings (off in the pond) */
type Props = { mood?: Expression; size?: number; shadow?: boolean; ripples?: boolean }

/** Stubby legs, a small rounded body and two little arms, all in one soft fill */
function Body({ fill, width = 44, top = 140, armDrop = 0 }: { fill: string; width?: number; top?: number; armDrop?: number }) {
  const l = 120 - width / 2
  return (
    <g fill={fill}>
      <rect x={l + 3} y="186" width="15" height="25" rx="7.5" />
      <rect x={120 + width / 2 - 18} y="186" width="15" height="25" rx="7.5" />
      <rect x={l} y={top} width={width} height={198 - top} rx="19" />
      <ellipse cx={l - 3} cy={168 + armDrop} rx="8" ry="12.5" transform={`rotate(22 ${l - 3} ${168 + armDrop})`} />
      <ellipse cx={120 + width / 2 + 3} cy={168 + armDrop} rx="8" ry="12.5" transform={`rotate(-22 ${120 + width / 2 + 3} ${168 + armDrop})`} />
    </g>
  )
}

export function MoocaSoft({ mood = 'listening', size = 220 }: Props) {
  const ids = useIds()
  const clip = ids.g('cloud')
  const cool = mood === 'concerned'
  return (
    <Frame
      size={size}
      title="mooca"
      ids={ids}
      defs={
        <>
          <Paint id={ids.soft} tone={cool ? { hi: '#FAFBFE', base: '#EEF0F7', shade: '#C9CEE2' } : CLOUD} />
          <clipPath id={clip}>
            {LOBES.map(([cx, cy, r]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
            ))}
          </clipPath>
        </>
      }
    >
      <g transform={`rotate(${bobOf(mood)} 120 210)`}>
        <Body fill={`url(#${ids.soft})`} width={48} top={142} />
        <g clipPath={`url(#${clip})`}>
          <rect x="20" y="10" width="200" height="160" fill={`url(#${ids.soft})`} />
          {/* the creases between the lower lobes, and the shadow under the cloud */}
          <g fill="#C9CFE4" opacity=".55" filter={`url(#${ids.blur})`}>
            <ellipse cx="120" cy="160" rx="62" ry="12" />
            <ellipse cx="66" cy="132" rx="14" ry="8" />
            <ellipse cx="176" cy="132" rx="14" ry="8" />
          </g>
          <ellipse cx="92" cy="54" rx="30" ry="14" fill="#fff" opacity=".9" filter={`url(#${ids.blur})`} />
        </g>
        <Scarf x={120} y={148} w={58} color={TURQ} dark={TURQ_DARK} />
        <SoftFace mood={mood} x={120} y={104} cheek={MOOCA_CHEEK} />
      </g>
    </Frame>
  )
}

// mooca built like our flow's mooca: no separate torso, the cloud is the whole body. Two long
// legs hang straight from under the cloud, little arms peek out at its lower sides, and a wide
// scarf wraps the cloud's lower edge. The new art's lobes, finish and face; floating, bobbing.
export function MoocaCloudBody({ mood = 'listening', size = 220 }: Props) {
  const ids = useIds()
  const clip = ids.g('cloud')
  const cool = mood === 'concerned'
  const tone = cool ? { hi: '#FAFBFE', base: '#EEF0F7', shade: '#C9CEE2' } : CLOUD
  const fill = `url(#${ids.soft})`
  return (
    <Frame
      size={size}
      title="mooca"
      ids={ids}
      ground={false}
      defs={
        <>
          <Paint id={ids.soft} tone={tone} />
          <clipPath id={clip}>
            {LOBES.map(([cx, cy, r]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
            ))}
          </clipPath>
        </>
      }
    >
      <ellipse className="float-shadow" cx="120" cy="222" rx="44" ry="5" fill="#7C83A8" opacity=".12" />
      <g className="float-bob">
        <g transform={`translate(0 -2) rotate(${bobOf(mood)} 120 120)`}>
          <g fill={fill}>
            {/* legs hang from under the cloud, as our mooca's do */}
            <rect x="96" y="138" width="20" height="62" rx="10" />
            <rect x="124" y="138" width="20" height="62" rx="10" />
            {/* arms peek out at the cloud's lower sides */}
            <ellipse cx="44" cy="142" rx="9" ry="14" transform="rotate(30 44 142)" />
            <ellipse cx="196" cy="142" rx="9" ry="14" transform="rotate(-30 196 142)" />
          </g>
          <g clipPath={`url(#${clip})`}>
            <rect x="20" y="10" width="200" height="160" fill={fill} />
            <g fill="#C9CFE4" opacity=".55" filter={`url(#${ids.blur})`}>
              <ellipse cx="120" cy="160" rx="62" ry="12" />
              <ellipse cx="66" cy="132" rx="14" ry="8" />
              <ellipse cx="176" cy="132" rx="14" ry="8" />
            </g>
            <ellipse cx="92" cy="54" rx="30" ry="14" fill="#fff" opacity=".9" filter={`url(#${ids.blur})`} />
          </g>
          {/* a wide scarf around the cloud's lower edge */}
          <Scarf x={120} y={138} w={112} color={TURQ} dark={TURQ_DARK} />
          <SoftFace mood={mood} x={120} y={100} cheek={MOOCA_CHEEK} />
        </g>
      </g>
    </Frame>
  )
}

/* ---------------------------------------------- mooca, floating options */

// Shared pieces for the floating options: the new art's cloud head (one clipped shape, so the
// shading runs across the lobes) and its defs.
function cloudTone(mood: Expression): Tone {
  return mood === 'concerned' ? { hi: '#FAFBFE', base: '#EEF0F7', shade: '#C9CEE2' } : CLOUD
}

function CloudDefs({ ids, mood }: { ids: ReturnType<typeof useIds>; mood: Expression }) {
  return (
    <>
      <Paint id={ids.soft} tone={cloudTone(mood)} />
      <clipPath id={ids.g('cloud')}>
        {LOBES.map(([cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
        ))}
      </clipPath>
    </>
  )
}

function CloudHead({ ids }: { ids: ReturnType<typeof useIds> }) {
  return (
    <g clipPath={`url(#${ids.g('cloud')})`}>
      <rect x="20" y="10" width="200" height="160" fill={`url(#${ids.soft})`} />
      <g fill="#C9CFE4" opacity=".55" filter={`url(#${ids.blur})`}>
        <ellipse cx="120" cy="160" rx="62" ry="12" />
        <ellipse cx="66" cy="132" rx="14" ry="8" />
        <ellipse cx="176" cy="132" rx="14" ry="8" />
      </g>
      <ellipse cx="92" cy="54" rx="30" ry="14" fill="#fff" opacity=".9" filter={`url(#${ids.blur})`} />
    </g>
  )
}

/** The frame every floating option shares: a shadow far below and a slow bob */
function Floating({ mood, size, scale = 0.9, dy = 0, shadow = true, children }: { mood: Expression; size: number; scale?: number; dy?: number; shadow?: boolean; children: (ids: ReturnType<typeof useIds>, fill: string) => ReactNode }) {
  const ids = useIds()
  const tx = 120 * (1 - scale)
  return (
    <Frame size={size} title="mooca" ids={ids} ground={false} defs={<CloudDefs ids={ids} mood={mood} />}>
      {shadow && <ellipse className="float-shadow" cx="120" cy="224" rx="38" ry="4.5" fill="#7C83A8" opacity=".12" />}
      <g className="float-bob">
        <g transform={`translate(${tx} ${dy}) scale(${scale})`}>{children(ids, `url(#${ids.soft})`)}</g>
      </g>
    </Frame>
  )
}

// F1 · Knees up: sitting on nothing, legs tucked under like a seated pose, hands on the knees.
// Compact and calm; the legs never dangle.
export function MoocaKneesUp({ mood = 'listening', size = 220 }: Props) {
  return (
    <Floating mood={mood} size={size} scale={0.92} dy={4}>
      {(ids, fill) => (
        <g transform={`rotate(${bobOf(mood)} 120 150)`}>
          <g fill={fill}>
            <rect x="96" y="142" width="48" height="46" rx="20" />
            {/* knees drawn up, feet showing under them */}
            <ellipse cx="106" cy="186" rx="14" ry="11" />
            <ellipse cx="134" cy="186" rx="14" ry="11" />
            <ellipse cx="104" cy="196" rx="9" ry="6" />
            <ellipse cx="136" cy="196" rx="9" ry="6" />
          </g>
          <g fill="#D9DDEC" opacity=".6">
            <ellipse cx="106" cy="194" rx="10" ry="3" />
            <ellipse cx="134" cy="194" rx="10" ry="3" />
          </g>
          <CloudHead ids={ids} />
          <Scarf x={120} y={148} w={58} color={TURQ} dark={TURQ_DARK} />
          {/* hands resting on the knees */}
          <g fill={fill}>
            <ellipse cx="96" cy="178" rx="8.5" ry="8" />
            <ellipse cx="144" cy="178" rx="8.5" ry="8" />
          </g>
          <SoftFace mood={mood} x={120} y={104} cheek={MOOCA_CHEEK} />
        </g>
      )}
    </Floating>
  )
}

// F2 · Cloud seat: mooca rides its own little puff, like the sheet's Cloud Rider. Floating reads
// at once, and the legs have somewhere to rest.
export function MoocaCloudSeat({ mood = 'listening', size = 220 }: Props) {
  return (
    <Floating mood={mood} size={size} scale={0.84} dy={2}>
      {(ids, fill) => (
        <g>
          <g transform={`rotate(${bobOf(mood)} 120 200)`}>
            <g fill={fill}>
              <rect x="96" y="142" width="48" height="48" rx="20" />
              <rect x="100" y="182" width="15" height="24" rx="7.5" transform="rotate(8 107 184)" />
              <rect x="125" y="182" width="15" height="24" rx="7.5" transform="rotate(-8 133 184)" />
              <ellipse cx="90" cy="168" rx="8" ry="12.5" transform="rotate(30 90 168)" />
              <ellipse cx="150" cy="168" rx="8" ry="12.5" transform="rotate(-30 150 168)" />
            </g>
            <CloudHead ids={ids} />
            <Scarf x={120} y={148} w={58} color={TURQ} dark={TURQ_DARK} />
            <SoftFace mood={mood} x={120} y={104} cheek={MOOCA_CHEEK} />
          </g>
          {/* the little cloud it sits on, pale blue so it reads apart from mooca */}
          <g fill="#CFE3FA">
            <circle cx="88" cy="214" r="16" />
            <circle cx="112" cy="206" r="20" />
            <circle cx="138" cy="208" r="18" />
            <circle cx="158" cy="216" r="13" />
            <rect x="74" y="212" width="98" height="18" rx="9" />
          </g>
          <ellipse cx="128" cy="226" rx="44" ry="5" fill="#AFC9EC" opacity=".7" />
          <ellipse cx="106" cy="200" rx="14" ry="6" fill="#fff" opacity=".85" filter={`url(#${ids.blur})`} />
        </g>
      )}
    </Floating>
  )
}

// F3 · Mochi: no torso and no legs to dangle. Just the cloud, its scarf, and two round feet and
// hands tucked in under it, like a soft toy.
export function MoocaMochi({ mood = 'listening', size = 220, shadow = true }: Props) {
  return (
    <Floating mood={mood} size={size} scale={0.96} dy={14} shadow={shadow}>
      {(ids, fill) => (
        <g transform={`rotate(${bobOf(mood)} 120 120)`}>
          <g fill={fill}>
            <ellipse cx="104" cy="164" rx="13" ry="10" />
            <ellipse cx="136" cy="164" rx="13" ry="10" />
          </g>
          <CloudHead ids={ids} />
          <Scarf x={120} y={146} w={70} color={TURQ} dark={TURQ_DARK} />
          <g fill={fill}>
            <ellipse cx="72" cy="140" rx="10" ry="9" />
            <ellipse cx="168" cy="140" rx="10" ry="9" />
          </g>
          <SoftFace mood={mood} x={120} y={102} cheek={MOOCA_CHEEK} />
        </g>
      )}
    </Floating>
  )
}

// F4 · Drifting: the new mooca on the move, leaning into the breeze. Legs trail behind, one arm
// reaches ahead, and soft wind lines follow it.
export function MoocaDrift({ mood = 'listening', size = 220 }: Props) {
  return (
    <Floating mood={mood} size={size} scale={0.88} dy={0}>
      {(ids, fill) => (
        <g>
          <g fill="none" stroke="#C9CFE4" strokeWidth="4" strokeLinecap="round" opacity=".8">
            <path d="M206 90 q16 -4 26 4" />
            <path d="M212 128 q14 -3 22 3" />
            <path d="M190 192 q14 -4 24 2" />
          </g>
          <g transform={`rotate(${-10 + bobOf(mood)} 120 140)`}>
            <g fill={fill}>
              {/* legs trail back, away from the direction of travel */}
              <rect x="104" y="184" width="15" height="25" rx="7.5" transform="rotate(34 111 186)" />
              <rect x="124" y="184" width="15" height="25" rx="7.5" transform="rotate(22 131 186)" />
              <rect x="96" y="142" width="48" height="54" rx="19" />
              {/* one arm reaches ahead, one trails */}
              <ellipse cx="86" cy="156" rx="8" ry="13" transform="rotate(62 86 156)" />
              <ellipse cx="152" cy="170" rx="8" ry="12.5" transform="rotate(-20 152 170)" />
            </g>
            <CloudHead ids={ids} />
            <Scarf x={120} y={148} w={58} color={TURQ} dark={TURQ_DARK} />
            <SoftFace mood={mood} x={116} y={104} cheek={MOOCA_CHEEK} />
          </g>
        </g>
      )}
    </Floating>
  )
}

export const MOOCA_FLOAT = [
  { key: 'F1', name: 'Knees up', note: 'Sitting on nothing: knees drawn up, hands resting on them. Compact and calm, nothing dangles.', Comp: MoocaKneesUp, isNew: true },
  { key: 'F2', name: 'Cloud seat', note: 'Rides its own little puff, like the sheet’s Cloud Rider. Floating reads at once.', Comp: MoocaCloudSeat, isNew: true },
  { key: 'F3', name: 'Mochi', note: 'No torso or legs: the cloud, its scarf, and round feet and hands tucked under, like a soft toy.', Comp: MoocaMochi, isNew: true },
  { key: 'F4', name: 'Drifting', note: 'On the move: leaning into the breeze, legs trailing, one arm reaching ahead, wind lines behind.', Comp: MoocaDrift, isNew: true },
]

/* ------------------------------------------------------------------ Hin */

const tiltOf = (m: Expression) => (m === 'listening' ? -4 : m === 'thinking' ? 5 : m === 'concerned' ? 2 : 0)

const PEBBLE = 'M56 110 C48 76 76 44 118 42 C162 40 192 66 190 100 C188 134 160 152 120 152 C80 152 62 140 56 110 Z'

function Speckles({ color }: { color: string }) {
  return (
    <g fill={color} opacity=".55">
      <circle cx="160" cy="70" r="2" />
      <circle cx="170" cy="82" r="1.4" />
      <circle cx="76" cy="128" r="1.6" />
      <circle cx="150" cy="136" r="1.3" />
    </g>
  )
}

/** The lit top of a stone: a blurred highlight, the painted look */
function Shine({ ids, cx, cy, rx, ry }: { ids: ReturnType<typeof useIds>; cx: number; cy: number; rx: number; ry: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff" opacity=".7" filter={`url(#${ids.blur})`} />
}

function HinBase({ mood, size, extra, stack = false }: { mood: Expression; size: number; extra?: ReactNode; stack?: boolean }) {
  const ids = useIds()
  const tone = STONE[mood]
  const fill = `url(#${ids.soft})`
  return (
    <Frame size={size} title="Hin the rock" ids={ids} defs={<Paint id={ids.soft} tone={tone} />}>
      <g transform={`rotate(${tiltOf(mood)} 120 210)`}>
        {stack ? (
          <g fill={fill}>
            <rect x="103" y="186" width="15" height="25" rx="7.5" />
            <rect x="122" y="186" width="15" height="25" rx="7.5" />
            <path d="M80 170 C80 150 104 142 122 142 C146 142 162 152 162 172 C162 192 142 198 120 198 C96 198 80 190 80 170 Z" />
            <ellipse cx="76" cy="170" rx="8" ry="12" transform="rotate(26 76 170)" />
            <ellipse cx="166" cy="170" rx="8" ry="12" transform="rotate(-26 166 170)" />
          </g>
        ) : (
          <Body fill={fill} />
        )}
        <path d={PEBBLE} fill={fill} />
        <Shine ids={ids} cx={92} cy={66} rx={26} ry={12} />
        <Speckles color={tone.shade} />
        <Scarf x={120} y={150} w={stack ? 64 : 56} color={MARIGO} dark={MARIGO_DARK} />
        {extra}
        <SoftFace mood={mood} x={120} y={104} cheek={HIN_CHEEK} />
      </g>
    </Frame>
  )
}

export function HinSoftA({ mood = 'calm', size = 220 }: Props) {
  return <HinBase mood={mood} size={size} />
}

export function HinSoftB({ mood = 'calm', size = 220 }: Props) {
  return <HinBase mood={mood} size={size} extra={<SoftSprout mood={mood} />} />
}

// Balance, the Stoic idea: a small pebble rests on Hin's head and slips aside when Hin is worried
export function HinSoftC({ mood = 'calm', size = 220 }: Props) {
  const slip = mood === 'concerned' ? 14 : mood === 'thinking' ? 6 : 0
  const pebble = (
    <g transform={`translate(${slip} ${slip ? 3 : 0}) rotate(${slip} 120 38)`}>
      <ellipse cx="120" cy="36" rx="17" ry="9.5" fill={STONE[mood].shade} />
      <ellipse cx="119" cy="34" rx="16" ry="8.5" fill={STONE[mood].base} />
      <ellipse cx="114" cy="31" rx="6" ry="2.6" fill="#fff" opacity=".7" />
    </g>
  )
  return <HinBase mood={mood} size={size} stack extra={pebble} />
}

/* ------------------------------------------------------------------ Bua */

// Flamingo petals; the face and body stay pale so the navy face reads like mooca's
const PETAL: Tone = { hi: '#FFE3E1', base: '#F9C2BF', shade: '#EE9893' }
const SKIN: Tone = { hi: '#FFFFFF', base: '#FFF2EF', shade: '#F5D5D1' }
const LEAF = '#86D06A'
const LEAF_DARK = '#62B246'

// worry closes the bud, calm is a bud, listening half-opens, happy is full bloom
const OPEN: Record<Expression, number> = { concerned: 0, calm: 0.35, thinking: 0.35, tender: 0.5, listening: 0.6, happy: 1, delighted: 1 }

/** One pointed petal of length L and width W, pivoting on its base at (x, y) */
function Petal({ x, y, L, W, angle, fill }: { x: number; y: number; L: number; W: number; angle: number; fill: string }) {
  const d = `M${x} ${y} C${x - W} ${y - L * 0.45} ${x - W * 0.55} ${y - L * 0.85} ${x} ${y - L} C${x + W * 0.55} ${y - L * 0.85} ${x + W} ${y - L * 0.45} ${x} ${y} Z`
  return <path d={d} fill={fill} transform={`rotate(${angle} ${x} ${y})`} style={{ transition: 'transform .6s cubic-bezier(.22,1,.36,1)' }} />
}

/** Petals fanned out behind the head, wider as Bua opens */
function Crown({ open, fill, count = 5, L = 128, W = 46 }: { open: number; fill: string; count?: number; L?: number; W?: number }) {
  const spread = 30 + open * 36
  const angles = Array.from({ length: count }, (_, i) => (i / (count - 1) - 0.5) * 2 * spread)
  // the outermost petals sit furthest back, and are a little shorter
  const order = [...angles].sort((a, b) => Math.abs(b) - Math.abs(a))
  return (
    <g>
      {order.map((a) => (
        <Petal key={a} x={120} y={150} L={L - Math.abs(a) * 0.35} W={W} angle={a} fill={fill} />
      ))}
    </g>
  )
}

function LeafCollar() {
  const veins = [-150, -120, -90, -60, -30].map((a) => {
    const r = (a * Math.PI) / 180
    return `M120 150 L${120 + Math.cos(r) * -30} ${150 - Math.sin(r) * 9}`
  })
  return (
    <g>
      <ellipse cx="120" cy="153" rx="40" ry="13" fill={LEAF_DARK} />
      <ellipse cx="120" cy="150" rx="39" ry="12" fill={LEAF} />
      <path d={veins.join(' ')} stroke={LEAF_DARK} strokeWidth="1.6" opacity=".6" />
    </g>
  )
}

function BuaBase({ mood, size, head, crown, neck, pad = false }: { mood: Expression; size: number; head: 'round' | 'bud'; crown: (fill: string, open: number) => ReactNode; neck: ReactNode; pad?: boolean }) {
  const ids = useIds()
  const open = OPEN[mood]
  const skin = `url(#${ids.soft})`
  const petal = `url(#${ids.g('petal')})`
  const sway = mood === 'listening' ? -3 : mood === 'thinking' ? 4 : 0
  return (
    <Frame
      size={size}
      title="Bua the lotus"
      ids={ids}
      defs={
        <>
          <Paint id={ids.soft} tone={SKIN} />
          <linearGradient id={ids.g('petal')} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor={PETAL.hi} />
            <stop offset="0.6" stopColor={PETAL.base} />
            <stop offset="1" stopColor={PETAL.shade} />
          </linearGradient>
        </>
      }
    >
      {pad && (
        <g>
          <ellipse cx="120" cy="212" rx="70" ry="13" fill={LEAF_DARK} />
          <ellipse cx="120" cy="209" rx="68" ry="11.5" fill={LEAF} />
          <path d="M120 209 L176 205" stroke="#F4F7EF" strokeWidth="3" />
        </g>
      )}
      <g transform={`rotate(${sway} 120 210)`}>
        <Body fill={skin} top={146} />
        {crown(petal, open)}
        {head === 'round' ? (
          <ellipse cx="120" cy="104" rx="56" ry="50" fill={skin} />
        ) : (
          <g>
            <path d="M120 38 C148 58 174 84 174 114 C174 142 150 156 120 156 C90 156 66 142 66 114 C66 84 92 58 120 38 Z" fill={skin} />
            <path d="M120 38 C126 44 131 50 135 57 C125 53 115 53 105 57 C109 50 114 44 120 38 Z" fill={PETAL.shade} />
          </g>
        )}
        <ellipse cx="96" cy="76" rx="20" ry="9" fill="#fff" opacity=".8" filter={`url(#${ids.blur})`} />
        {neck}
        <SoftFace mood={mood} x={120} y={110} gap={20} cheek={BUA_CHEEK} />
      </g>
    </Frame>
  )
}

// A round face framed by lotus petals, with a lotus-leaf collar instead of a scarf
export function BuaSoftA({ mood = 'calm', size = 220 }: Props) {
  return <BuaBase mood={mood} size={size} head="round" crown={(fill, open) => <Crown open={open} fill={fill} />} neck={<LeafCollar />} />
}

// The head is the bud itself, as before; side petals open with the mood. Flamingo scarf
export function BuaSoftB({ mood = 'calm', size = 220 }: Props) {
  return (
    <BuaBase
      mood={mood}
      size={size}
      head="bud"
      crown={(fill, open) => <Crown open={open} fill={fill} count={4} L={132} W={44} />}
      neck={<Scarf x={120} y={154} w={52} color={FLAMINGO} dark={FLAMINGO_DARK} />}
    />
  )
}

// A full ring of petals, standing on a lotus pad. Flamingo scarf
export function BuaSoftC({ mood = 'calm', size = 220 }: Props) {
  return (
    <BuaBase
      mood={mood}
      size={size}
      head="round"
      pad
      crown={(fill, open) => <Crown open={open} fill={fill} count={7} L={124} W={40} />}
      neck={<Scarf x={120} y={152} w={54} color={FLAMINGO} dark={FLAMINGO_DARK} />}
    />
  )
}


/* ------------------------- The chosen three, now the app's own components */

// mooca Version 2 (floating, body and all), and our own Hin and Bua repainted (R1, R2 with a scarf)
export const MoocaFloat = ({ mood = 'listening', size = 220, shadow = true }: Props) => <Mooca mood={mood} size={size} shadow={shadow} />
export const HinRepaint = ({ mood = 'calm', size = 220 }: Props) => <Rock mood={mood} size={size} />
export const HinRepaintScarf = ({ mood = 'calm', size = 220 }: Props) => <Rock mood={mood} size={size} scarf />
export const BuaRepaint = ({ mood = 'calm', size = 220, ripples = true }: Props) => <Lotus mood={mood} size={size} ripples={ripples} />
export const BuaRepaintScarf = ({ mood = 'calm', size = 220 }: Props) => <Lotus mood={mood} size={size} scarf />

export const HIN_SOFT = [
  { key: 'R1', name: 'Our Hin, repainted', note: 'The flow’s pebble as it is (one stone, little feet and arms, the sprout, the worry crack) in the new soft finish and face.', Comp: HinRepaint, isNew: true },
  { key: 'R2', name: 'Our Hin, with scarf', note: 'R1 with a Marigo scarf, the family mark it shares with mooca.', Comp: HinRepaintScarf, isNew: true },
  { key: 'S1', name: 'Pebble, scarf', note: 'A big smooth river stone on a small body, Marigo scarf. Cools to blue-grey when worried.', Comp: HinSoftA, isNew: true },
  { key: 'S2', name: 'Pebble with sprout', note: 'S1 plus the old Hin’s sprout as its signature: it leans with the mood and flowers when happy.', Comp: HinSoftB, isNew: true },
  { key: 'S3', name: 'Balanced stones', note: 'A stone body, a pebble head and a small pebble balanced on top that slips when Hin is worried.', Comp: HinSoftC, isNew: true },
]

export const BUA_SOFT = [
  { key: 'R1', name: 'Our Bua, repainted', note: 'The flow’s lotus as it is (a bud on its own stem, the round leaf, petals that open with the mood) in the new soft finish and face.', Comp: BuaRepaint, isNew: true },
  { key: 'R2', name: 'Our Bua, with scarf', note: 'R1 with a Flamingo scarf where the bud meets its stem.', Comp: BuaRepaintScarf, isNew: true },
  { key: 'S1', name: 'Petal hood, leaf collar', note: 'A round face framed by petals that fan open with the mood. A lotus-leaf collar instead of a scarf.', Comp: BuaSoftA, isNew: true },
  { key: 'S2', name: 'Bud head, scarf', note: 'The head is the bud, as before; side petals open with the mood. Flamingo scarf.', Comp: BuaSoftB, isNew: true },
  { key: 'S3', name: 'Full bloom on a pad', note: 'Seven petals and a lotus pad underfoot. The most lotus, but the busiest outline.', Comp: BuaSoftC, isNew: true },
]
