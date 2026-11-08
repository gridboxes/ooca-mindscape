import type { ReactNode } from 'react'
import BuaOriginal from './BuaOriginal'
import Face, { type Mood } from '../components/companions/Face'

// Four takes on Bua for the sandbox. A is the current Lotus; B–D are alternatives.

interface VariantProps {
  mood: Mood
  size: number
}

export const FACE = '#FFE6E5'
export const MID = '#FAD0CE'
export const OUTER = '#F6B9B6'
export const TIP = '#F49C98'
export const SHADE = '#EDB4B1'
export const CHEEK = '#F2918D'

function Frame({ size, label, children }: { size: number; label: string; children: ReactNode }) {
  return (
    <svg className="lotus" width={size} height={size} viewBox="0 0 240 240" role="img" aria-label={label}>
      {children}
    </svg>
  )
}

function Pad() {
  return (
    <g>
      <ellipse cx="116" cy="200" rx="86" ry="19" fill="#6FBF4C" />
      <path d="M120 192 L200 184 C206 202 172 212 120 212 C68 212 32 204 34 192 C36 178 76 172 120 172 C150 172 178 176 192 182 Z" fill="#8AD866" />
    </g>
  )
}

// A pointed petal of length L and width W growing up from (bx, by)
export function petal(bx: number, by: number, L: number, W: number) {
  return `M${bx} ${by} C${bx - W} ${by - L * 0.45} ${bx - W * 0.55} ${by - L * 0.85} ${bx} ${by - L} C${bx + W * 0.55} ${by - L * 0.85} ${bx + W} ${by - L * 0.45} ${bx} ${by} Z`
}
function tip(bx: number, by: number, L: number, W: number) {
  return `M${bx - W * 0.4} ${by - L * 0.8} C${bx - W * 0.3} ${by - L * 0.89} ${bx - W * 0.12} ${by - L * 0.96} ${bx} ${by - L} C${bx + W * 0.12} ${by - L * 0.96} ${bx + W * 0.3} ${by - L * 0.89} ${bx + W * 0.4} ${by - L * 0.8} C${bx + W * 0.15} ${by - L * 0.84} ${bx - W * 0.15} ${by - L * 0.84} ${bx - W * 0.4} ${by - L * 0.8} Z`
}

export function Petal({ bx, by, L, W, angle, fill, withTip = true }: { bx: number; by: number; L: number; W: number; angle: number; fill: string; withTip?: boolean }) {
  return (
    <g transform={`rotate(${angle} ${bx} ${by})`} style={{ transition: 'transform .6s' }}>
      <path d={petal(bx, by, L, W)} fill={fill} />
      {withTip && <path d={tip(bx, by, L, W)} fill={TIP} />}
    </g>
  )
}

/** A · Original: egg face petal with side petals tucked behind (current) */
export function BuaA({ mood, size }: VariantProps) {
  return <BuaOriginal mood={mood} size={size} ripples={false} title="Bua A, original" />
}

/** B · Bud: a closed lotus bud, petals hugging the face */
export function BuaB({ mood, size }: VariantProps) {
  const open = mood === 'happy' ? 10 : mood === 'concerned' ? -6 : 0
  const tilt = mood === 'listening' ? 5 : 0
  const BUD = 'M120 48 C148 74 170 108 170 140 C170 168 150 186 120 186 C90 186 70 168 70 140 C70 108 92 74 120 48 Z'
  return (
    <Frame size={size} label="Bua B, bud">
      <Pad />
      <g transform={`rotate(${tilt} 120 184)`}>
        <Petal bx={120} by={184} L={118} W={52} angle={-22 - open} fill={OUTER} />
        <Petal bx={120} by={184} L={118} W={52} angle={22 + open} fill={OUTER} />
        <path d={BUD} fill={SHADE} transform="translate(-5 7)" />
        <path d={BUD} fill={FACE} />
        <path d="M120 48 C128 56 136 66 142 76 C128 71 112 71 98 76 C104 66 112 56 120 48 Z" fill={TIP} />
        {/* the hugging front petals */}
        <path d="M120 186 C96 186 76 172 72 150 C86 162 104 168 120 168 C136 168 154 162 168 150 C164 172 144 186 120 186 Z" fill={MID} />
        <Face mood={mood} x={120} y={126} gap={22} cheek={CHEEK} />
      </g>
    </Frame>
  )
}

