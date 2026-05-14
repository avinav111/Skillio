import type { DetectedNote, TranscriptionResult } from "@/types/skill-learning";

export type MockTranscriptionScenario =
  | "auto"
  | "pass"
  | "fail_wrong_note"
  | "unclear_low_confidence"
  | "fail_sequence_swap"
  | "partial_pass";

function note(
  name: string,
  index: number,
  confidence: number
): DetectedNote {
  return {
    note: name,
    startTime: index * 0.28,
    endTime: index * 0.28 + 0.22,
    confidence,
  };
}

function buildResult(
  partial: Omit<TranscriptionResult, "recordingId" | "provider" | "warnings"> &
    Partial<Pick<TranscriptionResult, "recordingId" | "warnings">>
): TranscriptionResult {
  return {
    recordingId: partial.recordingId ?? "mock_recording",
    provider: "mock",
    detectedNotes: partial.detectedNotes,
    overallConfidence: partial.overallConfidence,
    warnings: partial.warnings ?? ["Mock transcription — replace with Basic Pitch output."],
  };
}

export function mockTranscriptionForExercise(
  exerciseId: string,
  scenario: MockTranscriptionScenario,
  recordingId: string
): TranscriptionResult {
  const effective = scenario === "auto" ? "pass" : scenario;

  if (exerciseId === "middle_c_play_five") {
    if (effective === "unclear_low_confidence") {
      return buildResult({
        recordingId,
        detectedNotes: [note("C4", 0, 0.42), note("C4", 1, 0.38)],
        overallConfidence: 0.35,
      });
    }
    if (effective === "fail_wrong_note") {
      return buildResult({
        recordingId,
        detectedNotes: [
          note("C4", 0, 0.9),
          note("C4", 1, 0.9),
          note("D4", 2, 0.88),
          note("C4", 3, 0.9),
          note("D4", 4, 0.87),
        ],
        overallConfidence: 0.9,
      });
    }
    if (effective === "partial_pass") {
      return buildResult({
        recordingId,
        detectedNotes: [
          note("C4", 0, 0.9),
          note("C4", 1, 0.9),
          note("C4", 2, 0.9),
          note("C4", 3, 0.9),
          note("D4", 4, 0.88),
        ],
        overallConfidence: 0.9,
      });
    }
    return buildResult({
      recordingId,
      detectedNotes: [
        note("C4", 0, 0.9),
        note("C4", 1, 0.9),
        note("C4", 2, 0.9),
        note("C4", 3, 0.9),
        note("C4", 4, 0.9),
      ],
      overallConfidence: 0.92,
    });
  }

  if (exerciseId === "cde_slow_sequence") {
    if (effective === "unclear_low_confidence") {
      return buildResult({
        recordingId,
        detectedNotes: [note("C4", 0, 0.45)],
        overallConfidence: 0.4,
      });
    }
    if (effective === "fail_sequence_swap") {
      return buildResult({
        recordingId,
        detectedNotes: [note("C4", 0, 0.9), note("E4", 1, 0.88), note("D4", 2, 0.87)],
        overallConfidence: 0.9,
      });
    }
    return buildResult({
      recordingId,
      detectedNotes: [note("C4", 0, 0.9), note("D4", 1, 0.9), note("E4", 2, 0.9)],
      overallConfidence: 0.91,
    });
  }

  return buildResult({
    recordingId,
    detectedNotes: [],
    overallConfidence: 0.2,
    warnings: ["Unknown exercise for mock transcription — defaulting to low confidence."],
  });
}
