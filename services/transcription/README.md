# Transcription service (Basic Pitch)

Python **FastAPI** app that runs **Spotify Basic Pitch** and returns JSON matching the app’s `TranscriptionResult` shape (`recordingId`, `provider`, `detectedNotes`, `overallConfidence`, `warnings`).

## Run locally

```bash
cd services/transcription
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

`ffmpeg` should be on your `PATH` (used by librosa for formats like WebM).

## Docker

```bash
docker build -t glide-transcription ./services/transcription
docker run -p 8000:8000 glide-transcription
```

## Next.js wiring

Set in `.env.local`:

- `TRANSCRIPTION_PROVIDER=basic_pitch`
- `BASIC_PITCH_SERVICE_URL=http://localhost:8000`

Leave `TRANSCRIPTION_PROVIDER` unset or `mock` to keep deterministic mock transcription (and mock scenario presets).

## CORS

Set `CORS_ALLOW_ORIGINS` (comma-separated) if the web app origin is not `http://localhost:3000`.
