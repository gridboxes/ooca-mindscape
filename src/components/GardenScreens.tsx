import { useId } from 'react'
import type { Lang } from '../content'
import { companions, fill, type Companion, type Theme } from '../mindscape-content'
import { chatOpener, chatScript, courses, coverFor, garden, heal, lessonFor, psychologists, upNextFor, type Cover as CoverSpec, type Lesson } from '../heal-content'
import Avatar from './companions/Avatar'
import WeatherIcon from './WeatherIcon'
import '../garden.css'

// ooca Garden as the poster's phone shows it after Mindscape: home, a chat with the friend the
// person chose (opened by their own thought), a lesson picked for that thought, and a real
// psychologist. Lessons and courses have their own cover art, never the friends.

type P = { lang: Lang; who: Companion; theme: Theme }
const tr = (lang: Lang) => (s: Record<Lang, string>) => s[lang]

/** Abstract cover art: one idea per cover, drawn on a soft two-colour wash */
export function Cover({ cover, size = 40, radius = 10 }: { cover: CoverSpec; size?: number; radius?: number }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const { art, from, to, ink } = cover
  const line = { fill: 'none', stroke: ink, strokeWidth: 5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const shape = () => {
    switch (art) {
      case 'swirl':
        return <path {...line} d="M50 50 m0 -6 a6 6 0 1 1 -6 6 a12 12 0 1 1 12 12 a18 18 0 1 1 -18 -18 a24 24 0 1 1 24 24" opacity=".85" />
      case 'moon':
        return (
          <g>
            <mask id={`m${id}`}>
              <rect width="100" height="100" fill="#fff" />
              <circle cx="68" cy="34" r="20" fill="#000" />
            </mask>
            <circle cx="56" cy="46" r="22" fill={ink} mask={`url(#m${id})`} />
            <g fill={ink} opacity=".8">
              <circle cx="24" cy="26" r="2" />
              <circle cx="78" cy="70" r="1.6" />
              <circle cx="30" cy="72" r="1.3" />
            </g>
          </g>
        )
      case 'battery':
        return (
          <g>
            <rect x="22" y="36" width="50" height="28" rx="7" {...line} />
            <rect x="74" y="44" width="5" height="12" rx="2" fill={ink} />
            <rect x="28" y="42" width="10" height="16" rx="3" fill={ink} />
          </g>
        )
      case 'apart':
        return (
          <g fill={ink}>
            <circle cx="38" cy="50" r="17" opacity=".9" />
            <circle cx="66" cy="50" r="17" opacity=".45" />
          </g>
        )
      case 'pages':
        return (
          <g fill="#fff" stroke={ink} strokeWidth="3.5">
            <rect x="28" y="26" width="40" height="50" rx="5" transform="rotate(-8 48 51)" opacity=".6" />
            <rect x="32" y="24" width="40" height="50" rx="5" />
            <g stroke={ink} strokeWidth="3.5" strokeLinecap="round">
              <path d="M40 38 h24 M40 48 h24 M40 58 h14" />
            </g>
          </g>
        )
      case 'nest':
        return (
          <g fill={ink}>
            <circle cx="50" cy="50" r="26" opacity=".35" />
            <circle cx="56" cy="58" r="12" />
          </g>
        )
      case 'bubble':
        return <path {...line} strokeDasharray="7 7" d="M26 30 h48 a8 8 0 0 1 8 8 v20 a8 8 0 0 1 -8 8 h-26 l-12 10 v-10 h-10 a8 8 0 0 1 -8 -8 v-20 a8 8 0 0 1 8 -8 z" />
      case 'half':
        return (
          <g>
            <circle cx="50" cy="50" r="24" {...line} />
            <path d="M28 56 a24 24 0 0 0 44 0 z" fill={ink} />
          </g>
        )
      case 'circle':
        return (
          <g fill={ink}>
            <circle cx="50" cy="50" r="28" opacity=".22" />
            <circle cx="50" cy="50" r="11" />
          </g>
        )
      case 'scale':
        return (
          <g>
            <path {...line} d="M50 26 v44 M30 36 h40 M38 76 h24" />
            <path d="M22 36 l8 16 h-16 z M70 36 l8 16 h-16 z" fill={ink} opacity=".8" />
          </g>
        )
      case 'sunset':
        return (
          <g>
            <path d="M26 62 a24 24 0 0 1 48 0 z" fill={ink} />
            <path {...line} strokeWidth="4" d="M18 70 h64 M28 80 h44" opacity=".7" />
          </g>
        )
      case 'path':
        return (
          <g>
            <path {...line} strokeDasharray="2 9" d="M22 80 C40 70 30 54 50 48 S70 30 74 22" />
            <path d="M74 14 l3 7 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1 z" fill={ink} />
          </g>
        )
      case 'ripple':
        return (
          <g fill="none" stroke={ink} strokeWidth="4">
            <ellipse cx="50" cy="58" rx="10" ry="4" />
            <ellipse cx="50" cy="58" rx="22" ry="9" opacity=".65" />
            <ellipse cx="50" cy="58" rx="34" ry="14" opacity=".35" />
            <circle cx="50" cy="38" r="5" fill={ink} stroke="none" />
          </g>
        )
      case 'petals':
        return (
          <g fill={ink}>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx="50" cy="34" rx="9" ry="15" opacity=".75" transform={`rotate(${a} 50 50)`} />
            ))}
            <circle cx="50" cy="50" r="7" fill="#fff" />
          </g>
        )
      case 'scan':
        return (
          <g>
            {[30, 42, 54, 66].map((y, i) => (
              <rect key={y} x="24" y={y} width="52" height="6" rx="3" fill={ink} opacity={0.25 + i * 0.12} />
            ))}
            <circle cx="62" cy="57" r="6" fill={ink} />
          </g>
        )
    }
  }
  return (
    <svg className="gx-cover" width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={{ borderRadius: radius }}>
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#g${id})`} />
      <circle cx="88" cy="10" r="26" fill="#fff" opacity=".18" />
      {shape()}
    </svg>
  )
}

