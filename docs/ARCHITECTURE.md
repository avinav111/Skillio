# Architecture — Glide Practice Lab

## Layered design (hard boundary)

```
Curriculum (lessons + rubrics)
        ↓
Recording (browser MediaRecorder → multipart upload)
        ↓
Transcription (provider interface → TranscriptionResult)
        ↓
Evaluator (pure functions → EvaluationResult)
        ↓
AI feedback (templates / future LLM → AIFeedback)
        ↓
Progress persistence (local prototype → future Supabase)
```

### Source of truth

- **Correctness** lives in the **evaluator** + rubric + transcription confidence thresholds.
- **LLMs must never grade from raw audio** and must not invent mistakes. They only narrate structured evaluator output.

## Repository layout (current)

Single **Next.js 15** application at the repo root:

- `src/app/**` — App Router pages and API routes (`/api/transcribe`).
- `src/components/**` — UI (keyboard, recorder, feedback, layout).
- `src/lib/curriculum/**` — Lesson + exercise definitions.
- `src/lib/evaluator/**` — Pure evaluation logic + unit tests.
- `src/lib/transcription/**` — Mock scenario helpers (server + client metadata).
- `src/lib/ai/**` — Template “coach” copy (LLM adapter later).
- `src/types/**` — Shared TypeScript contracts.

## Transcription providers

| Provider        | Role |
|-----------------|------|
| `mock`          | Deterministic outputs for UI + evaluator (scenario picker). |
| `virtual`       | On-screen keyboard: ordered note list with **real** per-tap `performance.now()` onsets, normalized to seconds for the evaluator. |
| `basic_pitch`   | Optional Python FastAPI worker; Next `/api/transcribe` forwards audio and maps to `TranscriptionResult`. |
| `klangio`       | Reserved for a future optional cloud provider. |

Rhythm exercises compare consecutive `DetectedNote.startTime` values to the rubric’s `targetSpacingMs` ± `timingToleranceMs`. Mock and Basic Pitch populate those fields from audio; virtual mode depends on the client capture described above.

Lesson-level **`demonstrationEvents`** (see [RUBRIC_SCHEMA.md](RUBRIC_SCHEMA.md)) drive an optional “Play example” UI (scheduled playback); they are not sent to the evaluator.

**Lesson phases:** optional ordered `lessonPhases` on each lesson power multi-step practice (isolate → combine → integrate). Completion for unlocks is recorded only when the **last** phase passes; see [PRODUCT_SPEC.md](PRODUCT_SPEC.md).

## Deployment sketch (later)

- **Vercel** — Next.js web + API routes.
- **Render/Railway/Fly** — Python transcription worker.
- **Supabase** — Auth, Postgres, storage for attempts.

## Security notes

- Audio uploads are **not** stored on disk in the MVP route; bytes are accepted to mirror production flow, then discarded after the mock response.
