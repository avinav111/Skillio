# Rubric schema

## `ExerciseRubric`

| Field                 | Type        | Description |
|-----------------------|-------------|-------------|
| `id`                  | string      | Stable identifier referenced by lessons + attempts. |
| `lessonId`            | string      | Owning lesson. |
| `type`                | enum        | `single_note`, `repeated_note`, `sequence`, `rhythm`, `melody`. MVP implements ordered-note logic for the first three; `rhythm` adds inter-onset timing. |
| `expectedNotes`       | string[]    | Scientific pitch strings (e.g., `C4`). Order matters. |
| `attemptsRequired`    | number      | Human-facing metadata (mirrors `expectedNotes.length` today). |
| `passingAccuracy`     | number      | 0–1 inclusive; pass when final `score >= passingAccuracy`. |
| `minimumConfidence`   | number      | If overall transcription confidence is lower → `unclear`. |
| `maxExtraNotes`       | number      | Allowed trailing detections beyond the rubric length. |
| `targetSpacingMs`     | number?     | For `rhythm`: expected milliseconds between consecutive note **onsets**. |
| `timingToleranceMs`   | number?     | For `rhythm`: allowed ± deviation from `targetSpacingMs` per interval. |
| `instructions`        | string      | Shown next to the recorder. |

## `TranscriptionResult`

| Field                 | Type            | Description |
|-----------------------|-----------------|-------------|
| `recordingId`         | string          | Correlates attempts (UUID from server in MVP). |
| `provider`            | enum            | `mock`, `virtual` (on-screen taps), `basic_pitch`, `klangio`. |
| `detectedNotes`       | `DetectedNote[]`| Ordered events with per-note confidence. |
| `overallConfidence`   | number          | Aggregate mic-analysis confidence. |
| `warnings`            | string[]        | Non-fatal issues (e.g. mock provider reminder). |

### Virtual vs microphone timing

- **Microphone** (`mock`, `basic_pitch`, …): `startTime` / `endTime` on each `DetectedNote` come from the transcription provider (real audio analysis or deterministic mock scenarios).
- **Virtual keyboard**: the client records **`performance.now()`** at each new note attack and normalizes to seconds from the first attack before evaluation. Rhythm grading is meaningful only after this capture; older builds used a fixed synthetic spacing and were not sensitive to how fast you tapped.

## `EvaluationResult`

| Field             | Description |
|-------------------|-------------|
| `status`          | `passed`, `failed`, or `unclear`. |
| `score`           | For ordered types: `correct / expectedNotes.length`. For `rhythm`: weighted combination of pitch and timing (see below). |
| `mistakes`        | Structured list (`wrong_note`, `missing_note`, `extra_note`, `timing_deviation`, etc.). |
| `recommendation`  | Machine-readable hint (`repeat_with_keyboard_landmark`, `re_record_cleaner_audio`, …). |
| `rhythmScoringBreakdown` | Optional. Present for `rhythm` rubrics with `targetSpacingMs` and `timingToleranceMs` set, after the pitch gate passes. |

### Scoring rules (MVP)

**Ordered exercises** (`single_note`, `repeated_note`, `sequence`): implemented by shared ordered-note logic — position-wise comparison of expected vs detected names; `score = matches / expectedNotes.length`; trailing notes beyond the expected length become `extra_note` mistakes up to `maxExtraNotes`.

**Rhythm** (`rhythm`):

1. Run the same pitch alignment as a repeated pattern (same note-order rules).
2. For each consecutive pair of detections, compare onset delta to `targetSpacingMs` (seconds) ± `timingToleranceMs`.
3. `timingScore` = fraction of intervals within tolerance (or `1` if there is only one note).
4. `combinedScore = 0.55 * pitchScore + 0.45 * timingScore`.
5. Pass if `combinedScore >= passingAccuracy`.

The UI may show this breakdown when `rhythmScoringBreakdown` is present.

## AI contract

`AIFeedback` is generated only from `Lesson` context + `EvaluationResult`. It references `detectedIssueReferences` so future LLM prompts can stay grounded.

## Lesson demonstrations

Optional `demonstrationEvents` on a `Lesson` in [`src/types/skill-learning.ts`](../src/types/skill-learning.ts) is an ordered list of `{ note, offsetMs }` used only for UI playback (scheduled samples). It does not change the evaluator; it sets expectations for the student before they record or use the virtual keyboard.

## Lesson phases (incremental flow)

Optional `lessonPhases` on a `Lesson` defines ordered steps `{ id, title, narrative?, exerciseId, demonstrationEvents? }`. The practice UI runs each step in order; a **pass on the final step** is what marks the lesson complete for the roadmap (earlier passes still log attempts). If `lessonPhases` is omitted, a single implicit phase is built from `exerciseIds[0]` (legacy lessons).
