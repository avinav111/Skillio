import type { ExerciseRubric, Lesson } from "@/types/skill-learning";

export const MODULE_KEYBOARD_FOUNDATIONS = "module_keyboard_foundations";
export const MODULE_REGISTER_AND_DIRECTION = "module_register_and_direction";
export const MODULE_NOTE_SEQUENCES = "module_note_sequences";

export type CurriculumModule = {
  id: string;
  title: string;
  description: string;
  lessonIds: string[];
};

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

export const exerciseCFiveFinger: ExerciseRubric = {
  id: "c_position_up",
  lessonId: "c_position_001",
  type: "sequence",
  expectedNotes: ["C4", "D4", "E4", "F4", "G4"],
  attemptsRequired: 5,
  passingAccuracy: 1,
  minimumConfidence: 0.65,
  maxExtraNotes: 0,
  instructions: "Play C–D–E–F–G in order, one note at a time.",
};

export const exerciseSteadyCFour: ExerciseRubric = {
  id: "steady_c_four",
  lessonId: "steady_beat_001",
  type: "rhythm",
  expectedNotes: ["C4", "C4", "C4", "C4"],
  attemptsRequired: 4,
  passingAccuracy: 0.78,
  minimumConfidence: 0.65,
  maxExtraNotes: 0,
  targetSpacingMs: 600,
  timingToleranceMs: 140,
  instructions:
    "Play Middle C four times with an even pulse — about one note every 0.6 seconds.",
};

export const exerciseSteadyCTwo: ExerciseRubric = {
  id: "steady_c_two",
  lessonId: "steady_beat_001",
  type: "rhythm",
  expectedNotes: ["C4", "C4"],
  attemptsRequired: 2,
  passingAccuracy: 0.78,
  minimumConfidence: 0.65,
  maxExtraNotes: 0,
  targetSpacingMs: 600,
  timingToleranceMs: 140,
  instructions:
    "Play Middle C twice with the same steady spacing you will use in longer patterns.",
};

export const exerciseSteadyCGFour: ExerciseRubric = {
  id: "steady_c_g_four",
  lessonId: "steady_beat_001",
  type: "rhythm",
  expectedNotes: ["C4", "G4", "C4", "G4"],
  attemptsRequired: 4,
  passingAccuracy: 0.75,
  minimumConfidence: 0.65,
  maxExtraNotes: 0,
  targetSpacingMs: 600,
  timingToleranceMs: 150,
  instructions:
    "Alternate Middle C and high G with the same pulse — register jumps on the beat.",
};

export const exerciseSteadyCDEG: ExerciseRubric = {
  id: "steady_c_d_e_g",
  lessonId: "steady_beat_001",
  type: "rhythm",
  expectedNotes: ["C4", "D4", "E4", "G4"],
  attemptsRequired: 4,
  passingAccuracy: 0.72,
  minimumConfidence: 0.65,
  maxExtraNotes: 0,
  targetSpacingMs: 550,
  timingToleranceMs: 160,
  instructions:
    "Walk up C–D–E then skip to G, keeping an even beat between every attack.",
};

export const exerciseRegisterF3: ExerciseRubric = {
  id: "register_single_f3",
  lessonId: "register_direction_001",
  type: "single_note",
  expectedNotes: ["F3"],
  attemptsRequired: 1,
  passingAccuracy: 1,
  minimumConfidence: 0.65,
  maxExtraNotes: 0,
  instructions: "Play the low F white key below Middle C once, clearly.",
};

export const exerciseRegisterG4: ExerciseRubric = {
  id: "register_single_g4",
  lessonId: "register_direction_001",
  type: "single_note",
  expectedNotes: ["G4"],
  attemptsRequired: 1,
  passingAccuracy: 1,
  minimumConfidence: 0.65,
  maxExtraNotes: 0,
  instructions: "Play high G (the top white key in this practice range) once, clearly.",
};

export const exerciseRegisterFCG: ExerciseRubric = {
  id: "register_f_c_g",
  lessonId: "register_direction_001",
  type: "sequence",
  expectedNotes: ["F3", "C4", "G4"],
  attemptsRequired: 3,
  passingAccuracy: 1,
  minimumConfidence: 0.65,
  maxExtraNotes: 0,
  instructions: "Jump from low F to Middle C, then up to high G — low, home, high.",
};

export const exerciseRegisterWalk: ExerciseRubric = {
  id: "register_f_g_a_c",
  lessonId: "register_direction_001",
  type: "sequence",
  expectedNotes: ["F3", "G3", "A3", "C4"],
  attemptsRequired: 4,
  passingAccuracy: 1,
  minimumConfidence: 0.65,
  maxExtraNotes: 0,
  instructions:
    "Climb F–G–A then land on Middle C, combining steps and a wider skip you already practiced.",
};

