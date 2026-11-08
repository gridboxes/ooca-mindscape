import { useState } from 'react'
import Landscape from '../components/Landscape'
import type { Mood } from '../components/companions/Face'
import { HinA, HinB, HinG } from './HinVariants'

// The Hin shortlist, seen where it will live: in the landscape beside mooca and Bua,
// at icon size, and through every mood.

const MOODS: Mood[] = ['calm', 'happy', 'listening', 'concerned']

const FINALISTS = [
  { key: 'A', name: 'River stone', trait: 'Grounded and weathered: the wise old rock.', Comp: HinA },
  { key: 'B', name: 'Pebble', trait: 'Softest and friendliest, closest to mooca.', Comp: HinB },
  { key: 'G', name: 'Stacked stones', trait: 'Its mood is balance, the Stoic idea: the head tips when worried.', Comp: HinG },
]

export default function Finalists({ pick, onPick }: { pick: string | null; onPick: (k: string) => void }) {
  const [mood, setMood] = useState<Mood>('calm')
  return (
    <section className="sbx__group fin" aria-labelledby="g-finalists">
      <h2 id="g-finalists">
        Hin · Finalists <span lang="th">หิน</span>
      </h2>
      <p className="sbx__intro">A, B and G in their real home, next to mooca and Bua, at icon size and in every mood.</p>
      <div className="fin__moods" role="group" aria-label="Mood">
        {MOODS.map((m) => (
          <button key={m} type="button" className="chip chip--quiet" aria-pressed={mood === m} onClick={() => setMood(m)}>
            {m}
          </button>
        ))}
      </div>
      <div className="fin__grid">
        {FINALISTS.map(({ key, name, trait, Comp }) => (
          <button key={key} type="button" className="fin__card" aria-pressed={pick === key} onClick={() => onPick(key)}>
            <span className="fin__scene">
              <Landscape
                moocaWeather={mood === 'happy' ? 'sunny' : mood === 'concerned' ? 'rainy' : mood === 'listening' ? 'partly' : null}
                rockMood={mood}
                lotusMood={mood}
                renderRock={(m, s) => <Comp mood={m as Mood} size={s} />}
              />
            </span>
            <span className="fin__name">
              <b>{key}</b> {name}
            </span>
            <span className="fin__trait">{trait}</span>
            <span className="fin__icons" aria-label={`${name} at icon sizes`}>
              <Comp mood={mood} size={64} />
              <Comp mood={mood} size={40} />
              <Comp mood={mood} size={24} />
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