// The open bloom's fanned petals: outer pair, middle pair and the face petal
function Bloom({ bx, by, open, shade }: { bx: number; by: number; open: number; shade: boolean }) {
  return (
    <g>
      <Petal bx={bx} by={by} L={100} W={38} angle={-(62 + open)} fill={shade ? SHADE : OUTER} withTip={!shade} />
      <Petal bx={bx} by={by} L={100} W={38} angle={62 + open} fill={shade ? SHADE : OUTER} withTip={!shade} />
      <Petal bx={bx} by={by} L={112} W={40} angle={-(32 + open * 0.6)} fill={shade ? SHADE : MID} withTip={!shade} />
      <Petal bx={bx} by={by} L={112} W={40} angle={32 + open * 0.6} fill={shade ? SHADE : MID} withTip={!shade} />
      <Petal bx={bx} by={by} L={126} W={58} angle={0} fill={shade ? SHADE : FACE} withTip={!shade} />
    </g>
  )
}

/** C · Open bloom: pointed petals fanned wide from one base */
export function BuaC({ mood, size }: VariantProps) {
  const open = mood === 'happy' ? 8 : mood === 'concerned' ? -10 : 0
  const tilt = mood === 'listening' ? 5 : 0
  const bx = 120
  const by = 184
  return (
    <Frame size={size} label="Bua C, open bloom">
      <Pad />
      <g transform={`rotate(${tilt} ${bx} ${by})`}>
        <g transform="translate(-5 7)">
          <Bloom bx={bx} by={by} open={open} shade />
        </g>
        <Bloom bx={bx} by={by} open={open} shade={false} />
        <Petal bx={bx} by={by} L={58} W={24} angle={-74} fill={MID} />
        <Petal bx={bx} by={by} L={58} W={24} angle={74} fill={MID} />
        <ellipse cx={bx} cy={by - 2} rx="18" ry="7" fill={MID} />
        <Face mood={mood} x={120} y={128} gap={22} cheek={CHEEK} />
      </g>
    </Frame>
  )
}

/** H · Open bloom, clean base: C without the front petals, sitting down into its pad */
export function BuaH({ mood, size }: VariantProps) {
  const open = mood === 'happy' ? 8 : mood === 'concerned' ? -10 : 0
  const tilt = mood === 'listening' ? 5 : 0
  const bx = 120
  const by = 184
  return (
    <Frame size={size} label="Bua H, open bloom with a clean base">
      <Pad />
      <g transform={`rotate(${tilt} ${bx} ${by})`}>
        <g transform="translate(-5 7)">
          <Bloom bx={bx} by={by} open={open} shade />
        </g>
        <Bloom bx={bx} by={by} open={open} shade={false} />
        <Face mood={mood} x={120} y={128} gap={22} cheek={CHEEK} />
      </g>
      {/* the pad's front lip hides where the petals meet, so the flower sits in it */}
      <path d="M38 190 C60 182 92 179 120 179 C150 179 182 182 202 188 C204 204 172 212 120 212 C68 212 34 204 38 190 Z" fill="#8AD866" />
      <path d="M120 194 L200 186" stroke="#6FBF4C" strokeWidth="2" strokeLinecap="round" opacity=".7" />
    </Frame>
  )
}