export const exerciseRegisterAscendA3C4: ExerciseRubric = {
  id: "register_ascend_a3_c4",
  lessonId: "register_connect_001",
  type: "sequence",
  expectedNotes: ["A3", "B3", "C4"],
  attemptsRequired: 3,
  passingAccuracy: 1,
  minimumConfidence: 0.65,
  maxExtraNotes: 0,
  instructions: "Step up from A through B into Middle C.",
};

export const exerciseRegisterDescendC4G3: ExerciseRubric = {
  id: "register_descend_c4_g3",
  lessonId: "register_connect_001",
  type: "sequence",
  expectedNotes: ["C4", "B3", "A3", "G3"],
  attemptsRequired: 4,
  passingAccuracy: 1,
  minimumConfidence: 0.65,
  maxExtraNotes: 0,
  instructions: "Walk down white keys from Middle C to G below A.",
};

export const exerciseRegisterSteadyReview: ExerciseRubric = {
  id: "register_steady_c_review",
  lessonId: "register_connect_001",
  type: "rhythm",
  expectedNotes: ["C4", "C4", "C4", "C4"],
  attemptsRequired: 4,
  passingAccuracy: 0.78,
  minimumConfidence: 0.65,
  maxExtraNotes: 0,
  targetSpacingMs: 600,
  timingToleranceMs: 140,
  instructions:
    "Return to Middle C and lock in four steady attacks — same timing goal as your steady-beat lesson.",
};

export const exerciseFgaAscend: ExerciseRubric = {
  id: "fga_up",
  lessonId: "f_g_a_001",
  type: "sequence",
  expectedNotes: ["F3", "G3", "A3"],
  attemptsRequired: 3,
  passingAccuracy: 1,
  minimumConfidence: 0.65,
  maxExtraNotes: 0,
  instructions: "Play F, then G, then A below Middle C.",
};

export const exerciseDescendCba: ExerciseRubric = {
  id: "cba_down",
  lessonId: "descend_c_b_a_001",
  type: "sequence",
  expectedNotes: ["C4", "B3", "A3"],
  attemptsRequired: 3,
  passingAccuracy: 1,
  minimumConfidence: 0.65,
  maxExtraNotes: 0,
  instructions: "Play C4, then step down to B3, then A3.",
};

export const exerciseRepeatedG3: ExerciseRubric = {
  id: "g3_repeat_three",
  lessonId: "g3_anchor_001",
  type: "repeated_note",
  expectedNotes: ["G3", "G3", "G3"],
  attemptsRequired: 3,
  passingAccuracy: 1,
  minimumConfidence: 0.65,
  maxExtraNotes: 0,
  instructions: "Play G below A three times to anchor the G landmark.",
};

