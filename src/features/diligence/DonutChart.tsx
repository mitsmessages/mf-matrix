export interface DonutSlice {
  key: string;
  label: string;
  value: number;
  color: string;
}

/** Accessible SVG donut. Values are percentages that should sum to ~100. */
export function DonutChart({ slices, centerLabel }: { slices: DonutSlice[]; centerLabel: string }) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const total = slices.reduce((s, x) => s + x.value, 0) || 100;
  let offset = 0;

  return (
    <div className="relative mx-auto h-56 w-56" role="img" aria-label={centerLabel}>
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <circle cx="100" cy="100" r={radius} fill="none" stroke="#F5F2EB" strokeWidth="24" />
        {slices.map((slice) => {
          const length = (slice.value / total) * circumference;
          const dash = `${length} ${circumference}`;
          const el = (
            <circle
              key={slice.key}
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={slice.color}
              strokeWidth="24"
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              className="transition-all duration-500"
            />
          );
          offset += length;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
          {centerLabel}
        </span>
      </div>
    </div>
  );
}
