# Rubric schema

## `ExerciseRubric`

| Field                 | Type        | Description |
|-----------------------|-------------|-------------|
| `id`                  | string      | Stable identifier referenced by lessons + attempts. |
| `lessonId`            | string      | Owning lesson. |
| `type`                | enum        | `single_note`, `repeated_note`, `sequence`, `rhythm`, `melody`. MVP implements the first three via shared ordered-note logic. |
| `expectedNotes`       | string[]    | Scientific pitch strings (e.g., `C4`). Order matters. |
| `attemptsRequired`    | number      | Human-facing metadata (mirrors `expectedNotes.length` today). |
| `passingAccuracy`     | number      | 0–1 inclusive; pass when `score >= passingAccuracy`. |
| `minimumConfidence`   | number      | If overall transcription confidence is lower → `unclear`. |
| `maxExtraNotes`       | number      | Allowed trailing detections beyond the rubric length. |
| `timingToleranceMs`   | number?     | Reserved for rhythm exercises (unused in MVP). |
| `instructions`        | string      | Shown next to the recorder. |

## `TranscriptionResult`

| Field                 | Type            | Description |
|-----------------------|-----------------|-------------|
| `recordingId`         | string          | Correlates attempts (UUID from server in MVP). |
| `provider`            | enum            | `mock`, `basic_pitch`, `klangio`. |
| `detectedNotes`       | `DetectedNote[]`| Ordered events with per-note confidence. |
| `overallConfidence`   | number          | Aggregate mic-analysis confidence. |
| `warnings`            | string[]        | Non-fatal issues (e.g., mock provider reminder). |

## `EvaluationResult`

| Field             | Description |
|-------------------|-------------|
| `status`          | `passed`, `failed`, or `unclear`. |
| `score`           | `matches / expectedNotes.length` for aligned positions. |
| `mistakes`        | Structured list (`wrong_note`, `missing_note`, `extra_note`, etc.). |
| `recommendation`  | Machine-readable hint (`repeat_with_keyboard_landmark`, `re_record_cleaner_audio`, …). |

## AI contract

`AIFeedback` is generated only from `Lesson` context + `EvaluationResult`. It references `detectedIssueReferences` so future LLM prompts can stay grounded.
