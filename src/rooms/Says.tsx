import type { ReactNode } from 'react'
import Avatar from '../components/companions/Avatar'
import type { Expression } from '../components/companions/Face'
import type { Companion } from '../mindscape-content'

/** A companion speaking: small avatar, speech bubble in its own tint */
export default function Says({ who, mood = 'listening', children }: { who: Companion; mood?: Expression; children: ReactNode }) {
  return (
    <div className={`ms-says ms-says--${who}`}>
      <span className="ms-says__who" aria-hidden="true">
        <Avatar who={who} mood={mood} size={who === 'mooca' ? 60 : 44} />
      </span>
      <p>{children}</p>
    </div>
  )
}
