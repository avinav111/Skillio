import type { ExerciseRubric, Lesson } from "@/types/skill-learning";

export const MODULE_KEYBOARD_FOUNDATIONS = "module_keyboard_foundations";

export const exerciseMiddleCFive: ExerciseRubric = {
  id: "middle_c_play_five",
  lessonId: "middle_c_001",
  type: "repeated_note",
  expectedNotes: ["C4", "C4", "C4", "C4", "C4"],
  attemptsRequired: 5,
  passingAccuracy: 0.8,
  minimumConfidence: 0.65,
  maxExtraNotes: 0,
  instructions: "Play Middle C five times, pausing briefly between each sound.",
};

export const exerciseCdeSequence: ExerciseRubric = {
  id: "cde_slow_sequence",
  lessonId: "c_d_e_001",
  type: "sequence",
  expectedNotes: ["C4", "D4", "E4"],
  attemptsRequired: 3,
  passingAccuracy: 1,
  minimumConfidence: 0.65,
  maxExtraNotes: 0,
  instructions: "Play C, then D, then E slowly in order.",
};

export const lessons: Lesson[] = [
  {
    id: "keyboard_layout_001",
    moduleId: MODULE_KEYBOARD_FOUNDATIONS,
    title: "Understanding the Keyboard",
    objective: "Understand how black keys group white keys so you can navigate confidently.",
    explanation:
      "Piano keys repeat in a pattern. Find a group of two black keys: the white key immediately to their left is C. Groups of three black keys sit to the right of F within each octave.",
    concepts: ["white_keys", "black_key_groups", "octave_pattern"],
    prerequisites: [],
    exerciseIds: [],
    estimatedMinutes: 8,
    requiresRecording: false,
  },
  {
    id: "middle_c_001",
    moduleId: MODULE_KEYBOARD_FOUNDATIONS,
    title: "Finding Middle C",
    objective: "Locate Middle C (C4) and play it reliably.",
    explanation:
      "Middle C is near the center of the keyboard. Use the two-black-key landmark: the white key just left of that pair is C. Middle C is the C closest to where you naturally sit.",
    concepts: ["middle_c", "keyboard_landmarks"],
    prerequisites: ["keyboard_layout_001"],
    exerciseIds: [exerciseMiddleCFive.id],
    estimatedMinutes: 10,
    requiresRecording: true,
  },
  {
    id: "c_d_e_001",
    moduleId: MODULE_KEYBOARD_FOUNDATIONS,
    title: "First Three Notes: C, D, and E",
    objective: "Play C4, D4, and E4 in order with a steady, slow pulse.",
    explanation:
      "From Middle C, move one white key to the right for D, then another for E. Keep fingers relaxed and aim for clear separate notes.",
    concepts: ["stepwise_motion", "finger_independence_intro"],
    prerequisites: ["middle_c_001"],
    exerciseIds: [exerciseCdeSequence.id],
    estimatedMinutes: 12,
    requiresRecording: true,
  },
];

export const exercisesById: Record<string, ExerciseRubric> = {
  [exerciseMiddleCFive.id]: exerciseMiddleCFive,
  [exerciseCdeSequence.id]: exerciseCdeSequence,
};

export function getLessonById(lessonId: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === lessonId);
}

export function getExerciseById(exerciseId: string): ExerciseRubric | undefined {
  return exercisesById[exerciseId];
}
