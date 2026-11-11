import { useRef, useState } from 'react'
import PhoneIcon from './PhoneIcon'
import { toPng } from 'html-to-image'
import {
  actions,
  batteries,
  minds,
  tiers,
  weathers,
  t,
  ui,
  type Answers,
  type Lang,
  type Report as ReportData,
} from '../content'
import type { Entry } from '../history'
import Breathing from './Breathing'
import Mooca from './Mooca'
import WeatherIcon from './WeatherIcon'

type SaveState = 'idle' | 'saving' | 'error'

export default function Report({
  lang,
  answers,
  report,
  history,
  onRestart,
  onHelp,
}: {
  lang: Lang
  answers: Answers
  report: ReportData
  history: Entry[]
  onRestart: () => void
  onHelp: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [save, setSave] = useState<SaveState>('idle')
  const [actionDone, setActionDone] = useState(false)
  const [showBreathing, setShowBreathing] = useState(report.action === 'breathe')

  const w = report.weather
  const wordIndex = answers.word ? weathers[w].words.en.indexOf(answers.word) : -1
  const word = wordIndex >= 0 ? weathers[w].words[lang][wordIndex] : null
  const mind = answers.mind.filter((m) => m !== 'none')
  const action = actions[report.action]
  const tier = tiers[report.tier]
  const heavy = w === 'rainy' || w === 'stormy'
  const date = new Date().toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  async function saveCard() {
    if (!cardRef.current) return
    setSave('saving')
    try {
      const url = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true })
      const a = document.createElement('a')
      a.href = url
      a.download = `inner-weather-${new Date().toISOString().slice(0, 10)}.png`
      a.click()
      setSave('idle')
    } catch {
      setSave('error')
    }
  }

  return (
    <div className="report">
      <div ref={cardRef} className={`report-card report-card--${w}`}>
        <div className="report-card__top">
          <span className="report-card__kicker">{t(ui.reportKicker, lang)}</span>
          <span className="report-card__date">{date}</span>
        </div>
        <div className="report-card__hero">
          <Mooca weather={w} friend={heavy} size={190} title={t(weathers[w].label, lang)} />
        </div>
        <h1 className="report-card__title">
          {t(weathers[w].label, lang)}
          {word && <span className="report-card__word"> · {word}</span>}
        </h1>
        <dl className="report-card__meta">
          {answers.battery && (
            <div>
              <dt>{t(ui.batteryLabel, lang)}</dt>
              <dd>
                <span className={`mini-battery mini-battery--${answers.battery}`} aria-hidden="true" />
                {t(batteries[answers.battery].label, lang)}
              </dd>
            </div>
          )}
          {mind.length > 0 && (
            <div>
              <dt>{t(ui.onMindLabel, lang)}</dt>
              <dd className="report-card__tags">
                {mind.map((m) => (
                  <span key={m} className="tag">
                    {t(minds[m], lang)}
                  </span>
                ))}
              </dd>
            </div>
          )}
        </dl>
        <div className="report-card__insight">
          <h2>{t(ui.insightTitle, lang)}</h2>
          {report.insight.map((line, i) => (
            <p key={i}>{t(line, lang)}</p>
          ))}
        </div>
        <div className="report-card__brand">
          <span className="logo-word">ooca</span>
          <span>{t(ui.brand, lang)}</span>
        </div>
      </div>

      <section className="panel panel--action" aria-labelledby="action-title">
        <span className="panel__eyebrow">{t(ui.actionTitle, lang)}</span>
        <h2 id="action-title" className="panel__title">
          {t(showBreathing ? actions.breathe.title : action.title, lang)}
        </h2>
        <p className="panel__body">{t(showBreathing ? actions.breathe.body : action.body, lang)}</p>
        {showBreathing ? (
          <Breathing lang={lang} weather={w} onDone={() => setActionDone(true)} />
        ) : actionDone ? (
          <p className="done-note" role="status">
            <span className="done-note__dot" aria-hidden="true">✓</span>
            {t(ui.didIt, lang)}
          </p>
        ) : (
          <div className="panel__actions">
            <button type="button" className="btn btn--primary" onClick={() => setActionDone(true)}>
              {t(ui.done, lang)}
            </button>
            <button type="button" className="btn btn--link" onClick={() => setShowBreathing(true)}>
              {t(ui.tryBreathing, lang)}
            </button>
          </div>
        )}
      </section>

      <section className={`panel panel--next panel--${report.tier}`} aria-labelledby="next-title">
        <span className="panel__eyebrow">{t(ui.nextTitle, lang)}</span>
        {report.tier === 'care' && (
          <div className="panel__mooca" aria-hidden="true">
            <Mooca weather="partly" size={96} effects={false} />
          </div>
        )}
        <h2 id="next-title" className="panel__title">
          {t(tier.title, lang)}
        </h2>
        <p className="panel__body">{t(tier.body, lang)}</p>
        <div className="panel__actions">
          {report.tier === 'care' ? (
            <>
              <a className="btn btn--primary" href="https://www.ooca.co/" target="_blank" rel="noreferrer">
                {t(tier.cta, lang)}
              </a>
              <button type="button" className="btn btn--secondary" onClick={saveCard} disabled={save === 'saving'}>
                {t(save === 'saving' ? ui.saving : ui.saveCard, lang)}
              </button>
            </>
          ) : (
            <button type="button" className="btn btn--primary" onClick={saveCard} disabled={save === 'saving'}>
              {save === 'saving' && <span className="spinner" aria-hidden="true" />}
              {t(save === 'saving' ? ui.saving : tier.cta, lang)}
            </button>
          )}
        </div>
        {save === 'error' && (
          <p className="inline-error" role="alert">
            {t(ui.saveError, lang)}
          </p>
        )}
      </section>

      {w === 'stormy' && (
        <button type="button" className="safety-note" onClick={onHelp}>
          <span className="safety-note__icon" aria-hidden="true"><PhoneIcon /></span>
          {t(ui.stormyNote, lang)}
        </button>
      )}

      {history.length > 1 && (
        <section className="history" aria-label={t(ui.recent, lang)}>
          <h2 className="history__title">{t(ui.recent, lang)}</h2>
          <ol className="history__list">
            {history.map((e) => (
              <li key={e.at} title={new Date(e.at).toLocaleDateString()}>
                <WeatherIcon weather={e.weather} size={32} />
                <span>
                  {new Date(e.at).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-GB', { weekday: 'short' })}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <button type="button" className="btn btn--ghost btn--block" onClick={onRestart}>
        {t(ui.restart, lang)}
      </button>
    </div>
  )
}
