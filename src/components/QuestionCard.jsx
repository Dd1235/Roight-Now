import PixelCat from "./PixelCat.jsx";
import ProgressBar from "./ProgressBar.jsx";
import { questions } from "../data/questions.js";

export default function QuestionCard({
  activity,
  answers,
  answeredCount,
  latestResponse,
  liveResult,
  onAnswer,
  onBack,
  onSubmit,
}) {
  const isComplete = answeredCount === questions.length;
  const catMessage =
    latestResponse?.message ||
    `Auditing "${activity}". Answer fast. The cat can smell overthinking.`;
  const catMood = answeredCount === 0 ? "curious" : liveResult.catMood;

  return (
    <section className="question-layout audit-layout" aria-labelledby="question-title">
      <div className="assistant-panel">
        <PixelCat mood={catMood} message={catMessage} />
      </div>

      <div className="card question-card audit-card">
        <div className="audit-head">
          <div>
            <p className="eyebrow">One-card cat audit</p>
            <h2 id="question-title">Worth doing now?</h2>
          </div>
          <span className="activity-pill">{activity}</span>
        </div>

        <ProgressBar
          current={answeredCount}
          total={questions.length}
          label="Answered"
        />

        <div className="audit-list">
          {questions.map((question) => {
            const answer = answers[question.id];

            return (
              <div
                className={
                  typeof answer === "boolean"
                    ? "audit-question answered"
                    : "audit-question"
                }
                key={question.id}
              >
                <div className="question-copy">
                  <span className="category-pill">{question.category}</span>
                  <p>{question.text}</p>
                </div>

                <div className="answer-pair" role="group" aria-label={question.text}>
                  <button
                    className={
                      answer === true
                        ? "answer-button compact yes selected"
                        : "answer-button compact yes"
                    }
                    type="button"
                    onClick={() => onAnswer(question, true)}
                  >
                    Yes
                  </button>
                  <button
                    className={
                      answer === false
                        ? "answer-button compact no selected"
                        : "answer-button compact no"
                    }
                    type="button"
                    onClick={() => onAnswer(question, false)}
                  >
                    No
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <p className="audit-note">
          Cat rule: body, brain, proof, people, money, or compounding all count.
          Fake productivity gets taxed.
        </p>

        <div className="card-actions">
          <button className="ghost-button" type="button" onClick={onBack}>
            Edit idea
          </button>
          <button
            className="primary-button"
            type="button"
            disabled={!isComplete}
            onClick={onSubmit}
          >
            Reveal verdict
          </button>
        </div>
      </div>
    </section>
  );
}
