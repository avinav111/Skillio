import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import type { MockTranscriptionScenario } from "@/lib/transcription/mock-scenarios";
import { mockTranscriptionForExercise } from "@/lib/transcription/mock-scenarios";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Expected multipart/form-data with an audio file." },
      { status: 400 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("audio");
  const exerciseIdValue = formData.get("exerciseId");
  const scenarioValue = formData.get("mockScenario");

  if (!(file instanceof Blob) || file.size === 0) {
    return NextResponse.json(
      { error: "Missing audio blob under the 'audio' field." },
      { status: 400 }
    );
  }

  if (typeof exerciseIdValue !== "string" || exerciseIdValue.length === 0) {
    return NextResponse.json(
      { error: "Missing exerciseId for transcription routing." },
      { status: 400 }
    );
  }

  const scenario = (typeof scenarioValue === "string"
    ? scenarioValue
    : "auto") as MockTranscriptionScenario;

  const recordingId = randomUUID();

  void file.arrayBuffer();

  const transcription = mockTranscriptionForExercise(
    exerciseIdValue,
    scenario,
    recordingId
  );

  return NextResponse.json({
    transcription,
    meta: {
      bytesReceived: file.size,
      provider: "mock",
    },
  });
}
