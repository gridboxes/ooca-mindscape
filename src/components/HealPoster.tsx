import { useEffect, useRef, useState } from 'react'
import { t, type Lang } from '../content'
import { companions, fill, type Companion, type Theme } from '../mindscape-content'
import { heal, lessonFor } from '../heal-content'
import Avatar from './companions/Avatar'
import Stores from './Stores'
import { storeUrl } from './store-links'
import { BookScreen, ChatScreen, GardenHome, Phone, PlayerScreen } from './HealPhones'
import '../heal.css'

// The phone tours the app once on its own: the garden's home, then into Chat, Listen and Talk,
// and back home, where it stays. Each screen stays a few seconds.
const SCREENS = 4
const STAY_MS = [3400, 3800, 3800, 3800]

/**
 * The next step up, as a poster: carry on with the same friend in ooca Garden. It takes the
 * landscape's place on the ending page (a compact banner under the card on phones). One page, no
 * carousel controls: the phone slides from the home screen into each feature and back, and the
 * Chat · Listen · Talk chips light in step (tap one to jump there). Never shown when the next step
 * is a psychologist.
 */
export default function HealPoster({ lang, who, theme, compact = false }: { lang: Lang; who: Companion; theme: Theme; compact?: boolean }) {
  const T = (s: Record<Lang, string>) => t(s, lang)
  // 0 home, 1 chat, 2 listen, 3 talk
  const [shown, setShown] = useState(0)
  const [still, setStill] = useState(false)
  const [touring, setTouring] = useState(true)
  // the phone shrinks to fit the space it has, so it never covers the button below
  const show = useRef<HTMLDivElement>(null)
  const phone = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState(1)
  const name = T(companions[who].name)
  const lesson = lessonFor(who, theme)
  const store = storeUrl()

  useEffect(() => setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches), [])
  useEffect(() => {
    if (compact || still || !touring) return
    const id = window.setTimeout(() => {
      const next = (shown + 1) % SCREENS
      setShown(next)
      // one tour, then rest on the home screen
      if (next === 0) setTouring(false)
    }, STAY_MS[shown])
    return () => window.clearTimeout(id)
  }, [compact, still, touring, shown])

  useEffect(() => {
    if (compact || !show.current || !phone.current) return
    const room = show.current
    const tall = phone.current.offsetHeight
    const measure = () => setFit(Math.min(1, room.clientHeight / tall))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(room)
    return () => ro.disconnect()
  }, [compact])

  const lessonChip = (
    <a className="poster__lesson" href={store} target="_blank" rel="noopener noreferrer">
      <i className="poster__play" aria-hidden="true" />
      <span>
        <b>{T(lesson.title)}</b>
        {fill(T(heal.min), { n: String(lesson.minutes) })} · {T(heal.pickedFor)}
      </span>
    </a>
  )

  if (compact) {
    return (
      <aside className={`poster poster--compact poster--${who}`} aria-labelledby="poster-title-c">
        <div className="poster__row">
          <Avatar who={who} mood="delighted" size={64} />
          <div>
            <span className="poster__new">✦ {T(heal.newIn)}</span>
            <h3 id="poster-title-c" className="poster__title">
              {fill(T(heal.carryTitle), { name })}
            </h3>
          </div>
        </div>
        {lessonChip}
        <a className="btn btn--primary btn--block" href={store} target="_blank" rel="noopener noreferrer">
          {T(heal.carryCta)}
        </a>
        <span className="poster__note">{T(heal.carryNote)}</span>
      </aside>
    )
  }

  return (
    <aside className={`poster poster--${who}`} aria-labelledby="poster-title">
      <span className="poster__sun" aria-hidden="true" />
      <span className="poster__cloud" aria-hidden="true" />

      <div className="poster__head">
        <span className="poster__new">✦ {T(heal.newIn)}</span>
        <h2 id="poster-title" className="poster__title">
          {fill(T(heal.carryTitle), { name })}
        </h2>
        <ul className="poster__feats">
          {[heal.featChat, heal.featListen, heal.featTalk].map((f, i) => (
            <li key={f.en}>
              <button
                type="button"
                className={i + 1 === shown ? 'is-on' : ''}
                aria-pressed={i + 1 === shown}
                onClick={() => {
                  setTouring(false)
                  setShown(i + 1 === shown ? 0 : i + 1)
                }}
              >
                <FeatIcon i={i} />
                {T(f)}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="poster__show" ref={show}>
        <div className="poster__phone" ref={phone} style={{ transform: `scale(${fit})` }}>
          <Phone>
            <div className="poster__screens">
              <div className="poster__strip" style={{ transform: `translateX(${-shown * 25}%)` }}>
                <div className="poster__pane">
                  <GardenHome
                    lang={lang}
                    who={who}
                    lesson={lesson}
                    onTalk={() => {
                      setTouring(false)
                      setShown(3)
                    }}
                  />
                </div>
                <div className="poster__pane">
                  <ChatScreen lang={lang} />
                </div>
                <div className="poster__pane">
                  <PlayerScreen lang={lang} />
                </div>
                <div className="poster__pane">
                  <BookScreen lang={lang} />
                </div>
              </div>
            </div>
          </Phone>
        </div>
      </div>

      {/* Get the app: the store buttons, as on ooca Garden's page */}
      <div className="poster__ask">
        <span className="poster__ask-line">{T(heal.cardComes)}</span>
        <Stores lang={lang} />
        <span className="poster__note">{T(heal.trial)}</span>
      </div>
    </aside>
  )
}

/** Small line icons for the Chat · Listen · Talk chips: a bubble, headphones, and a heart in a bubble */
function FeatIcon({ i }: { i: number }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
  return (
    <svg className="poster__feat-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      {i === 0 ? (
        <path {...p} d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8l-5 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      ) : i === 1 ? (
        <>
          <path {...p} d="M4 15v-3a8 8 0 0 1 16 0v3" />
          <rect {...p} x="3" y="14" width="4" height="7" rx="2" />
          <rect {...p} x="17" y="14" width="4" height="7" rx="2" />
        </>
      ) : (
        <>
          <path {...p} d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8l-5 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
          <path {...p} d="M12 14s-3.5-2-3.5-4.5a2 2 0 0 1 3.5-1.3 2 2 0 0 1 3.5 1.3C15.5 12 12 14 12 14z" />
        </>
      )}
    </svg>
  )
}
