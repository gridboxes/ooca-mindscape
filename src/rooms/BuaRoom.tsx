import { useEffect, useState, type ReactNode } from 'react'
import { t, ui, type Lang } from '../content'
import { Footer } from '../components/Steps'
import StepTop, { useStepChange } from './StepTop'
import Lotus from '../components/companions/Lotus'
import type { Expression } from '../components/companions/Face'
import { fill, ms } from '../mindscape-content'
import BodyMap from './BodyMap'
import Lamp from './Lamp'
import KindSend from './KindSend'
import { Reveal } from '../components/reveal'
import { bua, regions, tones, wishes, type Region, type Tone, type Wish } from './bua-content'

const STEPS = 3 // notice, let it drift, pass kindness on; the card is the shared ending's
const BREATHS = 5

export interface BuaAnswers {
  regions: Region[]
  tone: Tone | null
  breaths: number
  skipped: boolean
  wish: Wish | null
  /** how many circles the kindness reached: 1 you, 2 someone you love, 3 everyone */
  sent: number
}

export interface BuaResult {
  answers: BuaAnswers
  /** an uncomfortable weight felt all over, or in much of the body: worth asking how long */
  heavy: boolean
}

/** What the landscape shows while Bua's room is open */
export interface BuaStage {
  /** how open Bua is, 0 bud to 1 bloom */
  bloom: number
  mood: Expression
  /** how muddy the pond is */
  murk: number
  /** how far the note has drifted across the water, 0 resting to 1 gone */
  drift: number
  /** kindness ripples sent out: 1 reaches Bua, 2 Hin, 3 mooca */
  rings: number
  /** the camera pulls back to the whole landscape so the ripples can reach the others */
  view: 'water' | 'all'
}

interface Props {
  lang: Lang
  thought: string
  /** coming back from the ending: reopen on the kindness */
  resume?: BuaAnswers
  onStage: (s: BuaStage) => void
  onExit: () => void
  onDone: (r: BuaResult) => void
}

function BuaSays({ mood = 'calm', children }: { mood?: Expression; children: ReactNode }) {
  return (
    <div className="ms-says ms-says--bua">
      <span className="ms-says__who" aria-hidden="true">
        <Lotus mood={mood} size={44} ripples={false} />
      </span>
      <p>{children}</p>
    </div>
  )
}

