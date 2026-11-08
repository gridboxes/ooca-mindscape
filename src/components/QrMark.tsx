/**
 * A QR-code look-alike for the concept: three finder squares and a fixed pattern of modules.
 * It doesn't encode anything; a real build would draw the app's deep link here.
 */
export default function QrMark({ size = 104 }: { size?: number }) {
  const n = 21
  const cells: [number, number][] = []
  // a fixed, scattered pattern (a simple hash), leaving the three corners for the finders
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const corner = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12)
      if (!corner && ((x * 7 + y * 13 + x * y) % 5 < 2)) cells.push([x, y])
    }
  const finder = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width="7" height="7" fill="#1c2430" />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill="#ffffff" />
      <rect x={x + 2} y={y + 2} width="3" height="3" fill="#1c2430" />
    </g>
  )
  return (
    <svg className="qr" viewBox={`-1 -1 ${n + 2} ${n + 2}`} width={size} height={size} aria-hidden="true" shapeRendering="crispEdges">
      <rect x="-1" y="-1" width={n + 2} height={n + 2} fill="#ffffff" />
      {cells.map(([x, y]) => (
        <rect key={`${x}.${y}`} x={x} y={y} width="1" height="1" fill="#1c2430" />
      ))}
      {finder(0, 0)}
      {finder(14, 0)}
      {finder(0, 14)}
    </svg>
  )
}
