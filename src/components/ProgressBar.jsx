export default function ProgressBar({ current, total, value, label }) {
  const percent = total > 0 ? Math.round((current / total) * 100) : value ?? 0;
  const width = typeof value === "number" ? value : percent;

  return (
    <div className="progress-wrap" aria-label={label}>
      <div className="progress-meta">
        <span>{label}</span>
        <span>{typeof value === "number" ? `${value}%` : `${current}/${total}`}</span>
      </div>
      <div className="progress-track">
        <span className="progress-fill" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
