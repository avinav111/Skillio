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
  instructions: string;
};

export type DetectedNote = {
  note: string;
  midiNumber?: number;
  startTime: number;
  endTime: number;
  confidence: number;
};

export type TranscriptionProviderId = "mock" | "basic_pitch" | "klangio";

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
    | "too_many_extra_notes";
  message: string;
  position?: number;
  expectedNote?: string;
  detectedNote?: string;
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

export type Lesson = {
  id: string;
  moduleId: string;
  title: string;
  objective: string;
  explanation: string;
  concepts: string[];
  prerequisites: string[];
  exerciseIds: string[];
  estimatedMinutes: number;
  requiresRecording: boolean;
};
