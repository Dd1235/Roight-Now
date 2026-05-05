import { useEffect, useMemo, useState } from "react";
import QuestionCard from "./components/QuestionCard.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import VerdictCard from "./components/VerdictCard.jsx";
import PixelCat from "./components/PixelCat.jsx";
import {
  calculateVerdict,
  createVerdictText,
  getAnswerStats,
} from "./utils/scoring.js";

const examples = ["LeetCode", "Going to the gym"];

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [activity, setActivity] = useState("");
  const [mode, setMode] = useState("landing");
  const [answers, setAnswers] = useState({});
  const [latestResponse, setLatestResponse] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const answerStats = useMemo(() => getAnswerStats(answers), [answers]);
  const result = useMemo(() => calculateVerdict(answers, activity), [answers, activity]);

  function startOracle(event) {
    event.preventDefault();

    if (!activity.trim()) {
      return;
    }

    setMode("questions");
    setAnswers({});
    setLatestResponse(null);
    setCopied(false);
  }

  function answerQuestion(question, value) {
    setAnswers((current) => ({
      ...current,
      [question.id]: value,
    }));

    setLatestResponse({
      message: value ? question.catCommentYes : question.catCommentNo,
    });
    setCopied(false);
  }

  function restart() {
    setActivity("");
    setMode("landing");
    setAnswers({});
    setLatestResponse(null);
    setCopied(false);
  }

  function backToLanding() {
    setMode("landing");
    setLatestResponse(null);
  }

  function revealVerdict() {
    if (!answerStats.isComplete) {
      return;
    }

    setMode("verdict");
  }

  async function copyVerdict() {
    const verdictText = createVerdictText(activity, result);

    try {
      await navigator.clipboard.writeText(verdictText);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="app-shell">
      <div className="stars stars-one" aria-hidden="true" />
      <div className="stars stars-two" aria-hidden="true" />
      <div className="moon" aria-hidden="true">
        <span />
      </div>
      <div className="cloud cloud-one" aria-hidden="true" />
      <div className="cloud cloud-two" aria-hidden="true" />
      <div className="day-hill hill-one" aria-hidden="true" />
      <div className="day-hill hill-two" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="./" aria-label="Roight Now home">
          <span>Roight Now</span>
        </a>
        <ThemeToggle
          theme={theme}
          onToggle={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
        />
      </header>

      <main className="main-stage">
        {mode === "landing" && (
          <section className="landing-grid" aria-labelledby="app-title">
            <div className="assistant-panel landing-cat">
              <PixelCat
                mood="happy"
                message="Feed me an idea. One tiny audit, then move."
              />
            </div>

            <form className="card landing-card" onSubmit={startOracle}>
              <p className="eyebrow">Tiny ROI oracle</p>
              <h1 id="app-title">Roight Now</h1>
              <p className="subtitle">A tiny ROI oracle for your overthinking.</p>

              <label htmlFor="activity">What are you thinking of doing?</label>
              <input
                id="activity"
                type="text"
                value={activity}
                placeholder="LeetCode, Going to the gym"
                onChange={(event) => setActivity(event.target.value)}
              />

              <div className="example-row" aria-label="Example activities">
                {examples.map((example) => (
                  <button
                    key={example}
                    className="example-chip"
                    type="button"
                    onClick={() => setActivity(example)}
                  >
                    {example}
                  </button>
                ))}
              </div>

              <button className="primary-button start-button" type="submit" disabled={!activity.trim()}>
                Start audit
              </button>

              <p className="tiny-rule">
                Ninety-second courtroom. The cat does not accept infinite debate.
              </p>
            </form>
          </section>
        )}

        {mode === "questions" && (
          <QuestionCard
            activity={activity}
            answers={answers}
            answeredCount={answerStats.answeredCount}
            latestResponse={latestResponse}
            liveResult={result}
            onAnswer={answerQuestion}
            onBack={backToLanding}
            onSubmit={revealVerdict}
          />
        )}

        {mode === "verdict" && (
          <VerdictCard
            activity={activity}
            copied={copied}
            result={result}
            onCopy={copyVerdict}
            onRestart={restart}
          />
        )}
      </main>
    </div>
  );
}
