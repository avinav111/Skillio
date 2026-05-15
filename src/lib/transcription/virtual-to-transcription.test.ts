import { describe, expect, it } from "vitest";
import { buildVirtualTranscriptionResult } from "./virtual-to-transcription";
import { evaluateForRubric } from "@/lib/evaluator";
import {
  exerciseMiddleCFive,
  exerciseSteadyCFour,
} from "@/lib/curriculum/initial-lessons";

describe("buildVirtualTranscriptionResult", () => {
  it("builds a transcription the evaluator accepts for Middle C drill", () => {
    const base = 50_000;
    const captures = [0, 200, 400, 600, 800].map((offset) => ({
      note: "C4",
      onsetMs: base + offset,
    }));
    const result = buildVirtualTranscriptionResult(captures, "virtual_test_id");
    expect(result.provider).toBe("virtual");
    expect(result.detectedNotes).toHaveLength(5);
    const evaluation = evaluateForRubric(exerciseMiddleCFive, result);
    expect(evaluation.status).toBe("passed");
  });

  it("uses real onset spacing for rhythm (passes when near target 600ms)", () => {
    const base = 12_000;
    const captures = [0, 600, 1200, 1800].map((offset) => ({
      note: "C4",
      onsetMs: base + offset,
    }));
    const tr = buildVirtualTranscriptionResult(captures, "steady_ok");
    const evaluation = evaluateForRubric(exerciseSteadyCFour, tr);
    expect(evaluation.status).toBe("passed");
    expect(evaluation.rhythmScoringBreakdown?.intervals).toHaveLength(3);
    expect(
      evaluation.rhythmScoringBreakdown?.intervals.every((i) => i.withinTolerance)
    ).toBe(true);
  });

  it("uses real onset spacing for rhythm (fails when too fast)", () => {
    const base = 20_000;
    const captures = [0, 280, 560, 840].map((offset) => ({
      note: "C4",
      onsetMs: base + offset,
    }));
    const tr = buildVirtualTranscriptionResult(captures, "steady_fast");
    const evaluation = evaluateForRubric(exerciseSteadyCFour, tr);
    expect(evaluation.status).toBe("failed");
    expect(evaluation.mistakes.some((m) => m.code === "timing_deviation")).toBe(true);
    expect(
      evaluation.rhythmScoringBreakdown?.intervals.some((i) => !i.withinTolerance)
    ).toBe(true);
  });
});