export const lessons: Lesson[] = [
  {
    id: "keyboard_layout_001",
    moduleId: MODULE_KEYBOARD_FOUNDATIONS,
    title: "Understanding the Keyboard",
    objective:
      "Understand how black keys group white keys so you can navigate confidently.",
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
  {
    id: "c_position_001",
    moduleId: MODULE_KEYBOARD_FOUNDATIONS,
    title: "Five-Finger C Position",
    objective: "Play an ascending five-note scale from C4 through G4.",
    explanation:
      "Rest your hand over C with your thumb on C. Walk up white keys C–D–E–F–G without stretching sideways.",
    concepts: ["five_finger_position", "thumb_on_c"],
    prerequisites: ["c_d_e_001"],
    exerciseIds: [exerciseCFiveFinger.id],
    estimatedMinutes: 14,
    requiresRecording: true,
  },
  {
    id: "steady_beat_001",
    moduleId: MODULE_KEYBOARD_FOUNDATIONS,
    title: "Playing With a Steady Beat",
    objective:
      "Build steady spacing on one note, add register jumps, then integrate with a wider contour.",
    explanation:
      "Steady beat is the foundation for rhythm. You will isolate the pulse on Middle C, alternate with high G while keeping the same spacing, then apply the pulse to a short contour.",
    concepts: ["steady_pulse", "inter_onset_timing", "register_contrast"],
    prerequisites: ["c_position_001"],
    exerciseIds: [
      exerciseSteadyCTwo.id,
      exerciseSteadyCGFour.id,
      exerciseSteadyCDEG.id,
    ],
    estimatedMinutes: 18,
    requiresRecording: true,
    demonstrationEvents: [
      { note: "C4", offsetMs: 0 },
      { note: "C4", offsetMs: 600 },
      { note: "C4", offsetMs: 1200 },
      { note: "C4", offsetMs: 1800 },
    ],
    lessonPhases: [
      {
        id: "steady_isolate",
        title: "New mechanic: steady spacing on one note",
        narrative:
          "Tap Middle C twice. Focus only on the time between the two attacks — ignore speed for now and aim for an even wait.",
        exerciseId: exerciseSteadyCTwo.id,
        demonstrationEvents: [
          { note: "C4", offsetMs: 0 },
          { note: "C4", offsetMs: 600 },
        ],
      },
      {
        id: "steady_combine_register",
        title: "Tie-in: keep the pulse while changing register",
        narrative:
          "Alternate Middle C and high G four times. The beat stays the same; only the pitch changes.",
        exerciseId: exerciseSteadyCGFour.id,
        demonstrationEvents: [
          { note: "C4", offsetMs: 0 },
          { note: "G4", offsetMs: 600 },
          { note: "C4", offsetMs: 1200 },
          { note: "G4", offsetMs: 1800 },
        ],
      },
      {
        id: "steady_integrate",
        title: "Mastery check: contour + steady beat",
        narrative:
          "Play C–D–E–G with the same steady spacing between each attack. This blends steps, skips, and timing.",
        exerciseId: exerciseSteadyCDEG.id,
        demonstrationEvents: [
          { note: "C4", offsetMs: 0 },
          { note: "D4", offsetMs: 550 },
          { note: "E4", offsetMs: 1100 },
          { note: "G4", offsetMs: 1650 },
        ],
      },
    ],
  },
  {
    id: "register_direction_001",
    moduleId: MODULE_REGISTER_AND_DIRECTION,
    title: "Low, Middle, and High on the Keyboard",
    objective:
      "Feel the distance between a low anchor, Middle C, and a high anchor before linking them in motion.",
    explanation:
      "Register is how high or low a sound sits. You will visit F below Middle C, Middle C itself, and G above the staff area used in this course — all on white keys you can reach in practice.",
    concepts: ["register", "keyboard_navigation", "landmarks"],
    prerequisites: ["steady_beat_001"],
    exerciseIds: [
      exerciseRegisterF3.id,
      exerciseRegisterG4.id,
      exerciseRegisterFCG.id,
      exerciseRegisterWalk.id,
    ],
    estimatedMinutes: 22,
    requiresRecording: true,
    virtualCompatible: true,
    lessonPhases: [
      {
        id: "reg_isolate_low",
        title: "Isolate: find low F",
        narrative: "Play a single low F. Listen for a full, grounded sound.",
        exerciseId: exerciseRegisterF3.id,
      },
      {
        id: "reg_isolate_high",
        title: "Isolate: find high G",
        narrative: "Play a single high G. Notice how much brighter it feels than low F.",
        exerciseId: exerciseRegisterG4.id,
      },
      {
        id: "reg_combine_jump",
        title: "Combine: low → home → high",
        narrative: "Link the two anchors through Middle C: F, then C, then G.",
        exerciseId: exerciseRegisterFCG.id,
        demonstrationEvents: [
          { note: "F3", offsetMs: 0 },
          { note: "C4", offsetMs: 400 },
          { note: "G4", offsetMs: 800 },
        ],
      },
      {
        id: "reg_integrate_walk",
        title: "Integrate: walk and land on Middle C",
        narrative:
          "Climb stepwise from F through G and A, then skip to Middle C — several mechanics in one short line.",
        exerciseId: exerciseRegisterWalk.id,
        demonstrationEvents: [
          { note: "F3", offsetMs: 0 },
          { note: "G3", offsetMs: 350 },
          { note: "A3", offsetMs: 700 },
          { note: "C4", offsetMs: 1200 },
        ],
      },
    ],
  },
  {
    id: "register_connect_001",
    moduleId: MODULE_REGISTER_AND_DIRECTION,
    title: "Connecting Steps Around Middle C",
    objective:
      "Step toward Middle C from below, walk back down through the register, then re-stabilize timing on C alone.",
    explanation:
      "This lesson strings together scalar motion near Middle C and ends with the steady pulse you already passed in the steady-beat track.",
    concepts: ["scalar_motion", "register", "steady_pulse_review"],
    prerequisites: ["register_direction_001"],
    exerciseIds: [
      exerciseRegisterAscendA3C4.id,
      exerciseRegisterDescendC4G3.id,
      exerciseRegisterSteadyReview.id,
    ],
    estimatedMinutes: 16,
    requiresRecording: true,
    virtualCompatible: true,
    lessonPhases: [
      {
        id: "reg_conn_ascend",
        title: "Isolate: step up into Middle C",
        narrative: "Play A–B–C in order, one tone at a time.",
        exerciseId: exerciseRegisterAscendA3C4.id,
      },
      {
        id: "reg_conn_descend",
        title: "Combine: walk down from Middle C",
        narrative: "Descend C–B–A–G using the same calm pacing.",
        exerciseId: exerciseRegisterDescendC4G3.id,
      },
      {
        id: "reg_conn_steady",
        title: "Mastery check: steady C alone",
        narrative:
          "Four Middle Cs with even spacing — prove you still own the pulse after register work.",
        exerciseId: exerciseRegisterSteadyReview.id,
        demonstrationEvents: [
          { note: "C4", offsetMs: 0 },
          { note: "C4", offsetMs: 600 },
          { note: "C4", offsetMs: 1200 },
          { note: "C4", offsetMs: 1800 },
        ],
      },
    ],
  },
  {
    id: "g3_anchor_001",
    moduleId: MODULE_NOTE_SEQUENCES,
    title: "Landmark: G Below A",
    objective: "Find G3 and repeat it confidently.",
    explanation:
      "From Middle C, walk down white keys: B, A, then G. G sits between two black keys in the lower register.",
    concepts: ["descending_motion", "g_landmark"],
    prerequisites: ["register_connect_001"],
    exerciseIds: [exerciseRepeatedG3.id],
    estimatedMinutes: 10,
    requiresRecording: true,
  },
  {
    id: "f_g_a_001",
    moduleId: MODULE_NOTE_SEQUENCES,
    title: "Short Ascent: F–G–A",
    objective: "Play F3, G3, and A3 in order.",
    explanation:
      "This mirrors earlier work but starts on F. Keep the same calm tempo you used for C–D–E.",
    concepts: ["scalar_fragment", "left_hand_register"],
    prerequisites: ["g3_anchor_001"],
    exerciseIds: [exerciseFgaAscend.id],
    estimatedMinutes: 11,
    requiresRecording: true,
  },
  {
    id: "descend_c_b_a_001",
    moduleId: MODULE_NOTE_SEQUENCES,
    title: "Stepping Down from Middle C",
    objective: "Play C4, B3, and A3 in order.",
    explanation:
      "Descending uses the same white-key steps in reverse. Listen for each note ringing cleanly before the next.",
    concepts: ["descending_steps", "near_middle_c"],
    prerequisites: ["f_g_a_001"],
    exerciseIds: [exerciseDescendCba.id],
    estimatedMinutes: 11,
    requiresRecording: true,
  },
];

export const exercisesById: Record<string, ExerciseRubric> = {
  [exerciseMiddleCFive.id]: exerciseMiddleCFive,
  [exerciseCdeSequence.id]: exerciseCdeSequence,
  [exerciseCFiveFinger.id]: exerciseCFiveFinger,
  [exerciseSteadyCFour.id]: exerciseSteadyCFour,
  [exerciseSteadyCTwo.id]: exerciseSteadyCTwo,
  [exerciseSteadyCGFour.id]: exerciseSteadyCGFour,
  [exerciseSteadyCDEG.id]: exerciseSteadyCDEG,
  [exerciseRegisterF3.id]: exerciseRegisterF3,
  [exerciseRegisterG4.id]: exerciseRegisterG4,
  [exerciseRegisterFCG.id]: exerciseRegisterFCG,
  [exerciseRegisterWalk.id]: exerciseRegisterWalk,
  [exerciseRegisterAscendA3C4.id]: exerciseRegisterAscendA3C4,
  [exerciseRegisterDescendC4G3.id]: exerciseRegisterDescendC4G3,
  [exerciseRegisterSteadyReview.id]: exerciseRegisterSteadyReview,
  [exerciseRepeatedG3.id]: exerciseRepeatedG3,
  [exerciseFgaAscend.id]: exerciseFgaAscend,
  [exerciseDescendCba.id]: exerciseDescendCba,
};

export const curriculumModules: CurriculumModule[] = [
  {
    id: MODULE_KEYBOARD_FOUNDATIONS,
    title: "Keyboard Foundations",
    description: "Map the instrument, find Middle C, and build short patterns.",
    lessonIds: [
      "keyboard_layout_001",
      "middle_c_001",
      "c_d_e_001",
      "c_position_001",
      "steady_beat_001",
    ],
  },
  {
    id: MODULE_REGISTER_AND_DIRECTION,
    title: "Register and Direction",
    description:
      "Hear low vs high, connect landmarks through Middle C, and revisit steady pulse — all on the same white-key span as the on-screen keyboard (F3–G4).",
    lessonIds: ["register_direction_001", "register_connect_001"],
  },
  {
    id: MODULE_NOTE_SEQUENCES,
    title: "Note Sequences",
    description: "Short scalar fragments in different registers.",
    lessonIds: ["g3_anchor_001", "f_g_a_001", "descend_c_b_a_001"],
  },
];

export function getLessonById(lessonId: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === lessonId);
}

export function getExerciseById(exerciseId: string): ExerciseRubric | undefined {
  return exercisesById[exerciseId];
}

export function getModuleById(moduleId: string): CurriculumModule | undefined {
  return curriculumModules.find((m) => m.id === moduleId);
}