const nameOf = (who: Companion, lang: Lang) => companions[who].name[lang]

/** Home: three clear sections, Chat (the three friends), Listen (tonight's lesson and courses), Talk */
export function GardenHome({ lang, who, theme, onTalk }: P & { onTalk?: () => void }) {
  const T = tr(lang)
  const lesson = lessonFor(who, theme)
  const shelf = [courses[0], courses[1], courses[2], courses[3]]
  return (
    <div className="gx gx--home">
      <b className="gx-brand">
        <span className="logo-word">ooca</span> {lang === 'th' ? 'สวนพักใจ' : 'Garden'}
      </b>

      {/* Chat: the three friends, side by side */}
      <section className="gx-sec">
        <b className="gx-sec__title">{T(heal.featChat)}</b>
        <div className="gx-friends">
          {(['mooca', 'hin', 'bua'] as const).map((c) => (
            <span key={c} className={`gx-friend gx-friend--${c}`}>
              <Avatar who={c} mood="happy" size={28} />
              <b>{nameOf(c, lang)}</b>
            </span>
          ))}
        </div>
      </section>

      {/* Listen: tonight's lesson for the thought, and courses by problem */}
      <section className="gx-sec">
        <b className="gx-sec__title">{T(heal.featListen)}</b>
        <span className="gx-label">{T(garden.tonight)}</span>
        <div className="gx-lesson">
          <Cover cover={coverFor(lesson.title)} size={34} radius={9} />
          <div>
            <b>{T(lesson.title)}</b>
            <span>{fill(T(heal.min), { n: String(lesson.minutes) })}</span>
          </div>
          <span className="gx-play" />
        </div>
        <span className="gx-label">{T(garden.courses)}</span>
        <div className="gx-shelf">
          {shelf.map((c, i) => (
            <div key={c.en} className="gx-course">
              <Cover cover={coverFor(c)} size={46} radius={10} />
              <b>{T(c)}</b>
              <span>{fill(T(heal.lessons), { n: String([7, 5, 6, 4][i]) })}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Talk: a real psychologist */}
      <section className="gx-sec">
        <b className="gx-sec__title">{T(heal.featTalk)}</b>
        <button type="button" className="gx-talkrow" onClick={onTalk} tabIndex={onTalk ? 0 : -1}>
          <span className="gx-faces">
            {psychologists.map((p) => (
              <Portrait key={p.name.en} p={p} size={20} />
            ))}
          </span>
          <span>
            <b>{T(garden.talkNow)}</b>
            <span className="gx-live">{T(garden.availableNow)}</span>
          </span>
          <i className="gx-chev" />
        </button>
      </section>
    </div>
  )
}

/** Chat: the chosen friend, opened by the person's own thought, with that friend's practice inline */
export function GardenChat({ lang, who, theme }: P) {
  const T = tr(lang)
  const s = chatScript[who]
  const name = nameOf(who, lang)
  return (
    <div className={`gx gx--chat gx--${who}`}>
      <header className="gx-chathead">
        <i className="gx-back" />
        <span className="gx-chathead__av">
          <Avatar who={who} mood="happy" size={28} />
        </span>
        <div>
          <b>{name}</b>
          <span className="gx-live">{T(garden.here)}</span>
        </div>
      </header>
      <div className="gx-msgs">
        <span className="gx-day">{T(garden.today)}</span>
        <p className="gx-msg gx-msg--them">{T(s.hello)}</p>
        <p className="gx-msg gx-msg--me">{T(chatOpener[theme])}</p>
        <p className="gx-msg gx-msg--them">{T(s.ask)}</p>
        {who === 'mooca' && (
          <div className="gx-inline gx-skies">
            {(['sunny', 'partly', 'foggy', 'rainy', 'stormy'] as const).map((w) => (
              <span key={w} className={w === 'rainy' ? 'is-on' : ''}>
                <WeatherIcon weather={w} size={17} />
              </span>
            ))}
          </div>
        )}
        {who === 'hin' && (
          <div className="gx-inline gx-pebbles">
            <span className="is-mine">{T(garden.mine)}</span>
            <span>{T(garden.notMine)}</span>
          </div>
        )}
        {who === 'bua' && (
          <div className="gx-inline gx-breathe">
            <span className="gx-breathe__ring" />
            <b>{T(garden.breathe)}</b>
            <span className="gx-breathe__go">{T(garden.start)}</span>
          </div>
        )}
        <p className="gx-msg gx-msg--them">{T(s.after)}</p>
        <p className="gx-msg gx-msg--me">{T(s.reply)}</p>
        <span className="gx-typing">
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className="gx-input">
        <span>{fill(T(garden.message), { name })}</span>
        <i className="gx-send" />
      </div>
    </div>
  )
}

/** Listen: the lesson picked for the thought, playing, with what comes next */
export function GardenListen({ lang, who, theme }: P) {
  const T = tr(lang)
  const lesson: Lesson = lessonFor(who, theme)
  const next = upNextFor(who, theme)
  const total = lesson.minutes * 60
  const at = Math.round(total * 0.32)
  const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  return (
    <div className="gx gx--listen">
      <header className="gx-chathead gx-chathead--plain">
        <i className="gx-back" />
        <span className="gx-muted">{T(garden.pickedFor)}</span>
      </header>
      <div className="gx-art">
        <Cover cover={coverFor(lesson.title)} size={132} radius={22} />
      </div>
      <b className="gx-title">{T(lesson.title)}</b>
      <span className="gx-muted">{T(garden.voicedBy)}</span>
      <div className="gx-scrub">
        <span className="gx-scrub__bar">
          <i style={{ width: '32%' }} />
        </span>
        <span className="gx-scrub__times">
          <span>{clock(at)}</span>
          <span>{clock(total)}</span>
        </span>
      </div>
      <div className="gx-controls">
        <span className="gx-skip">15</span>
        <span className="gx-pause" />
        <span className="gx-skip gx-skip--fwd">15</span>
      </div>
      <div className="gx-next">
        <Cover cover={coverFor(next.title)} size={26} radius={7} />
        <div>
          <span className="gx-muted">{T(garden.upNext)}</span>
          <b>{T(next.title)}</b>
        </div>
      </div>
    </div>
  )
}

/** A psychologist's portrait: a simple drawn person, not a photo */
function Portrait({ p, size }: { p: (typeof psychologists)[number]; size: number }) {
  return (
    <svg className="gx-portrait" width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="20" fill={p.tint} />
      <ellipse cx="20" cy="40" rx="14" ry="10" fill="#5b7fa6" />
      <circle cx="20" cy="18" r="8.5" fill={p.skin} />
      <path d="M11.5 18 a8.5 8.5 0 0 1 17 0 c-3 -2 -9 -3.5 -12 -5 c-1 2 -3 4 -5 5 z" fill={p.hair} />
    </svg>
  )
}

/** Talk: suggested by the friend, a real psychologist, booked in a tap */
export function GardenTalk({ lang, who }: P) {
  const T = tr(lang)
  return (
    <div className="gx gx--talk">
      <header className="gx-chathead gx-chathead--plain">
        <i className="gx-back" />
        <b className="gx-h">{T(garden.talkNow)}</b>
      </header>
      <div className={`gx-suggest gx-suggest--${who}`}>
        <Avatar who={who} mood="tender" size={24} />
        <span>{fill(T(garden.suggested), { name: nameOf(who, lang) })}</span>
      </div>
      {psychologists.map((p, i) => (
        <div key={p.name.en} className={`gx-doc${i === 0 ? ' is-picked' : ''}`}>
          <Portrait p={p} size={34} />
          <div>
            <b>{T(p.name)}</b>
            <span className="gx-muted">
              {T(garden.psychologist)} · {T(p.focus)}
            </span>
            <span className="gx-slots">
              {p.slots.map((s) => (
                <span key={s} className={s === 'now' ? 'is-now' : ''}>
                  {s === 'now' ? T(garden.now) : s}
                </span>
              ))}
            </span>
          </div>
        </div>
      ))}
      <span className="gx-book">{T(garden.book)}</span>
      <span className="gx-private">
        <i className="gx-lock" />
        {T(garden.private)}
      </span>
    </div>
  )
}
