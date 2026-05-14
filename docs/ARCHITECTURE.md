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

## Transcription providers (planned)

| Provider        | Role in MVP                               |
|-----------------|-------------------------------------------|
| `mock`          | Deterministic outputs for UI + evaluator |
| `basic_pitch`   | Next step: Python FastAPI worker         |
| `klangio`       | Future optional cloud provider           |

## Deployment sketch (later)

- **Vercel** — Next.js web + API routes.
- **Render/Railway/Fly** — Python transcription worker.
- **Supabase** — Auth, Postgres, storage for attempts.

## Security notes

- Audio uploads are **not** stored on disk in the MVP route; bytes are accepted to mirror production flow, then discarded after the mock response.
