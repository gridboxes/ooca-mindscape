import { useRef, type KeyboardEvent, type PointerEvent } from 'react'
import type { Lang } from '../content'
import { hin } from './hin-content'

interface Props {
  lang: Lang
  /** how high you've risen, 0 on the ground to 1 high above */
  value: number
  onChange: (v: number) => void
}

/**
 * Rise above it: drag the handle up and the camera climbs from Hin's ground until the whole
 * landscape is in view and the stone looks its real size. Tapping the track or using the arrow
 * keys works too.
 */
export default function Rise({ lang, value, onChange }: Props) {
  const track = useRef<HTMLDivElement>(null)
  const T = (s: Record<Lang, string>) => s[lang]

  function at(e: PointerEvent) {
    const r = track.current?.getBoundingClientRect()
    if (!r) return
    // The knob's centre travels between 28px from either end of the track
    onChange(Math.min(1, Math.max(0, (r.bottom - 28 - e.clientY) / (r.height - 56))))
  }

  function key(e: KeyboardEvent) {
    const steps: Record<string, number> = { ArrowUp: 0.1, ArrowRight: 0.1, PageUp: 0.25, ArrowDown: -0.1, ArrowLeft: -0.1, PageDown: -0.25 }
    if (e.key === 'Home') onChange(0)
    else if (e.key === 'End') onChange(1)
    else if (e.key in steps) onChange(Math.min(1, Math.max(0, value + steps[e.key])))
    else return
    e.preventDefault()
  }

  const line = value >= 0.95 ? hin.riseTop : value >= 0.4 ? hin.riseMid : hin.riseLow

  return (
    <div className="rise">
      <div
        ref={track}
        className="rise__track"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          at(e)
        }}
        onPointerMove={(e) => e.buttons && at(e)}
      >
        <span className="rise__fill" style={{ height: `calc(${value} * (100% - 56px) + 56px)` }} />
        <span
          className="rise__knob"
          role="slider"
          tabIndex={0}
          aria-label={T(hin.riseLabel)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(value * 100)}
          aria-valuetext={T(line)}
          style={{ bottom: `calc(${value} * (100% - 56px) + 2px)` }}
          onKeyDown={key}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M6 14 l6 -6 l6 6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      <p className="rise__line" aria-hidden="true" key={line.en}>
        {T(line)}
      </p>
    </div>
  )
}
