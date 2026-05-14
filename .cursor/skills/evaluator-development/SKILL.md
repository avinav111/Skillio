---
name: evaluator-development
description: Guides creation and modification of rubric evaluator code—pure functions, types, tests, and no LLM or transcription calls inside evaluators. Use when creating or changing evaluators, rubric scoring, ExerciseRubric, TranscriptionResult, EvaluationResult, or pass/fail/unclear evaluation logic.
disable-model-invocation: true
---

# Evaluator Development Skill

Use this skill when creating or modifying rubric evaluator code.

## Steps

1. Read evaluator rules.
2. Inspect ExerciseRubric, TranscriptionResult, and EvaluationResult types.
3. Add or update pure evaluator functions.
4. Add tests before or alongside changes.
5. Do not call AI or transcription APIs inside evaluator functions.
6. Run tests.
7. Update docs/BUILD_LOG.md.

## Project pointers

- Evaluator rules for this repository: [.cursor/rules/evaluator-mdc.mdc](../../rules/evaluator-mdc.mdc) (workspace rule id: `evaluator-mdc.mdc`).
- Locate type definitions with search if paths move: `ExerciseRubric`, `TranscriptionResult`, `EvaluationResult`.
- If `docs/BUILD_LOG.md` is missing, create it when the workflow calls for an entry.

## Rules reminder (do not duplicate as source of truth)

After reading evaluator rules, follow them: pure inputs/outputs, support `passed` / `failed` / `unclear`, threshold-based `unclear`, no LLMs for scoring, tests required.

## Output

- summarize evaluator behavior
- list test cases added
- note edge cases
