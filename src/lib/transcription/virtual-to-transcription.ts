import type { TranscriptionResult } from "@/types/skill-learning";

export function buildVirtualTranscriptionResult(
  notesInOrder: string[],
  recordingId: string
): TranscriptionResult {
  const detectedNotes = notesInOrder.map((note, index) => ({
    note: note.trim(),
    startTime: index * 0.28,
    endTime: index * 0.28 + 0.22,
    confidence: 0.96,
  }));

  return {
    recordingId,
    provider: "virtual",
    detectedNotes,
    overallConfidence: 0.96,
    warnings: [
      "Virtual keyboard input — structured taps only, not a microphone recording.",
    ],
  };
}
