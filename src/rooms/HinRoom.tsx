import { useEffect, useState, type ReactNode } from 'react'
import { t, ui, type Lang } from '../content'
import { Footer } from '../components/Steps'
import StepTop, { useStepChange } from './StepTop'
import Rock from '../components/companions/Rock'
import type { Expression } from '../components/companions/Face'
import { fill, ms, type Theme } from '../mindscape-content'
import PebbleSort from './PebbleSort'
import Rise from './Rise'
import { hin, facts, JUST_A_FEELING, pebbles, virtues, years, type Bin, type Virtue, type Year } from './hin-content'

const STEPS = 4 // what happened, split the stone, turn it into a step, rise above it; the card is the shared ending's

export interface HinAnswers {
  /** index into facts[theme], or JUST_A_FEELING */
  fact: number | null
  places: (Bin | null)[]
  virtue: Virtue | null
  /** how high the user rose, 0 to 1 */
  lift: number
  year: Year | null
}

export interface HinResult {
  answers: HinAnswers
  /** it will still matter a lot in a year: worth asking how long it's been */
  heavy: boolean
}

/** What the landscape shows while Hin's room is open */
export interface HinStage {
  mood: Expression
  /** how far the camera has climbed from Hin's ground, 0 close up to 1 the whole landscape */
  lift: number
  /** stepping stones laid on Hin's hill: one for each pebble that's yours to move */
  steps: number
}

interface Props {
  lang: Lang
  thought: string
  theme: Theme
  /** coming back from the ending: reopen up high */
  resume?: HinAnswers
  onStage: (s: HinStage) => void
  onExit: () => void
  onDone: (r: HinResult) => void
}

function HinSays({ mood = 'listening', children }: { mood?: Expression; children: ReactNode }) {
  return (
    <div className="ms-says ms-says--hin">
      <span className="ms-says__who" aria-hidden="true">
        <Rock mood={mood} size={44} />
      </span>
      <p>{children}</p>
    </div>
  )
}

