import { describe, expect, it } from "vitest";
import type { ExerciseRubric, TranscriptionResult } from "@/types/skill-learning";
import { evaluateForRubric, evaluateSingleNoteExercise } from "./index";

function makeTranscription(
  overrides: Partial<TranscriptionResult> & {
    notes?: { note: string; confidence: number }[];
  }
): TranscriptionResult {
  const detected =
    overrides.detectedNotes ??
    (overrides.notes ?? []).map((n, index) => ({
      note: n.note,
      startTime: index * 0.25,
      endTime: index * 0.25 + 0.2,
      confidence: n.confidence,
    }));

  return {
    recordingId: overrides.recordingId ?? "rec_test",
    provider: overrides.provider ?? "mock",
    detectedNotes: detected,
    overallConfidence: overrides.overallConfidence ?? 0.9,
    warnings: overrides.warnings ?? [],
  };
}

const baseRubric: ExerciseRubric = {
  id: "exercise_test",
  lessonId: "lesson_test",
  type: "repeated_note",
  expectedNotes: ["C4", "C4", "C4", "C4", "C4"],
  attemptsRequired: 5,
  passingAccuracy: 0.8,
  minimumConfidence: 0.65,
  maxExtraNotes: 0,
  instructions: "Play Middle C five times.",
};

describe("evaluateSingleNoteExercise", () => {
  const rubric: ExerciseRubric = {
    ...baseRubric,
    id: "single_middle_c",
    type: "single_note",
    expectedNotes: ["C4"],
    attemptsRequired: 1,
    passingAccuracy: 1,
  };

  it("passes when the single note matches with high confidence", () => {
    const result = evaluateSingleNoteExercise(
      rubric,
      makeTranscription({ notes: [{ note: "C4", confidence: 0.92 }] })
    );
    expect(result.status).toBe("passed");
    expect(result.score).toBe(1);
  });

  it("fails when the single note is wrong with high confidence", () => {
    const result = evaluateSingleNoteExercise(
      rubric,
      makeTranscription({ notes: [{ note: "D4", confidence: 0.9 }] })
    );
    expect(result.status).toBe("failed");
    expect(result.mistakes.some((m) => m.code === "wrong_note")).toBe(true);
  });

  it("returns unclear when overall confidence is below the rubric threshold", () => {
    const result = evaluateSingleNoteExercise(
      rubric,
      makeTranscription({
        overallConfidence: 0.4,
        notes: [{ note: "C4", confidence: 0.9 }],
      })
    );
    expect(result.status).toBe("unclear");
    expect(result.recommendation).toBe("re_record_cleaner_audio");
  });
});

describe("evaluateRepeatedNoteExercise", () => {
  it("passes when 4 of 5 notes match and passingAccuracy is 0.8", () => {
    const transcription = makeTranscription({
      notes: [
        { note: "C4", confidence: 0.9 },
        { note: "C4", confidence: 0.9 },
        { note: "C4", confidence: 0.9 },
        { note: "C4", confidence: 0.9 },
        { note: "D4", confidence: 0.88 },
      ],
    });
    const result = evaluateForRubric(baseRubric, transcription);
    expect(result.status).toBe("passed");
    expect(result.score).toBeCloseTo(0.8);
  });

  it("matches the rubric example: wrong notes lower the score", () => {
    const transcription = makeTranscription({
      notes: [
        { note: "C4", confidence: 0.9 },
        { note: "C4", confidence: 0.9 },
        { note: "D4", confidence: 0.88 },
        { note: "C4", confidence: 0.9 },
        { note: "D4", confidence: 0.87 },
      ],
    });
    const result = evaluateForRubric(baseRubric, transcription);
    expect(result.status).toBe("failed");
    expect(result.score).toBeCloseTo(0.6);
  });

  it("tracks extra notes beyond the expected length", () => {
    const rubric: ExerciseRubric = { ...baseRubric, maxExtraNotes: 0 };
    const transcription = makeTranscription({
      notes: [
        { note: "C4", confidence: 0.9 },
        { note: "C4", confidence: 0.9 },
        { note: "C4", confidence: 0.9 },
        { note: "C4", confidence: 0.9 },
        { note: "C4", confidence: 0.9 },
        { note: "C4", confidence: 0.9 },
      ],
    });
    const result = evaluateForRubric(rubric, transcription);
    expect(result.status).toBe("failed");
    expect(result.mistakes.some((m) => m.code === "too_many_extra_notes")).toBe(
      true
    );
  });
});

