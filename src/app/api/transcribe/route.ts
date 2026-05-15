import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { transcribeViaBasicPitchService } from "@/lib/transcription/basic-pitch-client";
import {
  getBasicPitchServiceUrl,
  getTranscriptionProvider,
} from "@/lib/transcription/env";
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
  const provider = getTranscriptionProvider();
  const basicPitchUrl = getBasicPitchServiceUrl();

  if (provider === "basic_pitch") {
    if (!basicPitchUrl) {
      return NextResponse.json(
        {
          error:
            "TRANSCRIPTION_PROVIDER=basic_pitch but BASIC_PITCH_SERVICE_URL is not set.",
        },
        { status: 503 }
      );
    }

    const filename =
      file instanceof File && file.name.length > 0 ? file.name : "upload.webm";
    const upstream = await transcribeViaBasicPitchService({
      serviceUrl: basicPitchUrl,
      audio: file,
      filename,
      recordingId,
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: upstream.message },
        { status: upstream.status >= 400 ? upstream.status : 502 }
      );
    }

    return NextResponse.json({
      transcription: upstream.transcription,
      meta: {
        bytesReceived: file.size,
        provider: "basic_pitch",
        exerciseId: exerciseIdValue,
      },
    });
  }

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
      exerciseId: exerciseIdValue,
    },
  });
}
