import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { Lang } from '../content'
import { fill } from '../mindscape-content'
import { hin, type Bin } from './hin-content'

type Place = Bin | null

interface Props {
  lang: Lang
  labels: string[]
  /** where each pebble sits, by index; null = still in the tray */
  value: Place[]
  onChange: (next: Place[]) => void
}

// Small differences in shape so the pebbles read as stones, not buttons
const SHAPES = [
  '46% 54% 52% 48% / 58% 50% 50% 42%',
  '54% 46% 44% 56% / 50% 58% 42% 50%',
  '50% 50% 58% 42% / 44% 56% 44% 56%',
  '42% 58% 50% 50% / 56% 44% 56% 44%',
]

interface Drag {
  i: number
  x0: number
  y0: number
  dx: number
  dy: number
  moved: boolean
}

/**
 * Sort pebbles into "mine to move" and "let it be". Drag a pebble to a side, or tap a pebble
 * and then tap a side (which also works from the keyboard).
 */
export default function PebbleSort({ lang, labels, value, onChange }: Props) {
  const [picked, setPicked] = useState<number | null>(null)
  const [drag, setDrag] = useState<Drag | null>(null)
  const bins = useRef<Record<'tray' | Bin, HTMLElement | null>>({ tray: null, mine: null, let: null })

  const T = (s: Record<Lang, string>) => s[lang]

  function place(i: number, to: Place) {
    const next = [...value]
    next[i] = to
    onChange(next)
    setPicked(null)
  }

  function binAt(x: number, y: number): 'tray' | Bin | undefined {
    for (const key of ['mine', 'let', 'tray'] as const) {
      const r = bins.current[key]?.getBoundingClientRect()
      if (r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return key
    }
  }

  function down(i: number, e: ReactPointerEvent<HTMLButtonElement>) {
    if (e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    setDrag({ i, x0: e.clientX, y0: e.clientY, dx: 0, dy: 0, moved: false })
  }

  function move(e: ReactPointerEvent<HTMLButtonElement>) {
    if (!drag) return
    const dx = e.clientX - drag.x0
    const dy = e.clientY - drag.y0
    setDrag({ ...drag, dx, dy, moved: drag.moved || Math.hypot(dx, dy) > 6 })
  }

  function up(e: ReactPointerEvent<HTMLButtonElement>) {
    if (!drag) return
    const { i, moved } = drag
    setDrag(null)
    if (!moved) {
      setPicked((p) => (p === i ? null : i))
      return
    }
    const target = binAt(e.clientX, e.clientY)
    if (target) place(i, target === 'tray' ? null : target)
  }

  // Keyboard and tap: a picked pebble goes wherever you tap next
  function tapBin(to: 'tray' | Bin) {
    if (picked === null) return
    place(picked, to === 'tray' ? null : to)
  }

  function pebble(i: number) {
    const dragging = drag?.i === i && drag.moved
    return (
      <button
        key={i}
        type="button"
        className={`pebble${picked === i ? ' is-picked' : ''}${dragging ? ' is-dragging' : ''}`}
        style={{
          borderRadius: SHAPES[i % SHAPES.length],
          transform: dragging ? `translate(${drag.dx}px, ${drag.dy}px) rotate(-3deg) scale(1.06)` : undefined,
        }}
        aria-pressed={picked === i}
        onPointerDown={(e) => down(i, e)}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={() => setDrag(null)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setPicked((p) => (p === i ? null : i))
          }
        }}
      >
        {labels[i]}
      </button>
    )
  }

  const inTray = labels.map((_, i) => i).filter((i) => value[i] === null)
  const target = (to: Bin) =>
    picked !== null ? fill(T(hin.moveTo), { pebble: labels[picked], side: T(to === 'mine' ? hin.mine : hin.let) }) : undefined

  return (
    <div className={`pebbles${picked !== null ? ' has-picked' : ''}`}>
      <div
        ref={(el) => (bins.current.tray = el)}
        className="pebbles__tray"
        role="group"
        aria-label={T(hin.tray)}
        onClick={(e) => e.target === e.currentTarget && tapBin('tray')}
      >
        {inTray.length ? inTray.map(pebble) : <p className="pebbles__done">{T(hin.allSorted)}</p>}
      </div>
      <div className="pebbles__bins">
        {(['mine', 'let'] as Bin[]).map((b) => (
          <section
            key={b}
            ref={(el) => (bins.current[b] = el)}
            className={`pebbles__bin pebbles__bin--${b}`}
            aria-label={T(b === 'mine' ? hin.mine : hin.let)}
            onClick={(e) => {
              if (!(e.target as HTMLElement).closest('.pebble, .pebbles__bin-head')) tapBin(b)
            }}
          >
            <button
              type="button"
              className="pebbles__bin-head"
              onClick={() => tapBin(b)}
              disabled={picked === null}
              aria-label={target(b) ?? T(b === 'mine' ? hin.mine : hin.let)}
            >
              <b>{T(b === 'mine' ? hin.mine : hin.let)}</b>
              <span>{picked !== null ? T(hin.dropHere) : T(b === 'mine' ? hin.mineHint : hin.letHint)}</span>
            </button>
            <div className="pebbles__bin-body">{labels.map((_, i) => i).filter((i) => value[i] === b).map(pebble)}</div>
          </section>
        ))}
      </div>
    </div>
  )
}
