import type { ReactNode } from 'react'
import Face, { INK, type Mood } from '../components/companions/Face'
import { StoicFace } from './HinStoic'

// A fresh round of Hin ideas, each built from a different piece of philosophy's own story
// rather than from earlier sketches. Same ooca drawing rules: flat fills, one offset shade,
// navy faces, pink cheeks.

interface VariantProps {
  mood: Mood
  size: number
}

const STONE = '#DDD1BC'
const STONE_SHADE = '#B9A98D'
const STONE_SHINE = '#EAE1D0'
const STONE_SIDE = '#CFC1A8'
const MARBLE = '#EEE8DE'
const MARBLE_LIGHT = '#F7F3EC'
const MARBLE_SHADE = '#CFC5B5'
const GOLD = '#F2B533'
const LEAF = '#8AD866'

function Frame({ size, label, children }: { size: number; label: string; children: ReactNode }) {
  return (
    <svg className="rock" width={size} height={size} viewBox="0 0 240 240" role="img" aria-label={label}>
      {children}
    </svg>
  )
}

const Shadow = () => <ellipse cx="120" cy="204" rx="76" ry="7" fill="#26313C" opacity=".06" />

const Arm = ({ x, y, r, fill, stroke }: { x: number; y: number; r: number; fill: string; stroke: string }) => (
  <ellipse cx={x} cy={y} rx="9" ry="14" fill={fill} stroke={stroke} strokeWidth="3" transform={`rotate(${r} ${x} ${y})`} />
)

/** 1 · Stoa column: "Stoic" comes from the Stoa, the painted porch in Athens where Zeno taught */
export function Hin1({ mood, size }: VariantProps) {
  const tilt = mood === 'concerned' ? 4 : mood === 'listening' ? -3 : 0
  return (
    <Frame size={size} label="Hin 1, a little Stoa column">
      <Shadow />
      <g className="rock-body">
        <Arm x={64} y={142} r={25} fill={MARBLE} stroke={MARBLE_SHADE} />
        <Arm x={176} y={142} r={-25} fill={MARBLE} stroke={MARBLE_SHADE} />
        <rect x="62" y="184" width="116" height="16" rx="6" fill={MARBLE_SHADE} />
        <rect x="70" y="98" width="92" height="94" rx="12" fill={MARBLE_SHADE} />
        <rect x="74" y="92" width="92" height="96" rx="12" fill={MARBLE} />
        {/* fluting down the sides of the shaft */}
        <g stroke="#DCD3C6" strokeWidth="4" strokeLinecap="round">
          <path d="M84 104 V178 M96 104 V178 M144 104 V178 M156 104 V178" />
        </g>
        {/* the capital: a slab with two scroll volutes, tipping a little when worried */}
        <g transform={`rotate(${tilt} 120 94)`}>
          <rect x="60" y="76" width="120" height="20" rx="8" fill={MARBLE_LIGHT} />
          <circle cx="66" cy="86" r="11" fill={MARBLE} stroke={MARBLE_SHADE} strokeWidth="3" />
          <circle cx="174" cy="86" r="11" fill={MARBLE} stroke={MARBLE_SHADE} strokeWidth="3" />
          <circle cx="66" cy="86" r="4" fill={MARBLE_SHADE} />
          <circle cx="174" cy="86" r="4" fill={MARBLE_SHADE} />
          <path d="M148 77 l5 7 l6 -2" stroke={MARBLE_SHADE} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {mood === 'happy' && (
            <g fill={LEAF}>
              <path d="M88 78 q-10 -10 -18 -2 q8 8 18 2 z" />
              <path d="M94 76 q2 -14 12 -12 q0 10 -12 12 z" />
            </g>
          )}
        </g>
        <StoicFace mood={mood} x={120} y={136} gap={20} />
      </g>
    </Frame>
  )
}

