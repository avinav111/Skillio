import type { AIFeedback, EvaluationResult, Lesson } from "@/types/skill-learning";

function mistakeLines(result: EvaluationResult): string[] {
  return result.mistakes.map((m) => m.message);
}

export function buildTemplateFeedback(
  lesson: Lesson,
  evaluation: EvaluationResult
): AIFeedback {
  const references = evaluation.mistakes
    .filter((m) => m.code !== "low_confidence")
    .map((m) => m.code);

  if (evaluation.status === "unclear") {
    return {
      headline: "Let’s try a cleaner take",
      explanation:
        "The practice engine could not confidently line up your notes with the exercise. That usually means mic placement, noise, or overlapping sounds — not necessarily that you played incorrectly.",
      correction:
        "Move closer to the instrument, reduce background noise, and leave a small pause between each note.",
      nextStep: "Record again using the same short exercise instructions.",
      encouragement: "Short retries are normal while you dial in sound quality.",
      detectedIssueReferences: references,
    };
  }

  if (evaluation.status === "passed") {
    return {
      headline: "Nice — this attempt meets the goal",
      explanation: `Lesson objective: ${lesson.objective}. The evaluator marked this attempt as passing based only on the structured note results (not on raw audio listening).`,
      correction:
        evaluation.mistakes.length === 0
          ? "No note-level issues were flagged for this attempt."
          : `Note-level notes from the evaluator: ${mistakeLines(evaluation).join(" ")}`,
      nextStep: "Continue to the next lesson when you feel ready, or repeat for extra comfort.",
      detectedIssueReferences: references,
    };
  }

  const mistakeSummary = mistakeLines(evaluation).join(" ");

  return {
    headline: "Let’s adjust the next repetition",
    explanation: `The structured evaluator marked this attempt as needs work for: ${lesson.title}.`,
    correction:
      mistakeSummary.length > 0
        ? `Evaluator findings: ${mistakeSummary}`
        : "The evaluator did not list additional detail beyond the summary below.",
    nextStep:
      evaluation.recommendation === "repeat_with_keyboard_landmark"
        ? "Use the two-black-key landmark, then replay slowly focusing on one white key at a time."
        : "Repeat the same short pattern slowly, counting each note out loud.",
    encouragement: "Small, slow repetitions beat rushing.",
    detectedIssueReferences: references,
  };
}
