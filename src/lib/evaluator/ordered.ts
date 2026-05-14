import type {
  EvaluationMistake,
  EvaluationRecommendation,
  EvaluationResult,
  EvaluationStatus,
  ExerciseRubric,
  TranscriptionResult,
} from "@/types/skill-learning";
import {
  detectedNoteNames,
  normalizeNoteName,
  resolveOverallConfidence,
} from "./helpers";

function buildBaseResult(
  rubric: ExerciseRubric,
  transcription: TranscriptionResult,
  overallConfidence: number
): Pick<
  EvaluationResult,
  "exerciseId" | "expectedNotes" | "detectedNotes" | "confidence"
> {
  return {
    exerciseId: rubric.id,
    expectedNotes: rubric.expectedNotes.map(normalizeNoteName),
    detectedNotes: transcription.detectedNotes,
    confidence: overallConfidence,
  };
}

function recommendationForPractice(
  rubric: ExerciseRubric
): EvaluationRecommendation {
  if (rubric.type === "repeated_note" || rubric.type === "single_note") {
    return "repeat_with_keyboard_landmark";
  }
  return "repeat_exercise";
}

export function evaluateOrderedNotes(
  rubric: ExerciseRubric,
  transcription: TranscriptionResult
): EvaluationResult {
  const overallConfidence = resolveOverallConfidence(transcription);
  const base = buildBaseResult(rubric, transcription, overallConfidence);

  if (overallConfidence < rubric.minimumConfidence) {
    return {
      ...base,
      status: "unclear",
      score: 0,
      mistakes: [
        {
          code: "low_confidence",
          message:
            "Overall detection confidence was below the minimum threshold for grading.",
        },
      ],
      recommendation: "re_record_cleaner_audio",
      summary:
        "The recording was not confident enough to grade safely. Try again with less background noise and clearer notes.",
    };
  }

  const expected = rubric.expectedNotes.map(normalizeNoteName);
  const detected = detectedNoteNames(transcription.detectedNotes);
  const mistakes: EvaluationMistake[] = [];

  let correct = 0;

  for (let i = 0; i < expected.length; i += 1) {
    const exp = expected[i];
    const det = detected[i];
    const position = i + 1;

    if (det === undefined) {
      mistakes.push({
        code: "missing_note",
        message: `Missing note at attempt ${position}: expected ${exp}.`,
        position,
        expectedNote: exp,
      });
      continue;
    }

    if (exp === det) {
      correct += 1;
    } else {
      mistakes.push({
        code: rubric.type === "sequence" ? "wrong_order" : "wrong_note",
        message: `At position ${position}, expected ${exp} but detected ${det}.`,
        position,
        expectedNote: exp,
        detectedNote: det,
      });
    }
  }

  const extraCount = Math.max(0, detected.length - expected.length);
  for (let j = 0; j < extraCount; j += 1) {
    const idx = expected.length + j;
    const det = detected[idx];
    mistakes.push({
      code: "extra_note",
      message: `Extra note after expected length: detected ${det}.`,
      position: idx + 1,
      detectedNote: det,
    });
  }

  if (extraCount > rubric.maxExtraNotes) {
    return {
      ...base,
      status: "failed",
      score: expected.length === 0 ? 0 : correct / expected.length,
      mistakes: [
        ...mistakes,
        {
          code: "too_many_extra_notes",
          message: `Detected ${extraCount} extra note(s); maximum allowed is ${rubric.maxExtraNotes}.`,
        },
      ],
      recommendation: "repeat_exercise",
      summary: "Too many extra notes were detected for this exercise.",
    };
  }

  const score = expected.length === 0 ? 0 : correct / expected.length;

  let status: EvaluationStatus;
  let recommendation: EvaluationRecommendation;
  let summary: string;

  if (score >= rubric.passingAccuracy) {
    status = "passed";
    recommendation = "continue_next_lesson";
    summary =
      mistakes.length === 0
        ? "Perfect match — your notes lined up with the exercise."
        : "Good enough to pass — a few notes were off, but your overall accuracy met the goal.";
  } else {
    status = "failed";
    recommendation = recommendationForPractice(rubric);
    summary =
      "Keep practicing the same pattern slowly until each step matches what the lesson asks for.";
  }

  return {
    ...base,
    status,
    score,
    mistakes,
    recommendation,
    summary,
  };
}
