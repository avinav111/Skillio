# Architecture decisions

## ADR-001 — Single Next.js app at repo root

**Context:** The product brief suggested a monorepo (`apps/web`, `services/...`). The workspace started empty aside from Cursor rules.

**Decision:** Ship a **single Next.js project** at `/Users/avip/Glide.ai` with `src/*` organization.

**Why:** Fewer moving parts for a solo beginner/intermediate owner while still keeping transcription logic isolated for a future Python worker.

**Consequences:** Adding `services/transcription/` later does not require Turborepo immediately; we can publish Docker images independently.

## ADR-002 — Mock transcription lives in the Next route for now

**Context:** We need Option B (real upload) before the Python service exists.

**Decision:** Implement `POST /api/transcribe` in Next.js, read the blob, return deterministic mock JSON keyed by `exerciseId` + `mockScenario`.

**Why:** Proves networking, multipart handling, and UI states without provisioning another host yet.

**Consequences:** Swap implementation to HTTP-forwarding or shared package when Basic Pitch is ready.

## ADR-003 — Evaluator uses ordered positional comparison

**Context:** MVP exercises are short literal sequences (e.g., five Middle C hits).

**Decision:** Align expected vs detected notes by index; extras after the rubric length consume `maxExtraNotes`.

**Why:** Simple, explainable, and testable; matches beginner drills without requiring music-information retrieval alignment.

**Consequences:** Future rubrics with rubato or ornamentation will need smarter matching (onset windows, DTW, etc.).

## ADR-004 — Template coach before LLM

**Context:** Need grounded explanations without API spend.

**Decision:** Ship `buildTemplateFeedback` that only references evaluator mistakes.

**Why:** Reinforces the “LLM is narrator, not judge” rule and keeps CI deterministic.

## ADR-005 — Virtual piano audio via Tone.js + Gleitz SoundFont CDN

**Context:** On-screen practice should sound like a piano and support computer-keyboard play without shipping large sample assets in git.

**Decision:** Use **`tone`** `Sampler` with **MusyngKite acoustic grand** MP3s from `gleitz.github.io/midi-js-soundfonts`, with a short triangle-wave fallback if loads fail or time out.

**Why:** Proven URLs, CORS-friendly hosting, good enough for MVP/QA; keeps repo small.

**Consequences:** Offline/air-gapped use falls back to simple tones; later we can self-host samples or swap to `@tonejs/piano` if needed.

**Consequences:** Later we add `openai`/`anthropic` providers behind the same interface with identical JSON inputs.