/** D · Halo: a round face at the heart of the flower, petals all around */
export function BuaD({ mood, size }: VariantProps) {
  const spread = mood === 'happy' ? 6 : mood === 'concerned' ? -6 : 0
  const tilt = mood === 'listening' ? 6 : 0
  const cx = 120
  const cy = 122
  const ring = (angles: number[], L: number, W: number, fill: string) =>
    angles.map((a) => <Petal key={a} bx={cx} by={cy} L={L} W={W} angle={a + Math.sign(a) * spread} fill={fill} />)
  return (
    <Frame size={size} label="Bua D, halo">
      <Pad />
      <g transform={`rotate(${tilt} ${cx} 184)`}>
        {ring([-110, -70, -35, 0, 35, 70, 110], 88, 30, OUTER)}
        {ring([-52, -18, 18, 52], 76, 30, MID)}
        <circle cx={cx - 4} cy={cy + 6} r="46" fill={SHADE} />
        <circle cx={cx} cy={cy} r="46" fill={FACE} />
        <Face mood={mood} x={cx} y={cy - 2} gap={20} cheek={CHEEK} />
      </g>
    </Frame>
  )
}

/** E · Marshmallow bud: a plump, round bud with three pointed tips, face set low */
export function BuaE({ mood, size }: VariantProps) {
  const open = mood === 'happy' ? 8 : mood === 'concerned' ? -6 : 0
  const tilt = mood === 'listening' ? 6 : 0
  const BALL = 'M120 76 C160 76 182 108 182 142 C182 172 156 190 120 190 C84 190 58 172 58 142 C58 108 80 76 120 76 Z'
  return (
    <Frame size={size} label="Bua E, marshmallow bud">
      <Pad />
      <g transform={`rotate(${tilt} 120 188)`}>
        <Petal bx={120} by={128} L={90} W={34} angle={-(36 + open)} fill={OUTER} />
        <Petal bx={120} by={128} L={90} W={34} angle={36 + open} fill={OUTER} />
        <Petal bx={120} by={128} L={96} W={36} angle={0} fill={MID} />
        <path d={BALL} fill={SHADE} transform="translate(-5 7)" />
        <path d={BALL} fill={FACE} />
        {/* soft seams where the petals fold around the bud */}
        <g stroke={SHADE} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".8">
          <path d="M92 84 C80 108 78 134 86 160" />
          <path d="M148 84 C160 108 162 134 154 160" />
        </g>
        <Face mood={mood} x={120} y={150} gap={20} cheek={CHEEK} />
      </g>
    </Frame>
  )
}

/** F · Crown cup: a rounded cup with a crown of pointed petals that rises as the mood lifts */
export function BuaF({ mood, size }: VariantProps) {
  // Bud to bloom: the back crown lifts when happy and tucks down when concerned
  const lift = mood === 'happy' ? -10 : mood === 'concerned' ? 10 : 0
  const tilt = mood === 'listening' ? 5 : 0
  const CUP = 'M56 110 C56 160 82 188 120 188 C158 188 184 160 184 110 Z'
  // One pointed crown petal rising from the rim at x, with its tip at `top` and half-width w
  const crown = (x: number, top: number, w: number) =>
    `M${x - w} 116 C${x - w} ${top + 34} ${x - w * 0.4} ${top + 12} ${x} ${top} C${x + w * 0.4} ${top + 12} ${x + w} ${top + 34} ${x + w} 116 Z`
  return (
    <Frame size={size} label="Bua F, crown cup">
      <Pad />
      <g transform={`rotate(${tilt} 120 188)`}>
        <g transform={`translate(0 ${lift})`} style={{ transition: 'transform .6s' }}>
          {[99, 141].map((x) => (
            <path key={x} d={crown(x, 50, 26)} fill={OUTER} />
          ))}
        </g>
        <path d={CUP} fill={SHADE} transform="translate(-5 7)" />
        {[78, 120, 162].map((x) => (
          <g key={x}>
            <path d={crown(x, 66, 26)} fill={MID} />
            <path d={`M${x - 8} 84 C${x - 5} 78 ${x - 2} 71 ${x} 66 C${x + 2} 71 ${x + 5} 78 ${x + 8} 84 C${x + 3} 82 ${x - 3} 82 ${x - 8} 84 Z`} fill={TIP} />
          </g>
        ))}
        <path d={CUP} fill={FACE} />
        <Face mood={mood} x={120} y={146} gap={22} cheek={CHEEK} />
      </g>
    </Frame>
  )
}

