import type { Weather } from '../content'

// Compact weather glyphs for cards, chips and the history strip
export default function WeatherIcon({ weather, size = 40 }: { weather: Weather; size?: number }) {
  const cloud = (fill: string, stroke: string, dx = 0, dy = 0) => (
    <path
      d="M14 34 a8 8 0 0 1 1-16 a11 11 0 0 1 21-3 a9 9 0 0 1 4 19 z"
      transform={`translate(${dx} ${dy})`}
      fill={fill}
      stroke={stroke}
      strokeWidth="2"
      strokeLinejoin="round"
    />
  )
  const sun = (cx: number, cy: number, r: number) => (
    <g>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2
        return (
          <line
            key={i}
            x1={cx + Math.cos(a) * (r + 3)}
            y1={cy + Math.sin(a) * (r + 3)}
            x2={cx + Math.cos(a) * (r + 6)}
            y2={cy + Math.sin(a) * (r + 6)}
            stroke="#F2B533"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        )
      })}
      <circle cx={cx} cy={cy} r={r} fill="#FBE36A" stroke="#F2B533" strokeWidth="2" />
    </g>
  )
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      {weather === 'sunny' && sun(24, 24, 10)}
      {weather === 'partly' && (
        <>
          {sun(30, 16, 7)}
          {cloud('#fff', '#8FBBEF', -2, 4)}
        </>
      )}
      {weather === 'foggy' && (
        <>
          {cloud('#EEF0F4', '#AEB6C2', 0, -4)}
          <g stroke="#AEB6C2" strokeWidth="3" strokeLinecap="round">
            <line x1="8" y1="36" x2="30" y2="36" />
            <line x1="16" y1="42" x2="40" y2="42" />
          </g>
        </>
      )}
      {weather === 'rainy' && (
        <>
          {cloud('#D5D6EE', '#8E90C4', 0, -6)}
          <g stroke="#62A0E9" strokeWidth="2.6" strokeLinecap="round">
            <line x1="16" y1="34" x2="14" y2="40" />
            <line x1="24" y1="34" x2="22" y2="40" />
            <line x1="32" y1="34" x2="30" y2="40" />
          </g>
        </>
      )}
      {weather === 'stormy' && (
        <>
          {cloud('#C3C4E2', '#7F81B8', 0, -6)}
          <path d="M26 30 l-6 9 h5 l-3 7 l9 -10 h-5 l3 -6 z" fill="#F9A000" />
        </>
      )}
    </svg>
  )
}
