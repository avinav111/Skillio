"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { EvaluationResult, TranscriptionResult } from "@/types/skill-learning";
import {
  ensureLocalUserId,
  isLessonUnlockedLocal,
  loadLocalProgress,
  markLessonCompleteLocal,
  recordAttemptLocal,
  type LocalProgressSnapshot,
} from "@/lib/progress/local-persistence";

export function useProgress() {
  const [snapshot, setSnapshot] = useState<LocalProgressSnapshot | null>(null);

  useEffect(() => {
    const sync = () => {
      setSnapshot(loadLocalProgress());
    };
    sync();
    window.addEventListener("glide-progress-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("glide-progress-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const refresh = useCallback(() => {
    setSnapshot(loadLocalProgress());
  }, []);

  const recordAttempt = useCallback(
    (input: {
      lessonId: string;
      exerciseId: string;
      transcription?: TranscriptionResult;
      evaluation?: EvaluationResult;
      completeLessonOnPass?: boolean;
    }) => {
      const base = loadLocalProgress();
      const next = recordAttemptLocal(base, input);
      setSnapshot(next);

      const userId = ensureLocalUserId();
      void fetch("/api/progress/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          lessonId: input.lessonId,
          exerciseId: input.exerciseId,
          transcription: input.transcription,
          evaluation: input.evaluation,
          profile: {
            skillLevel: next.skillLevel,
            instrumentType: next.instrumentType,
            microphoneOk: next.microphoneOk,
            completedLessonIds: next.completedLessonIds,
            weakAreas: next.weakAreas,
          },
        }),
      }).catch(() => {
        /* optional remote sync */
      });
    },
    []
  );

  const markLessonComplete = useCallback((lessonId: string) => {
    const base = loadLocalProgress();
    const next = markLessonCompleteLocal(base, lessonId);
    setSnapshot(next);
    const userId = ensureLocalUserId();
    void fetch("/api/progress/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        skillLevel: next.skillLevel,
        instrumentType: next.instrumentType,
        microphoneOk: next.microphoneOk,
        completedLessonIds: next.completedLessonIds,
        weakAreas: next.weakAreas,
      }),
    }).catch(() => {});
  }, []);

  const isLessonUnlocked = useCallback(
    (prerequisiteLessonIds: string[]) => {
      if (!snapshot) {
        return true;
      }
      return isLessonUnlockedLocal(snapshot, prerequisiteLessonIds);
    },
    [snapshot]
  );

  return useMemo(
    () => ({
      snapshot,
      refresh,
      recordAttempt,
      markLessonComplete,
      isLessonUnlocked,
    }),
    [isLessonUnlocked, markLessonComplete, recordAttempt, refresh, snapshot]
  );
}