/** 2 · Little bust: a marble philosopher's head on a plinth, curls and all. No body needed. */
export function Hin2({ mood, size }: VariantProps) {
  const tilt = mood === 'listening' ? -8 : mood === 'concerned' ? 5 : 0
  const curl = (x: number, y: number) => <circle key={`${x}-${y}`} cx={x} cy={y} r="11" fill={MARBLE_LIGHT} stroke={MARBLE_SHADE} strokeWidth="2" />
  return (
    <Frame size={size} label="Hin 2, a little marble bust">
      <Shadow />
      <path d="M82 202 L158 202 L150 172 L90 172 Z" fill={MARBLE_SHADE} />
      <rect x="84" y="162" width="72" height="12" rx="5" fill={MARBLE} />
      <rect x="104" y="146" width="32" height="20" fill={MARBLE_SHADE} />
      <g transform={`rotate(${tilt} 120 160)`}>
        <ellipse cx="115" cy="106" rx="52" ry="54" fill={MARBLE_SHADE} />
        <ellipse cx="120" cy="100" rx="52" ry="54" fill={MARBLE} />
        {[[76, 74], [90, 58], [108, 50], [127, 48], [146, 54], [161, 66], [168, 82]].map(([x, y]) => curl(x, y))}
        {[[86, 128], [96, 142], [108, 150], [121, 153], [134, 150], [146, 142], [155, 128]].map(([x, y]) => curl(x, y))}
        <StoicFace mood={mood} x={120} y={104} gap={20} />
      </g>
    </Frame>
  )
}

/** 3 · Owl stone: a rock shaped like the owl of Athena, the old symbol of wisdom */
export function Hin3({ mood, size }: VariantProps) {
  const droop = mood === 'concerned' ? 14 : mood === 'happy' ? -6 : 0
  const BODY = 'M120 66 C162 66 192 104 192 146 C192 178 162 198 120 198 C78 198 48 178 48 146 C48 104 78 66 120 66 Z'
  const tuft = { fill: STONE, stroke: STONE, strokeWidth: 8, strokeLinejoin: 'round' as const }
  const line = { stroke: INK, strokeWidth: 4, strokeLinecap: 'round' as const, fill: 'none' }
  return (
    <Frame size={size} label="Hin 3, an owl-shaped stone">
      <Shadow />
      <g className="rock-body">
        <polygon points="72,94 64,56 98,78" {...tuft} transform={`rotate(${-droop} 80 90)`} />
        <polygon points="168,94 176,56 142,78" {...tuft} transform={`rotate(${droop} 160 90)`} />
        <path d={BODY} fill={STONE_SHADE} transform="translate(-5 7)" />
        <path d={BODY} fill={STONE} />
        <ellipse cx="58" cy="152" rx="14" ry="30" fill={STONE_SIDE} transform="rotate(14 58 152)" />
        <ellipse cx="182" cy="152" rx="14" ry="30" fill={STONE_SIDE} transform="rotate(-14 182 152)" />
        <circle cx="96" cy="122" r="22" fill={STONE_SHINE} />
        <circle cx="144" cy="122" r="22" fill={STONE_SHINE} />
        {mood === 'happy' ? (
          <g {...line}>
            <path d="M89 124 q7 -7 14 0" />
            <path d="M137 124 q7 -7 14 0" />
          </g>
        ) : (
          <g className="face-eyes" fill={INK}>
            <path d="M89 122 a7 7 0 0 0 14 0 z" />
            <path d="M137 122 a7 7 0 0 0 14 0 z" />
          </g>
        )}
        <polygon points="114,138 126,138 120,149" fill={GOLD} stroke={GOLD} strokeWidth="4" strokeLinejoin="round" />
        <g opacity=".7" fill="#F2B3AE">
          <ellipse cx="80" cy="146" rx="7" ry="4.5" />
          <ellipse cx="160" cy="146" rx="7" ry="4.5" />
        </g>
        <g stroke={STONE_SHADE} strokeWidth="3" strokeLinecap="round" fill="none">
          <path d="M108 164 q6 6 12 0 q6 6 12 0" />
          <path d="M114 178 q6 6 12 0" />
        </g>
        <ellipse cx="104" cy="198" rx="10" ry="4" fill={GOLD} />
        <ellipse cx="136" cy="198" rx="10" ry="4" fill={GOLD} />
      </g>
    </Frame>
  )
}

