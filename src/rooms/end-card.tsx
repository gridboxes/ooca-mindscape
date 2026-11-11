import type { ReactNode } from 'react'
import { actions, weathers, type Lang, type Weather } from '../content'
import { companions, fill, keepLines, ms, type Theme } from '../mindscape-content'
import WeatherIcon from '../components/WeatherIcon'
import type { MoocaResult } from './MoocaRoom'
import type { HinResult } from './HinRoom'
import type { BuaResult } from './BuaRoom'
import { CLEARER, UNSURE, mooca, traps, values } from './mooca-content'
import { softened } from './Soften'
import { JUST_A_FEELING, facts, hin, pebbles, virtues, years } from './hin-content'
import { CIRCLES, bua, circles, regions, tones, wishes } from './bua-content'

/**
 * What a room leaves behind, laid out for the one card at the end: the room used to show its own
 * card and then the ending showed another, so the room's card now *is* the ending's card.
 */
export interface EndCard {
  /** the line the card is about: the thought, or for mooca the new forecast */
  title: string
  rows: { label: string; value: ReactNode }[]
  quote: { text: string; by: string }
  /** the tradition behind the room, and where it shows up in therapy */
  source: string
  /** one small thing to do now; breathing is done right here */
  practice: { title: string; body?: string; breathe?: Weather } | null
  /**
   * The card as a postcard: the friend's place on top, the change in one big line with the
   * thought small above it, at most one detail, and a single footer line
   */
  postcard: {
    /** the thought as it came in: crossed out where it was reframed (mooca), set on a stone to step on (Hin), let drift (Bua) */
    before: string
    beforeStyle: 'crossed' | 'drift' | 'stone'
    after: string
    detail?: { label: string; value: string }
    line: string
    /** mooca: the sky before and after the softening */
    from?: Weather
    to?: Weather
    /** Hin: what's yours to move, laid as stepping stones */
    stones?: string[]
    /** Bua: how far the kindness reached */
    rings?: number
  }
}

type Results = { mooca: MoocaResult | null; hin: HinResult | null; bua: BuaResult | null }

