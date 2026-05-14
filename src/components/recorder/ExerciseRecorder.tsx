"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { MockTranscriptionScenario } from "@/lib/transcription/mock-scenarios";
import { scenarioOptionsForExercise } from "@/lib/transcription/scenario-options";

type RecorderState =
  | "ready"
  | "recording"
  | "uploading"
  | "analyzing"
  | "complete"
  | "error";

type Props = {
  exerciseId: string;
  disabled?: boolean;
  onResult: (payload: {
    transcriptionJson: unknown;
    bytesSent: number;
  }) => void;
};

export function ExerciseRecorder({ exerciseId, disabled, onResult }: Props) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const scenarioOptions = useMemo(
    () => scenarioOptionsForExercise(exerciseId),
    [exerciseId]
  );

  const [permission, setPermission] = useState<"unknown" | "granted" | "denied">(
    "unknown"
  );
  const [state, setState] = useState<RecorderState>("ready");
  const [error, setError] = useState<string | null>(null);
  const [scenario, setScenario] = useState<MockTranscriptionScenario>("auto");

  useEffect(() => {
    const allowed = new Set(scenarioOptions.map((option) => option.value));
    setScenario((current) => (allowed.has(current) ? current : "auto"));
  }, [scenarioOptions]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const canRecord = useMemo(() => {
    return !disabled && permission !== "denied" && state !== "recording";
  }, [disabled, permission, state]);

  async function ensureStream() {
    if (streamRef.current) {
      return streamRef.current;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    setPermission("granted");
    return stream;
  }

  async function handleStart() {
    setError(null);
    try {
      const stream = await ensureStream();
      chunksRef.current = [];
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : undefined;
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      recorder.onerror = () => {
        setError("Recording stopped unexpectedly.");
        setState("error");
      };
      recorder.start();
      setState("recording");
    } catch {
      setPermission("denied");
      setError("Microphone permission is required to practice here.");
      setState("error");
    }
  }

  async function handleStopAndSubmit() {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      setState("ready");
      return;
    }

    setState("uploading");

    const blob = await new Promise<Blob>((resolve, reject) => {
      recorder.onstop = () => {
        const recording = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        resolve(recording);
      };
      recorder.onerror = () => reject(new Error("Recorder error"));
      recorder.stop();
    });

    mediaRecorderRef.current = null;

    const formData = new FormData();
    formData.append("audio", blob, "take.webm");
    formData.append("exerciseId", exerciseId);
    formData.append("mockScenario", scenario);

    setState("analyzing");

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(
          typeof payload.error === "string"
            ? payload.error
            : "Upload failed. Try again."
        );
      }

      const payload = await response.json();
      onResult({ transcriptionJson: payload.transcription, bytesSent: blob.size });
      setState("complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  function reset() {
    setState("ready");
    setError(null);
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card/40 p-4">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-foreground">Practice recording</p>
        <p className="text-sm text-muted-foreground">
          Your clip is uploaded for analysis. The current server still uses a mock
          transcription so we can prove the full loop before Basic Pitch is wired
          in.
        </p>
      </div>

      <label className="flex flex-col gap-2 text-sm text-muted-foreground">
        Mock transcription preset
        <select
          className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
          value={scenario}
          disabled={state === "recording" || state === "uploading"}
          onChange={(event) =>
            setScenario(event.target.value as MockTranscriptionScenario)
          }
        >
          {scenarioOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={handleStart} disabled={!canRecord}>
          {state === "recording" ? "Recording…" : "Start recording"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleStopAndSubmit}
          disabled={state !== "recording"}
        >
          Stop &amp; analyze
        </Button>
        <Button type="button" variant="outline" onClick={reset}>
          Reset
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        Status:{" "}
        <span className="font-medium text-foreground">
          {state}
          {permission === "denied" ? " (microphone blocked)" : ""}
        </span>
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
