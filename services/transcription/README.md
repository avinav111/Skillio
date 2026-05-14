# Transcription service (future)

This directory is reserved for the **Python + FastAPI** worker that will run **Spotify Basic Pitch** (or another engine) and return `TranscriptionResult`-compatible JSON.

The Next.js route `src/app/api/transcribe` currently mocks transcription in-process. When the worker exists, the API route should:

1. Stream uploaded audio to the worker (or stage it in Supabase Storage first).
2. Normalize worker output into the shared TypeScript contract.
3. Tag `provider: "basic_pitch"` once real inference is active.

See `docs/ARCHITECTURE.md` for the full pipeline diagram.