export function endCard(who: 'mooca' | 'hin' | 'bua', r: Results, lang: Lang, thought: string, theme: Theme): EndCard | null {
  const T = (s: Record<Lang, string>) => s[lang]

  if (who === 'mooca' && r.mooca) {
    const { answers: a, report, traps: softenedTraps } = r.mooca
    const reframe = r.mooca.reframe[lang] ?? ''
    // the value is kept as its index, so it reads in the language the card is shown in
    const value = a.value !== null && a.value !== UNSURE ? T(values[theme][a.value]) : null
    const w = report.weather
    const wordIndex = a.word ? weathers[w].words.en.indexOf(a.word) : -1
    const word = wordIndex >= 0 ? weathers[w].words[lang][wordIndex] : null
    const action = actions[report.action]
    const rows: EndCard['rows'] = [
      {
        label: T(mooca.oldLabel),
        value: (
          <span className="ms-card__old">
            <WeatherIcon weather={w} size={24} />
            <span>
              <s>“{thought}”</s> · {T(weathers[w].label)}
              {word && ` · ${word}`}
            </span>
          </span>
        ),
      },
    ]
    if (value) rows.push({ label: T(mooca.careLabel), value })
    if (softenedTraps.length) rows.push({ label: T(mooca.softenedLabel), value: softenedTraps.map((x) => T(traps[x])).join(' · ') })
    // the sky clears a notch for each change, up to two, as it did in the room
    let to = w
    for (let i = 0; i < Math.min(softened(a.soft), 2); i++) to = CLEARER[to]
    return {
      title: reframe,
      rows,
      postcard: {
        before: thought,
        beforeStyle: 'crossed',
        after: reframe,
        from: w,
        to,
        detail: value ? { label: T(mooca.careLabel), value } : undefined,
        line: T(keepLines.mooca),
      },
      quote: { text: T(keepLines.mooca), by: T(companions.mooca.name) },
      source: T(ms.sourceMooca),
      practice: {
        title: T(action.title),
        body: T(action.body),
        breathe: report.action === 'breathe' ? w : undefined,
      },
    }
  }

  if (who === 'hin' && r.hin) {
    const a = r.hin.answers
    const parts = pebbles[theme]
    const mine = parts.filter((_, i) => a.places[i] === 'mine').map(T)
    const letBe = parts.filter((_, i) => a.places[i] === 'let').map(T)
    const rows: EndCard['rows'] = []
    if (a.fact !== null)
      rows.push({ label: T(hin.factLabel), value: a.fact === JUST_A_FEELING ? T(hin.justAFeeling) : T(facts[theme][a.fact]) })
    if (mine.length) rows.push({ label: T(hin.mineLabel), value: <Pebbles items={mine} /> })
    if (letBe.length) rows.push({ label: T(hin.letLabel), value: <Pebbles items={letBe} let /> })
    if (a.virtue) rows.push({ label: T(hin.virtueLabel), value: T(virtues[a.virtue].label) })
    if (a.year) rows.push({ label: T(hin.yearLabel), value: T(years[a.year].label) })
    // the change Hin's sitting makes is in what you'll do, so that's the big line
    const virtue = a.virtue ? T(virtues[a.virtue].label) : null
    const after = virtue
      ? fill(T(hin.stepWith), { virtue: lang === 'en' ? virtue.toLowerCase() : virtue })
      : T(hin.nothingMine)
    return {
      title: thought,
      rows,
      postcard: {
        before: thought,
        beforeStyle: 'stone',
        after,
        detail: letBe.length ? { label: T(hin.letLabel), value: letBe.join(', ') } : undefined,
        line: `“${T(hin.quote)}” ${T(hin.quoteShort)}`,
        stones: mine.slice(0, 3),
      },
      quote: { text: `“${T(hin.quote)}”`, by: T(hin.quoteBy) },
      source: T(ms.sourceHin),
      practice: a.virtue ? { title: T(virtues[a.virtue].label), body: T(virtues[a.virtue].step) } : null,
    }
  }

  if (who === 'bua' && r.bua) {
    const a = r.bua.answers
    const rows: EndCard['rows'] = [
      {
        label: T(bua.feltLabel),
        value: `${a.regions.map((x) => T(regions[x])).join(', ')}${a.tone ? ` · ${T(tones[a.tone].label)}` : ''}`,
      },
    ]
    if (!a.skipped) rows.push({ label: T(bua.breathsLabel), value: fill(T(bua.breathsValue), { n: String(a.breaths) }) })
    if (a.wish) rows.push({ label: T(bua.kindLabel), value: T(wishes[a.wish].me) })
    if (a.sent) rows.push({ label: T(bua.reachLabel), value: CIRCLES.slice(0, a.sent).map((c) => T(circles[c])).join(' → ') })
    return {
      title: thought,
      rows,
      // nothing gets fixed in Bua's room: the thought isn't crossed out, just let drift, and the
      // big line is the kindness passed on
      postcard: {
        before: thought,
        beforeStyle: 'drift',
        after: a.wish ? T(wishes[a.wish].me) : T(bua.quote),
        detail: a.sent ? { label: T(bua.reachLabel), value: CIRCLES.slice(0, a.sent).map((c) => T(circles[c])).join(' → ') } : undefined,
        line: T(bua.quote),
        rings: a.sent,
      },
      quote: { text: T(bua.quote), by: T(companions.bua.name) },
      source: T(ms.sourceBua),
      practice: { title: T(bua.practiceTitle), body: T(bua.practiceBody) },
    }
  }

  return null
}

function Pebbles({ items, let: letBe }: { items: string[]; let?: boolean }) {
  return (
    <span className="ms-stone__pebbles">
      {items.map((p) => (
        <span key={p} className={`pebble pebble--static${letBe ? ' pebble--let' : ''}`}>
          {p}
        </span>
      ))}
    </span>
  )
}
