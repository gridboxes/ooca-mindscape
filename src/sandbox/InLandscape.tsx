import { useState, type CSSProperties } from 'react'
import Landscape, { type Focus, type SoftGround } from '../components/Landscape'
import type { Expression, Mood, NewMood } from '../components/companions/Face'
import { MOOCA_FACE } from '../components/companions/Avatar'
import { BuaRepaint, HinRepaint, MoocaFloat, MoocaMochi } from './SoftFamily'
import OldMooca from './legacy/OldMooca'
import OldRock from './legacy/OldRock'
import OldLotus from './legacy/OldLotus'

const MOODS: Expression[] = ['calm', 'listening', 'happy', 'concerned', 'tender', 'thinking', 'delighted']
const FOCI: { key: Focus; label: string }[] = [
  { key: 'all', label: 'Whole scene' },
  { key: 'sky', label: 'mooca’s sky' },
  { key: 'earth', label: 'Hin’s ground' },
  { key: 'water', label: 'Bua’s pond' },
]

/**
 * The finalists where they'll actually live: the landscape, with the camera moves the rooms use.
 * The earlier flat look first, for reference, then the new finish with mooca Version 2 and with F3.
 */
export default function InLandscape() {
  const [mood, setMood] = useState<Expression>('listening')
  const [focus, setFocus] = useState<Focus>('all')
  const rock = (m: Expression, size: number) => <HinRepaint mood={m} size={size} />
  const lotus = (m: Expression, size: number) => <BuaRepaint mood={m} size={size} ripples={false} />
  const scenes = [
    {
      key: 'now',
      title: 'Before',
      note: 'The earlier flow: flat scene, the earlier characters.',
      props: {
        look: 'flat' as const,
        moocaShadow: false,
        renderMooca: (size: number) =>
          mood in MOOCA_FACE ? (
            <OldMooca weather={MOOCA_FACE[mood as Mood]} size={size} effects={false} />
          ) : (
            <OldMooca mood={mood as NewMood} size={size} effects={false} />
          ),
        renderRock: (m: Expression, size: number) => <OldRock mood={m} size={size} />,
        renderLotus: (m: Expression, size: number) => <OldLotus mood={m} size={size} ripples={false} />,
      },
    },
    {
      key: 'v2',
      title: 'New · mooca Version 2',
      note: 'Soft scene. mooca with its small body, floating.',
      props: { look: 'soft' as const, moocaShadow: true, renderMooca: (size: number) => <MoocaFloat mood={mood} size={size} shadow={false} />, renderRock: rock, renderLotus: lotus },
    },
    {
      key: 'f3',
      title: 'New · mooca F3 Mochi',
      note: 'Soft scene. mooca as one soft shape, feet and hands tucked.',
      props: { look: 'soft' as const, moocaShadow: true, renderMooca: (size: number) => <MoocaMochi mood={mood} size={size} shadow={false} />, renderRock: rock, renderLotus: lotus },
    },
  ]
  return (
    <section className="sbx__lineup" aria-labelledby="in-landscape">
      <h2 id="in-landscape">In the landscape · Version 2 or F3</h2>
      <p className="sbx__intro">
        Both moocas in the scene they live in, beside the earlier look for reference. The scene is repainted to match: soft gradients, warm morning light,
        puffy clouds with lavender undersides, and light on the pond. Try the camera moves the rooms use.
      </p>
      <div className="sbx__moodbar" role="group" aria-label="Camera">
        {FOCI.map((f) => (
          <button key={f.key} type="button" className="chip" aria-pressed={focus === f.key} onClick={() => setFocus(f.key)}>
            {f.label}
          </button>
        ))}
      </div>
      <div className="sbx__moodbar" role="group" aria-label="Mood">
        {MOODS.map((m) => (
          <button key={m} type="button" className="chip" aria-pressed={mood === m} onClick={() => setMood(m)}>
            {m}
          </button>
        ))}
      </div>
      <div className="sbx__scenes">
        {scenes.map((s) => (
          <figure key={s.key}>
            <div className="sbx__scene" style={{ '--ratio': '390 / 560' } as CSSProperties}>
              <Landscape focus={focus} rockMood={mood} lotusMood={mood} {...s.props} />
            </div>
            <figcaption>
              <b>{s.title}</b>
              {s.note}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

const GROUNDS: { key: SoftGround; title: string; note: string }[] = [
  { key: 'hill', title: 'A · Hill and pond', note: 'The first soft scene: the pond sits at the foot of Hin’s sandy hill.' },
  { key: 'meadow', title: 'B · Meadow pond', note: 'Hin’s hill ends before the water; the pond sits on soft mint ground, the same colour as A’s background.' },
  { key: 'stones', title: 'C · Stone-ringed pond', note: 'A pond in a green meadow, with river stones around it (Hin’s kind), reeds at its far edge and two lily pads.' },
  { key: 'lake', title: 'D · Open lake', note: 'The water runs from Hin’s beach to the edge of the scene, with foam where it meets the sand.' },
  { key: 'sea', title: 'E · Sand and water', note: 'Hin’s sandy hill rises out of open water that runs to the horizon; Bua stands in the water, with no pond of its own.' },
]

/** Background options: the same places and camera, four grounds, so Bua's water needn't sit on Hin's sand */
export function Grounds() {
  const [focus, setFocus] = useState<Focus>('all')
  const [which, setWhich] = useState<'v2' | 'f3'>('v2')
  const mooca = (size: number) =>
    which === 'v2' ? <MoocaFloat mood="listening" size={size} shadow={false} /> : <MoocaMochi mood="listening" size={size} shadow={false} />
  return (
    <section className="sbx__lineup" aria-labelledby="grounds">
      <h2 id="grounds">Background options</h2>
      <p className="sbx__intro">
        Same places, same camera, five grounds. Everyone stands where they do today; what changes is what Bua’s water sits in.
      </p>
      <div className="sbx__moodbar" role="group" aria-label="Camera">
        {FOCI.map((f) => (
          <button key={f.key} type="button" className="chip" aria-pressed={focus === f.key} onClick={() => setFocus(f.key)}>
            {f.label}
          </button>
        ))}
      </div>
      <div className="sbx__moodbar" role="group" aria-label="mooca">
        <button type="button" className="chip" aria-pressed={which === 'v2'} onClick={() => setWhich('v2')}>
          mooca Version 2
        </button>
        <button type="button" className="chip" aria-pressed={which === 'f3'} onClick={() => setWhich('f3')}>
          mooca F3 Mochi
        </button>
      </div>
      <div className="sbx__scenes sbx__scenes--four">
        {GROUNDS.map((gr) => (
          <figure key={gr.key}>
            <div className="sbx__scene" style={{ '--ratio': '390 / 560' } as CSSProperties}>
              <Landscape
                focus={focus}
                look="soft"
                moocaShadow
                ground={gr.key}
                rockMood="listening"
                lotusMood="listening"
                renderMooca={mooca}
                renderRock={(m, size) => <HinRepaint mood={m} size={size} />}
                renderLotus={(m, size) => <BuaRepaint mood={m} size={size} ripples={false} />}
              />
            </div>
            <figcaption>
              <b>{gr.title}</b>
              {gr.note}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
