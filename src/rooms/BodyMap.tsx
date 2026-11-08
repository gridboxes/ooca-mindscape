import { useId } from 'react'
import type { Region } from './bua-content'

interface Props {
  selected: Region[]
  onToggle: (r: Region) => void
  labels: Record<Region, string>
  groupLabel: string
}

const BODY = '#F6E9E6'
const BODY_SHADE = '#EEDAD5'
const SPOT = '#EF7773'

// Each place on the body and its glow. The chips beside the figure run in the same top-to-bottom order.
const PLACES: { r: Region; glow: JSX.Element }[] = [
  { r: 'head', glow: <circle cx="80" cy="36" r="26" /> },
  { r: 'throat', glow: <ellipse cx="80" cy="66" rx="14" ry="9" /> },
  {
    r: 'shoulders',
    glow: (
      <>
        <ellipse cx="56" cy="84" rx="17" ry="11" />
        <ellipse cx="104" cy="84" rx="17" ry="11" />
      </>
    ),
  },
  { r: 'chest', glow: <ellipse cx="80" cy="110" rx="28" ry="19" /> },
  { r: 'stomach', glow: <ellipse cx="80" cy="148" rx="26" ry="18" /> },
]
const OTHER: Region[] = ['whole', 'nowhere']

/**
 * Where you feel it: a soft figure you can tap, with each place's chip beside it in body order.
 * A picked place glows in Bua's pink. "All over" and "Nowhere I can find"
 * aren't places, so they sit in their own row underneath.
 */
export default function BodyMap({ selected, onToggle, labels, groupLabel }: Props) {
  const glowId = useId()
  const on = (r: Region) => selected.includes(r) || (selected.includes('whole') && r !== 'nowhere')
  const chip = (r: Region) => (
    <button
      key={r}
      type="button"
      role="checkbox"
      aria-checked={selected.includes(r)}
      className={`chip${selected.includes(r) ? ' is-selected' : on(r) ? ' is-included' : ''}`}
      onClick={() => onToggle(r)}
    >
      {labels[r]}
    </button>
  )

  return (
    <div className="body-pick" role="group" aria-label={groupLabel}>
      <div className="body-pick__map">
        <svg className="body-map" viewBox="0 0 160 236" width="160" height="236" aria-hidden="true">
          <defs>
            <radialGradient id={glowId}>
              <stop offset="0" stopColor={SPOT} stopOpacity=".75" />
              <stop offset="1" stopColor={SPOT} stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* the figure: round and simple, in the companions' soft style */}
          <g fill={BODY}>
            <path d="M42 90 Q24 104 26 146 Q27 156 34 156 Q41 156 41 146 Q41 114 52 100 Z" fill={BODY_SHADE} />
            <path d="M118 90 Q136 104 134 146 Q133 156 126 156 Q119 156 119 146 Q119 114 108 100 Z" fill={BODY_SHADE} />
            <rect x="55" y="166" width="22" height="58" rx="11" fill={BODY_SHADE} />
            <rect x="83" y="166" width="22" height="58" rx="11" fill={BODY_SHADE} />
            <rect x="72" y="56" width="16" height="16" rx="7" />
            <path d="M46 94 Q46 74 64 73 L96 73 Q114 74 114 94 L110 166 Q80 180 50 166 Z" />
            <circle cx="80" cy="36" r="24" />
          </g>
          {/* the glow on each picked place, then a generous tap target over each */}
          {PLACES.map(({ r, glow }) => (
            <g key={r} fill={`url(#${glowId})`} className={`body-map__glow${on(r) ? ' is-on' : ''}`}>
              {glow}
            </g>
          ))}
          {PLACES.map(({ r, glow }) => (
            <g key={r} fill="transparent" className="body-map__spot" onClick={() => onToggle(r)}>
              {glow}
            </g>
          ))}
        </svg>
        <div className="body-pick__places">{PLACES.map(({ r }) => chip(r))}</div>
      </div>
      <div className="body-pick__other">{OTHER.map(chip)}</div>
    </div>
  )
}
