import Avatar from '../components/companions/Avatar'
import type { Expression } from '../components/companions/Face'
import type { Companion } from '../mindscape-content'

// The four moods the flow uses, then the three being tried out, each with the moment it's for
const EXPRESSIONS: { mood: Expression; isNew?: boolean; when: string }[] = [
  { mood: 'calm', when: 'Resting, the default' },
  { mood: 'listening', when: 'Taking in your words' },
  { mood: 'happy', when: 'Glad with you' },
  { mood: 'concerned', when: 'Worried for you' },
  { mood: 'tender', isNew: true, when: 'You shared something hard' },
  { mood: 'thinking', isNew: true, when: 'Considering, before a reply' },
  { mood: 'delighted', isNew: true, when: 'An aha, or a room finished' },
]

const FRIENDS: { who: Companion; name: string; tint: string }[] = [
  { who: 'mooca', name: 'mooca', tint: '#E4EFFB' },
  { who: 'hin', name: 'Hin', tint: '#F6EEDC' },
  { who: 'bua', name: 'Bua', tint: '#FDE6E8' },
]

/** Every companion in every mood, the new ones marked, so they can be judged side by side */
export default function Expressions() {
  return (
    <section className="sbx__group" aria-labelledby="g-expressions">
      <h2 id="g-expressions">
        Expressions · three new moods <span lang="th">อารมณ์</span>
      </h2>
      <p className="sbx__intro">
        Tender, thinking and delighted join the four moods the flow already uses. Each is for one moment in the
        check-in. Tender stands in for sad: it shows care without mirroring the pain back.
      </p>
      <div className="exp" role="table" aria-label="Companions by mood">
        <div className="exp__row exp__row--head" role="row">
          <span role="columnheader" />
          {EXPRESSIONS.map(({ mood, isNew, when }) => (
            <span key={mood} role="columnheader" className={`exp__head${isNew ? ' is-new' : ''}`}>
              <b>
                {mood}
                {isNew && <em>New</em>}
              </b>
              <small>{when}</small>
            </span>
          ))}
        </div>
        {FRIENDS.map(({ who, name, tint }) => (
          <div key={who} className="exp__row" role="row">
            <span role="rowheader" className="exp__name">
              {name}
            </span>
            {EXPRESSIONS.map(({ mood, isNew }) => (
              <span
                key={mood}
                role="cell"
                className={`exp__cell${isNew ? ' is-new' : ''}`}
                style={{ background: tint }}
                aria-label={`${name}, ${mood}`}
              >
                <Avatar who={who} mood={mood} size={112} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
