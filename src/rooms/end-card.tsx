import type { ReactNode } from 'react'
import { actions, weathers, type Lang, type Weather } from '../content'
import { companions, fill, keepLines, ms, type Theme } from '../mindscape-content'
import WeatherIcon from '../components/WeatherIcon'
import type { MoocaResult } from './MoocaRoom'
import type { HinResult } from './HinRoom'
import type { BuaResult } from './BuaRoom'
import { mooca, traps } from './mooca-content'
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
}

type Results = { mooca: MoocaResult | null; hin: HinResult | null; bua: BuaResult | null }

export function endCard(who: 'mooca' | 'hin' | 'bua', r: Results, lang: Lang, thought: string, theme: Theme): EndCard | null {
  const T = (s: Record<Lang, string>) => s[lang]

  if (who === 'mooca' && r.mooca) {
    const { answers: a, report, reframe, value, traps: softenedTraps } = r.mooca
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
    return {
      title: reframe,
      rows,
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
    return {
      title: thought,
      rows,
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
