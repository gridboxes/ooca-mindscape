import type { ReactNode } from 'react'
import type { Lang, Weather } from '../content'
import Avatar from './companions/Avatar'
import Mooca from './Mooca'
import Landscape from './Landscape'
import WeatherIcon from './WeatherIcon'
import { fill } from '../mindscape-content'
import { courses, heal } from '../heal-content'

type P = { lang: Lang }
const tr = (lang: Lang) => (s: Record<Lang, string>) => s[lang]

/** A modern phone: thin rounded bezel, a camera island, side buttons, and a soft screen glare */
export function Phone({ children, tilt = 0, dark = false }: { children: ReactNode; tilt?: number; dark?: boolean }) {
  return (
    <div className="phone" style={{ ['--tilt' as string]: `${tilt}deg` }} aria-hidden="true">
      <div className={`phone__screen${dark ? ' is-dark' : ''}`}>
        <div className="phone__island" />
        <div className="phone__status">
          <span>9:41</span>
          <span className="phone__icons">
            <i />
            <i />
            <b />
          </span>
        </div>
        {children}
        <div className="phone__home" />
      </div>
    </div>
  )
}

/** ooca Garden home: the landscape, how's your sky, tonight's lesson, the three friends */
export function HomeScreen({ lang }: P) {
  const T = tr(lang)
  const skies: Weather[] = ['sunny', 'partly', 'foggy', 'rainy', 'stormy']
  return (
    <div className="hs hs--home">
      <div className="hs__scene">
        <Landscape focus="all" fit="slice" moocaWeather="sunny" rockMood="happy" lotusMood="happy" />
      </div>
      <div className="hs__pad">
        <span className="hs__hi">{T(heal.homeHi)}</span>
        <b className="hs__h">{T(heal.homeAsk)}</b>
        <div className="hs__skies">
          {skies.map((w) => (
            <span key={w} className={w === 'partly' ? 'is-on' : ''}>
              <WeatherIcon weather={w} size={22} />
            </span>
          ))}
        </div>
        <span className="hs__kicker">{T(heal.forYou)}</span>
        <div className="hs__lesson hs__lesson--hin">
          <Avatar who="hin" mood="calm" size={38} />
          <div>
            <b>{lang === 'th' ? 'อะไรอยู่ในมือเรา' : 'What’s in your control'}</b>
            <span>{fill(T(heal.min), { n: '4' })}</span>
          </div>
          <i className="hs__playdot" />
        </div>
        <span className="hs__kicker">{T(heal.talkTo)}</span>
        <div className="hs__friends">
          {(['mooca', 'hin', 'bua'] as const).map((c) => (
            <span key={c} className={`hs__friend hs__friend--${c}`}>
              <Avatar who={c} mood="happy" size={34} />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Talk: a chat with Hin, with a pebble sort right in the conversation */
export function ChatScreen({ lang }: P) {
  const T = tr(lang)
  return (
    <div className="hs hs--chat">
      <div className="hs__head">
        <span className="hs__headav">
          <Avatar who="hin" mood="happy" size={34} />
        </span>
        <div>
          <b>{lang === 'th' ? 'หิน' : 'Hin'}</b>
          <span className="hs__status">● {T(heal.chatStatus)}</span>
        </div>
      </div>
      <div className="hs__msgs">
        <p className="hs__msg hs__msg--them">{T(heal.chat1)}</p>
        <p className="hs__msg hs__msg--me">{T(heal.chat2)}</p>
        <p className="hs__msg hs__msg--them">{T(heal.chat3)}</p>
        <div className="hs__pebbles">
          <span>{T(heal.chatChip1)}</span>
          <span className="is-let">{T(heal.chatChip2)}</span>
        </div>
        <p className="hs__msg hs__msg--them">{T(heal.chat4)}</p>
        <p className="hs__msg hs__msg--me">{T(heal.chat5)}</p>
        <span className="hs__typing">
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className="hs__input">
        <span>{T(heal.chatInput)}</span>
        <i className="hs__mic" />
      </div>
    </div>
  )
}

/** Listen: a lesson playing over Hin's hillside */
export function PlayerScreen({ lang }: P) {
  const T = tr(lang)
  const bars = [6, 10, 16, 9, 20, 14, 8, 18, 12, 22, 10, 15, 7, 19, 11, 16, 9, 13, 6, 17, 10, 14]
  return (
    <div className="hs hs--player">
      <div className="hs__cover">
        <Landscape focus="earth" fit="slice" rockMood="calm" />
      </div>
      <span className="hs__kicker">{T(heal.nowPlaying)}</span>
      <b className="hs__title">{lang === 'th' ? 'อะไรอยู่ในมือเรา' : 'What’s in your control'}</b>
      <div className="hs__wave">
        {bars.map((h, i) => (
          <i key={i} style={{ height: h }} className={i < 9 ? 'is-played' : ''} />
        ))}
      </div>
      <div className="hs__controls">
        <span className="hs__skip">15</span>
        <span className="hs__play" />
        <span className="hs__skip">15</span>
      </div>
      <div className="hs__next">
        <Avatar who="bua" mood="calm" size={26} />
        <span>
          {T(heal.upNext)} · {lang === 'th' ? 'ห้าลมหายใจ ปล่อยวาง' : 'Five breaths to let go'}
        </span>
      </div>
    </div>
  )
}

/** Listen: courses named by the problem, and tonight's sleep story */
export function LibraryScreen({ lang }: P) {
  const T = tr(lang)
  const covers = [
    { c: courses[0], who: 'mooca' as const, n: 7 },
    { c: courses[1], who: 'bua' as const, n: 5 },
    { c: courses[2], who: 'hin' as const, n: 6 },
    { c: courses[3], who: 'bua' as const, n: 4 },
  ]
  return (
    <div className="hs hs--library">
      <b className="hs__h">{T(heal.libraryTitle)}</b>
      <div className="hs__night">
        <span className="hs__moon" />
        <span className="hs__stars" />
        <div className="hs__nightmooca">
          <Mooca weather={null} size={58} effects={false} />
        </div>
        <div>
          <span className="hs__kicker hs__kicker--light">{T(heal.sleepKicker)}</span>
          <b>{T(heal.sleepStory)}</b>
          <span>{fill(T(heal.min), { n: '12' })}</span>
        </div>
      </div>
      <span className="hs__kicker">{T(heal.libraryFor)}</span>
      <div className="hs__grid">
        {covers.map(({ c, who, n }) => (
          <div key={c.en} className={`hs__course hs__course--${who}`}>
            <Avatar who={who} mood="calm" size={30} />
            <b>{T(c)}</b>
            <span>{fill(T(heal.lessons), { n: String(n) })}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Every day: a week of skies, a streak, and mooca noticing the pattern */
export function WeekScreen({ lang }: P) {
  const T = tr(lang)
  const week: [string, Weather][] = [
    [lang === 'th' ? 'จ' : 'M', 'rainy'],
    [lang === 'th' ? 'อ' : 'T', 'foggy'],
    [lang === 'th' ? 'พ' : 'W', 'partly'],
    [lang === 'th' ? 'พฤ' : 'T', 'partly'],
    [lang === 'th' ? 'ศ' : 'F', 'sunny'],
  ]
  return (
    <div className="hs hs--week">
      <b className="hs__h">{T(heal.weekTitle)}</b>
      <div className="hs__weekrow">
        {week.map(([d, w], i) => (
          <div key={i} className="hs__day">
            <WeatherIcon weather={w} size={26} />
            <span>{d}</span>
          </div>
        ))}
        <div className="hs__day is-empty">
          <span className="hs__ring" />
          <span>{lang === 'th' ? 'ส' : 'S'}</span>
        </div>
      </div>
      <div className="hs__streak">
        <span>🔥</span> {T(heal.streak)}
      </div>
      <div className="hs__bubble">
        <Mooca weather="sunny" size={44} effects={false} />
        <p>{T(heal.weekNote)}</p>
      </div>
      <span className="hs__kicker">{T(heal.myCards)}</span>
      <div className="hs__minicard">
        <span className="hs__kicker">{T(heal.fromMindscape)}</span>
        <b>“{lang === 'th' ? 'บางคนอยู่คนละเส้นทางกับเรา' : 'Some people are on a different path'}”</b>
      </div>
      <div className="hs__minicard hs__minicard--hin">
        <span className="hs__kicker">{T(heal.lastWeek)}</span>
        <b>{lang === 'th' ? 'ก้าวไปด้วยความกล้า' : 'I’ll step on it with courage'}</b>
      </div>
    </div>
  )
}

/** Pick up where you left off: today's Mindscape card waiting in the app */
export function CardsScreen({ lang }: P) {
  const T = tr(lang)
  return (
    <div className="hs hs--cards">
      <b className="hs__h">{T(heal.cardsTitle)}</b>
      <div className="hs__new">✦ {T(heal.cardsNew)}</div>
      <div className="hs__bigcard">
        <div className="hs__bigcard-who">
          <Mooca weather="sunny" size={40} effects={false} />
          <span>{lang === 'th' ? 'กับมูก้า · วันนี้' : 'with mooca · today'}</span>
        </div>
        <b>“{lang === 'th' ? 'บางคนอยู่คนละเส้นทางกับเรา' : 'Some people are on a different path'}”</b>
        <span className="hs__old">“{lang === 'th' ? 'ใครๆ ก็ไปไกลกว่าเรา' : 'Everyone’s ahead of me'}”</span>
      </div>
      <div className="hs__picked">
        <i className="hs__playdot" />
        <span>{T(heal.cardsLesson)}</span>
      </div>
      <span className="hs__btn">{T(heal.cardsContinue)}</span>
      <span className="hs__kicker">{T(heal.lastWeek)}</span>
      <div className="hs__minicard hs__minicard--hin">
        <b>{lang === 'th' ? 'ก้าวไปด้วยความกล้า' : 'I’ll step on it with courage'}</b>
      </div>
      <div className="hs__minicard hs__minicard--bua">
        <b>{lang === 'th' ? 'ขอให้ฉันใจดีกับตัวเอง' : 'I hope I’m gentle with myself'}</b>
      </div>
    </div>
  )
}

/** When you need more: an ooca psychologist, suggested by a friend */
export function BookScreen({ lang }: P) {
  const T = tr(lang)
  const people = [
    { name: lang === 'th' ? 'คุณนภา' : 'Napa', tint: '#c7ecea', slot: heal.bookNow },
    { name: lang === 'th' ? 'คุณต้น' : 'Ton', tint: '#f8e4b3', slot: heal.bookTonight },
    { name: lang === 'th' ? 'คุณมายด์' : 'Mind', tint: '#fad0ce', slot: heal.bookTonight },
  ]
  return (
    <div className="hs hs--book">
      <b className="hs__h">{T(heal.bookTitle)}</b>
      <div className="hs__suggest">
        <Avatar who="hin" mood="tender" size={30} />
        <span>{T(heal.bookNote)}</span>
      </div>
      {people.map((p, i) => (
        <div key={i} className="hs__doc">
          <span className="hs__face" style={{ background: p.tint }}>
            <i />
          </span>
          <div>
            <b>{p.name}</b>
            <span className="hs__role">{lang === 'th' ? 'นักจิตวิทยา' : 'Psychologist'}</span>
            <span className={`hs__slot${i === 0 ? ' is-now' : ''}`}>{T(p.slot)}</span>
          </div>
          <span className="hs__member">{T(heal.bookMember)}</span>
        </div>
      ))}
      <div className="hs__notes">
        <span>📝</span>
        {T(heal.bookNotes)}
      </div>
    </div>
  )
}

/**
 * ooca Garden's home: chat with the three friends, and things to listen to: tonight's lesson
 * (picked for the thought) and courses named by the problem.
 */
export function GardenHome({
  lang,
  who,
  lesson,
  onTalk,
}: {
  lang: Lang
  who: 'mooca' | 'hin' | 'bua'
  lesson: { title: Record<Lang, string>; minutes: number }
  /** the Talk row leads to the psychologist screen */
  onTalk?: () => void
}) {
  const T = tr(lang)

  return (
    <div className="hs hs--garden">
      <div className="gh">
        <span className="gh__brand">
          <span className="logo-word">ooca</span> {lang === 'th' ? 'สวนพักใจ' : 'Garden'}
        </span>
      </div>

      <section className="gsec">
        <b className="gsec__title">{T(heal.chatWith)}</b>
        <div className="gf">
          {(['mooca', 'hin', 'bua'] as const).map((c) => (
            <span key={c} className={`gf__card gf__card--${c}`}>
              {c === who && <i className="gf__tag">{T(heal.continueTag)}</i>}
              <Avatar who={c} mood="happy" size={30} />
              <b>{c === 'mooca' ? 'mooca' : c === 'hin' ? (lang === 'th' ? 'หิน' : 'Hin') : lang === 'th' ? 'บัว' : 'Bua'}</b>
            </span>
          ))}
        </div>
      </section>

      <section className="gsec">
        <b className="gsec__title">{T(heal.featListen)}</b>
        <span className="gsec__sub">{T(heal.forYou)}</span>
        <div className={`hs__lesson hs__lesson--${who}`}>
          <Avatar who={who} mood="calm" size={32} />
          <div>
            <b>{T(lesson.title)}</b>
            <span>{fill(T(heal.min), { n: String(lesson.minutes) })}</span>
          </div>
          <i className="hs__playdot" />
        </div>
        <span className="gsec__sub">{T(heal.libraryFor)}</span>
        {/* a playlist row: it runs off the screen's edge, the way a shelf in an app does */}
        <div className="gplay">
          {(
            [
              [courses[0], 'mooca', 7],
              [courses[1], 'bua', 5],
              [courses[2], 'hin', 6],
              [courses[3], 'bua', 4],
              [courses[4], 'hin', 5],
              [courses[5], 'mooca', 6],
            ] as const
          ).map(([c, w, n]) => (
            <div key={c.en} className={`hs__course hs__course--${w}`}>
              <Avatar who={w} mood="calm" size={20} />
              <b>{T(c)}</b>
              <span>{fill(T(heal.lessons), { n: String(n) })}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="gsec">
        <b className="gsec__title">{T(heal.featTalk)}</b>
        <button type="button" className="gtalk" onClick={onTalk} tabIndex={onTalk ? 0 : -1}>
          {/* two speech bubbles, one carrying a little heart: a real person, listening */}
          <svg className="gtalk__icon" viewBox="0 0 28 28" aria-hidden="true">
            <path d="M3 5.5a3.5 3.5 0 0 1 3.5-3.5h9A3.5 3.5 0 0 1 19 5.5v5A3.5 3.5 0 0 1 15.5 14H10l-4 3.6V14A3.5 3.5 0 0 1 3 10.5z" fill="#5FC9C0" />
            <path d="M10 14.5a3.5 3.5 0 0 1 3.5-3.5h8a3.5 3.5 0 0 1 3.5 3.5v5a3.5 3.5 0 0 1-3 3.46V26l-4-3.5h-4.5a3.5 3.5 0 0 1-3.5-3.5z" fill="#F7A8B8" />
            <path d="M17.5 20.4s-3-1.8-3-3.9a1.7 1.7 0 0 1 3-1.1 1.7 1.7 0 0 1 3 1.1c0 2.1-3 3.9-3 3.9z" fill="#fff" />
          </svg>
          <b>{T(heal.talkReal)}</b>
          <i className="gtalk__go" aria-hidden="true" />
        </button>
      </section>
    </div>
  )
}

/** Talk: a real psychologist, as a card that sits beside the phone */
export function TalkCard({ lang, lit = false }: P & { lit?: boolean }) {
  const T = tr(lang)
  return (
    <div className={`gt${lit ? ' is-lit' : ''}`}>
      <span className="hs__face" style={{ background: '#c7ecea' }}>
        <i />
      </span>
      <div>
        <b>{T(heal.talkReal)}</b>
        <span className="hs__slot is-now">● {T(heal.bookNow)}</span>
      </div>
      <span className="hs__member">{T(heal.bookMember)}</span>
    </div>
  )
}
