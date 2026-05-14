import type { DetectedNote, TranscriptionResult } from "@/types/skill-learning";

export function normalizeNoteName(note: string): string {
  return note.trim().replace(/\s+/g, "").toUpperCase();
}

export function resolveOverallConfidence(
  transcription: TranscriptionResult
): number {
  if (Number.isFinite(transcription.overallConfidence)) {
    return transcription.overallConfidence;
  }
  if (transcription.detectedNotes.length === 0) {
    return 0;
  }
  const values = transcription.detectedNotes.map((n) => n.confidence);
  const sum = values.reduce((a, b) => a + b, 0);
  return sum / values.length;
}

export function detectedNoteNames(detected: DetectedNote[]): string[] {
  return detected.map((n) => normalizeNoteName(n.note));
}
