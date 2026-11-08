import { useEffect, useState, type ReactNode } from 'react'
import { t, type Lang } from './content'
import { courses, heal } from './heal-content'
import { companions, type Companion } from './mindscape-content'
import Avatar from './components/companions/Avatar'
import Stores from './components/Stores'
import WeatherIcon from './components/WeatherIcon'
import { BookScreen, CardsScreen, ChatScreen, HomeScreen, LibraryScreen, Phone, PlayerScreen, WeekScreen } from './components/HealPhones'
import './mindscape.css'
import './heal.css'

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

/** One feature: copy on one side, its phone on the other, on a soft panel in a companion's colour */
function Feature({
  tone,
  kicker,
  title,
  body,
  flip,
  art,
  children,
}: {
  tone: Companion | 'sky'
  kicker: string
  title: string
  body: string
  flip?: boolean
  art: ReactNode
  children?: ReactNode
}) {
  return (
    <section className={`feat feat--${tone}${flip ? ' feat--flip' : ''}`}>
      <div className="feat__copy">
        <span className="feat__kicker">{kicker}</span>
        <h2 className="feat__title">{title}</h2>
        <p className="feat__body">{body}</p>
        {children}
      </div>
      <div className="feat__art">{art}</div>
    </section>
  )
}

/**
 * ooca Garden: where Mindscape leads. Mindscape is the free three-minute taste on the web; Heal
 * Space, in the ooca app, is where the three friends live, the habit grows and the paid plan sits,
 * and it leads on to an ooca psychologist. Same friendly world as Mindscape: the landscape, the
 * friends talking, each section in a companion's colour.
 */
