import { useEffect, useRef, useState } from 'react'
import { t, ui, type Lang, type Weather } from '../content'
import Mooca from './Mooca'

const IN = 4
const OUT = 6
const TOTAL = 60

type Phase = 'idle' | 'in' | 'out' | 'done'

export default function Breathing({
  lang,
  weather,
  onDone,
}: {
  lang: Lang
  weather: Weather
  onDone: () => void
}) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [elapsed, setElapsed] = useState(0)
  const timer = useRef<number | null>(null)

  useEffect(() => () => stop(), [])

  function stop() {
    if (timer.current) window.clearInterval(timer.current)
    timer.current = null
  }

  function start() {
    setElapsed(0)
    setPhase('in')
    const startedAt = Date.now()
    stop()
    timer.current = window.setInterval(() => {
      const s = (Date.now() - startedAt) / 1000
      if (s >= TOTAL) {
        stop()
        setElapsed(TOTAL)
        setPhase('done')
        onDone()
        return
      }
      setElapsed(s)
      setPhase(s % (IN + OUT) < IN ? 'in' : 'out')
    }, 200)
  }

  const running = phase === 'in' || phase === 'out'
  const cycleT = elapsed % (IN + OUT)
  const left = Math.ceil(phase === 'in' ? IN - cycleT : IN + OUT - cycleT)

  return (
    <div className={`breathe breathe--${phase}`}>
      <div className="breathe__stage" aria-hidden={!running}>
        <span className="breathe__ring" />
        <div className="breathe__mooca">
          {/* Sky clears as the minute goes on */}
          <Mooca weather={phase === 'done' ? 'sunny' : weather} size={150} effects={false} />
        </div>
      </div>

      {phase === 'idle' && (
        <button type="button" className="btn btn--primary btn--block" onClick={start}>
          {t(ui.breatheStart, lang)}
        </button>
      )}

      {running && (
        <>
          <p className="breathe__cue" aria-live="assertive">
            {t(phase === 'in' ? ui.breatheIn : ui.breatheOut, lang)} <span className="breathe__count">{left}</span>
          </p>
          <div className="breathe__bar" aria-hidden="true">
            <span style={{ width: `${(elapsed / TOTAL) * 100}%` }} />
          </div>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => {
              stop()
              setPhase('idle')
              setElapsed(0)
            }}
          >
            {t(ui.breatheStop, lang)}
          </button>
        </>
      )}

      {phase === 'done' && (
        <p className="breathe__cue breathe__cue--done" role="status">
          {t(ui.breatheDone, lang)}
        </p>
      )}
    </div>
  )
}
