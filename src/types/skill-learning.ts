export type SkillLevel = "complete_beginner" | "some_experience";

export type InstrumentType = "acoustic_piano" | "digital_keyboard" | "other";

export type PreferredInputMode = "microphone" | "midi_optional_later";

export type UserProfile = {
  id: string;
  skillLevel: SkillLevel;
  instrumentType: InstrumentType;
  preferredInputMode: PreferredInputMode;
  currentLessonId: string | null;
  completedLessonIds: string[];
  weakAreas: string[];
};

export type ExerciseRubricType =
  | "single_note"
  | "repeated_note"
  | "sequence"
  | "rhythm"
  | "melody";

export type ExerciseRubric = {
  id: string;
  lessonId: string;
  type: ExerciseRubricType;
  expectedNotes: string[];
  attemptsRequired: number;
  passingAccuracy: number;
  minimumConfidence: number;
  maxExtraNotes: number;
  timingToleranceMs?: number;
  /** Expected spacing between consecutive note onsets (rhythm), milliseconds. */
  targetSpacingMs?: number;
  instructions: string;
};

export type DetectedNote = {
  note: string;
  midiNumber?: number;
  startTime: number;
  endTime: number;
  confidence: number;
};

export type TranscriptionProviderId =
  | "mock"
  | "virtual"
  | "basic_pitch"
  | "klangio";

export type TranscriptionResult = {
  recordingId: string;
  provider: TranscriptionProviderId;
  detectedNotes: DetectedNote[];
  overallConfidence: number;
  warnings: string[];
};

export type EvaluationStatus = "passed" | "failed" | "unclear";

export type EvaluationRecommendation =
  | "continue_next_lesson"
  | "repeat_exercise"
  | "repeat_with_keyboard_landmark"
  | "re_record_cleaner_audio"
  | "unsupported_exercise_type";

export type EvaluationMistake = {
  code:
    | "wrong_note"
    | "missing_note"
    | "extra_note"
    | "wrong_order"
    | "low_confidence"
    | "too_many_extra_notes"
    | "timing_deviation";
  message: string;
  position?: number;
  expectedNote?: string;
  detectedNote?: string;
};

export type RhythmIntervalBreakdown = {
  fromIndex: number;
  toIndex: number;
  expectedSpacingMs: number;
  measuredSpacingMs: number;
  withinTolerance: boolean;
};

export type RhythmScoringBreakdown = {
  expectedNoteCount: number;
  detectedNoteCount: number;
  pitchScore: number;
  timingScore: number;
  pitchWeight: number;
  timingWeight: number;
  combinedScore: number;
  passingAccuracy: number;
  intervals: RhythmIntervalBreakdown[];
};

export type EvaluationResult = {
  exerciseId: string;
  status: EvaluationStatus;
  score: number;
  expectedNotes: string[];
  detectedNotes: DetectedNote[];
  mistakes: EvaluationMistake[];
  confidence: number;
  recommendation: EvaluationRecommendation;
  summary: string;
  /** Present when rubric `type` is `rhythm` and timing fields are configured. */
  rhythmScoringBreakdown?: RhythmScoringBreakdown;
};

export type AIFeedback = {
  headline: string;
  explanation: string;
  correction: string;
  nextStep: string;
  encouragement?: string;
  detectedIssueReferences: string[];
};

export type Attempt = {
  id: string;
  userId: string;
  lessonId: string;
  exerciseId: string;
  recordingUrl?: string;
  transcriptionResult?: TranscriptionResult;
  evaluationResult?: EvaluationResult;
  aiFeedback?: AIFeedback;
  createdAt: string;
};

export type LessonDemonstrationEvent = {
  note: string;
  offsetMs: number;
};

/** One graded step inside a lesson (isolate → combine → integrate). */
export type LessonPhase = {
  id: string;
  title: string;
  /** Shown above the recorder; explains the goal of this step. */
  narrative?: string;
  exerciseId: string;
  /** Optional demo for this step only; falls back to lesson-level `demonstrationEvents` when absent. */
  demonstrationEvents?: LessonDemonstrationEvent[];
};

export type Lesson = {
  id: string;
  moduleId: string;
  title: string;
  objective: string;
  explanation: string;
  concepts: string[];
  prerequisites: string[];
  /** Owning exercises; kept in sync with `lessonPhases` for tooling. */
  exerciseIds: string[];
  estimatedMinutes: number;
  requiresRecording: boolean;
  /** Optional scheduled playback before practice (whole-lesson intro). */
  demonstrationEvents?: LessonDemonstrationEvent[];
  /**
   * Ordered practice gates. When set, all graded steps use these in order.
   * When absent, a single implicit phase is derived from `exerciseIds[0]`.
   */
  lessonPhases?: LessonPhase[];
  /**
   * When false, on-screen keyboard cannot cover every note in a phase (mic/MIDI only).
   * Currently unused by UI; reserved for future gating.
   */
  virtualCompatible?: boolean;
};
