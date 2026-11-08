import type { Weather } from '../../content'
import type { Companion } from '../../mindscape-content'
import Mooca from '../Mooca'
import Rock from './Rock'
import Lotus from './Lotus'
import type { Expression, Mood, NewMood } from './Face'

// mooca's moods come from its weather faces
export const MOOCA_FACE: Record<Mood, Weather | null> = {
  calm: null,
  happy: 'sunny',
  listening: 'partly',
  concerned: 'rainy',
}

/** Any of the three companions, small, in a given mood */
export default function Avatar({ who, mood = 'calm', size = 64 }: { who: Companion; mood?: Expression; size?: number }) {
  if (who === 'mooca') {
    return mood in MOOCA_FACE ? (
      <Mooca weather={MOOCA_FACE[mood as Mood]} size={size} effects={false} />
    ) : (
      <Mooca mood={mood as NewMood} size={size} effects={false} />
    )
  }
  if (who === 'hin') return <Rock mood={mood} size={size} />
  return <Lotus mood={mood} size={size} ripples={false} />
}
