import type { TranscriptionResult } from "@/types/skill-learning";

function isTranscriptionResult(value: unknown): value is TranscriptionResult {
  if (!value || typeof value !== "object") {
    return false;
  }
  const v = value as Record<string, unknown>;
  return (
    typeof v.recordingId === "string" &&
    typeof v.provider === "string" &&
    Array.isArray(v.detectedNotes) &&
    typeof v.overallConfidence === "number" &&
    Array.isArray(v.warnings)
  );
}

export async function transcribeViaBasicPitchService(options: {
  serviceUrl: string;
  audio: Blob;
  filename: string;
  recordingId: string;
}): Promise<
  | { ok: true; transcription: TranscriptionResult }
  | { ok: false; status: number; message: string }
> {
  const { serviceUrl, audio, filename, recordingId } = options;
  const formData = new FormData();
  formData.append("audio", audio, filename);
  formData.append("recording_id", recordingId);

  const response = await fetch(`${serviceUrl}/transcribe`, {
    method: "POST",
    body: formData,
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const detail =
      payload &&
      typeof payload === "object" &&
      "detail" in payload &&
      typeof (payload as { detail: unknown }).detail === "string"
        ? (payload as { detail: string }).detail
        : `upstream ${response.status}`;
    return { ok: false, status: response.status, message: detail };
  }

  if (
    payload &&
    typeof payload === "object" &&
    "error" in payload &&
    typeof (payload as { error: unknown }).error === "string"
  ) {
    return {
      ok: false,
      status: 502,
      message: (payload as { error: string }).error,
    };
  }

  if (!isTranscriptionResult(payload)) {
    return {
      ok: false,
      status: 502,
      message: "Invalid transcription payload from Basic Pitch service",
    };
  }

  return { ok: true, transcription: payload };
}
