import { useEffect, useRef, useState } from 'react'
import type { Lang } from '../content'
import { bua } from './bua-content'

const IN_MS = 4000
const OUT_MS = 5000

type Phase = 'idle' | 'in' | 'out' | 'paused' | 'done'

interface Props {
  lang: Lang
  total?: number
  /** breaths completed so far, kept by the room so it survives going back */
  count: number
  onBreath: (n: number) => void
}

/**
 * Five slow breaths with a lotus lamp, guided: tap once and follow the light. Its glow swells
 * for four seconds while you breathe in and shrinks for five while you breathe out, five times
 * over, so there's nothing to hold and nothing to get wrong. Tapping again pauses. The flame
 * grows with every breath.
 */
export default function Lamp({ lang, total = 5, count, onBreath }: Props) {
  const [phase, setPhase] = useState<Phase>(count >= total ? 'done' : 'idle')
  // how far through the current in- or out-breath, 0 to 1
  const [p, setP] = useState(0)
  const start = useRef(0)
  const raf = useRef(0)
  const timer = useRef(0)
  // breaths done, ahead of the prop, so the cycle can run on by itself
  const done = useRef(count)
  const T = (s: Record<Lang, string>) => s[lang]

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current)
      window.clearTimeout(timer.current)
    },
    [],
  )

  // Frames only draw the light; the timers move the breath on, so it keeps time even if
  // the browser stops drawing frames
  function draw(ms: number) {
    const tick = () => {
      setP(Math.min(1, (performance.now() - start.current) / ms))
      raf.current = requestAnimationFrame(tick)
    }
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(tick)
  }

  function breatheIn() {
    start.current = performance.now()
    setP(0)
    setPhase('in')
    draw(IN_MS)
    timer.current = window.setTimeout(breatheOut, IN_MS)
  }

  function breatheOut() {
    start.current = performance.now()
    setP(0)
    setPhase('out')
    draw(OUT_MS)
    timer.current = window.setTimeout(() => {
      done.current += 1
      onBreath(done.current)
      if (done.current >= total) {
        cancelAnimationFrame(raf.current)
        setPhase('done')
      } else breatheIn()
    }, OUT_MS)
  }

  /** Start, pause, or carry on; a paused breath starts again from the in-breath */
  function toggle() {
    if (phase === 'done') return
    if (phase === 'in' || phase === 'out') {
      cancelAnimationFrame(raf.current)
      window.clearTimeout(timer.current)
      setP(0)
      setPhase('paused')
      return
    }
    done.current = count
    breatheIn()
  }

  // The light swells with the in-breath and settles with the out-breath
  const breath = phase === 'in' ? p : phase === 'out' ? 1 - p : phase === 'done' ? 1 : 0
  const glow = 0.45 + 0.55 * ease(breath)
  // The flame grows breath by breath
  const flame = 0.35 + 0.65 * (count / total)
  const cue =
    phase === 'done'
      ? T(bua.settled)
      : phase === 'in'
        ? T(bua.breatheIn)
        : phase === 'out'
          ? T(bua.breatheOut)
          : phase === 'paused'
            ? T(bua.breathPaused)
            : T(bua.breathReady)
  const running = phase === 'in' || phase === 'out'

  return (
    <div className={`lamp lamp--${phase}`}>
      <button
        type="button"
        className="lamp__art"
        onClick={toggle}
        disabled={phase === 'done'}
        aria-label={running ? T(bua.breathPause) : phase === 'paused' ? T(bua.breathResume) : T(bua.breathBegin)}
      >
        <svg viewBox="0 0 200 200" width="170" height="170" aria-hidden="true">
          {/* the breath: a soft disc of light that grows as you breathe in and shrinks as you breathe out */}
          <circle cx="100" cy="100" r="92" fill="none" stroke="#FAD6D5" strokeWidth="2" strokeDasharray="2 6" />
          <circle className="lamp__breath" cx="100" cy="100" r="92" fill="#FDECEB" style={{ transform: `scale(${glow})` }} />
          <g className="lamp__glow" style={{ opacity: 0.3 + 0.6 * ease(breath) }}>
            <circle cx="100" cy="92" r={34 * flame + 10} fill="#FBE36A" opacity=".4" />
          </g>
          <g className="lamp__flame" style={{ ['--s' as string]: flame }}>
            <path d="M100 52 C112 70 116 84 110 96 C106 104 94 104 90 96 C84 84 88 70 100 52 Z" fill="#F9A000" />
            <path d="M100 68 C106 78 108 86 104 93 C102 97 98 97 96 93 C92 86 94 78 100 68 Z" fill="#FBE36A" />
          </g>
          <path d="M100 100 v6" stroke="#5B4A3A" strokeWidth="2.5" strokeLinecap="round" />
          {/* the lamp: a small lotus cup */}
          <path d="M58 112 C64 136 82 146 100 146 C118 146 136 136 142 112 Z" fill="#F6B9B6" />
          <path d="M70 112 C70 98 80 92 86 92 C88 102 86 110 82 116 Z" fill="#FAD0CE" />
          <path d="M130 112 C130 98 120 92 114 92 C112 102 114 110 118 116 Z" fill="#FAD0CE" />
          <path d="M100 104 C108 112 108 124 100 132 C92 124 92 112 100 104 Z" fill="#FFE6E5" />
          <ellipse cx="100" cy="150" rx="40" ry="6" fill="#26313C" opacity=".06" />
        </svg>
      </button>

      <p className="lamp__cue" aria-live="polite">
        {cue}
      </p>
      <div className="lamp__dots" role="img" aria-label={`${Math.min(count, total)} / ${total}`}>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={i < count ? 'is-on' : i === count && running ? 'is-now' : ''} />
        ))}
      </div>

      {phase !== 'done' && (
        <button type="button" className="btn btn--secondary lamp__go" onClick={toggle}>
          {running ? T(bua.breathPause) : phase === 'paused' ? T(bua.breathResume) : T(bua.breathBegin)}
        </button>
      )}
    </div>
  )
}

/** Breathing isn't linear: ease in and out so the light swells and settles softly */
function ease(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
}