export default function BuaRoom({ lang, thought, resume, onStage, onExit, onDone }: Props) {
  const [step, setStep] = useState(resume ? 2 : 0)
  const [a, setA] = useState<BuaAnswers>(
    () => resume ?? { regions: [], tone: null, breaths: 0, skipped: false, wish: null, sent: 0 },
  )
  const T = (s: Record<Lang, string>) => s[lang]
  const settled = a.skipped ? 1 : a.breaths / BREATHS

  // Bud to bloom as the room goes on. The breaths clear the pond and carry the note away; the
  // kindness pulls the camera back and ripples out to the others.
  useEffect(() => {
    let s: BuaStage
    if (step === 0)
      s = { bloom: 0.15, mood: a.tone === 'unpleasant' ? 'tender' : 'listening', murk: 0.9, drift: 0, rings: 0, view: 'water' }
    else if (step === 1)
      s = {
        bloom: 0.25 + 0.6 * settled,
        mood: settled >= 1 ? 'happy' : 'calm',
        murk: 0.9 * (1 - settled),
        drift: settled,
        rings: 0,
        view: 'water',
      }
    else s = { bloom: 1, mood: a.sent ? 'delighted' : 'calm', murk: 0, drift: 1, rings: a.sent, view: a.sent ? 'all' : 'water' }
    onStage(s)
  }, [step, a.tone, settled, a.sent, onStage])

  useStepChange(step)

  function toggleRegion(r: Region) {
    setA((prev) => {
      const has = prev.regions.includes(r)
      if (has) return { ...prev, regions: prev.regions.filter((x) => x !== r) }
      // "All over" and "Nowhere I can find" stand alone
      if (r === 'whole' || r === 'nowhere') return { ...prev, regions: [r] }
      return { ...prev, regions: [...prev.regions.filter((x) => x !== 'whole' && x !== 'nowhere'), r] }
    })
  }

  const canNext = step === 0 ? a.regions.length > 0 && !!a.tone : step === 1 ? settled >= 1 : a.sent > 0

  function finish() {
    onDone({
      answers: a,
      heavy: a.tone === 'unpleasant' && (a.regions.includes('whole') || a.regions.length >= 3),
    })
  }

  let body: ReactNode
  if (step === 0) {
    body = (
      <>
        <BuaSays mood="tender">{fill(T(bua.intro), { thought })}</BuaSays>
        <header className="step-head">
          <h1 className="step-title">{T(bua.qBody)}</h1>
          <p className="step-sub">{T(bua.qBodySub)}</p>
        </header>
        <BodyMap
          selected={a.regions}
          onToggle={toggleRegion}
          labels={{
            head: T(regions.head),
            throat: T(regions.throat),
            shoulders: T(regions.shoulders),
            chest: T(regions.chest),
            stomach: T(regions.stomach),
            whole: T(regions.whole),
            nowhere: T(regions.nowhere),
          }}
          groupLabel={T(bua.qBody)}
        />
        {a.regions.length > 0 && (
          <Reveal className="ms-tone" aria-live="polite">
            <h3 className="word-pick__title">{T(bua.qTone)}</h3>
            <p className="word-pick__sub">{T(bua.toneSub)}</p>
            <div className="chips" role="radiogroup" aria-label={T(bua.qTone)}>
              {(Object.keys(tones) as Tone[]).map((tn) => (
                <button
                  key={tn}
                  type="button"
                  role="radio"
                  aria-checked={a.tone === tn}
                  className={`chip${a.tone === tn ? ' is-selected' : ''}`}
                  onClick={() => setA({ ...a, tone: tn })}
                >
                  {T(tones[tn].label)}
                </button>
              ))}
            </div>
          </Reveal>
        )}
        {a.tone && (
          <BuaSays key={a.tone} mood={a.tone === 'unpleasant' ? 'tender' : 'calm'}>
            {T(tones[a.tone].reply)}
          </BuaSays>
        )}
      </>
    )
  } else if (step === 1) {
    body = (
      <>
        <header className="step-head">
          <h1 className="step-title">{T(bua.qSettle)}</h1>
          <p className="step-sub">{T(bua.qSettleSub)}</p>
        </header>
        <Lamp lang={lang} total={BREATHS} count={a.breaths} onBreath={(n) => setA((prev) => ({ ...prev, breaths: n }))} />
        {settled < 1 && (
          <button type="button" className="btn btn--link ms-skip" onClick={() => setA({ ...a, skipped: true })}>
            {T(bua.skipBreaths)}
          </button>
        )}
        {settled >= 1 && <BuaSays mood="happy">{T(bua.drifted)}</BuaSays>}
      </>
    )
  } else {
    body = (
      <>
        <header className="step-head">
          <h1 className="step-title">{T(bua.qKind)}</h1>
          <p className="step-sub">{T(bua.qKindSub)}</p>
        </header>
        {/* The wishes stay put once it's on its way, so nothing jumps; the others just dim */}
        <div className="ms-options ms-wishes" role="radiogroup" aria-label={T(bua.qKind)}>
          {(Object.keys(wishes) as Wish[]).map((w) => {
            const locked = a.sent > 0 && a.wish !== w
            return (
              <button
                key={w}
                type="button"
                role="radio"
                aria-checked={a.wish === w}
                disabled={locked}
                className={`ms-option${a.wish === w ? ' is-selected' : ''}${locked ? ' is-locked' : ''}`}
                onClick={() => a.sent === 0 && setA({ ...a, wish: w })}
              >
                <b>{T(wishes[w].me)}</b>
              </button>
            )
          })}
        </div>
        {a.wish && <KindSend lang={lang} wish={a.wish} sent={a.sent} onSent={(n) => setA((prev) => ({ ...prev, sent: n }))} />}
      </>
    )
  }

  return (
    <div className="ms-step ms-room-bua">
      <StepTop lang={lang} onBack={() => (step === 0 ? onExit() : setStep(step - 1))} step={step + 1} total={STEPS} />

      <div className="flow__body" key={step}>
        {body}
      </div>

      {/* While breathing, the lamp's own button is the only action; Next appears once the note has drifted */}
      {(step !== 1 || canNext) && (
        <Footer>
          {step < 2 ? (
            <button type="button" className="btn btn--primary btn--grow" disabled={!canNext} onClick={() => setStep(step + 1)}>
              {t(ui.next, lang)}
            </button>
          ) : (
            <button type="button" className="btn btn--primary btn--grow" disabled={!canNext} onClick={finish}>
              {t(ms.seeCard, lang)}
            </button>
          )}
        </Footer>
      )}
    </div>
  )
}
