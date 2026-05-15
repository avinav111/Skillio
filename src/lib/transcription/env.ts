export type TranscriptionProviderMode = "mock" | "basic_pitch";

export function getTranscriptionProvider(): TranscriptionProviderMode {
  const raw = process.env.TRANSCRIPTION_PROVIDER?.trim().toLowerCase();
  if (raw === "basic_pitch") {
    return "basic_pitch";
  }
  return "mock";
}

export function getBasicPitchServiceUrl(): string | undefined {
  const url =
    process.env.BASIC_PITCH_SERVICE_URL?.trim() ||
    process.env.TRANSCRIPTION_SERVICE_URL?.trim();
  return url && url.length > 0 ? url.replace(/\/$/, "") : undefined;
}
