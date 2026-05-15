import type { DetectedNote, TranscriptionResult } from "@/types/skill-learning";

export type MockTranscriptionScenario =
  | "auto"
  | "pass"
  | "fail_wrong_note"
  | "unclear_low_confidence"
  | "fail_sequence_swap"
  | "partial_pass"
  | "fail_steady_timing";

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

function noteAt(
  name: string,
  startTime: number,
  confidence: number
): DetectedNote {
  return {
    note: name,
    startTime,
    endTime: startTime + 0.18,
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

  if (exerciseId === "steady_c_four") {
    if (effective === "unclear_low_confidence") {
      return buildResult({
        recordingId,
        detectedNotes: [noteAt("C4", 0, 0.4)],
        overallConfidence: 0.35,
      });
    }
    if (effective === "fail_steady_timing") {
      return buildResult({
        recordingId,
        detectedNotes: [
          noteAt("C4", 0, 0.9),
          noteAt("C4", 0.95, 0.9),
          noteAt("C4", 1.35, 0.88),
          noteAt("C4", 1.95, 0.9),
        ],
        overallConfidence: 0.9,
      });
    }
    return buildResult({
      recordingId,
      detectedNotes: [
        noteAt("C4", 0, 0.9),
        noteAt("C4", 0.6, 0.9),
        noteAt("C4", 1.2, 0.9),
        noteAt("C4", 1.8, 0.9),
      ],
      overallConfidence: 0.92,
    });
  }

  if (exerciseId === "steady_c_two") {
    if (effective === "fail_steady_timing") {
      return buildResult({
        recordingId,
        detectedNotes: [noteAt("C4", 0, 0.9), noteAt("C4", 0.32, 0.88)],
        overallConfidence: 0.9,
      });
    }
    return buildResult({
      recordingId,
      detectedNotes: [noteAt("C4", 0, 0.9), noteAt("C4", 0.6, 0.9)],
      overallConfidence: 0.92,
    });
  }

  if (exerciseId === "steady_c_g_four") {
    if (effective === "fail_steady_timing") {
      return buildResult({
        recordingId,
        detectedNotes: [
          noteAt("C4", 0, 0.9),
          noteAt("G4", 0.35, 0.88),
          noteAt("C4", 0.9, 0.9),
          noteAt("G4", 1.25, 0.88),
        ],
        overallConfidence: 0.9,
      });
    }
    return buildResult({
      recordingId,
      detectedNotes: [
        noteAt("C4", 0, 0.9),
        noteAt("G4", 0.6, 0.9),
        noteAt("C4", 1.2, 0.9),
        noteAt("G4", 1.8, 0.9),
      ],
      overallConfidence: 0.92,
    });
  }

  if (exerciseId === "steady_c_d_e_g") {
    if (effective === "fail_steady_timing") {
      return buildResult({
        recordingId,
        detectedNotes: [
          noteAt("C4", 0, 0.9),
          noteAt("D4", 0.3, 0.88),
          noteAt("E4", 0.55, 0.88),
          noteAt("G4", 0.85, 0.88),
        ],
        overallConfidence: 0.9,
      });
    }
    return buildResult({
      recordingId,
      detectedNotes: [
        noteAt("C4", 0, 0.9),
        noteAt("D4", 0.55, 0.9),
        noteAt("E4", 1.1, 0.9),
        noteAt("G4", 1.65, 0.9),
      ],
      overallConfidence: 0.92,
    });
  }

  if (exerciseId === "register_steady_c_review") {
    return buildResult({
      recordingId,
      detectedNotes: [
        noteAt("C4", 0, 0.9),
        noteAt("C4", 0.6, 0.9),
        noteAt("C4", 1.2, 0.9),
        noteAt("C4", 1.8, 0.9),
      ],
      overallConfidence: 0.92,
    });
  }

  if (exerciseId === "register_single_f3") {
    return buildResult({
      recordingId,
      detectedNotes: [note("F3", 0, 0.9)],
      overallConfidence: 0.9,
    });
  }

  if (exerciseId === "register_single_g4") {
    return buildResult({
      recordingId,
      detectedNotes: [note("G4", 0, 0.9)],
      overallConfidence: 0.9,
    });
  }

  if (exerciseId === "register_f_c_g") {
    return buildResult({
      recordingId,
      detectedNotes: [note("F3", 0, 0.9), note("C4", 1, 0.9), note("G4", 2, 0.9)],
      overallConfidence: 0.9,
    });
  }

  if (exerciseId === "register_f_g_a_c") {
    return buildResult({
      recordingId,
      detectedNotes: [
        note("F3", 0, 0.9),
        note("G3", 1, 0.9),
        note("A3", 2, 0.9),
        note("C4", 3, 0.9),
      ],
      overallConfidence: 0.9,
    });
  }

  if (exerciseId === "register_ascend_a3_c4") {
    return buildResult({
      recordingId,
      detectedNotes: [note("A3", 0, 0.9), note("B3", 1, 0.9), note("C4", 2, 0.9)],
      overallConfidence: 0.9,
    });
  }

  if (exerciseId === "register_descend_c4_g3") {
    return buildResult({
      recordingId,
      detectedNotes: [
        note("C4", 0, 0.9),
        note("B3", 1, 0.9),
        note("A3", 2, 0.9),
        note("G3", 3, 0.9),
      ],
      overallConfidence: 0.9,
    });
  }

  if (exerciseId === "c_position_up") {
    return buildResult({
      recordingId,
      detectedNotes: [
        note("C4", 0, 0.9),
        note("D4", 1, 0.9),
        note("E4", 2, 0.9),
        note("F4", 3, 0.9),
        note("G4", 4, 0.9),
      ],
      overallConfidence: 0.9,
    });
  }

  if (exerciseId === "g3_repeat_three") {
    return buildResult({
      recordingId,
      detectedNotes: [note("G3", 0, 0.9), note("G3", 1, 0.9), note("G3", 2, 0.9)],
      overallConfidence: 0.9,
    });
  }

  if (exerciseId === "fga_up") {
    return buildResult({
      recordingId,
      detectedNotes: [note("F3", 0, 0.9), note("G3", 1, 0.9), note("A3", 2, 0.9)],
      overallConfidence: 0.9,
    });
  }

  if (exerciseId === "cba_down") {
    return buildResult({
      recordingId,
      detectedNotes: [note("C4", 0, 0.9), note("B3", 1, 0.9), note("A3", 2, 0.9)],
      overallConfidence: 0.9,
    });
  }

  return buildResult({
    recordingId,
    detectedNotes: [],
    overallConfidence: 0.2,
    warnings: ["Unknown exercise for mock transcription — defaulting to low confidence."],
  });
}
