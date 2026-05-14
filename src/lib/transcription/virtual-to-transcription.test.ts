import { describe, expect, it } from "vitest";
import { buildVirtualTranscriptionResult } from "./virtual-to-transcription";
import { evaluateForRubric } from "@/lib/evaluator";
import { exerciseMiddleCFive } from "@/lib/curriculum/initial-lessons";

describe("buildVirtualTranscriptionResult", () => {
  it("builds a transcription the evaluator accepts for Middle C drill", () => {
    const notes = ["C4", "C4", "C4", "C4", "C4"];
    const result = buildVirtualTranscriptionResult(notes, "virtual_test_id");
    expect(result.provider).toBe("virtual");
    expect(result.detectedNotes).toHaveLength(5);
    const evaluation = evaluateForRubric(exerciseMiddleCFive, result);
    expect(evaluation.status).toBe("passed");
  });
});
