"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FeedbackPanel } from "@/components/feedback/FeedbackPanel";
import { ExerciseRecorder } from "@/components/recorder/ExerciseRecorder";
import { VirtualPiano } from "@/components/keyboard/VirtualPiano";
import { LessonDemonstration } from "@/components/lesson/LessonDemonstration";
import { evaluateForRubric } from "@/lib/evaluator";
import { buildTemplateFeedback } from "@/lib/ai/template-feedback";
import { useProgress } from "@/hooks/use-progress";
import type {
  AIFeedback,
  ExerciseRubric,
  Lesson,
  LessonDemonstrationEvent,
  TranscriptionResult,
} from "@/types/skill-learning";

type InputMode = "microphone" | "virtual";

type Props = {
  lesson: Lesson;
  exercise: ExerciseRubric;
  phaseDemonstrationEvents?: LessonDemonstrationEvent[];
  /** When false, a passing attempt does not mark the whole lesson complete (intermediate phases). */
  completeLessonOnPass?: boolean;
  /** When set, after a pass the user advances to the next phase instead of leaving for the roadmap. */
  onAdvancePhase?: () => void;
};

export function LessonPracticePanel({
  lesson,
  exercise,
  phaseDemonstrationEvents,
  completeLessonOnPass = true,
  onAdvancePhase,
}: Props) {
  const { recordAttempt } = useProgress();
  const lastRecordedId = useRef<string | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>("microphone");
  const [practiceKey, setPracticeKey] = useState(0);
  const [transcription, setTranscription] = useState<TranscriptionResult | null>(
    null
  );
  const [coachFeedback, setCoachFeedback] = useState<AIFeedback | null>(null);

  const demoEvents =
    phaseDemonstrationEvents && phaseDemonstrationEvents.length > 0
      ? phaseDemonstrationEvents
      : lesson.demonstrationEvents;

  const evaluation = useMemo(() => {
    if (!transcription) {
      return null;
    }
    return evaluateForRubric(exercise, transcription);
  }, [exercise, transcription]);

  useEffect(() => {
    if (!transcription || !evaluation) {
      if (!transcription) {
        lastRecordedId.current = null;
      }
      setCoachFeedback(null);
      return;
    }
    if (transcription.recordingId === lastRecordedId.current) {
      return;
    }
    lastRecordedId.current = transcription.recordingId;
    recordAttempt({
      lessonId: lesson.id,
      exerciseId: exercise.id,
      transcription,
      evaluation,
      completeLessonOnPass,
    });
  }, [
    completeLessonOnPass,
    evaluation,
    exercise.id,
    lesson.id,
    recordAttempt,
    transcription,
  ]);

  useEffect(() => {
    if (!transcription) {
      setCoachFeedback(null);
      return;
    }
    const ev = evaluateForRubric(exercise, transcription);
    const template = buildTemplateFeedback(lesson, ev);
    setCoachFeedback(template);
    const controller = new AbortController();
    void (async () => {
      try {
        const response = await fetch("/api/coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lesson, evaluation: ev }),
          signal: controller.signal,
        });
        if (!response.ok) {
          return;
        }
        const payload = (await response.json()) as { feedback?: AIFeedback | null };
        if (payload.feedback && !controller.signal.aborted) {
          setCoachFeedback(payload.feedback);
        }
      } catch {
        /* keep template */
      }
    })();
    return () => controller.abort();
  }, [exercise, lesson, transcription]);

  function handleModeChange(mode: InputMode) {
    setInputMode(mode);
    setTranscription(null);
    setPracticeKey((key) => key + 1);
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{exercise.instructions}</p>

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">How do you want to practice?</p>
        <div
          className="flex flex-wrap gap-2 rounded-lg border border-border bg-muted/30 p-1"
          role="group"
          aria-label="Practice input source"
        >
          <Button
            type="button"
            size="sm"
            variant={inputMode === "microphone" ? "default" : "ghost"}
            className={inputMode === "microphone" ? "" : "text-muted-foreground"}
            onClick={() => handleModeChange("microphone")}
          >
            Microphone
          </Button>
          <Button
            type="button"
            size="sm"
            variant={inputMode === "virtual" ? "default" : "ghost"}
            className={inputMode === "virtual" ? "" : "text-muted-foreground"}
            onClick={() => handleModeChange("virtual")}
          >
            On-screen keyboard
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Use the microphone with a real instrument when you can. On-screen keyboard
          is for quick testing without hardware; results are labeled as virtual input.
        </p>
      </div>

      {demoEvents && demoEvents.length > 0 ? (
        <LessonDemonstration title="Hear the target" events={demoEvents} />
      ) : null}

      {inputMode === "microphone" ? (
        <ExerciseRecorder
          key={`mic-${practiceKey}`}
          exerciseId={exercise.id}
          onResult={({ transcriptionJson }) => {
            setTranscription(transcriptionJson as TranscriptionResult);
          }}
        />
      ) : (
        <VirtualPiano
          key={`virtual-${practiceKey}`}
          onSubmit={setTranscription}
        />
      )}

      {evaluation && coachFeedback ? (
        <div className="space-y-4">
          <FeedbackPanel evaluation={evaluation} aiFeedback={coachFeedback} />
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setTranscription(null);
                setPracticeKey((key) => key + 1);
              }}
            >
              Try again
            </Button>
            {evaluation.status === "passed" ? (
              onAdvancePhase ? (
                <Button
                  type="button"
                  onClick={() => {
                    lastRecordedId.current = null;
                    onAdvancePhase();
                  }}
                >
                  Next step
                </Button>
              ) : (
                <Link
                  href="/roadmap"
                  className={cn(buttonVariants({ variant: "default" }))}
                >
                  Back to roadmap
                </Link>
              )
            ) : (
              <Link
                href={`/lessons/${lesson.id}`}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Review lesson
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
