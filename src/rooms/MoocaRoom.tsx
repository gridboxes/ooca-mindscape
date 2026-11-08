import { useEffect, useMemo, useState } from 'react'
import { buildReport, emptyAnswers, ui, type Answers, type Lang, type MindKey, type Report, type Weather } from '../content'
import { Footer, WeatherStep } from '../components/Steps'
import StepTop, { useStepChange } from './StepTop'
import Says from './Says'
import WeatherIcon from '../components/WeatherIcon'
import { saveEntry } from '../history'
import { fill, type Theme } from '../mindscape-content'
import { CLEARER, UNSURE, findParts, mooca, presetParts, values, type Trap } from './mooca-content'
import Soften, { compose, softened, type Softening } from './Soften'

// The thought's theme stands in for Inner Weather's "what's on your mind", which picks the small step
const MIND_FROM_THEME: Record<Theme, MindKey[]> = {
  worth: ['self'],
  compare: ['self', 'people'],
  alone: ['people'],
  regret: ['self'],
  fear: ['future'],
  tired: ['work'],
  overthink: ['none'],
  meaning: ['self'],
  general: ['none'],
}

const STEPS = 3 // the weather, the silver lining, soften the forecast; the card is the shared ending's

export interface MoocaAnswers extends Answers {
  /** index into values[theme], or UNSURE */
  value: number | null
  soft: Softening
}

export interface MoocaResult {
  answers: MoocaAnswers
  report: Report
  /** the thought, softened */
  reframe: string
  /** what the worry hangs over, in the user's language */
  value: string | null
  /** the thinking traps the user softened */
  traps: Trap[]
  /** a heavy sky: worth asking how long it's been */
  heavy: boolean
}

interface Props {
  lang: Lang
  thought: string
  theme: Theme
  /** which of the door's thoughts this is, so its heavy words are the hand-marked ones */
  chip: number | null
  /** coming back from the ending: reopen on softening */
  resume?: MoocaAnswers
  /** mooca's sky: the weather picked here, clearing as the forecast softens */
  onSky: (w: Weather | null) => void
  /** the silver lining has been found: mooca's cloud glows at the edge */
  onGlow: (on: boolean) => void
  /** the paper note in the landscape rewrites itself as words soften */
  onNote: (text: string | null) => void
  onExit: () => void
  onDone: (r: MoocaResult) => void
}

export default function MoocaRoom({ lang, thought, theme, chip, resume, onSky, onGlow, onNote, onExit, onDone }: Props) {
  const [step, setStep] = useState(resume ? 2 : 0)
  const [reading, setReading] = useState(false)
  const [a, setA] = useState<MoocaAnswers>(
    () => resume ?? { ...emptyAnswers, mind: MIND_FROM_THEME[theme], value: null, soft: { swaps: {}, prefix: null } },
  )
  const T = (s: Record<Lang, string>) => s[lang]

  const parts = useMemo(() => (chip !== null ? presetParts[chip][lang] : findParts(thought, lang)), [chip, thought, lang])
  const now = compose(parts, a.soft, lang)
  const changes = softened(a.soft)

  // One notch of clearer sky per change, up to two
  let sky = a.weather
  if (sky && step === 2) for (let i = 0; i < Math.min(changes, 2); i++) sky = CLEARER[sky]
  useEffect(() => onSky(sky), [sky, onSky])
  const glow = step >= 1 && a.value !== null && a.value !== UNSURE
  useEffect(() => onGlow(glow), [glow, onGlow])
  useEffect(() => onNote(step === 2 && changes > 0 ? now : null), [step, changes, now, onNote])

  useStepChange(`${step}-${reading}`)

  const report = useMemo(() => buildReport(a), [a])
  const value = a.value !== null && a.value !== UNSURE ? T(values[theme][a.value]) : null

  const canNext = step === 0 ? !!a.weather : step === 1 ? a.value !== null : changes > 0

  function next() {
    if (step < 2) return setStep(step + 1)
    // A moment for the sky to redraw, then the card
    setReading(true)
    window.setTimeout(() => {
      saveEntry({ at: Date.now(), weather: report.weather, word: a.word })
      const traps = Object.keys(a.soft.swaps).flatMap((i) => {
        const p = parts[Number(i)]
        return typeof p === 'string' ? [] : [p.trap]
      })
      onDone({
        answers: a,
        report,
        reframe: now,
        value,
        traps: [...new Set(traps)],
        heavy: report.weather === 'rainy' || report.weather === 'stormy' || report.weather === 'foggy',
      })
    }, 1400)
  }

  function back() {
    if (step === 0) return onExit()
    setStep(step - 1)
  }

  if (reading) {
    return (
      <div className="ms-step ms-reading" role="status" aria-live="polite">
        <WeatherIcon weather={sky ?? 'partly'} size={64} />
        <h1 className="step-title">{T(mooca.reading)}</h1>
        <span className="dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </div>
    )
  }

  const hasHeavy = parts.some((p) => typeof p !== 'string')

  return (
    <div className="ms-step ms-room-mooca">
      <StepTop lang={lang} onBack={back} step={step + 1} total={STEPS} />

      <div className="flow__body" key={step}>
        {step === 0 && (
          <>
            <Says who="mooca" mood="tender">{fill(T(mooca.intro), { thought })}</Says>
            <WeatherStep
              lang={lang}
              weather={a.weather}
              word={a.word}
              onWeather={(w) => setA((p) => ({ ...p, weather: w, word: p.weather === w ? p.word : null }))}
              onWord={(w) => setA((p) => ({ ...p, word: w }))}
            />
          </>
        )}

        {step === 1 && (
          <>
            <header className="step-head">
              <h1 className="step-title">{T(mooca.qLining)}</h1>
              <p className="step-sub">{T(mooca.qLiningSub)}</p>
            </header>
            <p className="ms-lining__lead">{T(mooca.liningLead)}</p>
            <div className="ms-options" role="radiogroup" aria-label={T(mooca.qLining)}>
              {[...values[theme].map((v, i) => ({ i, label: T(v) })), { i: UNSURE, label: T(mooca.unsure) }].map(({ i, label }) => (
                <button
                  key={i}
                  type="button"
                  role="radio"
                  aria-checked={a.value === i}
                  className={`ms-option${a.value === i ? ' is-selected' : ''}`}
                  onClick={() => setA((p) => ({ ...p, value: i }))}
                >
                  <b>{label}</b>
                </button>
              ))}
            </div>
            {a.value !== null && (
              <Says who="mooca" mood="happy" key={a.value}>
                {T(a.value === UNSURE ? mooca.unsureSays : mooca.liningSays)}
              </Says>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <header className="step-head">
              <h1 className="step-title">{T(mooca.qSoften)}</h1>
              <p className="step-sub">{T(hasHeavy ? mooca.qSoftenSub : mooca.qSoftenSubNone)}</p>
            </header>
            <Soften lang={lang} parts={parts} value={a.soft} onChange={(soft) => setA((p) => ({ ...p, soft }))} />
            {changes > 0 && (
              <Says who="mooca" mood="delighted">
                {T(mooca.softenSays)}
              </Says>
            )}
          </>
        )}
      </div>

      <Footer>
        <button type="button" className="btn btn--primary btn--grow" disabled={!canNext} onClick={next}>
          {T(step === 2 ? mooca.seeCard : ui.next)}
        </button>
      </Footer>
    </div>
  )
}
