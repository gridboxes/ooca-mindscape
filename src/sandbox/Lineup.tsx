import { useState } from 'react'
import type { Expression } from '../components/companions/Face'
import { BUA_SOFT, BuaRepaint, HIN_SOFT, HinRepaint, MoocaCloudBody, MoocaFloat, MoocaSoft } from './SoftFamily'

const MOODS: Expression[] = ['calm', 'listening', 'happy', 'concerned', 'tender', 'thinking', 'delighted']

/** The three friends side by side on the new mooca's card colour, to judge them as one family */
export default function Lineup({ hin, bua }: { hin: string | null; bua: string | null }) {
  const [mood, setMood] = useState<Expression>('listening')
  const Hin = (HIN_SOFT.find((v) => v.key === hin) ?? HIN_SOFT[0]).Comp
  const Bua = (BUA_SOFT.find((v) => v.key === bua) ?? BUA_SOFT[0]).Comp
  return (
    <section className="sbx__lineup" aria-labelledby="lineup">
      <h2 id="lineup">The family, in the new mooca style</h2>
      <p className="sbx__intro">
        The new mooca, rebuilt in code from the ooca character sheet, beside Hin and Bua in its finish: painted shading with no outlines,
        small oval eyes, puffed cheeks and a scarf in each friend’s own accent. R keeps our own silhouettes; S puts each on a small body like
        mooca’s. Pick a Hin and a Bua below to swap them in.
      </p>
      <div className="sbx__moodbar" role="group" aria-label="Mood">
        {MOODS.map((m) => (
          <button key={m} type="button" className="chip" aria-pressed={mood === m} onClick={() => setMood(m)}>
            {m}
          </button>
        ))}
      </div>
      <div className="sbx__trio">
        <figure>
          <MoocaSoft mood={mood} size={240} />
          <figcaption>mooca</figcaption>
        </figure>
        <figure>
          <Hin mood={mood} size={240} />
          <figcaption>Hin {HIN_SOFT.some((v) => v.key === hin) ? hin : HIN_SOFT[0].key}</figcaption>
        </figure>
        <figure>
          <Bua mood={mood} size={240} />
          <figcaption>Bua {BUA_SOFT.some((v) => v.key === bua) ? bua : BUA_SOFT[0].key}</figcaption>
        </figure>
      </div>
    </section>
  )
}

/** Versions 2 and 3: mooca floating, and Hin and Bua without scarves */
export function LineupFloat({ version, intro, Mooca }: { version: number; intro: string; Mooca: (p: { mood?: Expression; size?: number }) => JSX.Element }) {
  const [mood, setMood] = useState<Expression>('listening')
  return (
    <section className="sbx__lineup" aria-labelledby={`lineup-v${version}`}>
      <h2 id={`lineup-v${version}`}>Version {version} · mooca floating, no scarves on Hin and Bua</h2>
      <p className="sbx__intro">{intro}</p>
      <div className="sbx__moodbar" role="group" aria-label="Mood">
        {MOODS.map((m) => (
          <button key={m} type="button" className="chip" aria-pressed={mood === m} onClick={() => setMood(m)}>
            {m}
          </button>
        ))}
      </div>
      <div className="sbx__trio">
        <figure>
          <Mooca mood={mood} size={240} />
          <figcaption>mooca · floating</figcaption>
        </figure>
        <figure>
          <HinRepaint mood={mood} size={240} />
          <figcaption>Hin R1</figcaption>
        </figure>
        <figure>
          <BuaRepaint mood={mood} size={240} />
          <figcaption>Bua R1</figcaption>
        </figure>
      </div>
    </section>
  )
}

export function LineupV2() {
  return (
    <LineupFloat
      version={2}
      Mooca={MoocaFloat}
      intro="mooca as it lives in our landscape: body and all, but up in the air, legs hanging loose, bobbing slowly over its shadow. It keeps its turquoise scarf, ooca’s own mark for it. Hin and Bua are our own silhouettes in the new finish (R1), with no scarf."
    />
  )
}

export function LineupV3() {
  return (
    <LineupFloat
      version={3}
      Mooca={MoocaCloudBody}
      intro="mooca built like our current one: no separate body, the cloud is the body. Long legs hang straight from under it, small arms peek out at its sides, and a wide scarf wraps its lower edge. The new art’s lobes, finish and face. Hin and Bua as in version 2."
    />
  )
}
