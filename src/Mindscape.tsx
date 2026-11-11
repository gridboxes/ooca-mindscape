import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import PhoneIcon from './components/PhoneIcon'
import { flushSync } from 'react-dom'
import { buildReport, t, ui, type Duration, type Lang, type Tier, type Weather } from './content'
import {
  COMPANION_ORDER,
  atRisk,
  companions,
  fill,
  moocaPicks,
  ms,
  themeOf,
  thoughts,
  voices,
  type Companion,
  type Theme,
} from './mindscape-content'
import Landscape, { type Focus } from './components/Landscape'
import Avatar, { MOOCA_FACE } from './components/companions/Avatar'
import type { Expression, Mood, NewMood } from './components/companions/Face'
import CrisisSheet from './components/CrisisSheet'
import StepTop, { JourneyBar, JourneyProvider, useJourney } from './rooms/StepTop'
import MoocaRoom, { type MoocaResult } from './rooms/MoocaRoom'
import { UNSURE } from './rooms/mooca-content'
import HinRoom, { type HinResult, type HinStage } from './rooms/HinRoom'
import BuaRoom, { type BuaResult, type BuaStage } from './rooms/BuaRoom'
import Ending, { type EndingProgress } from './rooms/Ending'
import { endCard } from './rooms/end-card'
import HealPoster from './components/HealPoster'
import './mindscape.css'

type Phase = 'landing' | 'thought' | 'voices' | 'mooca' | 'hin' | 'bua' | 'ending'

const LANG_KEY = 'ooca-mindscape:lang'

// The moment before the card: the chosen friend cheers, one line names what happened, then the
// note flies into the card's place (a tap skips ahead)
const MOMENT_MS = 2400

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY)
    if (saved === 'en' || saved === 'th') return saved
  } catch {
    // ignore
  }
  return navigator.language?.startsWith('th') ? 'th' : 'en'
}

// Survives a refresh (this tab only): where you were and what you've shared. A room that was
// half-done starts again from its first question; a finished card comes back as it was.
const SAVE_KEY = 'ooca-mindscape:session'

interface Saved {
  phase: Phase
  thought: Thought | null
  writing: boolean
  draft: string
  lean: Companion | null
  chosen: Companion | null
  flagged: boolean
  moocaResult: MoocaResult | null
  hinResult: HinResult | null
  buaResult: BuaResult | null
  /** how far into the ending: the answer to "how long", and whether the card was showing */
  ending?: EndingProgress
}

function loadSaved(): Saved | null {
  try {
    const raw = sessionStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const s = JSON.parse(raw) as Saved
    const result = s.chosen === 'mooca' ? s.moocaResult : s.chosen === 'hin' ? s.hinResult : s.chosen === 'bua' ? s.buaResult : null
    if (s.phase === 'ending' && !result) s.phase = s.chosen ? s.chosen : 'voices'
    if (!s.thought && s.phase !== 'landing' && s.phase !== 'thought') s.phase = 'thought'
    return s
  } catch {
    return null
  }
}

const saved = loadSaved()

const PLACE: Record<Companion, Focus> = { mooca: 'sky', hin: 'earth', bua: 'water' }

interface Thought {
  text: string
  theme: Theme
  /** index into `thoughts`, so the chip follows a language switch */
  chip: number | null
}