describe("evaluateSequenceExercise", () => {
  const sequenceRubric: ExerciseRubric = {
    ...baseRubric,
    id: "cde_sequence",
    type: "sequence",
    expectedNotes: ["C4", "D4", "E4"],
    attemptsRequired: 3,
    passingAccuracy: 1,
  };

  it("passes when the ordered sequence matches", () => {
    const transcription = makeTranscription({
      notes: [
        { note: "C4", confidence: 0.9 },
        { note: "D4", confidence: 0.9 },
        { note: "E4", confidence: 0.9 },
      ],
    });
    const result = evaluateForRubric(sequenceRubric, transcription);
    expect(result.status).toBe("passed");
  });

  it("fails when the sequence is out of order", () => {
    const transcription = makeTranscription({
      notes: [
        { note: "C4", confidence: 0.9 },
        { note: "E4", confidence: 0.9 },
        { note: "D4", confidence: 0.9 },
      ],
    });
    const result = evaluateForRubric(sequenceRubric, transcription);
    expect(result.status).toBe("failed");
    expect(result.mistakes.some((m) => m.code === "wrong_order")).toBe(true);
  });
});

describe("evaluateRhythmExercise", () => {
  const rhythmRubric: ExerciseRubric = {
    id: "steady_c_four",
    lessonId: "steady_beat_001",
    type: "rhythm",
    expectedNotes: ["C4", "C4", "C4", "C4"],
    attemptsRequired: 4,
    passingAccuracy: 0.78,
    minimumConfidence: 0.65,
    maxExtraNotes: 0,
    targetSpacingMs: 600,
    timingToleranceMs: 150,
    instructions: "Four C4s evenly spaced.",
  };

  it("passes when pitches and 600ms spacing are within tolerance", () => {
    const transcription = makeTranscription({
      detectedNotes: [
        { note: "C4", startTime: 0, endTime: 0.15, confidence: 0.9 },
        { note: "C4", startTime: 0.6, endTime: 0.75, confidence: 0.9 },
        { note: "C4", startTime: 1.2, endTime: 1.35, confidence: 0.9 },
        { note: "C4", startTime: 1.8, endTime: 1.95, confidence: 0.9 },
      ],
    });
    const result = evaluateForRubric(rhythmRubric, transcription);
    expect(result.status).toBe("passed");
    expect(result.rhythmScoringBreakdown?.combinedScore).toBeCloseTo(result.score, 5);
    expect(result.rhythmScoringBreakdown?.intervals).toHaveLength(3);
  });

  it("fails when spacing is too irregular", () => {
    const transcription = makeTranscription({
      detectedNotes: [
        { note: "C4", startTime: 0, endTime: 0.15, confidence: 0.9 },
        { note: "C4", startTime: 0.35, endTime: 0.5, confidence: 0.9 },
        { note: "C4", startTime: 1.2, endTime: 1.35, confidence: 0.9 },
        { note: "C4", startTime: 1.5, endTime: 1.65, confidence: 0.9 },
      ],
    });
    const result = evaluateForRubric(rhythmRubric, transcription);
    expect(result.status).toBe("failed");
    expect(result.mistakes.some((m) => m.code === "timing_deviation")).toBe(true);
  });
});

describe("edge cases", () => {
  it("returns unclear when there are no detected notes and confidence resolves low", () => {
    const transcription = makeTranscription({
      detectedNotes: [],
      overallConfidence: 0.2,
    });
    const result = evaluateForRubric(baseRubric, transcription);
    expect(result.status).toBe("unclear");
  });

  it("fails when nothing is detected but overall confidence is still high", () => {
    const transcription = makeTranscription({
      detectedNotes: [],
      overallConfidence: 0.95,
    });
    const result = evaluateForRubric(baseRubric, transcription);
    expect(result.status).toBe("failed");
    expect(result.score).toBe(0);
  });
});
