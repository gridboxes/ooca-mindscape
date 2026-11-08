import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { t, ui, type Lang } from '../content'
import { fill, ms } from '../mindscape-content'

/**
 * Where a screen sits within its part (its step of the room, say). The bar lives in Mindscape
 * and stays mounted from screen to screen, so it glides instead of jumping; each screen just
 * reports where it is with <StepTop>.
 */

interface Place {
  step: number
  total: number
}

interface JourneyValue {
  report: (place: Place, onBack: () => void) => void
}

const Journey = createContext<JourneyValue>({ report: () => {} })

/** Where a screen sits within its part, and what back does from there */
export default function StepTop({ onBack, step = 1, total = 1 }: { lang?: Lang; onBack: () => void; step?: number; total?: number }) {
  const { report } = useContext(Journey)
  useLayoutEffect(() => {
    report({ step, total }, onBack)
  })
  return null
}

/** Holds the journey's place for the bar, so the screens below can report into it */
export function useJourney() {
  const [place, setPlace] = useState<Place>({ step: 1, total: 1 })
  const back = useRef<() => void>(() => {})
  const value = useRef<JourneyValue>({
    report: (p, onBack) => {
      back.current = onBack
      setPlace((cur) => (cur.step === p.step && cur.total === p.total ? cur : p))
    },
  }).current
  return { place, back, value }
}

export const JourneyProvider = Journey.Provider

interface BarProps {
  lang: Lang
  place: Place
  onBack: () => void
  /** who you're with, on a room's first step */
  intro?: string
}

/**
 * The row above every step: back, then where you are. In a room it names who you're with; when a
 * part has more than one step, dots show how many are left in it. No whole-journey bar: the question
 * people actually have is "how much more of this?", not how far through the check-in they are.
 */
export function JourneyBar({ lang, place, onBack, intro }: BarProps) {
  return (
    <div className="ms-journey">
      <div className="flow__top">
        <button type="button" className="icon-btn" onClick={onBack} aria-label={t(ms.back, lang)}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M15 5 l-7 7 l7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {intro && <p className="ms-journey__label">{intro}</p>}
        {place.total > 1 && (
          <div
            className="ms-journey__dots"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={place.total}
            aria-valuenow={place.step}
            aria-label={fill(t(ui.stepOf, lang), { n: String(place.step), t: String(place.total) })}
          >
            {Array.from({ length: place.total }, (_, i) => (
              <span key={i} className={i < place.step - 1 ? 'is-on' : i === place.step - 1 ? 'is-on is-now' : undefined} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Each new step starts with the landscape in view (it changes with the answers) and moves
 * focus to the step's heading, so screen readers follow along.
 */
export function useStepChange(key: unknown) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const h = document.querySelector<HTMLElement>('.ms__card h1')
    if (!h) return
    h.setAttribute('tabindex', '-1')
    h.focus({ preventScroll: true })
  }, [key])
}
