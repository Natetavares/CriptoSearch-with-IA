export function Sparkline({ points, up }: { points: number[]; up: boolean }) {
  if (points.length < 2) return null;
  const step = Math.max(1, Math.floor(points.length / 48));
  const data = points.filter((_, i) => i % step === 0);
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 96;
  const h = 32;
  const d = data
    .map((p, i) => `${i === 0 ? "M" : "L"}${(i / (data.length - 1)) * w},${h - ((p - min) / range) * h}`)
    .join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0 overflow-visible" aria-hidden="true">
      <path
        d={d}
        fill="none"
        stroke={up ? "var(--up)" : "var(--down)"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
