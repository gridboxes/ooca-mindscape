import { useEffect, useMemo, useRef, useState } from 'react'
import {
  bodies,
  buildReport,
  durations,
  emptyAnswers,
  minds,
  reactions,
  t,
  ui,
  type Answers,
  type BodyKey,
  type Duration,
  type Lang,
  type MindKey,
  type Report as ReportData,
} from './content'
import { loadHistory, saveEntry, type Entry } from './history'
import Mooca from './components/Mooca'
import WeatherIcon from './components/WeatherIcon'
import Report from './components/Report'
import CrisisSheet from './components/CrisisSheet'
import { BatteryStep, ChipStep, Footer, Progress, WeatherStep } from './components/Steps'

type Screen = 'intro' | 'questions' | 'reading' | 'report'
const STEPS = 5
const LANG_KEY = 'ooca-inner-weather:lang'

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY)
    if (saved === 'en' || saved === 'th') return saved
  } catch {
    // ignore
  }
  return navigator.language?.startsWith('th') ? 'th' : 'en'
}

export default function App() {
  const [lang, setLang] = useState<Lang>(initialLang)
  const [screen, setScreen] = useState<Screen>('intro')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>(emptyAnswers)
  const [report, setReport] = useState<ReportData | null>(null)
  const [history, setHistory] = useState<Entry[]>(loadHistory)
  const [helpOpen, setHelpOpen] = useState(false)
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(LANG_KEY, lang)
    } catch {
      // ignore
    }
  }, [lang])

  // Move focus to the new heading so screen readers follow the flow
  useEffect(() => {
    window.scrollTo({ top: 0 })
    const h = mainRef.current?.querySelector<HTMLElement>('h1')
    h?.setAttribute('tabindex', '-1')
    h?.focus({ preventScroll: true })
  }, [screen, step])

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => setAnswers((a) => ({ ...a, [k]: v }))

  const canNext = useMemo(() => {
    switch (step) {
      case 0:
        return !!answers.weather
      case 1:
        return !!answers.battery
      case 2:
        return answers.body.length > 0
      case 3:
        return answers.mind.length > 0
      case 4:
        return !!answers.duration
    }
    return false
  }, [step, answers])

  const skippable = step === 2 || step === 3

  function next() {
    if (step < STEPS - 1) return setStep(step + 1)
    setScreen('reading')
    const r = buildReport(answers)
    window.setTimeout(() => {
      setReport(r)
      setHistory(saveEntry({ at: Date.now(), weather: r.weather, word: answers.word }))
      setScreen('report')
    }, 1600)
  }

  function back() {
    if (step === 0) return setScreen('intro')
    setStep(step - 1)
  }

  function restart() {
    setAnswers(emptyAnswers)
    setReport(null)
    setStep(0)
    setScreen('intro')
  }

  const sky = screen === 'report' ? report?.weather : answers.weather

  return (
    <div className="app" data-weather={sky ?? 'none'} data-screen={screen}>
      <div className="sky-bg" aria-hidden="true" />
      <header className="topbar">
        <button type="button" className="brand" onClick={restart} aria-label="ooca Inner Weather, start over">
          <span className="logo-word">ooca</span>
          <span className="brand__divider" aria-hidden="true" />
          <span className="brand__name">{t(ui.brand, lang)}</span>
        </button>
        <div className="topbar__right">
          <div className="lang" role="group" aria-label="Language">
            {(['th', 'en'] as Lang[]).map((l) => (
              <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button type="button" className="help-btn" onClick={() => setHelpOpen(true)}>
            <span aria-hidden="true">☎</span>
            <span className="help-btn__text">{t(ui.helpNow, lang)}</span>
          </button>
        </div>
      </header>

      <main ref={mainRef} className={`main main--${screen}`}>
        {screen === 'intro' && (
          <section className="intro">
            <div className="intro__art">
              <div className="bubble bubble--intro">{t(ui.introHi, lang)} 👋</div>
              <Mooca pose="wave" size={240} weather="partly" />
            </div>
            <div className="intro__copy">
              <h1 className="intro__title">{t(ui.introTitle, lang)}</h1>
              <p className="intro__body">{t(ui.introBody, lang)}</p>
              <ul className="intro__meta">
                <li>{t(ui.introMeta1, lang)}</li>
                <li>{t(ui.introMeta2, lang)}</li>
                <li>{t(ui.introMeta3, lang)}</li>
              </ul>
              <button type="button" className="btn btn--primary btn--lg" onClick={() => setScreen('questions')}>
                {t(ui.start, lang)}
              </button>
              <p className="fineprint">{t(ui.disclaimer, lang)}</p>
              {history.length > 0 && (
                <div className="intro__history">
                  <span>{t(ui.recent, lang)}</span>
                  <ol>
                    {history.map((e) => (
                      <li key={e.at}>
                        <WeatherIcon weather={e.weather} size={26} />
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </section>
        )}

        {screen === 'questions' && (
          <section className="flow">
            <aside className="flow__sky" aria-hidden="true">
              <div className="bubble" key={`${answers.weather}-${step}`}>
                {t(reactions[answers.weather ?? 'none'], lang)}
              </div>
              <Mooca weather={answers.weather} size={220} />
            </aside>
            <div className="flow__card">
              <div className="flow__top">
                <button type="button" className="icon-btn" onClick={back} aria-label={t(ui.back, lang)}>
                  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                    <path d="M15 5 l-7 7 l7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <Progress
                  step={step + 1}
                  total={STEPS}
                  label={t(ui.stepOf, lang).replace('{n}', String(step + 1)).replace('{t}', String(STEPS))}
                />
                <span className="flow__count">
                  {step + 1}/{STEPS}
                </span>
              </div>

              <div className="flow__body" key={step}>
                {step === 0 && (
                  <WeatherStep
                    lang={lang}
                    weather={answers.weather}
                    word={answers.word}
                    onWeather={(w) => setAnswers((a) => ({ ...a, weather: w, word: a.weather === w ? a.word : null }))}
                    onWord={(w) => set('word', w)}
                  />
                )}
                {step === 1 && <BatteryStep lang={lang} value={answers.battery} onChange={(b) => set('battery', b)} />}
                {step === 2 && (
                  <ChipStep<BodyKey>
                    lang={lang}
                    title={t(ui.qBody, lang)}
                    sub={t(ui.qBodySub, lang)}
                    options={bodies}
                    selected={answers.body}
                    multiple
                    exclusive="fine"
                    onChange={(v) => set('body', v)}
                  />
                )}
                {step === 3 && (
                  <ChipStep<MindKey>
                    lang={lang}
                    title={t(ui.qMind, lang)}
                    sub={t(ui.qMindSub, lang)}
                    options={minds}
                    selected={answers.mind}
                    multiple
                    exclusive="none"
                    onChange={(v) => set('mind', v)}
                  />
                )}
                {step === 4 && (
                  <ChipStep<Duration>
                    lang={lang}
                    title={t(ui.qDuration, lang)}
                    sub={t(ui.qDurationSub, lang)}
                    options={durations}
                    selected={answers.duration ? [answers.duration] : []}
                    multiple={false}
                    onChange={(v) => set('duration', v[0])}
                  />
                )}
              </div>

              <Footer>
                {skippable && !canNext && (
                  <button type="button" className="btn btn--ghost" onClick={next}>
                    {t(ui.skip, lang)}
                  </button>
                )}
                <button type="button" className="btn btn--primary btn--grow" disabled={!canNext} onClick={next}>
                  {t(step === STEPS - 1 ? ui.seeReport : ui.next, lang)}
                </button>
              </Footer>
            </div>
          </section>
        )}

        {screen === 'reading' && (
          <section className="reading" role="status" aria-live="polite">
            <div className="reading__mooca">
              <Mooca weather={answers.weather} size={200} />
            </div>
            <h1 className="reading__text">{t(ui.reading, lang)}</h1>
            <span className="dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </section>
        )}

        {screen === 'report' && report && (
          <Report
            lang={lang}
            answers={answers}
            report={report}
            history={history}
            onRestart={restart}
            onHelp={() => setHelpOpen(true)}
          />
        )}
      </main>

      <CrisisSheet lang={lang} open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}