export default function HinRoom({ lang, thought, theme, resume, onStage, onExit, onDone }: Props) {
  const parts = pebbles[theme]
  const [step, setStep] = useState(resume ? 3 : 0)
  const [a, setA] = useState<HinAnswers>(() => resume ?? { fact: null, places: parts.map(() => null), virtue: null, lift: 0, year: null })
  const T = (s: Record<Lang, string>) => s[lang]

  const mine = parts.map((p, i) => (a.places[i] === 'mine' ? T(p) : null)).filter((p): p is string => !!p)
  const sorted = a.places.every((p) => p !== null)
  const high = a.lift >= 0.95

  // Hin weighs each pebble with you and brightens once everything has a place. Picking how to
  // step lays the stones on the hill; rising lifts the camera off the ground.
  useEffect(() => {
    let mood: Expression = 'listening'
    if (step === 1) mood = sorted ? 'delighted' : 'thinking'
    if (step === 2) mood = a.virtue ? 'happy' : 'listening'
    if (step === 3) mood = a.year === 'alot' ? 'tender' : high ? 'calm' : 'listening'
    onStage({
      mood,
      // the camera eases back a little so the path is in view, then climbs as you rise
      lift: step === 3 ? Math.max(a.lift, 0.45) : step === 2 && a.virtue ? 0.45 : 0,
      steps: step >= 2 && a.virtue ? Math.min(mine.length, 5) : 0,
    })
  }, [step, sorted, a.virtue, a.lift, a.year, high, mine.length, onStage])

  useStepChange(step)

  const canNext = step === 0 ? a.fact !== null : step === 1 ? sorted : step === 2 ? !!a.virtue || mine.length === 0 : !!a.year

  function next() {
    if (step < 3) setStep(step + 1)
  }

  function back() {
    if (step === 0) return onExit()
    setStep(step - 1)
  }

  function finish() {
    onDone({ answers: a, heavy: a.year === 'alot' })
  }

  let body: ReactNode
  if (step === 0) {
    body = (
      <>
        <HinSays mood="tender">{fill(T(hin.intro), { thought })}</HinSays>
        <header className="step-head">
          <h1 className="step-title">{T(hin.qFact)}</h1>
          <p className="step-sub">{T(hin.qFactSub)}</p>
        </header>
        <div className="ms-options" role="radiogroup" aria-label={T(hin.qFact)}>
          {[...facts[theme].map((f, i) => ({ i, label: T(f) })), { i: JUST_A_FEELING, label: T(hin.justAFeeling) }].map(
            ({ i, label }) => (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={a.fact === i}
                className={`ms-option${a.fact === i ? ' is-selected' : ''}`}
                onClick={() => setA({ ...a, fact: i })}
              >
                <b>{label}</b>
              </button>
            ),
          )}
        </div>
        {a.fact !== null && (
          <HinSays key={a.fact}>
            {a.fact === JUST_A_FEELING ? T(hin.feelingReply) : fill(T(hin.factReply), { thought })}
          </HinSays>
        )}
      </>
    )
  } else if (step === 1) {
    body = (
      <>
        <HinSays>{T(hin.sortSays)}</HinSays>
        <header className="step-head">
          <h1 className="step-title">{T(hin.qSort)}</h1>
          <p className="step-sub">{T(hin.qSortSub)}</p>
        </header>
        <PebbleSort lang={lang} labels={parts.map(T)} value={a.places} onChange={(places) => setA({ ...a, places })} />
      </>
    )
  } else if (step === 2) {
    body = (
      <>
        <header className="step-head">
          <h1 className="step-title">{T(hin.qStep)}</h1>
          {mine.length > 0 && <p className="step-sub">{T(hin.qStepSub)}</p>}
        </header>
        {mine.length ? (
          <>
            <p className="ms-steps-for">{fill(T(hin.forMine), { list: mine.join(' · ') })}</p>
            <div className="ms-options" role="radiogroup" aria-label={T(hin.qStep)}>
              {(Object.keys(virtues) as Virtue[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={a.virtue === v}
                  className={`ms-option${a.virtue === v ? ' is-selected' : ''}`}
                  onClick={() => setA({ ...a, virtue: v })}
                >
                  <b>{T(virtues[v].label)}</b>
                  <span>{T(virtues[v].step)}</span>
                </button>
              ))}
            </div>
            {a.virtue && (
              <HinSays mood="happy" key={a.virtue}>
                {T(hin.wayReply)}
              </HinSays>
            )}
          </>
        ) : (
          <HinSays>{T(hin.nothingMine)}</HinSays>
        )}
      </>
    )
  } else {
    body = (
      <>
        <header className="step-head">
          <h1 className="step-title">{T(hin.qRise)}</h1>
          <p className="step-sub">{T(hin.qRiseSub)}</p>
        </header>
        <Rise lang={lang} value={a.lift} onChange={(lift) => setA((prev) => ({ ...prev, lift }))} />
        {high && (
          <section className="ms-year" aria-live="polite">
            <h3 className="word-pick__title">{T(hin.qYearTop)}</h3>
            <div className="chips" role="radiogroup" aria-label={T(hin.qYearTop)}>
              {(Object.keys(years) as Year[]).map((y) => (
                <button
                  key={y}
                  type="button"
                  role="radio"
                  aria-checked={a.year === y}
                  className={`chip${a.year === y ? ' is-selected' : ''}`}
                  onClick={() => setA({ ...a, year: y })}
                >
                  {T(years[y].label)}
                </button>
              ))}
            </div>
          </section>
        )}
        {a.year && <HinSays key={a.year}>{T(a.year === 'alot' ? hin.yearHeavy : hin.yearLight)}</HinSays>}
      </>
    )
  }

  return (
    <div className="ms-step ms-room-hin">
      <StepTop lang={lang} onBack={back} step={step + 1} total={STEPS} />

      <div className="flow__body" key={step}>
        {body}
      </div>

      <Footer>
        {step < 3 ? (
          <button type="button" className="btn btn--primary btn--grow" disabled={!canNext} onClick={next}>
            {t(ui.next, lang)}
          </button>
        ) : (
          <button type="button" className="btn btn--primary btn--grow" disabled={!canNext} onClick={finish}>
            {t(ms.seeCard, lang)}
          </button>
        )}
      </Footer>
    </div>
  )
}
