"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FeedbackPanel } from "@/components/feedback/FeedbackPanel";
import { ExerciseRecorder } from "@/components/recorder/ExerciseRecorder";
import { evaluateForRubric } from "@/lib/evaluator";
import { buildTemplateFeedback } from "@/lib/ai/template-feedback";
import type { ExerciseRubric, Lesson, TranscriptionResult } from "@/types/skill-learning";

type Props = {
  lesson: Lesson;
  exercise: ExerciseRubric;
};

export function LessonPracticePanel({ lesson, exercise }: Props) {
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

  return (
    <div className="space-y-6">
      <ExerciseRecorder
        key={transcription?.recordingId ?? "idle"}
        exerciseId={exercise.id}
        onResult={({ transcriptionJson }) => {
          setTranscription(transcriptionJson as TranscriptionResult);
        }}
      />

      {evaluation && feedback ? (
        <div className="space-y-4">
          <FeedbackPanel evaluation={evaluation} aiFeedback={feedback} />
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="secondary" onClick={() => setTranscription(null)}>
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
