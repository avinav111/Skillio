# Product specification — Glide Practice Lab (MVP)

## Vision

Glide is an adaptive skill-learning engine that pairs **objective performance evaluation** with **adaptive AI coaching**. The first domain is **beginner piano** on the web. The long-term platform may support other measurable skills (guitar, voice, language pronunciation, etc.), but **this MVP ships piano only**.

## Core loop

1. **Teach** — Short lessons with a visual keyboard and plain-language explanations.
2. **Try** — Learner records a short audio clip on a real instrument (no MIDI keyboard required).
3. **Analyze** — Audio is transcribed into structured note events with confidence scores.
4. **Explain** — A coach explains **only** what the evaluator surfaced (no invented mistakes).
5. **Adapt** — Pass on the **final practice step** unlocks the next lesson; fail suggests a repeat or remedial path; **unclear** requests a cleaner take.

## Multi-phase lessons

Longer lessons are split into **ordered phases** (for example: isolate a new mechanic, combine it with something familiar, then a short mastery line). Each phase has its own exercise and optional demo. Only a **passing attempt on the last phase** counts as completing the lesson for the roadmap; earlier passes still save attempts for the dashboard.

## Virtual vs microphone practice

- **Microphone** (and future MIDI): the full instrument range is available; transcription returns whatever pitches were played.
- **On-screen keyboard**: maps to **white keys F3–G4** only (see [CURRICULUM_MAP.md](CURRICULUM_MAP.md)). Curriculum steps that are graded on the virtual path use notes inside that span so timing and pitch checks stay honest.

## MVP proof

A beginner can record a simple note or short sequence, the system can detect whether expected notes were met within confidence and rubric rules, show structured mistakes, and present grounded coaching plus a clear next action.

## Target users

- Total beginners and casual learners.
- Acoustic piano or basic digital keyboard owners.
- Learners without a MIDI interface.
- Budget under roughly **$100/month** for hosted services; prefer OSS/local where practical.

## In scope (MVP)

- Landing, onboarding, dashboard, roadmap, lesson pages.
- Microphone capture → upload → **mock transcription** first, **Basic Pitch** microservice next.
- Deterministic rubric evaluator (`passed` / `failed` / `unclear`).
- Template-based AI feedback now; LLM provider later, still fed only structured results.

## Explicit non-goals

- Real-time live feedback, camera posture analysis, mobile native apps.
- Full sheet-music library, advanced harmony, pedal/velocity grading.
- Payments, community, marketplace, autonomous multi-agent flows.

## Success criteria for this repository milestone

- Types and evaluator tests demonstrate the objective layer without any LLM.
- UI walks through **Lesson 1** (static), **Lesson 2** (record + mock analyze), **Lesson 3** (record + mock analyze).
- `/api/transcribe` accepts real audio uploads and returns normalized `TranscriptionResult` JSON from a mock provider.