export default function Heal() {
  const [lang, setLang] = useState<Lang>(initialLang)
  const T = (s: Record<Lang, string>) => t(s, lang)
  const mindscape = location.pathname

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = t(heal.pageTitle, lang)
    try {
      localStorage.setItem(LANG_KEY, lang)
    } catch {
      // ignore
    }
  }, [lang])

  const styles: [Companion, Record<Lang, string>][] = [
    ['mooca', heal.styleMooca],
    ['hin', heal.styleHin],
    ['bua', heal.styleBua],
  ]

  return (
    <div className="app heal">
      <div className="sky-bg" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href={mindscape} aria-label="ooca Garden">
          <span className="logo-word">ooca</span>
          <span className="brand__divider" aria-hidden="true" />
          <span className="brand__name">{T(heal.name)}</span>
        </a>
        <div className="topbar__right">
          <div className="lang" role="group" aria-label="Language">
            {(['th', 'en'] as Lang[]).map((l) => (
              <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <a className="btn btn--primary heal__topcta" href="#get">
            {T(heal.carryCta)}
          </a>
        </div>
      </header>

      <main className="heal__main">
        {/* Hero: the friends say hello around the app */}
        <section className="heal__hero">
          <div className="heal__copy">
            <span className="heal__new">✦ {T(heal.newIn)}</span>
            <h1 className="heal__title">{T(heal.heroTitle)}</h1>
            <p className="heal__lead">{T(heal.heroLead)}</p>
            <Stores lang={lang} />
            <p className="heal__trial">{T(heal.trial)}</p>
          </div>
          <div className="heal__stage">
            <div className="heal__glow" aria-hidden="true" />
            <Phone>
              <HomeScreen lang={lang} />
            </Phone>
            <div className="hello hello--mooca" aria-hidden="true">
              <Avatar who="mooca" mood="happy" size={52} />
              <p>{T(heal.hiMooca)}</p>
            </div>
            <div className="hello hello--hin" aria-hidden="true">
              <Avatar who="hin" mood="happy" size={52} />
              <p>{T(heal.hiHin)}</p>
            </div>
            <div className="hello hello--bua" aria-hidden="true">
              <Avatar who="bua" mood="happy" size={52} />
              <p>{T(heal.hiBua)}</p>
            </div>
          </div>
        </section>

        {/* Pick up where you left off: the Mindscape card flies into the app */}
        <Feature
          tone="sky"
          kicker={T(heal.bridgeKicker)}
          title={T(heal.bridgeTitle)}
          body={T(heal.bridgeBody)}
          art={
            <div className="bridge">
              <div className="ms-card ms-card--mooca bridge__card" aria-hidden="true">
                <div className="ms-card__top">
                  <span>{lang === 'th' ? 'การ์ดที่พักใจของฉัน' : 'My Mindscape card'}</span>
                </div>
                <div className="ms-card__who">
                  <Avatar who="mooca" mood="happy" size={44} />
                  <span>{lang === 'th' ? 'กับมูก้า' : 'with mooca'}</span>
                </div>
                <p className="ms-card__thought">“{lang === 'th' ? 'บางคนอยู่คนละเส้นทางกับเรา' : 'Some people are on a different path'}”</p>
              </div>
              <svg className="bridge__arrow" viewBox="0 0 120 60" aria-hidden="true">
                <path d="M6 44 C 40 6, 80 6, 110 30" fill="none" stroke="#00C4B3" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 8" />
                <path d="M100 22 l12 9 l-14 4" fill="none" stroke="#00C4B3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <Phone tilt={4}>
                <CardsScreen lang={lang} />
              </Phone>
            </div>
          }
        />

        {/* Talk */}
        <Feature
          tone="hin"
          flip
          kicker={T(heal.talkKicker)}
          title={T(heal.talkTitle)}
          body={T(heal.talkBody)}
          art={
            <Phone tilt={-3}>
              <ChatScreen lang={lang} />
            </Phone>
          }
        >
          <ul className="styles">
            {styles.map(([c, line]) => (
              <li key={c} className={`styles__item styles__item--${c}`}>
                <Avatar who={c} mood="happy" size={40} />
                <span>
                  <b>{T(companions[c].name)}</b> {T(line)}
                </span>
              </li>
            ))}
          </ul>
        </Feature>

        {/* Listen */}
        <Feature
          tone="bua"
          kicker={T(heal.listenKicker)}
          title={T(heal.listenTitle)}
          body={T(heal.listenBody)}
          art={
            <div className="pair">
              <Phone tilt={-5}>
                <LibraryScreen lang={lang} />
              </Phone>
              <Phone tilt={5}>
                <PlayerScreen lang={lang} />
              </Phone>
            </div>
          }
        >
          <div className="cloud">
            {courses.map((c) => (
              <span key={c.en}>{T(c)}</span>
            ))}
          </div>
        </Feature>

        {/* Every day */}
        <Feature
          tone="mooca"
          flip
          kicker={T(heal.dailyKicker)}
          title={T(heal.dailyTitle)}
          body={T(heal.dailyBody)}
          art={
            <div className="skyline">
              <Phone tilt={-3}>
                <WeekScreen lang={lang} />
              </Phone>
              {(['rainy', 'partly', 'sunny'] as const).map((w, i) => (
                <span key={w} className={`skyline__icon skyline__icon--${i}`} aria-hidden="true">
                  <WeatherIcon weather={w} size={44} />
                </span>
              ))}
            </div>
          }
        />

        {/* When you need more: the path from a free taste to a real person */}
        <Feature
          tone="sky"
          kicker={T(heal.moreKicker)}
          title={T(heal.moreTitle)}
          body={T(heal.moreBody)}
          art={
            <Phone tilt={3}>
              <BookScreen lang={lang} />
            </Phone>
          }
        >
          <ol className="ladder">
            <li>
              <b>{T(heal.step1)}</b>
              <span>{T(heal.step1Note)}</span>
            </li>
            <li className="is-here">
              <b>{T(heal.step2)}</b>
              <span>{T(heal.step2Note)}</span>
            </li>
            <li>
              <b>{T(heal.step3)}</b>
              <span>{T(heal.step3Note)}</span>
            </li>
          </ol>
        </Feature>

        {/* Get the app: back in the landscape, everyone waving */}
        <section className="heal__end" id="get">
          {/* the three friends together on a hill, saying see you */}
          <div className="heal__endscene" aria-hidden="true">
            <span className="heal__sun" />
            <span className="heal__cloud heal__cloud--a" />
            <span className="heal__cloud heal__cloud--b" />
            <div className="heal__trio">
              <span className="heal__pal heal__pal--hin">
                <Avatar who="hin" mood="delighted" size={130} />
              </span>
              <span className="heal__pal heal__pal--mooca">
                <Avatar who="mooca" mood="delighted" size={150} />
              </span>
              <span className="heal__pal heal__pal--bua">
                <Avatar who="bua" mood="delighted" size={130} />
              </span>
            </div>
          </div>
          <div className="heal__endcopy">
            <h2 className="heal__endtitle">{T(heal.endTitle)}</h2>
            <p className="heal__lead">{T(heal.endBody)}</p>
            <Stores lang={lang} />
            <p className="heal__trial">{T(heal.trial)}</p>
            <a className="btn btn--link" href={mindscape}>
              {T(heal.tryFirst)}
            </a>
          </div>
        </section>
        <p className="fineprint heal__concept">{T(heal.conceptNote)}</p>
      </main>
    </div>
  )
}
