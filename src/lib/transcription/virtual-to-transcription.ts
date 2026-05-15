import type { TranscriptionResult } from "@/types/skill-learning";

export type VirtualNoteCapture = {
  note: string;
  /** Monotonic `performance.now()` (or equivalent) in milliseconds. */
  onsetMs: number;
};

export function buildVirtualTranscriptionResult(
  captures: VirtualNoteCapture[],
  recordingId: string
): TranscriptionResult {
  if (captures.length === 0) {
    return {
      recordingId,
      provider: "virtual",
      detectedNotes: [],
      overallConfidence: 0,
      warnings: [
        "Virtual keyboard input — structured taps only, not a microphone recording.",
      ],
    };
  }

  const t0 = captures[0].onsetMs;
  let lastStartSec = -Infinity;
  const detectedNotes = captures.map((cap, index) => {
    let startSec = (cap.onsetMs - t0) / 1000;
    if (startSec <= lastStartSec) {
      startSec = lastStartSec + 0.001;
    }
    lastStartSec = startSec;
    const next = captures[index + 1];
    const endSec = next
      ? Math.max(startSec + 0.04, (next.onsetMs - t0) / 1000 - 0.008)
      : startSec + 0.22;
    return {
      note: cap.note.trim(),
      startTime: startSec,
      endTime: endSec,
      confidence: 0.96,
    };
  });

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