/** 4 · Diogenes' lantern: the philosopher who walked Athens by day with a lamp, looking for an honest person */
export function Hin4({ mood, size }: VariantProps) {
  const glow = { happy: 0.45, calm: 0.3, listening: 0.36, concerned: 0.12 }[mood]
  const BODY = 'M118 80 C158 78 190 106 190 144 C190 176 164 196 120 196 C76 196 50 176 50 144 C50 108 80 82 118 80 Z'
  return (
    <Frame size={size} label="Hin 4, a stone carrying Diogenes' lantern">
      <Shadow />
      <g className="rock-body">
        <Arm x={52} y={160} r={28} fill={STONE} stroke={STONE_SHADE} />
        <path d={BODY} fill={STONE_SHADE} transform="translate(-5 7)" />
        <path d={BODY} fill={STONE} />
        <path d="M70 110 C84 92 102 84 120 84 C146 84 166 96 178 112 C150 104 100 104 70 110 Z" fill={STONE_SHINE} />
        <Face mood={mood} x={116} y={140} gap={22} blink />
        {/* the lantern on its pole, glowing brighter when Hin is at ease */}
        <circle cx="206" cy="96" r="30" fill="#FBE36A" opacity={glow} style={{ transition: 'opacity .6s' }} />
        <path d="M184 154 L206 66" stroke="#C49A5A" strokeWidth="5" strokeLinecap="round" />
        <path d="M206 66 V82" stroke="#C49A5A" strokeWidth="2.5" />
        <path d="M198 84 L206 76 L214 84 Z" fill="#C49A5A" />
        <rect x="197" y="84" width="18" height="24" rx="5" fill="#FBE36A" stroke="#C49A5A" strokeWidth="3" />
        <path d="M206 92 v8" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
        <Arm x={186} y={154} r={-40} fill={STONE} stroke={STONE_SHADE} />
      </g>
    </Frame>
  )
}

/** 5 · Journal slate: Marcus Aurelius' Meditations was a private notebook. Hin keeps one too. */
export function Hin5({ mood, size }: VariantProps) {
  const SLATE = '#D5D7DB'
  const SLATE_SHADE = '#AEB2B9'
  const raise = mood === 'happy' ? -6 : 0
  return (
    <Frame size={size} label="Hin 5, a slate stone with a journal">
      <Shadow />
      <g className="rock-body">
        <rect x="80" y="190" width="28" height="14" rx="7" fill={SLATE} stroke={SLATE_SHADE} strokeWidth="3" />
        <rect x="132" y="190" width="28" height="14" rx="7" fill={SLATE} stroke={SLATE_SHADE} strokeWidth="3" />
        <rect x="57" y="71" width="116" height="128" rx="26" fill={SLATE_SHADE} />
        <rect x="62" y="64" width="116" height="128" rx="26" fill={SLATE} />
        {/* slate splits in thin layers */}
        <g stroke="#C6C9CF" strokeWidth="2.5" strokeLinecap="round">
          <path d="M78 80 H150 M88 90 H162" />
        </g>
        <StoicFace mood={mood} x={120} y={114} gap={22} />
        {/* the little notebook */}
        <g transform={`translate(0 ${raise})`} style={{ transition: 'transform .6s' }}>
          <rect x="82" y="142" width="76" height="46" rx="4" fill="#FFFDF6" stroke="#E6DCC8" strokeWidth="2" />
          <path d="M120 144 V186" stroke="#E6DCC8" strokeWidth="2" />
          <g stroke="#D6CCB8" strokeWidth="2" strokeLinecap="round">
            <path d="M90 154 H112 M90 162 H110 M90 170 H112 M128 154 H150 M128 162 H146" />
          </g>
          <path d="M150 142 v14 l-4 -3 l-4 3 v-14" fill={GOLD} />
          <ellipse cx="80" cy="166" rx="8" ry="11" fill={SLATE} stroke={SLATE_SHADE} strokeWidth="3" />
          <ellipse cx="160" cy="166" rx="8" ry="11" fill={SLATE} stroke={SLATE_SHADE} strokeWidth="3" />
          {mood === 'listening' && (
            <g transform="rotate(-35 140 172)">
              <rect x="132" y="150" width="7" height="30" rx="2" fill={GOLD} />
              <path d="M132 180 l3.5 7 l3.5 -7 z" fill="#C49A5A" />
            </g>
          )}
        </g>
      </g>
    </Frame>
  )
}

