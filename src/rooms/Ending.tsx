import { useEffect, useRef, useState } from 'react'
import { toBlob } from 'html-to-image'
import { durations, t, tiers, ui, type Duration, type Lang, type Tier } from '../content'
import { ChipStep, Footer } from '../components/Steps'
import Breathing from '../components/Breathing'
import StepTop, { useStepChange } from './StepTop'
import Avatar from '../components/companions/Avatar'
import Postcard from './Postcard'
import { companions, ms, nextSteps, safetyLine, type Companion, type Theme } from '../mindscape-content'
import HealPoster from '../components/HealPoster'
import type { EndCard } from './end-card'

type Save = 'idle' | 'saving' | 'saved' | 'error'
type Sub = 'duration' | 'closing'

interface Props {
  lang: Lang
  who: Companion
  /** the kind of thought, so the ooca Garden lesson on offer fits it */
  theme: Theme
  /** the room's card: what it found, its quote and its small step */
  card: EndCard
  /** the room saw a heavy signal, so ask how long it's been */
  heavy: boolean
  /** the room's own read of the next step, given how long it's been */
  tierFor: (duration: Duration | null) => Tier
  onBack: () => void
  onRestart: () => void
  onHelp: () => void
  /** the card's page is open (or closed again), and its next step, so the poster knows whether to show */
  onFinal?: (open: boolean, tier: Tier) => void
}

const fileName = () => `mindscape-${new Date().toISOString().slice(0, 10)}.png`

// The small practice and the "next step" panel are switched off for now; the psychologist offer on the care tier always stays
const SHOW_SUGGESTIONS = false

