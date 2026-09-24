interface Bar {
  label: string;
  value: number;
}

/** 纯 CSS 柱状图，不接第三方图表服务 */
export function ChartPanel({ title, bars }: { title: string; bars: Bar[] }) {
  const max = Math.max(1, ...bars.map((bar) => bar.value));
  return (
    <div className="panel chart-panel">
      <h2>{title}</h2>
      <div className="bars">
        {bars.map((bar) => (
          <div key={bar.label} className="bar-col">
            <div className="bar" style={{ height: `${(bar.value / max) * 120 + 8}px` }} title={String(bar.value)} />
            <span className="muted">{bar.label}</span>
            <strong>{bar.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
