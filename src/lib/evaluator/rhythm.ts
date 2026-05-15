import type {
  EvaluationMistake,
  EvaluationRecommendation,
  EvaluationResult,
  ExerciseRubric,
  RhythmIntervalBreakdown,
  RhythmScoringBreakdown,
  TranscriptionResult,
} from "@/types/skill-learning";
import {
  normalizeNoteName,
  resolveOverallConfidence,
} from "./helpers";
import { evaluateOrderedNotes } from "./ordered";

const PITCH_WEIGHT = 0.55;
const TIMING_WEIGHT = 0.45;

function pitchEvaluation(
  rubric: ExerciseRubric,
  transcription: TranscriptionResult
) {
  return evaluateOrderedNotes(
    { ...rubric, type: "repeated_note" },
    transcription
  );
}

export function evaluateRhythmExercise(
  rubric: ExerciseRubric,
  transcription: TranscriptionResult
): EvaluationResult {
  const overallConfidence = resolveOverallConfidence(transcription);
  const spacingMs = rubric.targetSpacingMs;
  const toleranceMs = rubric.timingToleranceMs;

  if (spacingMs === undefined || toleranceMs === undefined) {
    return {
      exerciseId: rubric.id,
      status: "unclear",
      score: 0,
      expectedNotes: rubric.expectedNotes.map(normalizeNoteName),
      detectedNotes: transcription.detectedNotes,
      mistakes: [
        {
          code: "low_confidence",
          message:
            "Rhythm rubric is missing targetSpacingMs or timingToleranceMs configuration.",
        },
      ],
      confidence: overallConfidence,
      recommendation: "unsupported_exercise_type",
      summary: "This rhythm exercise is not fully configured yet.",
    };
  }

  const pitchResult = pitchEvaluation(rubric, transcription);
  if (pitchResult.status === "unclear") {
    return { ...pitchResult, exerciseId: rubric.id };
  }
  if (pitchResult.status === "failed") {
    return { ...pitchResult, exerciseId: rubric.id };
  }

  const expected = rubric.expectedNotes.map(normalizeNoteName);
  const mistakes: EvaluationMistake[] = [...pitchResult.mistakes];
  const spacingSeconds = spacingMs / 1000;
  const toleranceSeconds = toleranceMs / 1000;

  let timingMatches = 0;
  const timingSlots = Math.max(0, expected.length - 1);
  const intervals: RhythmIntervalBreakdown[] = [];

  for (let i = 1; i < expected.length; i += 1) {
    const prev = transcription.detectedNotes[i - 1];
    const curr = transcription.detectedNotes[i];
    if (!prev || !curr) {
      mistakes.push({
        code: "timing_deviation",
        message: `Missing timing window after note ${i}: need two consecutive detections.`,
        position: i + 1,
      });
      intervals.push({
        fromIndex: i,
        toIndex: i + 1,
        expectedSpacingMs: spacingMs,
        measuredSpacingMs: 0,
        withinTolerance: false,
      });
      continue;
    }
    const delta = curr.startTime - prev.startTime;
    const measuredMs = Math.round(delta * 1000);
    const ok = Math.abs(delta - spacingSeconds) <= toleranceSeconds;
    intervals.push({
      fromIndex: i,
      toIndex: i + 1,
      expectedSpacingMs: spacingMs,
      measuredSpacingMs: measuredMs,
      withinTolerance: ok,
    });
    if (ok) {
      timingMatches += 1;
    } else {
      mistakes.push({
        code: "timing_deviation",
        message: `Between notes ${i} and ${i + 1}, expected about ${spacingMs} ms spacing (±${toleranceMs} ms) but measured ${measuredMs} ms.`,
        position: i + 1,
      });
    }
  }

  const pitchScore = pitchResult.score;
  const timingScore =
    timingSlots === 0 ? 1 : timingMatches / timingSlots;
  const combinedScore =
    timingSlots === 0 ? pitchScore : pitchScore * PITCH_WEIGHT + timingScore * TIMING_WEIGHT;

  const rhythmScoringBreakdown: RhythmScoringBreakdown = {
    expectedNoteCount: expected.length,
    detectedNoteCount: transcription.detectedNotes.length,
    pitchScore,
    timingScore,
    pitchWeight: timingSlots === 0 ? 1 : PITCH_WEIGHT,
    timingWeight: timingSlots === 0 ? 0 : TIMING_WEIGHT,
    combinedScore,
    passingAccuracy: rubric.passingAccuracy,
    intervals,
  };

  let status: EvaluationResult["status"];
  let recommendation: EvaluationRecommendation;
  let summary: string;

  if (combinedScore < rubric.passingAccuracy) {
    status = "failed";
    recommendation = "repeat_exercise";
    summary =
      "Keep the notes correct and match the steady spacing between each sound as closely as you can.";
  } else {
    status = "passed";
    recommendation = "continue_next_lesson";
    summary = "Nice steady timing — you stayed close enough to the target spacing.";
  }

  return {
    exerciseId: rubric.id,
    status,
    score: combinedScore,
    expectedNotes: expected,
    detectedNotes: transcription.detectedNotes,
    mistakes,
    confidence: overallConfidence,
    recommendation,
    summary,
    rhythmScoringBreakdown,
  };
}