export default function Ending({ lang, who, theme, card, heavy, tierFor, onBack, onRestart, onHelp, onFinal }: Props) {
  const subs: Sub[] = heavy ? ['duration', 'closing'] : ['closing']
  const [sub, setSub] = useState<Sub>(subs[0])
  const [duration, setDuration] = useState<Duration | null>(null)
  const [save, setSave] = useState<Save>('idle')
  // leave the original thought off the card, for saving or sharing without showing what you wrote
  const [hideThought, setHideThought] = useState(false)
  const [practiceDone, setPracticeDone] = useState(false)
  const [breathing, setBreathing] = useState(false)
  const [felt, setFelt] = useState<'yes' | 'no' | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  useStepChange(sub)

  const tierNow: Tier = tierFor(duration)
  useEffect(() => {
    onFinal?.(sub === 'closing', tierNow)
  }, [sub, tierNow, onFinal])
  useEffect(() => () => onFinal?.(false, 'keep'), [onFinal])

  const name = t(companions[who].name, lang)
  // mooca speaks in weather; the other rooms use plain words for the same next steps
  const steps = who === 'mooca' ? tiers : nextSteps
  const tier: Tier = tierFor(duration)
  const date = new Date().toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  const canShare = typeof navigator !== 'undefined' && 'canShare' in navigator
  const practice = card.practice

  function back() {
    const i = subs.indexOf(sub)
    if (i === 0) return onBack()
    setSub(subs[i - 1])
  }

  async function image() {
    if (!cardRef.current) throw new Error('no card')
    const blob = await toBlob(cardRef.current, { pixelRatio: 2, cacheBust: true })
    if (!blob) throw new Error('no image')
    return blob
  }

  async function saveCard() {
    setSave('saving')
    try {
      const url = URL.createObjectURL(await image())
      const a = document.createElement('a')
      a.href = url
      a.download = fileName()
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      setSave('saved')
    } catch {
      setSave('error')
    }
  }

  // The phone's own share sheet where it can take an image; otherwise saving is the fallback
  async function shareCard() {
    setSave('saving')
    try {
      const file = new File([await image()], fileName(), { type: 'image/png' })
      if (!navigator.canShare?.({ files: [file] })) return saveCard()
      await navigator.share({ files: [file], title: t(ms.brand, lang) })
      setSave('idle')
    } catch (e) {
      // Closing the share sheet isn't a failure
      setSave(e instanceof DOMException && e.name === 'AbortError' ? 'idle' : 'error')
    }
  }

  const top = <StepTop lang={lang} onBack={back} step={subs.indexOf(sub) + 1} total={subs.length} />

  if (sub === 'duration') {
    return (
      <div className={`ms-step ms-tone-${who}`}>
        {top}
        <div className="flow__body" key="duration">
          <ChipStep<Duration>
            lang={lang}
            title={t(ms.qDuration, lang)}
            sub={t(ui.qDurationSub, lang)}
            options={durations}
            selected={duration ? [duration] : []}
            multiple={false}
            onChange={(v) => setDuration(v[0])}
          />
        </div>
        <Footer>
          <button type="button" className="btn btn--primary btn--grow" disabled={!duration} onClick={() => setSub('closing')}>
            {t(ui.next, lang)}
          </button>
        </Footer>
      </div>
    )
  }

  return (
    <div className={`ms-step ms-ending ms-tone-${who}`}>
      {top}
      <div className="flow__body ms-final" key="closing">
        {/* The keepsake: the card, and saving it */}
        <div className="ms-final__keep">
          {/* the title sits in the top row, beside the back button (see JourneyBar) */}
          <Postcard ref={cardRef} lang={lang} who={who} name={name} date={date} postcard={card.postcard} hideBefore={hideThought} />

          <label className="ms-hide">
            <input type="checkbox" checked={hideThought} onChange={(e) => setHideThought(e.target.checked)} />
            <span className="ms-hide__switch" aria-hidden="true" />
            <span>{t(ms.hideThought, lang)}</span>
          </label>
          <div className="ms-save">
            <button type="button" className="btn btn--secondary btn--grow" onClick={saveCard} disabled={save === 'saving'}>
              {save === 'saving' && <span className="spinner" aria-hidden="true" />}
              {t(save === 'saving' ? ui.saving : save === 'saved' ? ms.saved : ms.saveImage, lang)}
              {save === 'saved' && ' ✓'}
            </button>
            {canShare && (
              <button type="button" className="btn btn--secondary btn--grow" onClick={shareCard} disabled={save === 'saving'}>
                {t(ms.share, lang)}
              </button>
            )}
          </div>
          {save === 'error' && (
            <p className="inline-error" role="alert">
              {t(ui.saveError, lang)}
            </p>
          )}
          {/* On phones the ooca Garden poster sits here, under the card; on a computer it takes the
              landscape's place beside it. Never when the next step is a psychologist. */}
          {tier !== 'care' && (
            <div className="ms-final__poster">
              <HealPoster lang={lang} who={who} theme={theme} compact />
            </div>
          )}
        </div>

        {/* What to do with it */}
        <div className="ms-final__next">
          {SHOW_SUGGESTIONS && practice && tier !== 'care' && (
            <section className="panel panel--action" aria-labelledby="practice-title">
              <span className="panel__eyebrow">{t(ui.actionTitle, lang)}</span>
              <h3 id="practice-title" className="panel__title">
                {practice.title}
              </h3>
              {practice.body && <p className="panel__body">{practice.body}</p>}
              {breathing || (practice.breathe && !practiceDone) ? (
                <Breathing lang={lang} weather={practice.breathe ?? 'partly'} onDone={() => setPracticeDone(true)} />
              ) : practiceDone ? (
                <p className="done-note" role="status">
                  <span className="done-note__dot" aria-hidden="true">
                    ✓
                  </span>
                  {t(ui.didIt, lang)}
                </p>
              ) : (
                <div className="panel__actions">
                  <button type="button" className="btn btn--secondary" onClick={() => setPracticeDone(true)}>
                    {t(ui.done, lang)}
                  </button>
                  {who === 'mooca' && (
                    <button type="button" className="btn btn--link" onClick={() => setBreathing(true)}>
                      {t(ui.tryBreathing, lang)}
                    </button>
                  )}
                </div>
              )}
            </section>
          )}

          {(SHOW_SUGGESTIONS || tier === 'care') && (
          <section className={`panel panel--next panel--${tier}`} aria-labelledby="next-title">
            {tier === 'care' && (
              <div className="panel__mooca" aria-hidden="true">
                <Avatar who={who} mood="happy" size={96} />
              </div>
            )}
            <span className="panel__eyebrow">{t(ui.nextTitle, lang)}</span>
            <h3 id="next-title" className="panel__title">
              {t(steps[tier].title, lang)}
            </h3>
            <p className="panel__body">{t(steps[tier].body, lang)}</p>
            {tier === 'care' && (
              <div className="panel__actions">
                <a className="btn btn--primary" href="https://www.ooca.co/" target="_blank" rel="noreferrer">
                  {t(steps.care.cta, lang)}
                </a>
              </div>
            )}
          </section>
          )}

          <section className="ms-felt" aria-labelledby="felt-q">
            <p id="felt-q" className="ms-felt__q">
              {t(ms.feedbackQ, lang)}
            </p>
            {felt ? (
              <p className="ms-felt__thanks" role="status">
                {t(felt === 'yes' ? ms.feedbackThanksYes : ms.feedbackThanksNo, lang)}
              </p>
            ) : (
              <div className="chips">
                <button type="button" className="chip" onClick={() => setFelt('yes')}>
                  {t(ms.feedbackYes, lang)}
                </button>
                <button type="button" className="chip" onClick={() => setFelt('no')}>
                  {t(ms.feedbackNo, lang)}
                </button>
              </div>
            )}
          </section>

          {tier === 'keep' ? (
            <button type="button" className="ms-safety ms-safety--quiet" onClick={onHelp}>
              {t(who === 'mooca' ? ui.stormyNote : safetyLine, lang)}
            </button>
          ) : (
            <button type="button" className="safety-note" onClick={onHelp}>
              <span className="safety-note__icon" aria-hidden="true">
                ☎
              </span>
              {t(who === 'mooca' ? ui.stormyNote : safetyLine, lang)}
            </button>
          )}

          <button type="button" className="btn btn--ghost btn--block ms-again" onClick={onRestart}>
            {t(ms.again, lang)}
          </button>
        </div>
      </div>
    </div>
  )
}
