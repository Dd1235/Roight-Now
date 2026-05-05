import PixelCat from "./PixelCat.jsx";
import ProgressBar from "./ProgressBar.jsx";

export default function VerdictCard({
  activity,
  copied,
  result,
  onCopy,
  onRestart,
}) {
  return (
    <section className="verdict-layout" aria-labelledby="verdict-title">
      <div className="assistant-panel">
        <PixelCat mood={result.catMood} message={result.nudge} />
      </div>

      <div className={`card verdict-card ${result.level}`}>
        <p className="eyebrow">Final cat audit</p>
        <h2 id="verdict-title">{result.verdict}</h2>
        <p className="verdict-activity">{activity}</p>

        <ProgressBar value={result.meterScore} label="Roight meter" />

        <div className="score-line">
          <span>Score</span>
          <strong>
            {result.rawScore}/{result.maxScore}
          </strong>
        </div>

        <ul className="reason-list">
          {result.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>

        <div className="prescription-box">
          <span>Cat prescription</span>
          <p>{result.prescription}</p>
        </div>

        <div className="copy-strip" aria-live="polite">
          {copied ? "Verdict copied. The cat accepts tribute." : "Roight now? Roight now."}
        </div>

        <div className="card-actions">
          <button className="ghost-button" type="button" onClick={onRestart}>
            Start over
          </button>
          <button className="primary-button" type="button" onClick={onCopy}>
            Copy verdict
          </button>
        </div>
      </div>
    </section>
  );
}
