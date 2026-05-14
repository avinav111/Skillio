import type { MockTranscriptionScenario } from "@/lib/transcription/mock-scenarios";

type ScenarioOption = {
  value: MockTranscriptionScenario;
  label: string;
};

const baseScenarios: ScenarioOption[] = [
  { value: "auto", label: "Auto (happy path for this exercise)" },
  { value: "pass", label: "Mock: perfect match" },
  { value: "unclear_low_confidence", label: "Mock: low confidence" },
];

export function scenarioOptionsForExercise(
  exerciseId: string
): ScenarioOption[] {
  if (exerciseId === "middle_c_play_five") {
    return [
      ...baseScenarios,
      { value: "partial_pass", label: "Mock: 4/5 correct" },
      { value: "fail_wrong_note", label: "Mock: wrong note swaps" },
    ];
  }

  if (exerciseId === "cde_slow_sequence") {
    return [
      ...baseScenarios,
      { value: "fail_sequence_swap", label: "Mock: C–E–D instead of C–D–E" },
    ];
  }

  return baseScenarios;
}
