import type {
  EvaluationResult,
  TranscriptionResult,
} from "@/types/skill-learning";

export type StoredAttempt = {
  id: string;
  userId: string;
  lessonId: string;
  exerciseId: string;
  transcription?: TranscriptionResult;
  evaluation?: EvaluationResult;
  createdAt: string;
};

export type LocalProgressSnapshot = {
  userId: string;
  skillLevel?: string;
  instrumentType?: string;
  microphoneOk?: boolean;
  completedLessonIds: string[];
  weakAreas: string[];
  attempts: StoredAttempt[];
};

const STORAGE_KEY = "glide_progress_v2";

function notifyProgressChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("glide-progress-changed"));
  }
}

function randomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `user_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function ensureLocalUserId(): string {
  if (typeof window === "undefined") {
    return "ssr";
  }
  const existing = window.localStorage.getItem("glide_user_id");
  if (existing && existing.length > 0) {
    return existing;
  }
  const id = randomId();
  window.localStorage.setItem("glide_user_id", id);
  return id;
}

export function loadLocalProgress(): LocalProgressSnapshot {
  if (typeof window === "undefined") {
    return {
      userId: "ssr",
      completedLessonIds: [],
      weakAreas: [],
      attempts: [],
    };
  }
  const userId = ensureLocalUserId();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      userId,
      completedLessonIds: [],
      weakAreas: [],
      attempts: [],
    };
  }
  try {
    const parsed = JSON.parse(raw) as Partial<LocalProgressSnapshot>;
    return {
      userId,
      skillLevel: parsed.skillLevel,
      instrumentType: parsed.instrumentType,
      microphoneOk: parsed.microphoneOk,
      completedLessonIds: parsed.completedLessonIds ?? [],
      weakAreas: parsed.weakAreas ?? [],
      attempts: parsed.attempts ?? [],
    };
  } catch {
    return {
      userId,
      completedLessonIds: [],
      weakAreas: [],
      attempts: [],
    };
  }
}

export function saveLocalProgress(snapshot: LocalProgressSnapshot): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  notifyProgressChanged();
}

export function weakTagsFromEvaluation(evaluation: EvaluationResult): string[] {
  const tags = new Set<string>();
  for (const m of evaluation.mistakes) {
    tags.add(m.code);
  }
  tags.add(evaluation.status);
  tags.add(evaluation.recommendation);
  return [...tags];
}

export function recordAttemptLocal(
  snapshot: LocalProgressSnapshot,
  input: {
    lessonId: string;
    exerciseId: string;
    transcription?: TranscriptionResult;
    evaluation?: EvaluationResult;
    /** When false, a passing attempt does not mark the lesson complete (multi-phase lessons). Default true. */
    completeLessonOnPass?: boolean;
  }
): LocalProgressSnapshot {
  const attempt: StoredAttempt = {
    id: randomId(),
    userId: snapshot.userId,
    lessonId: input.lessonId,
    exerciseId: input.exerciseId,
    transcription: input.transcription,
    evaluation: input.evaluation,
    createdAt: new Date().toISOString(),
  };
  const attempts = [attempt, ...snapshot.attempts].slice(0, 50);
  let weakAreas = [...snapshot.weakAreas];
  let completedLessonIds = [...snapshot.completedLessonIds];

  if (input.evaluation) {
    weakAreas = [
      ...new Set([...weakAreas, ...weakTagsFromEvaluation(input.evaluation)]),
    ].slice(0, 30);
    if (
      input.evaluation.status === "passed" &&
      input.completeLessonOnPass !== false
    ) {
      completedLessonIds = [
        ...new Set([...completedLessonIds, input.lessonId]),
      ];
    }
  }

  const next: LocalProgressSnapshot = {
    ...snapshot,
    attempts,
    weakAreas,
    completedLessonIds,
  };
  saveLocalProgress(next);
  return next;
}

export function markLessonCompleteLocal(
  snapshot: LocalProgressSnapshot,
  lessonId: string
): LocalProgressSnapshot {
  const completedLessonIds = [...new Set([...snapshot.completedLessonIds, lessonId])];
  const next: LocalProgressSnapshot = { ...snapshot, completedLessonIds };
  saveLocalProgress(next);
  return next;
}

export function isLessonUnlockedLocal(
  snapshot: LocalProgressSnapshot,
  prerequisiteLessonIds: string[]
): boolean {
  if (prerequisiteLessonIds.length === 0) {
    return true;
  }
  const done = new Set(snapshot.completedLessonIds);
  return prerequisiteLessonIds.every((id) => done.has(id));
}
