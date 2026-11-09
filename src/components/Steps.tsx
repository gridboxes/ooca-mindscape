import type { ReactNode } from 'react'
import {
  batteries,
  weathers,
  t,
  ui,
  type Battery,
  type Lang,
  type Weather,
} from '../content'
import WeatherIcon from './WeatherIcon'
import { Reveal } from './reveal'

export function StepHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <header className="step-head">
      <h1 className="step-title">{title}</h1>
      <p className="step-sub">{sub}</p>
    </header>
  )
}

const ORDER: Weather[] = ['sunny', 'partly', 'foggy', 'rainy', 'stormy']

export function WeatherStep({
  lang,
  weather,
  word,
  onWeather,
  onWord,
}: {
  lang: Lang
  weather: Weather | null
  word: string | null
  onWeather: (w: Weather) => void
  onWord: (w: string | null) => void
}) {
  return (
    <>
      <StepHeader title={t(ui.qWeather, lang)} sub={t(ui.qWeatherSub, lang)} />
      <div className="weather-grid" role="radiogroup" aria-label={t(ui.qWeather, lang)}>
        {ORDER.map((w) => {
          const selected = weather === w
          return (
            <button
              key={w}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`weather-card weather-card--${w} ${selected ? 'is-selected' : ''}`}
              onClick={() => onWeather(w)}
            >
              <WeatherIcon weather={w} size={44} />
              <span className="weather-card__label">{t(weathers[w].label, lang)}</span>
              <span className="weather-card__hint">{t(weathers[w].hint, lang)}</span>
            </button>
          )
        })}
      </div>

      {weather && (
        <Reveal className="word-pick" aria-live="polite" key={weather}>
          <h2 className="word-pick__title">{t(ui.qWord, lang)}</h2>
          <p className="word-pick__sub">{t(ui.qWordSub, lang)}</p>
          <div className="chips" role="radiogroup" aria-label={t(ui.qWord, lang)}>
            {weathers[weather].words[lang].map((w, i) => {
              const id = weathers[weather].words.en[i]
              const selected = word === id
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={`chip ${selected ? 'is-selected' : ''}`}
                  onClick={() => onWord(selected ? null : id)}
                >
                  {w}
                </button>
              )
            })}
          </div>
        </Reveal>
      )}
    </>
  )
}

const LEVELS: Battery[] = ['low', 'mid', 'high']

export function BatteryStep({
  lang,
  value,
  onChange,
}: {
  lang: Lang
  value: Battery | null
  onChange: (b: Battery) => void
}) {
  return (
    <>
      <StepHeader title={t(ui.qBattery, lang)} sub={t(ui.qBatterySub, lang)} />
      <div className="battery-list" role="radiogroup" aria-label={t(ui.qBattery, lang)}>
        {LEVELS.map((b, i) => {
          const selected = value === b
          return (
            <button
              key={b}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`battery-option battery-option--${b} ${selected ? 'is-selected' : ''}`}
              onClick={() => onChange(b)}
            >
              <span className="battery" aria-hidden="true">
                {[0, 1, 2].map((s) => (
                  <span key={s} className={`battery__cell ${s <= i ? 'is-on' : ''}`} />
                ))}
              </span>
              <span className="battery-option__label">{t(batteries[b].label, lang)}</span>
              <span className="radio-dot" aria-hidden="true" />
            </button>
          )
        })}
      </div>
    </>
  )
}

export function ChipStep<K extends string>({
  title,
  sub,
  options,
  selected,
  multiple,
  exclusive,
  onChange,
  lang,
}: {
  title: string
  sub: string
  options: Record<K, Record<Lang, string>>
  selected: K[]
  multiple: boolean
  exclusive?: K
  onChange: (next: K[]) => void
  lang: Lang
}) {
  const keys = Object.keys(options) as K[]
  const toggle = (k: K) => {
    if (!multiple) return onChange([k])
    if (selected.includes(k)) return onChange(selected.filter((s) => s !== k))
    // "Nothing specific" / "Body feels fine" clears the others, and vice versa
    if (exclusive && k === exclusive) return onChange([k])
    return onChange([...selected.filter((s) => s !== exclusive), k])
  }
  return (
    <>
      <StepHeader title={title} sub={sub} />
      <div
        className={multiple ? 'chips chips--lg' : 'choice-list'}
        role={multiple ? 'group' : 'radiogroup'}
        aria-label={title}
      >
        {keys.map((k) => {
          const on = selected.includes(k)
          return (
            <button
              key={k}
              type="button"
              role={multiple ? 'checkbox' : 'radio'}
              aria-checked={on}
              className={`${multiple ? 'chip chip--lg' : 'choice'} ${on ? 'is-selected' : ''}`}
              onClick={() => toggle(k)}
            >
              {multiple && <Check on={on} />}
              <span>{t(options[k], lang)}</span>
              {!multiple && <span className="radio-dot" aria-hidden="true" />}
            </button>
          )
        })}
      </div>
    </>
  )
}

function Check({ on }: { on: boolean }) {
  return (
    <span className={`check ${on ? 'is-on' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 16 16" width="12" height="12">
        <path d="M3 8.5 l3 3 l7 -7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export function Progress({ step, total, label }: { step: number; total: number; label: string }) {
  return (
    <div className="progress" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step} aria-label={label}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`progress__seg ${i < step ? 'is-done' : ''}`} />
      ))}
    </div>
  )
}

export function Footer({ children }: { children: ReactNode }) {
  return <div className="step-foot">{children}</div>
}
