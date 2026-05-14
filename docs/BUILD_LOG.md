# Build log

## 2026-05-14 — Milestone: foundation + mock practice loop (Option B)

### What changed

- Bootstrapped **Next.js 15 + TypeScript + Tailwind 4 + shadcn/ui (Base UI)** in-repo.
- Added **shared types** under `src/types/skill-learning.ts`.
- Implemented **pure evaluator** with Vitest coverage in `src/lib/evaluator/`.
- Authored **curriculum** for the first three lessons in `src/lib/curriculum/initial-lessons.ts`.
- Added **`POST /api/transcribe`** with multipart upload handling + deterministic mock outputs.
- Built **UI flow**: landing, onboarding (localStorage), dashboard, roadmap, dynamic lesson pages.
- Wired **MediaRecorder → upload → mock transcription → evaluator → template coach**.

### Files touched (high level)

- `src/app/**`, `src/components/**`, `src/lib/**`, `src/types/**`, `docs/**`, `vitest.config.ts`, `package.json`.

### How to test

```bash
npm install
npm test
npm run lint
npm run dev
```

Manual QA:

1. Visit `/lessons/middle_c_001`, allow microphone, record a short clip, stop & analyze.
2. Toggle mock presets (e.g., low confidence vs wrong notes) and confirm evaluator + coach copy track the JSON.
3. Visit `/lessons/keyboard_layout_001` to confirm static “no recording” path.

### Known issues / follow-ups

- Transcription is **mock only**; audio bytes are not parsed yet.
- Progress, auth, and persistence are **localStorage** at best — Supabase comes later.
- Safari may pick a different default codec than Chrome; recorder now falls back automatically but still requires browser support.

### Next recommended step

Implement the **Python FastAPI + Basic Pitch** worker and swap the server-side provider behind the same `TranscriptionResult` contract.

## 2026-05-14 — Virtual on-screen keyboard (lesson toggle)

### What changed

- Added **`virtual`** transcription provider and `buildVirtualTranscriptionResult` helper.
- New **`VirtualPiano`** client component (interactive white keys, submit/clear); later upgraded with sampled piano + key bindings (see next entry).
- **`LessonPracticePanel`** toggle: Microphone vs On-screen keyboard; remounts practice UI on mode switch and “Try again”.

## 2026-05-14 — Virtual piano: sampled sound + keyboard bindings

### What changed

- **`tone`** + `Tone.Sampler` loads **MusyngKite acoustic grand** samples from the Gleitz `midi-js-soundfonts` CDN (same note range as the UI).
- **`useSampledPiano`** hook: `triggerAttack` / `triggerRelease` for sustain (mouse or computer keyboard).
- **Computer keys** `A`–`L` → `F3`…`G4` via `KeyboardEvent.code` (`src/lib/piano/virtual-white-keys.ts`); ignored when focus is in inputs.
- **Fallback**: short triangle-wave beep if samples fail or time out (~28s).
- Keys show letter badge + note name; loading / fallback copy in the panel.

### How to test

1. Open a lesson with virtual keyboard, wait for samples (or disconnect network to see fallback).
2. Hold **G** (Middle C) — sound should sustain until keyup.
3. Click and hold a key with the mouse — same behavior; sequence still records one entry per press.
