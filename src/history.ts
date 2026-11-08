import type { Weather } from './content'

export interface Entry {
  at: number
  weather: Weather
  word: string | null
}

const KEY = 'ooca-inner-weather:history'

export function loadHistory(): Entry[] {
  try {
    const raw = localStorage.getItem(KEY)
    const list = raw ? (JSON.parse(raw) as Entry[]) : []
    return Array.isArray(list) ? list.slice(-7) : []
  } catch {
    return []
  }
}

export function saveEntry(entry: Entry): Entry[] {
  const next = [...loadHistory(), entry].slice(-7)
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // Private mode or blocked storage: the check-in still works, it just isn't remembered
  }
  return next
}
