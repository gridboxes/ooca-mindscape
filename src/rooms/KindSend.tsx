import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import type { Lang } from '../content'
import { CIRCLES, bua, circles, wishes, type Wish } from './bua-content'

// The same heart that stays with each friend on the landscape
const HEART = 'M0 9 C-15 -3 -12 -18 0 -10.5 C12 -18 15 -3 0 9 Z'

/** How long the hold takes to reach each circle; one unbroken hold reaches all three */
const HOLD_MS = 1500

interface Props {
  lang: Lang
  wish: Wish
  /** circles reached so far, kept by the room so it survives going back */
  sent: number
  onSent: (n: number) => void
}

/**
 * Pass kindness on in widening circles. One hold carries the wish outward: to you, then someone
 * you love, then everyone, each circle sending its ripple across the landscape as the hold reaches
 * it. Letting go keeps the circles already reached; holding again carries on from there. Space or
 * Enter works the same way from the keyboard.
 */
export default function KindSend({ lang, wish, sent, onSent }: Props) {
  const [holding, setHolding] = useState(false)
  const [early, setEarly] = useState(false)
  // how far into the current circle the hold is, 0 to 1
  const [p, setP] = useState(0)
  const start = useRef(0)
  const raf = useRef(0)
  const timer = useRef(0)
  // circles reached, ahead of the prop, so a hold can carry on from circle to circle
  const reachedRef = useRef(sent)
  // circles reached when this hold began, to tell a too-short hold from one that got somewhere
  const pressedAt = useRef(sent)
  const T = (s: Record<Lang, string>) => s[lang]
  const done = sent >= CIRCLES.length
  const next = CIRCLES[Math.min(sent, CIRCLES.length - 1)]

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current)
      window.clearTimeout(timer.current)
    },
    [],
  )

  // Frames only draw the fill; the timer decides when a circle is reached, so it still counts
  // if the browser stops drawing frames
  function tick() {
    setP(Math.min(1, (performance.now() - start.current) / HOLD_MS))
    raf.current = requestAnimationFrame(tick)
  }

  /** Start filling toward the next circle; when it's reached, carry straight on to the one after */
  function reach() {
    start.current = performance.now()
    setP(0)
    timer.current = window.setTimeout(() => {
      reachedRef.current += 1
      onSent(reachedRef.current)
      if (reachedRef.current < CIRCLES.length) reach()
      else stop()
    }, HOLD_MS)
  }

  function stop() {
    cancelAnimationFrame(raf.current)
    window.clearTimeout(timer.current)
    setHolding(false)
    setP(0)
  }

  function press() {
    if (holding || done) return
    reachedRef.current = sent
    pressedAt.current = sent
    setEarly(false)
    setHolding(true)
    raf.current = requestAnimationFrame(tick)
    reach()
  }

  function release() {
    if (!holding) return
    // let go before even the first circle of this hold: say so; otherwise what's reached stays
    setEarly(reachedRef.current === pressedAt.current)
    stop()
  }

  function key(e: KeyboardEvent<HTMLButtonElement>, down: boolean) {
    if (e.key !== ' ' && e.key !== 'Enter') return
    e.preventDefault()
    if (down && !e.repeat) press()
    if (!down) release()
  }

  // the button fills across the whole journey, not just the current circle
  const total = (Math.min(sent, CIRCLES.length) + (holding ? p : 0)) / CIRCLES.length
  const reached = sent === 0 ? null : sent === 1 ? bua.reachedMe : sent === 2 ? bua.reachedThem : bua.reachedAll

  return (
    <div className="kind">
      <ol className="kind__circles" aria-label={T(bua.qKind)}>
        {CIRCLES.map((c, i) => (
          <li
            key={c}
            className={i < sent ? 'is-sent' : i === sent ? `is-next${holding ? ' is-reaching' : ''}` : ''}
            style={i === sent && holding ? { ['--p' as string]: p } : undefined}
          >
            <span className="kind__heart" aria-hidden="true">
              <svg viewBox="-16 -19 32 30">
                <path className="kind__heart-line" d={HEART} />
                <path className="kind__heart-fill" d={HEART} />
              </svg>
            </span>
            <span className="kind__to">{T(circles[c])}</span>
          </li>
        ))}
      </ol>

      <p className="kind__phrase" aria-live="polite">
        {T(wishes[wish][done ? 'all' : next])}
      </p>
      {!done && <p className="kind__how">{T(bua.sayIt)}</p>}

      {!done && (
        <button
          type="button"
          className={`btn btn--secondary kind__hold${holding ? ' is-holding' : ''}`}
          style={{ ['--p' as string]: total }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            press()
          }}
          onPointerUp={release}
          onPointerCancel={release}
          onKeyDown={(e) => key(e, true)}
          onKeyUp={(e) => key(e, false)}
          onContextMenu={(e) => e.preventDefault()}
        >
          {holding ? `${T(bua.sending)} ${T(circles[next])}` : T(sent === 0 ? bua.holdSend : bua.holdOn)}
        </button>
      )}
      {early && !holding && <p className="kind__early">{T(bua.holdLonger)}</p>}
      {reached && !early && (
        <p className="kind__reached" role="status" key={sent}>
          {T(reached)}
        </p>
      )}
    </div>
  )
}
