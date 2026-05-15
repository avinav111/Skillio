import type {
  EvaluationResult,
  ExerciseRubric,
  TranscriptionResult,
} from "@/types/skill-learning";
import { resolveOverallConfidence } from "./helpers";
import { evaluateOrderedNotes } from "./ordered";
import { evaluateRhythmExercise } from "./rhythm";

export function evaluateSingleNoteExercise(
  rubric: ExerciseRubric,
  transcription: TranscriptionResult
): EvaluationResult {
  return evaluateOrderedNotes(rubric, transcription);
}

export function evaluateRepeatedNoteExercise(
  rubric: ExerciseRubric,
  transcription: TranscriptionResult
): EvaluationResult {
  return evaluateOrderedNotes(rubric, transcription);
}

export function evaluateSequenceExercise(
  rubric: ExerciseRubric,
  transcription: TranscriptionResult
): EvaluationResult {
  return evaluateOrderedNotes(rubric, transcription);
}

export function evaluateForRubric(
  rubric: ExerciseRubric,
  transcription: TranscriptionResult
): EvaluationResult {
  switch (rubric.type) {
    case "single_note":
      return evaluateSingleNoteExercise(rubric, transcription);
    case "repeated_note":
      return evaluateRepeatedNoteExercise(rubric, transcription);
    case "sequence":
      return evaluateSequenceExercise(rubric, transcription);
    case "rhythm":
      return evaluateRhythmExercise(rubric, transcription);
    default: {
      const overallConfidence = resolveOverallConfidence(transcription);
      return {
        exerciseId: rubric.id,
        status: "unclear",
        score: 0,
        expectedNotes: rubric.expectedNotes,
        detectedNotes: transcription.detectedNotes,
        mistakes: [
          {
            code: "low_confidence",
            message: "This exercise type is not implemented in the MVP evaluator yet.",
          },
        ],
        confidence: overallConfidence,
        recommendation: "unsupported_exercise_type",
        summary:
          "This exercise needs a more advanced evaluator (rhythm/melody). For now, practice slowly without automated grading.",
      };
    }
  }
}
