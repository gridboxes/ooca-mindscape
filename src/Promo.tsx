import { useEffect, useState } from 'react'
import { t, type Lang } from './content'
import Landscape from './components/Landscape'
import Avatar from './components/companions/Avatar'
import WeatherIcon from './components/WeatherIcon'
import { COMPANION_ORDER, companions } from './mindscape-content'
import { promo } from './promo-content'
import './mindscape.css'
import './promo.css'

const LANG_KEY = 'ooca-mindscape:lang'

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY)
    if (saved === 'en' || saved === 'th') return saved
  } catch {
    // ignore
  }
  return navigator.language?.startsWith('th') ? 'th' : 'en'
}

/**
 * The promo page: Mindscape announced inside ooca's world, for the website, LINE and corporate
 * newsletters. Short on purpose: what it is, the three friends, what you leave with, try it.
 */
export default function Promo() {
  const [lang, setLang] = useState<Lang>(initialLang)
  const T = (s: Record<Lang, string>) => t(s, lang)
  const tryIt = location.pathname

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = T(promo.pageTitle)
    try {
      localStorage.setItem(LANG_KEY, lang)
    } catch {
      // ignore
    }
  }, [lang])

  return (
    <div className="app promo">
      <div className="sky-bg" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href={tryIt} aria-label="ooca Mindscape">
          <span className="logo-word">ooca</span>
          <span className="brand__divider" aria-hidden="true" />
          <span className="brand__name">{T(promo.brand)}</span>
        </a>
        <div className="topbar__right">
          <div className="lang" role="group" aria-label="Language">
            {(['th', 'en'] as Lang[]).map((l) => (
              <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <a className="btn btn--primary promo__top-cta" href={tryIt}>
            {T(promo.tryShort)}
          </a>
        </div>
      </header>

      <main className="promo__main">
        {/* What it is */}
        <section className="promo__hero">
          <div className="promo__hero-copy">
            <span className="promo__new">{T(promo.newIn)}</span>
            <h1 className="promo__title">{T(promo.heroTitle)}</h1>
            <p className="promo__lead">{T(promo.heroLead)}</p>
            <a className="btn btn--primary btn--lg promo__cta" href={tryIt}>
              {T(promo.tryFree)}
            </a>
            <ul className="intro__meta promo__meta">
              <li>{T(promo.meta1)}</li>
              <li>{T(promo.meta2)}</li>
              <li>{T(promo.meta3)}</li>
            </ul>
          </div>
          <div className="promo__hero-art" aria-hidden="true">
            <Landscape focus="all" fit="slice" rockMood="happy" lotusMood="happy" moocaWeather="sunny" note={T(promo.sampleThought)} />
          </div>
        </section>

        {/* The three friends */}
        <section className="promo__section" aria-labelledby="promo-friends">
          <h2 id="promo-friends" className="promo__h2">
            {T(promo.friendsTitle)}
          </h2>
          <p className="promo__sub">{T(promo.friendsSub)}</p>
          <ul className="promo__friends">
            {COMPANION_ORDER.map((c) => (
              <li key={c} className={`promo__friend promo__friend--${c}`}>
                <Avatar who={c} mood="happy" size={88} />
                <b>{T(companions[c].name)}</b>
                <span className="promo__lens">{T(companions[c].lens)}</span>
                <p>{T(promo.does[c])}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* What you leave with */}
        <section className="promo__section promo__leave" aria-labelledby="promo-leave">
          <div>
            <h2 id="promo-leave" className="promo__h2">
              {T(promo.leaveTitle)}
            </h2>
            <ul className="promo__points">
              <li>
                <b>{T(promo.point1)}</b>
                {T(promo.point1Body)}
              </li>
              <li>
                <b>{T(promo.point2)}</b>
                {T(promo.point2Body)}
              </li>
              <li>
                <b>{T(promo.point3)}</b>
                {T(promo.point3Body)}
              </li>
            </ul>
          </div>
          {/* A sample of the card people keep */}
          <div className="ms-card ms-card--mooca promo__sample" aria-hidden="true">
            <div className="ms-card__top">
              <span>{T(promo.sampleKicker)}</span>
            </div>
            <div className="ms-card__who">
              <Avatar who="mooca" mood="happy" size={56} />
              <span>{T(promo.sampleWith)}</span>
            </div>
            <p className="ms-card__thought">“{T(promo.sampleNew)}”</p>
            <dl className="ms-card__rows">
              <div>
                <dt>{T(promo.sampleOldLabel)}</dt>
                <dd>
                  <span className="ms-card__old">
                    <WeatherIcon weather="rainy" size={22} />
                    <s>“{T(promo.sampleThought)}”</s>
                  </span>
                </dd>
              </div>
              <div>
                <dt>{T(promo.sampleCareLabel)}</dt>
                <dd>{T(promo.sampleCare)}</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Try it */}
        <section className="promo__end">
          <h2 className="promo__h2">{T(promo.endTitle)}</h2>
          <a className="btn btn--primary btn--lg promo__cta" href={tryIt}>
            {T(promo.tryFree)}
          </a>
          <p className="fineprint">{T(promo.disclaimer)}</p>
          <p className="promo__help">{T(promo.help)}</p>
        </section>
      </main>
    </div>
  )
}