export default function Mindscape() {
  const [lang, setLang] = useState<Lang>(initialLang)
  const [phase, setPhase] = useState<Phase>(saved?.phase ?? 'landing')
  const [thought, setThought] = useState<Thought | null>(saved?.thought ?? null)
  const [writing, setWriting] = useState(saved?.writing ?? false)
  const [draft, setDraft] = useState(saved?.draft ?? '')
  // the voice picked on the voices step, before going into its room
  const [lean, setLean] = useState<Companion | null>(saved?.lean ?? null)
  const [chosen, setChosen] = useState<Companion | null>(saved?.chosen ?? null)
  const [helpOpen, setHelpOpen] = useState(false)
  const [flagged, setFlagged] = useState(saved?.flagged ?? false)
  // mooca's room: the sky it's showing, and what the check-in found
  const [sky, setSky] = useState<Weather | null>(null)
  const [moocaResult, setMoocaResult] = useState<MoocaResult | null>(saved?.moocaResult ?? null)
  // the silver lining's glow, and the note as it softens
  const [moocaGlow, setMoocaGlow] = useState(false)
  const [moocaNote, setMoocaNote] = useState<string | null>(null)
  // Hin's room: where its camera looks and how Hin feels, and what the sitting found
  const [hinStage, setHinStage] = useState<HinStage>({ mood: 'listening', lift: 0, steps: 0 })
  const [hinResult, setHinResult] = useState<HinResult | null>(saved?.hinResult ?? null)
  // Bua's room: how open Bua is, how it looks, how muddy the pond is, and what it found
  const [buaStage, setBuaStage] = useState<BuaStage>({ bloom: 0.1, mood: 'listening', murk: 0.9, drift: 0, rings: 0, view: 'water' })
  const [buaResult, setBuaResult] = useState<BuaResult | null>(saved?.buaResult ?? null)
  // how far into the ending, so a refresh on the card comes back to the card
  const [ending, setEnding] = useState<EndingProgress | undefined>(saved?.phase === 'ending' ? saved.ending : undefined)
  const onProgress = useCallback((p: EndingProgress) => setEnding(p), [])
  // leaving the ending (back into a room, or starting over) means the next ending starts fresh
  useEffect(() => {
    if (phase !== 'ending') setEnding(undefined)
  }, [phase])
  // coming back to a card after a refresh skips the moment before it: you've already had it
  const backOnCard = useRef(saved?.phase === 'ending' && !!saved.ending?.closing)
  const cardRef = useRef<HTMLElement>(null)
  // The card's own page: first a moment in the whole landscape, then the page takes over
  const [final, setFinal] = useState<'off' | 'moment' | 'page'>('off')
  const journey = useJourney()

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(LANG_KEY, lang)
    } catch {
      // ignore
    }
  }, [lang])

  useEffect(() => {
    try {
      const snap: Saved = { phase, thought, writing, draft, lean, chosen, flagged, moocaResult, hinResult, buaResult, ending }
      sessionStorage.setItem(SAVE_KEY, JSON.stringify(snap))
    } catch {
      // ignore
    }
  }, [phase, thought, writing, draft, lean, chosen, flagged, moocaResult, hinResult, buaResult, ending])

  // Each step lands focus on its heading so screen readers follow along
  useEffect(() => {
    const h = cardRef.current?.querySelector<HTMLElement>('h1, h2')
    h?.setAttribute('tabindex', '-1')
    h?.focus({ preventScroll: true })
    // The thought list needs the room; every other step keeps the landscape in view, since
    // that's where the note lands and the camera moves
    if (phase === 'thought') cardRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [phase])

  const noteText = thought ? (thought.chip !== null ? t(thoughts[thought.chip].text, lang) : thought.text) : null
  // In mooca's room the note rewrites itself as words soften, and leaves softened
  const shownNote =
    phase === 'mooca' && moocaNote ? moocaNote : phase === 'ending' && chosen === 'mooca' && moocaResult ? moocaResult.reframe[lang] ?? '' : noteText

  // How the three react: soften when you share a thought, listen, and brighten when you pick one of them
  function moodOf(c: Companion): Expression {
    if (phase === 'landing') return 'calm'
    if (phase === 'thought') return thought ? 'tender' : 'listening'
    // at the end the chosen friend is delighted, and in the moment before the card the others are glad for it
    if (phase === 'ending') return c === chosen ? 'delighted' : final === 'moment' ? 'happy' : 'calm'
    if (phase === 'mooca') return c === 'mooca' ? 'listening' : 'calm'
    if (phase === 'hin') return c === 'hin' ? hinStage.mood : 'calm'
    // Bua's kindness brightens Hin when the second ring reaches it, and mooca with the third
    if (phase === 'bua') return c === 'bua' ? buaStage.mood : buaStage.rings >= (c === 'hin' ? 2 : 3) ? 'delighted' : 'calm'
    if (phase === 'voices') return lean === c ? 'happy' : 'listening'
    return 'listening'
  }

  // mooca's first four moods are weather faces; the newer ones draw over its plain cloud
  const moocaMoodNow = moodOf('mooca')
  const moocaFace: { weather: Weather | null; mood?: NewMood } =
    moocaMoodNow in MOOCA_FACE ? { weather: MOOCA_FACE[moocaMoodNow as Mood] } : { weather: null, mood: moocaMoodNow as NewMood }

  function pickChip(i: number) {
    setThought({ text: '', theme: thoughts[i].theme, chip: i })
  }

  function submitThought() {
    if (writing) {
      const text = draft.trim()
      if (!text) return
      setThought({ text, theme: themeOf(text), chip: null })
      const risk = atRisk(text)
      setFlagged(risk)
      if (risk) setHelpOpen(true)
    }
    setPhase('voices')
  }

  // Into the chosen room, fresh
  function enter(c: Companion) {
    setEnding(undefined)
    setChosen(c)
    if (c === 'mooca') setMoocaResult(null)
    else if (c === 'hin') setHinResult(null)
    else setBuaResult(null)
    setPhase(c)
  }

  const onFinal = useCallback((open: boolean) => {
    if (!open) return setFinal('off')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches || backOnCard.current
    setFinal((f) => (f === 'off' ? (still ? 'page' : 'moment') : f))
  }, [])

  // Once the card's page is showing, its title takes focus (it was hidden during the moment)
  useEffect(() => {
    if (final !== 'page') return
    // the card is back on screen; from here on, endings play their moment again
    backOnCard.current = false
    const h = document.querySelector<HTMLElement>('.ms__card h1')
    h?.setAttribute('tabindex', '-1')
    h?.focus({ preventScroll: true })
  }, [final])

  // From the moment to the card's page, in two beats so nothing ever cuts:
  //  1. Lift: a paper copy of the note rises out of the scene, straightens and grows toward the
  //     middle of the screen, while the landscape softly blurs, sinks back and fades behind it.
  //  2. Land: with the scene gone, the page swaps underneath (unseen), and the card rises in around
  //     the note as it settles onto its own words on the card (the softened line for mooca, the
  //     thought you brought for Hin and Bua). The thought you carried becomes the thing you keep.
  const [lifting, setLifting] = useState(false)
  const leaving = useRef(false)
  const toPage = useCallback(() => {
    if (leaving.current) return
    leaving.current = true
    const ease = 'cubic-bezier(.22,1,.36,1)'
    const paper = document.querySelector('.landscape__note-paper')
    const from = paper?.getBoundingClientRect()
    const words = [...(paper?.querySelectorAll('tspan') ?? [])].map((l) => l.textContent).join(' ')
    const stage = document.querySelector<HTMLElement>('.ms__stage')
    const settle = () => {
      flushSync(() => {
        setLifting(false)
        setFinal('page')
      })
      window.scrollTo({ top: 0, behavior: 'instant' })
      // the stage now holds the poster (or nothing, on phones): let it show again
      stage?.getAnimations().forEach((a) => a.cancel())
    }
    if (!from || !from.width || !stage) {
      settle()
      leaving.current = false
      return
    }

    // the note's paper, as it looks in the scene
    const line = paper?.querySelector('tspan')?.getBoundingClientRect()
    const startSize = line ? Math.max(9, line.height / 1.25) : 12
    const ghost = document.createElement('div')
    ghost.className = 'ms-note-fly'
    ghost.setAttribute('aria-hidden', 'true')
    ghost.textContent = words
    document.body.append(ghost)
    // only the width is set: the paper's height follows its words as they grow
    const box = (x: number, y: number, w: number) => ({ left: `${x}px`, top: `${y}px`, width: `${w}px` })
    const paperLook = (size: number, lift: number) => ({
      backgroundColor: '#fffdf7',
      boxShadow: `0 ${8 + lift * 16}px ${20 + lift * 30}px rgba(38, 49, 60, ${0.14 + lift * 0.08})`,
      fontSize: `${size}px`,
      color: '#3f6866',
      padding: `${Math.round(size * 0.6)}px ${Math.round(size * 0.9)}px`,
    })

    // 1. Lift: to the middle of the screen, a third bigger, straightened
    const k = 1.35
    const w = from.width * k
    const h = from.height * k
    const mx = window.innerWidth / 2 - w / 2
    const my = Math.min(window.innerHeight * 0.42, from.top + from.height / 2) - h / 2
    setLifting(true)
    stage.animate(
      [
        { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' },
        { opacity: 0, transform: 'scale(0.94)', filter: 'blur(8px)' },
      ],
      { duration: 700, easing: 'ease-in', fill: 'forwards' },
    )
    ghost.animate(
      [
        { ...box(from.left, from.top, from.width), ...paperLook(startSize, 0), transform: 'rotate(-4deg)' },
        { ...box(mx, my, w), ...paperLook(startSize * k, 1), transform: 'rotate(0deg)' },
      ],
      { duration: 700, easing: ease, fill: 'forwards' },
    ).onfinish = () => {
      // 2. Land: the page swaps under the empty screen, then the card rises in around the note
      settle()
      const card = document.querySelector<HTMLElement>('.ms-final .pc')
      if (!card) return ghost.remove()
      const plain = (x: string | null | undefined) => (x ?? '').replace(/[“”"〜~\s]/g, '').toLowerCase()
      const spot =
        [...card.querySelectorAll<HTMLElement>('.pc__after, .pc__before')].find((el) => plain(el.textContent) === plain(words)) ??
        card.querySelector<HTMLElement>('.pc__after') ??
        card
      // measure where the words will rest once the card has settled (skip its own rise)
      document.querySelector('.ms-final')?.getAnimations().forEach((a) => a.finish())
      const to = spot.getBoundingClientRect()
      const look = getComputedStyle(spot)
      // the card's own line (with its quote marks) and type, so the words wrap the same way when they land
      ghost.textContent = spot.textContent ?? words
      ghost.style.textAlign = look.textAlign
      ghost.style.fontWeight = look.fontWeight
      ghost.style.lineHeight = String(parseFloat(look.lineHeight) / parseFloat(look.fontSize) || 1.25)
      ghost.style.letterSpacing = look.letterSpacing
      ghost.style.fontFamily = look.fontFamily
      ghost.style.setProperty('text-wrap', look.getPropertyValue('text-wrap') || 'wrap')
      ghost.style.justifyItems = look.textAlign === 'center' ? 'center' : 'start'
      ghost.style.alignItems = 'start'
      ghost.getAnimations().forEach((a) => a.cancel())
      const landed = {
        ...box(to.left, to.top, to.width),
        backgroundColor: 'rgba(255, 253, 247, 0)',
        boxShadow: '0 0 0 rgba(38, 49, 60, 0)',
        fontSize: look.fontSize,
        color: look.color,
        padding: '0px',
        transform: 'rotate(0deg)',
      }
      ghost.animate(
        [
          { ...box(mx, my, w), ...paperLook(startSize * k, 1), transform: 'rotate(0deg)', opacity: 1, easing: ease },
          { ...landed, opacity: 1, offset: 0.8 },
          { ...landed, opacity: 0 },
        ],
        { duration: 900, fill: 'forwards' },
      ).onfinish = () => ghost.remove()
      // the card's own line stays hidden until the note touches down, so the words never show twice
      spot.animate([{ opacity: 0 }, { opacity: 0, offset: 0.78 }, { opacity: 1 }], { duration: 900, fill: 'backwards' })
      // the card and the rest of the page rise in around the landing note
      card.animate(
        [
          { opacity: 0, transform: 'translateY(24px) scale(0.98)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 700, delay: 120, easing: ease, fill: 'backwards' },
      )
      document.querySelectorAll<HTMLElement>('.ms-final > :not(.ms-final__keep), .ms-final__keep > :not(.pc), .ms__stage .poster, .ms__card .journey').forEach((el, i) =>
        el.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], {
          duration: 600,
          delay: 380 + i * 60,
          easing: ease,
          fill: 'backwards',
        }),
      )
    }
  }, [])

  useEffect(() => {
    if (final === 'off') leaving.current = false
    if (final !== 'moment') return
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const id = window.setTimeout(toPage, MOMENT_MS)
    return () => window.clearTimeout(id)
  }, [final, toPage])

  function restart() {
    setPhase('landing')
    setThought(null)
    setDraft('')
    setWriting(false)
    setChosen(null)
    setLean(null)
    setFlagged(false)
    setSky(null)
    setMoocaResult(null)
    setHinResult(null)
    setBuaResult(null)
    setEnding(undefined)
  }

  // Heavy: the room saw a heavy signal, or the written thought tripped the crisis check
  const roomHeavy = chosen === 'mooca' ? !!moocaResult?.heavy : chosen === 'hin' ? !!hinResult?.heavy : !!buaResult?.heavy
  const heavy = roomHeavy || flagged

  // Each room reads its own next step; anything heavy that has lasted weeks earns the offer
  // to talk to someone. A written thought that tripped the crisis check always does.
  function tierFor(d: Duration | null): Tier {
    if (flagged) return 'care'
    if (chosen === 'mooca' && moocaResult) return buildReport({ ...moocaResult.answers, duration: d }).tier
    if (!heavy) return 'keep'
    return d === 'weeks' ? 'care' : 'watch'
  }

  function back() {
    if (phase === 'thought') setPhase('landing')
    else if (phase === 'voices') setPhase('thought')
  }

  const canNext = phase === 'thought' ? (writing ? draft.trim().length > 0 : thought?.chip != null) : true
  const focus: Focus =
    phase === 'hin'
      ? 'earth'
      : phase === 'bua'
        ? buaStage.view === 'all'
          ? 'all'
          : 'water'
        : phase === 'mooca'
          ? PLACE[phase]
        : phase === 'voices' && lean
          ? PLACE[lean]
          : 'all'
  const theme = thought?.theme ?? 'general'
  // The room's findings, laid out as the one card at the end
  const endingCard =
    phase === 'ending' && chosen
      ? endCard(chosen, { mooca: moocaResult, hin: hinResult, bua: buaResult }, lang, noteText ?? '', theme)
      : null

  // Where this screen sits in the journey: thought, voices, room, card
  const part = phase === 'thought' ? 0 : phase === 'voices' ? 1 : phase === 'ending' ? 3 : 2
  const intro =
    chosen && part === 2
      ? fill(t(ms.roomKicker, lang), { name: t(companions[chosen].name, lang), method: t(companions[chosen].method, lang) })
      : undefined
  // On the card's page the top row carries its title, beside the back button like the room labels
  const finalTitle = phase === 'ending' && final !== 'off' ? t(ms.closingTitle, lang) : undefined

  let card: ReactNode
  if (phase === 'landing') {
    card = (
      <div className="ms-land">
        <p className="ms-kicker">{t(ms.landKicker, lang)}</p>
        <h1 className="ms-title ms-title--lg">{t(ms.landTitle, lang)}</h1>
        <p className="ms-body">{t(ms.landBody, lang)}</p>
        <ul className="ms-trio" aria-hidden="true">
          {COMPANION_ORDER.map((c) => (
            <li key={c}>
              <Avatar who={c} size={64} />
              <span>
                <b>{t(companions[c].name, lang)}</b>
                {t(companions[c].lens, lang)}
              </span>
            </li>
          ))}
        </ul>
        <div className="ms-land__foot">
          <button type="button" className="btn btn--primary ms-cta" onClick={() => setPhase('thought')}>
            {t(ms.start, lang)}
          </button>
        </div>
      </div>
    )
  } else if (phase === 'thought') {
    card = (
      <div className="ms-step">
        <div className="step-head">
          <h1 className="step-title">{t(ms.qThought, lang)}</h1>
          <p className="step-sub">{t(ms.qThoughtSub, lang)}</p>
        </div>
        {writing ? (
          <div className="ms-write">
            <textarea
              className="ms-textarea"
              value={draft}
              maxLength={120}
              rows={3}
              placeholder={t(ms.writePlaceholder, lang)}
              aria-label={t(ms.qThought, lang)}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
            />
            <p className="ms-hint">{t(ms.writeNote, lang)}</p>
            <button type="button" className="btn btn--link ms-switch" onClick={() => setWriting(false)}>
              {t(ms.useChips, lang)}
            </button>
          </div>
        ) : (
          <div className="ms-thoughts" role="radiogroup" aria-label={t(ms.qThought, lang)}>
            {thoughts.map((th, i) => (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={thought?.chip === i}
                className={`chip ms-thought${thought?.chip === i ? ' is-selected' : ''}`}
                onClick={() => pickChip(i)}
              >
                {t(th.text, lang)}
              </button>
            ))}
            <button type="button" className="chip ms-thought ms-thought--own" onClick={() => setWriting(true)}>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  d="M4 20 h4 L19 9 a2.1 2.1 0 0 0 -4 -4 L4 16 Z M13.5 6.5 l4 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t(ms.writeOwn, lang)}
            </button>
          </div>
        )}
        <div className="step-foot">
          <button type="button" className="btn btn--primary btn--grow" disabled={!canNext} onClick={submitThought}>
            {t(ms.showMe, lang)}
          </button>
        </div>
      </div>
    )
  } else if (phase === 'voices') {
    card = (
      <div className="ms-step">
        <div className="step-head">
          <h1 className="step-title">{t(ms.qVoices, lang)}</h1>
          <p className="step-sub">{t(ms.qVoicesSub, lang)}</p>
        </div>
        {flagged && (
          <div className="ms-care" role="note">
            <p>
              <b>{t(ms.riskTitle, lang)}</b> {t(ms.riskBody, lang)}
            </p>
            <a className="btn btn--secondary" href="tel:1323">
              <PhoneIcon /> 1323
            </a>
          </div>
        )}
        <ul className="ms-voices" role="radiogroup" aria-label={t(ms.qVoices, lang)}>
          {COMPANION_ORDER.map((c, i) => (
            <li key={c} style={{ animationDelay: `${0.1 + i * 0.2}s` }}>
              <button
                type="button"
                role="radio"
                aria-checked={lean === c}
                className={`ms-voice ms-voice--${c}${lean === c ? ' is-selected' : ''}`}
                onClick={() => setLean(c)}
              >
                <span className="ms-voice__avatar" aria-hidden="true">
                  <Avatar who={c} mood={lean === c ? 'happy' : 'listening'} size={56} />
                </span>
                <span className="ms-voice__text">
                  <span className="ms-voice__who">
                    <b>{t(companions[c].name, lang)}</b> · {t(companions[c].lens, lang)}
                  </span>
                  <span className="ms-voice__line">“{t(voices[theme][c], lang)}”</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="btn btn--ghost ms-notsure" onClick={() => setLean(moocaPicks[theme])}>
          {t(ms.notSure, lang)}
        </button>
        {theme === 'meaning' && <p className="ms-safety">{t(ms.meaningNote, lang)}</p>}
        <div className="step-foot">
          <button type="button" className="btn btn--primary btn--grow" disabled={!lean} onClick={() => lean && enter(lean)}>
            {lean ? fill(t(ms.goWith, lang), { name: t(companions[lean].name, lang) }) : t(ui.next, lang)}
          </button>
        </div>
      </div>
    )
  } else if (phase === 'mooca') {
    card = (
      <MoocaRoom
        lang={lang}
        thought={noteText ?? ''}
        theme={theme}
        resume={moocaResult?.answers}
        chip={thought?.chip ?? null}
        onSky={setSky}
        onGlow={setMoocaGlow}
        onNote={setMoocaNote}
        onExit={() => setPhase('voices')}
        onDone={(r) => {
          setMoocaResult(r)
          setPhase('ending')
        }}
      />
    )
  } else if (phase === 'hin') {
    card = (
      <HinRoom
        lang={lang}
        thought={noteText ?? ''}
        theme={theme}
        resume={hinResult?.answers}
        onStage={setHinStage}
        onExit={() => setPhase('voices')}
        onDone={(r) => {
          setHinResult(r)
          setPhase('ending')
        }}
      />
    )
  } else if (phase === 'bua') {
    card = (
      <BuaRoom
        lang={lang}
        thought={noteText ?? ''}
        resume={buaResult?.answers}
        onStage={setBuaStage}
        onExit={() => setPhase('voices')}
        onDone={(r) => {
          setBuaResult(r)
          setPhase('ending')
        }}
      />
    )
  } else if (phase === 'ending' && endingCard && chosen) {
    card = (
      <Ending
        lang={lang}
        who={chosen}
        theme={theme}
        card={endingCard}
        heavy={heavy}
        tierFor={tierFor}
        onBack={() => setPhase(chosen)}
        onRestart={restart}
        onHelp={() => setHelpOpen(true)}
        onFinal={onFinal}
        resume={ending}
        onProgress={onProgress}
      />
    )
  }

  // On the ending page the ooca Garden poster always takes the landscape's place
  const poster = phase === 'ending' && final === 'page'

  return (
    <div className={`app ms ms--${phase}${phase === 'ending' && final !== 'off' ? ` ms--final-${final}` : ''}${poster ? ' ms--poster' : ''}${lifting ? ' ms--lifting' : ''}`} data-place={focus} data-friend={part >= 2 ? (chosen ?? undefined) : undefined}>
      <div className="sky-bg" aria-hidden="true" />
      <header className="topbar">
        <button type="button" className="brand" onClick={restart} aria-label="ooca Mindscape, start over">
          <span className="logo-word">ooca</span>
          <span className="brand__divider" aria-hidden="true" />
          <span className="brand__name">{t(ms.brand, lang)}</span>
        </button>
        <div className="topbar__right">
          <div className="lang" role="group" aria-label="Language">
            {(['th', 'en'] as Lang[]).map((l) => (
              <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button type="button" className="help-btn" onClick={() => setHelpOpen(true)} aria-label={t(ui.helpNow, lang)}>
            <PhoneIcon />
            <span className="help-btn__text">{t(ui.helpNow, lang)}</span>
          </button>
        </div>
      </header>

      <main className="ms__main">
        <div className="ms__stage" onClick={final === 'moment' ? toPage : undefined}>
          {poster && chosen && <HealPoster lang={lang} who={chosen} theme={theme} />}
          {final === 'moment' && chosen && (
            <p className="ms-moment-line" role="status">
              {t(ms.momentLine[chosen], lang)}
              <small>{t(ms.momentKeep, lang)}</small>
            </p>
          )}
          <Landscape
            focus={focus}
            fit="slice"
            moocaWeather={
              phase === 'mooca' ? (sky ?? 'partly') : phase === 'ending' && chosen === 'mooca' ? 'sunny' : moocaFace.weather
            }
            moocaMood={phase === 'mooca' ? undefined : moocaFace.mood}
            moocaEffects={phase === 'mooca' && !!sky}
            rockMood={moodOf('hin')}
            lotusMood={moodOf('bua')}
            lotusBloom={phase === 'bua' ? buaStage.bloom : undefined}
            pondMurk={phase === 'bua' ? buaStage.murk : 0}
            kindRings={phase === 'bua' ? buaStage.rings : phase === 'ending' && chosen === 'bua' ? (buaResult?.answers.sent ?? 0) : 0}
            noteDrift={phase === 'bua' ? buaStage.drift : 0}
            lift={phase === 'hin' ? hinStage.lift : 0}
            hinSteps={
              phase === 'hin'
                ? hinStage.steps
                : phase === 'ending' && chosen === 'hin' && hinResult?.answers.virtue
                  ? Math.min(hinResult.answers.places.filter((p) => p === 'mine').length, 5)
                  : 0
            }
            note={phase === 'landing' || phase === 'thought' ? null : shownNote}
            moocaGlow={(phase === 'mooca' && moocaGlow) || (phase === 'ending' && chosen === 'mooca' && moocaResult?.answers.value != null && moocaResult.answers.value !== UNSURE)}
            noteAt={focus}
            noteStamp={phase === 'ending' ? chosen : null}
          />
        </div>

        <section ref={cardRef} className="ms__card">
          {phase !== 'landing' && (
            <JourneyBar lang={lang} place={journey.place} onBack={() => journey.back.current()} intro={finalTitle ?? intro} heading={!!finalTitle} />
          )}
          <JourneyProvider value={journey.value}>
            {(phase === 'thought' || phase === 'voices') && <StepTop onBack={back} />}
            <div className="ms__body" key={phase}>
              {card}
            </div>
          </JourneyProvider>
        </section>
      </main>

      <CrisisSheet lang={lang} open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}