/** G · True lotus: a bud on its stem with a round lotus leaf raised behind like a parasol */
export function BuaG({ mood, size }: VariantProps) {
  const open = mood === 'happy' ? 10 : mood === 'concerned' ? -6 : 0
  const leafTilt = mood === 'listening' ? -8 : mood === 'concerned' ? 6 : 0
  const bx = 132
  const by = 172
  const BUD = 'M132 64 C156 86 170 110 168 136 C166 160 152 174 132 174 C112 174 98 160 96 136 C94 110 108 86 132 64 Z'
  return (
    <Frame size={size} label="Bua G, true lotus with raised leaf">
      {/* water: a true lotus stands above it, so ripples instead of a pad */}
      <g fill="none" stroke="#8FBBEF" strokeWidth="3" strokeLinecap="round">
        <ellipse cx="120" cy="204" rx="90" ry="14" />
        <path d="M48 216 q14 -5 28 0" opacity=".7" />
        <path d="M168 218 q12 -4 24 0" opacity=".7" />
      </g>
      {/* the raised leaf on its own stem */}
      <path d="M78 140 C80 168 92 188 100 204" stroke="#6FBF4C" strokeWidth="5" strokeLinecap="round" fill="none" />
      <g transform={`rotate(${leafTilt} 78 140)`} style={{ transition: 'transform .6s' }}>
        <ellipse cx="74" cy="98" rx="58" ry="46" fill="#6FBF4C" />
        <ellipse cx="78" cy="94" rx="58" ry="46" fill="#8AD866" />
        <g stroke="#6FBF4C" strokeWidth="2" strokeLinecap="round" opacity=".6">
          <path d="M78 94 L78 52 M78 94 L120 82 M78 94 L116 120 M78 94 L78 138 M78 94 L40 120 M78 94 L36 82" />
        </g>
        <circle cx="78" cy="94" r="4" fill="#6FBF4C" />
      </g>
      {/* the flower on a short stem */}
      <path d={`M${bx} ${by} C${bx} 186 ${bx - 2} 196 ${bx - 4} 206`} stroke="#6FBF4C" strokeWidth="5" strokeLinecap="round" fill="none" />
      <Petal bx={bx} by={by} L={88} W={34} angle={-(32 + open)} fill={OUTER} />
      <Petal bx={bx} by={by} L={88} W={34} angle={32 + open} fill={OUTER} />
      <path d={BUD} fill={SHADE} transform="translate(-4 6)" />
      <path d={BUD} fill={FACE} />
      <path d="M132 64 C138 70 143 76 147 83 C137 79 127 79 117 83 C121 76 126 70 132 64 Z" fill={TIP} />
      <Face mood={mood} x={bx} y={130} gap={18} cheek={CHEEK} />
    </Frame>
  )
}

export const BUA_VARIANTS = [
  { key: 'A', name: 'Original', note: 'Current. Egg-shaped face petal with pointed side and back petals tucked behind.', Comp: BuaA },
  { key: 'B', name: 'Bud', note: 'A closed bud, petals hugging the face. Quiet and inward, like the start of practice.', Comp: BuaB },
  { key: 'C', name: 'Open bloom', note: 'Five pointed petals fanned wide from one base. The most clearly "lotus".', Comp: BuaC },
  { key: 'D', name: 'Halo', note: 'A round face at the heart of the flower with petals all around. Most mascot-like.', Comp: BuaD },
  { key: 'E', name: 'Marshmallow bud', note: 'New. A plump round bud, face set low. Soft like the Thai "marshmallow" temple-creature trend.', Comp: BuaE, isNew: true },
  { key: 'F', name: 'Crown cup', note: 'New. A cup with a crown of pointed petals that rises when happy and tucks in when worried: bud to bloom.', Comp: BuaF, isNew: true },
  { key: 'G', name: 'True lotus', note: 'New. A real lotus holds its round leaf up above the water. The raised leaf makes a silhouette no water lily has.', Comp: BuaG, isNew: true },
  { key: 'H', name: 'Open bloom, clean base', note: 'New. C without the front petals. The flower sits down into its pad, so the bottom stays light.', Comp: BuaH, isNew: true },
]
