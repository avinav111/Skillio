"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FeedbackPanel } from "@/components/feedback/FeedbackPanel";
import { ExerciseRecorder } from "@/components/recorder/ExerciseRecorder";
import { VirtualPiano } from "@/components/keyboard/VirtualPiano";
import { evaluateForRubric } from "@/lib/evaluator";
import { buildTemplateFeedback } from "@/lib/ai/template-feedback";
import type { ExerciseRubric, Lesson, TranscriptionResult } from "@/types/skill-learning";

type InputMode = "microphone" | "virtual";

type Props = {
  lesson: Lesson;
  exercise: ExerciseRubric;
};

export function LessonPracticePanel({ lesson, exercise }: Props) {
  const [inputMode, setInputMode] = useState<InputMode>("microphone");
  const [practiceKey, setPracticeKey] = useState(0);
  const [transcription, setTranscription] = useState<TranscriptionResult | null>(
    null
  );

  const evaluation = useMemo(() => {
    if (!transcription) {
      return null;
    }
    return evaluateForRubric(exercise, transcription);
  }, [exercise, transcription]);

  const feedback = useMemo(() => {
    if (!evaluation) {
      return null;
    }
    return buildTemplateFeedback(lesson, evaluation);
  }, [evaluation, lesson]);

  function handleModeChange(mode: InputMode) {
    setInputMode(mode);
    setTranscription(null);
    setPracticeKey((key) => key + 1);
  }

  return (
    <div className="space-y-6">
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

      {evaluation && feedback ? (
        <div className="space-y-4">
          <FeedbackPanel evaluation={evaluation} aiFeedback={feedback} />
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
              <Link
                href="/roadmap"
                className={cn(buttonVariants({ variant: "default" }))}
              >
                Back to roadmap
              </Link>
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
