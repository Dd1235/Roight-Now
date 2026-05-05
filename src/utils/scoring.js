import {
  categoryReasons,
  questions,
  reverseNoReasons,
} from "../data/questions.js";

const activityProfiles = [
  {
    id: "gym",
    patterns: ["gym", "workout", "lift", "lifting", "run", "running", "walk", "cardio", "fitness"],
    bonus: 7,
    reason:
      "Gym gets a foundational-ROI bonus: energy, sleep, mood, and confidence make every other plan less painful.",
  },
  {
    id: "leetcode",
    patterns: ["leetcode", "leet code", "dsa", "cp", "codeforces", "atcoder", "problem solving"],
    bonus: 6,
    reason:
      "LeetCode/DSA gets a direct placement-and-sharpness bonus.",
  },
  {
    id: "reading",
    patterns: ["read", "reading", "book", "almanack", "article", "paper", "notes"],
    bonus: 5,
    reason:
      "Reading gets a mental-model bonus when it is intentional instead of scroll-disguised-as-study.",
  },
  {
    id: "project",
    patterns: ["build", "building", "project", "ship", "website", "app", "portfolio", "clone", "tool"],
    bonus: 5,
    reason:
      "Real projects get a proof-and-skill bonus. The product can be goofy; the reps are not.",
  },
];

const positiveMax = questions.reduce((total, question) => {
  if (question.reverseScored) {
    return total + 1;
  }

  return total + question.weight;
}, 0);

const negativeFloor = questions.reduce((total, question) => {
  if (!question.reverseScored) {
    return total;
  }

  return total - question.weight;
}, 0);

const maxProfileBonus = Math.max(...activityProfiles.map((profile) => profile.bonus));

function detectActivityProfile(activity) {
  const normalizedActivity = activity.trim().toLowerCase();

  if (!normalizedActivity) {
    return null;
  }

  return activityProfiles.find((profile) =>
    profile.patterns.some((pattern) => normalizedActivity.includes(pattern)),
  );
}

function clampScore(value) {
  return Math.min(100, Math.max(0, value));
}

export function getAnswerStats(answers) {
  const answeredCount = questions.filter((question) =>
    Object.prototype.hasOwnProperty.call(answers, question.id),
  ).length;

  return {
    answeredCount,
    total: questions.length,
    isComplete: answeredCount === questions.length,
  };
}

export function calculateVerdict(answers, activity = "") {
  const profile = detectActivityProfile(activity);
  const answeredQuestions = questions.filter((question) =>
    Object.prototype.hasOwnProperty.call(answers, question.id),
  );

  const answerScore = answeredQuestions.reduce((score, question) => {
    const answeredYes = answers[question.id] === true;

    if (question.reverseScored) {
      return answeredYes ? score - question.weight : score + 1;
    }

    return answeredYes ? score + question.weight : score;
  }, 0);

  const profileBonus = profile ? profile.bonus : 0;
  const rawScore = answerScore + profileBonus;
  const maxScore = positiveMax + maxProfileBonus;
  const meterScore = Math.round(
    ((rawScore - negativeFloor) / (maxScore - negativeFloor)) * 100,
  );

  const strongestPositive = questions
    .filter((question) => !question.reverseScored && answers[question.id])
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 4);

  const strongestNegative = questions
    .filter((question) => question.reverseScored && answers[question.id])
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 2);

  const usefulNoSignals = questions
    .filter((question) => question.reverseScored && answers[question.id] === false)
    .map((question) => reverseNoReasons[question.id])
    .filter(Boolean)
    .slice(0, 2);

  let verdict = "Not Roight Now.";
  let level = "low";
  let catMood = "sleepy";
  let nudge = "This looks like weak ROI, bad timing, or procrastination in costume.";
  let prescription = "Do the scarier important task, or rest on purpose. Do not fake-work.";

  if (rawScore >= 15) {
    verdict = "Roight Move. Do it.";
    level = "high";
    catMood = "happy";
    nudge = "Enough compounding value. The cat closes the courtroom.";
    prescription = "Start a 45-minute tiny quest. One tab, one target, no ceremony.";
  } else if (rawScore >= 7) {
    verdict = "Roight-ish. Timebox it.";
    level = "medium";
    catMood = "thinking";
    nudge = "Useful, but not infinite. Put it on a leash.";
    prescription = "Give it 25 minutes. If it starts smelling fake, switch tasks.";
  }

  const reasons = [...strongestPositive, ...strongestNegative]
    .map((question) => categoryReasons[question.id])
    .filter(Boolean);

  if (profile) {
    reasons.unshift(profile.reason);
  }

  reasons.push(...usefulNoSignals);

  if (reasons.length === 0) {
    reasons.push("No strong ROI signal showed up. That is useful information too.");
  }

  return {
    rawScore,
    meterScore: clampScore(meterScore),
    maxScore,
    verdict,
    level,
    catMood,
    nudge,
    prescription,
    reasons: reasons.slice(0, 5),
  };
}

export function createVerdictText(activity, result) {
  const label = activity?.trim() || "this mysterious activity";

  return [
    `Roight Now verdict for "${label}": ${result.verdict}`,
    `Score: ${result.rawScore}/${result.maxScore} (${result.meterScore}%)`,
    result.nudge,
    result.prescription,
    ...result.reasons,
  ].join("\n");
}