/** 6 · Kintsugi stone: cracks mended with gold. Resilience: what broke you becomes part of your strength. */
export function Hin6({ mood, size }: VariantProps) {
  const STONE_COOL = '#D8D1C6'
  const SHADE_COOL = '#B3AA9C'
  const BODY = 'M116 70 C160 68 196 98 196 138 C196 174 170 196 120 196 C70 196 44 174 44 140 C44 100 74 72 116 70 Z'
  return (
    <Frame size={size} label="Hin 6, a stone mended with gold">
      <Shadow />
      <g className="rock-body">
        <Arm x={40} y={160} r={28} fill={STONE_COOL} stroke={SHADE_COOL} />
        <Arm x={200} y={160} r={-28} fill={STONE_COOL} stroke={SHADE_COOL} />
        <path d={BODY} fill={SHADE_COOL} transform="translate(-5 7)" />
        <path d={BODY} fill={STONE_COOL} />
        <ellipse cx="84" cy="98" rx="14" ry="7" fill="#EAE5DD" transform="rotate(-28 84 98)" />
        {/* gold seams where the stone once cracked */}
        <g stroke={GOLD} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M56 112 L72 126 L66 144 L78 162" />
          <path d="M164 84 L152 100 L168 112 L162 124" />
          <path d="M118 194 L128 178 L150 174" />
        </g>
        {mood === 'happy' && (
          <g fill={GOLD}>
            <path d="M172 104 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 z" />
            <path d="M74 152 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 l4 -1.5 z" />
          </g>
        )}
        <StoicFace mood={mood} x={120} y={136} gap={22} />
      </g>
    </Frame>
  )
}

export const HIN_IDEAS = [
  { key: '1', name: 'Stoa column', note: '"Stoic" comes from the Stoa, the porch in Athens where Zeno taught. Hin is a little piece of it. The capital tips when worried.', Comp: Hin1, isNew: true },
  { key: '2', name: 'Little bust', note: 'A marble philosopher’s head on a plinth, curls and beard. Instantly "philosopher", and funny with no body.', Comp: Hin2, isNew: true },
  { key: '3', name: 'Owl stone', note: 'A rock shaped like the owl of Athena, the old symbol of wisdom. Ear tufts droop when worried; a marigold beak.', Comp: Hin3, isNew: true },
  { key: '4', name: 'Diogenes’ lantern', note: 'Diogenes walked Athens by day with a lamp, looking for an honest person. Hin’s lantern glows brighter as it relaxes.', Comp: Hin4, isNew: true },
  { key: '5', name: 'Journal slate', note: 'Marcus Aurelius’ Meditations was a private notebook. Hin keeps one too, and writes in it while listening. Fits the evening review.', Comp: Hin5, isNew: true },
  { key: '6', name: 'Kintsugi stone', note: 'Cracks mended with gold: what broke you becomes part of your strength. Gold is ooca’s Marigo.', Comp: Hin6, isNew: true },
]
