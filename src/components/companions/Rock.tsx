import type { Expression } from './Face'
import { Frame, HIN_CHEEK, MARIGO, MARIGO_DARK, Paint, Scarf, SoftFace, SoftSprout, STONE, useIds } from './soft'

interface Props {
  mood?: Expression
  size?: number
  /** a Marigo scarf, the mark the three can share (the sandbox compares it; the flow goes without) */
  scarf?: boolean
  className?: string
  title?: string
}

// Hin, the warm stone: one smooth pebble with little feet and arms, in the new mooca's finish
// (soft light and shade, no outlines, the shared face). Stones hold the sun's heat, so Hin cools
// to blue-grey when worried, and a small crack shows. Its sprout leans with the mood and flowers
// when happy. At rest it breathes slowly, its sprout nods and it blinks now and then.

// Ten gentle sides; a wide round-joined stroke in the same paint wears every corner smooth
const BODY = '90,72 140,68 178,86 194,118 192,158 168,182 120,188 72,182 48,156 48,108'

export default function Rock({ mood = 'calm', size = 220, scarf = false, className = '', title = 'Hin the rock' }: Props) {
  const ids = useIds()
  const tone = STONE[mood]
  const fill = `url(#${ids.soft})`
  const tilt = mood === 'listening' ? -4 : mood === 'thinking' ? 5 : 0
  return (
    <Frame
      size={size}
      title={title}
      className={`rock rock--${mood} ${className}`}
      ids={ids}
      defs={<Paint id={ids.soft} tone={tone} />}
      groundAt={
        // one soft shadow, right where the feet end (y 206 once Hin is scaled), so Hin stands on the ground
        <ellipse cx="120" cy="205" rx="62" ry="6" fill="#7C83A8" opacity=".14" />
      }
    >
      {/* Hin is drawn at 90%, anchored on the ground line, so it sits a touch smaller than its friends */}
      <g transform="translate(12 20.8) scale(0.9)">
        <g transform={`rotate(${tilt} 120 196)`}>
          <rect x="82" y="182" width="26" height="24" rx="12" fill={tone.shade} />
          <rect x="134" y="182" width="26" height="24" rx="12" fill={tone.shade} />
          <ellipse cx="38" cy="156" rx="10" ry="15" transform="rotate(28 38 156)" fill={fill} />
          <ellipse cx="202" cy="156" rx="10" ry="15" transform="rotate(-28 202 156)" fill={fill} />
          {/* everything above the feet breathes, slowly */}
          <g className="idle-breathe">
            <polygon points={BODY} fill={fill} stroke={fill} strokeWidth="18" strokeLinejoin="round" />
            {/* a soft core shadow low on the far side, and the lit top */}
            <ellipse cx="160" cy="166" rx="40" ry="16" fill={tone.shade} opacity=".45" filter={`url(#${ids.blur})`} />
            <ellipse cx="92" cy="88" rx="30" ry="13" fill="#fff" opacity=".75" filter={`url(#${ids.blur})`} transform="rotate(-20 92 88)" />
            <g fill={tone.shade} opacity=".6">
              <circle cx="170" cy="100" r="2.2" />
              <circle cx="180" cy="146" r="1.8" />
              <circle cx="66" cy="160" r="1.8" />
            </g>
            {mood === 'concerned' && (
              <path d="M166 90 l-7 11 l7 7 l-6 10" stroke={tone.shade} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            )}
            {/* the sprout grows from the stone's top edge */}
            <g transform="translate(0 19)">
              <g className="idle-sprout">
                <SoftSprout mood={mood} />
              </g>
            </g>
            {scarf && <Scarf x={120} y={164} w={116} color={MARIGO} dark={MARIGO_DARK} />}
            <SoftFace mood={mood} x={120} y={128} gap={24} cheek={HIN_CHEEK} blinkDelay="-2.4s" />
          </g>
        </g>
      </g>
    </Frame>
  )
}
