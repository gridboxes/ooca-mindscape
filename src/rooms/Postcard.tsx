import { forwardRef } from 'react'
import type { Lang } from '../content'
import { fill, ms, type Companion } from '../mindscape-content'
import Mooca from '../components/Mooca'
import Rock from '../components/companions/Rock'
import Lotus from '../components/companions/Lotus'
import WeatherIcon from '../components/WeatherIcon'
import type { EndCard } from './end-card'

interface Props {
  lang: Lang
  who: Companion
  name: string
  date: string
  postcard: EndCard['postcard']
  /** leave the original thought off, for saving or sharing without showing what was written */
  hideBefore?: boolean
}

/**
 * The keepsake at the end, as a 4:5 postcard: the friend's place on top (mooca's sky clearing,
 * Hin's hill with your stepping stones, Bua's pond with the kindness rings), then the change in
 * one big line, at most one detail, and a single footer line. It's also what Save makes an image of.
 */
const Postcard = forwardRef<HTMLDivElement, Props>(function Postcard({ lang, who, name, date, postcard: p, hideBefore = false }, ref) {
  const sky = who === 'mooca' && p.to ? ` pc--sky-${p.to}` : ''
  return (
    <div ref={ref} className={`pc pc--${who}${sky}`}>
      <div className="pc__band" aria-hidden="true">
        <span className="pc__sun" />
        <span className="pc__cloud pc__cloud--a" />
        <span className="pc__cloud pc__cloud--b" />

        {who === 'mooca' && (
          <>
            <span className="pc__hill" />
            <span className="pc__friend">
              <Mooca weather={p.to ?? 'sunny'} size={170} effects={false} />
            </span>
            {p.from && p.to && (
              <span className="pc__sky">
                <WeatherIcon weather={p.from} size={26} />
                <i>→</i>
                <WeatherIcon weather={p.to} size={26} />
              </span>
            )}
          </>
        )}

        {who === 'hin' && (
          <>
            <span className="pc__hill pc__hill--earth" />
            <span className="pc__friend pc__friend--hin">
              <Rock mood="delighted" size={150} />
            </span>
            {/* what's yours to move, laid as stepping stones up the hill */}
            <span className="pc__stones">
              {(p.stones ?? []).map((st, i) => (
                <span key={st} className="pc__stone" style={{ ['--i' as string]: i }}>
                  {st}
                </span>
              ))}
            </span>
          </>
        )}

        {who === 'bua' && (
          <>
            <span className="pc__pond" />
            {/* the kindness, ripples reaching out: one ring per circle reached */}
            {Array.from({ length: p.rings ?? 0 }, (_, i) => (
              <span key={i} className="pc__ring" style={{ ['--i' as string]: i }} />
            ))}
            <span className="pc__friend pc__friend--bua">
              <Lotus mood="delighted" bloom={1} size={150} ripples={false} />
            </span>
          </>
        )}

        <span className="pc__stamp">
          <b>{date}</b>
          <small>{lang === 'th' ? ms.brand.th : ms.brand.en}</small>
        </span>
      </div>

      <div className="pc__body">
        <span className="pc__with">{fill(lang === 'th' ? ms.withLabel.th : ms.withLabel.en, { name })}</span>
        {hideBefore ? null : p.beforeStyle === 'crossed' ? (
          <s className="pc__before">“{p.before}”</s>
        ) : p.beforeStyle === 'stone' ? (
          <span className="pc__before pc__before--stone">“{p.before}”</span>
        ) : (
          <span className="pc__before pc__before--drift">〜 “{p.before}”</span>
        )}
        <p className="pc__after">“{p.after}”</p>
        {p.detail && (
          <span className="pc__detail">
            {p.detail.label} · <b>{p.detail.value}</b>
          </span>
        )}
      </div>

      <div className="pc__foot">
        <span className="logo-word">ooca</span>
        <span className="pc__line">{p.line}</span>
      </div>
    </div>
  )
})

export default Postcard
