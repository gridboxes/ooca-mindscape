import { useState } from 'react'
import type { Lang } from '../content'
import { fill } from '../mindscape-content'
import { mooca, prefixes, traps, type Part } from './mooca-content'

/** Which swap each heavy word took (by part index), and the gentler start, if any */
export interface Softening {
  swaps: Record<number, number>
  prefix: number | null
}

/** The thought as it reads now, with its swaps and gentler start */
export function compose(parts: Part[], s: Softening, lang: Lang): string {
  const body = parts.map((_, i) => shown(parts, s, lang, i)).join('')
  return s.prefix === null ? body : `${prefixes[s.prefix][lang]} ${body}`
}

/** One part as it reads now: swapped if it was, and carrying on from a gentler start if there is one */
function shown(parts: Part[], s: Softening, lang: Lang, i: number): string {
  const p = parts[i]
  const text = typeof p === 'string' ? p : s.swaps[i] !== undefined ? p.swaps[s.swaps[i]] : p.word
  // "Part of me thinks everyone's ahead…": the thought carries on, so it loses its capital (but "I" keeps it)
  if (i === 0 && s.prefix !== null && lang === 'en' && !/^I\b|^I’/.test(text)) return text.charAt(0).toLowerCase() + text.slice(1)
  return text
}

/** Marks a heavy word as one you can swap */
function SwapIcon() {
  return (
    <svg className="soften__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 9 h13 l-3 -3 M20 15 H7 l3 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** How much the forecast has softened: one notch per word swapped or gentler start */
export const softened = (s: Softening) => Object.keys(s.swaps).length + (s.prefix === null ? 0 : 1)

/**
 * Soften the forecast: the thought, large, with its heavy words marked. Tapping one opens its
 * softer swaps and names the trap it fell into; picking one rewrites the word in place.
 */
export default function Soften({
  lang,
  parts,
  value,
  onChange,
}: {
  lang: Lang
  parts: Part[]
  value: Softening
  onChange: (s: Softening) => void
}) {
  const [open, setOpen] = useState<number | null>(null)
  const T = (s: Record<Lang, string>) => s[lang]
  const heavy = parts.flatMap((p, i) => (typeof p === 'string' ? [] : [i]))
  const opened = open !== null ? parts[open] : null

  function swap(i: number, k: number | null) {
    const swaps = { ...value.swaps }
    if (k === null) delete swaps[i]
    else swaps[i] = k
    onChange({ ...value, swaps })
    setOpen(null)
  }

  const done = heavy.filter((i) => value.swaps[i] !== undefined).length

  // One card holds the whole edit: the sentence, how far it has softened, the open word's swaps,
  // and the gentler starts, so every change visibly lands in the same thought
  return (
    <div className="soften">
      <p className="soften__thought" lang={lang}>
        {value.prefix !== null && <span className="soften__lead">{T(prefixes[value.prefix])} </span>}
        {parts.map((p, i) => {
          if (typeof p === 'string') return <span key={i}>{shown(parts, value, lang, i)}</span>
          const soft = value.swaps[i] !== undefined
          return (
            <button
              key={i}
              type="button"
              className={`soften__word${soft ? ' is-soft' : ''}${open === i ? ' is-open' : ''}`}
              aria-expanded={open === i}
              aria-controls="soften-swaps"
              onClick={() => setOpen(open === i ? null : i)}
            >
              {shown(parts, value, lang, i)}
              <SwapIcon />
            </button>
          )
        })}
      </p>

      {heavy.length > 0 && (
        <p className={`soften__progress${done === heavy.length ? ' is-done' : ''}`} aria-live="polite">
          {done === heavy.length
            ? T(mooca.softAll)
            : fill(T(mooca.softProgress), { done: String(done), total: String(heavy.length) })}
        </p>
      )}

      {opened && typeof opened !== 'string' && open !== null && (
        <div id="soften-swaps" className="soften__swaps" key={open}>
          <div className="soften__swaps-head">
            <p className="soften__ask">{fill(T(mooca.swapFor), { word: opened.word })}</p>
            <button type="button" className="soften__x" aria-label={T(mooca.close)} onClick={() => setOpen(null)}>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <span className="soften__trap">{T(traps[opened.trap])}</span>
          <div className="chips">
            {opened.swaps.map((sw, k) => (
              <button
                key={sw}
                type="button"
                aria-pressed={value.swaps[open] === k}
                className={`chip${value.swaps[open] === k ? ' is-selected' : ''}`}
                onClick={() => swap(open, k)}
              >
                {sw}
              </button>
            ))}
          </div>
          {value.swaps[open] !== undefined && (
            <button type="button" className="btn btn--link soften__back" onClick={() => swap(open, null)}>
              {fill(T(mooca.putBack), { word: opened.word })}
            </button>
          )}
        </div>
      )}

      <div className="soften__starts">
        <p className="soften__label">{T(mooca.gentlerStart)}</p>
        <div className="chips">
          {prefixes.map((pre, k) => (
            <button
              key={k}
              type="button"
              aria-pressed={value.prefix === k}
              className={`chip${value.prefix === k ? ' is-selected' : ''}`}
              onClick={() => onChange({ ...value, prefix: value.prefix === k ? null : k })}
            >
              {T(pre)}…
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
