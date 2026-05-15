"""FastAPI service: audio file -> Basic Pitch -> Glide TranscriptionResult JSON."""

from __future__ import annotations

import logging
import os
import tempfile
from pathlib import Path
from typing import Any

import librosa
from basic_pitch import ICASSP_2022_MODEL_PATH
from basic_pitch.inference import predict
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Glide Transcription", version="0.1.0")

_cors_origins = os.getenv("CORS_ALLOW_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in _cors_origins if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _midi_to_note_name(midi: int) -> str:
    return librosa.midi_to_note(int(midi), unicode=False)


def _note_events_to_payload(
    note_events: list[tuple[float, float, int, float, list[int] | None]],
    recording_id: str,
) -> dict[str, Any]:
    detected: list[dict[str, Any]] = []
    confidences: list[float] = []
    for start, end, pitch_midi, amplitude, _pitch_bend in note_events:
        conf = float(max(0.0, min(1.0, float(amplitude))))
        confidences.append(conf)
        name = _midi_to_note_name(pitch_midi)
        detected.append(
            {
                "note": name,
                "midiNumber": int(pitch_midi),
                "startTime": float(start),
                "endTime": float(end),
                "confidence": conf,
            }
        )
    overall = sum(confidences) / len(confidences) if confidences else 0.0
    return {
        "recordingId": recording_id,
        "provider": "basic_pitch",
        "detectedNotes": detected,
        "overallConfidence": overall,
        "warnings": [],
    }


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/transcribe")
async def transcribe(
    audio: UploadFile = File(...),
    recording_id: str = Form(""),
) -> dict[str, Any]:
    suffix = Path(audio.filename or "clip").suffix or ".webm"
    body = await audio.read()
    if not body:
        raise HTTPException(status_code=400, detail="empty audio upload")

    tmp_path: str | None = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(body)
            tmp_path = tmp.name

        logger.info("Running Basic Pitch on %s (%s bytes)", tmp_path, len(body))
        _model_output, _midi_data, note_events = predict(
            tmp_path,
            model_or_model_path=ICASSP_2022_MODEL_PATH,
        )
        rid = recording_id.strip() or "unknown"
        return _note_events_to_payload(list(note_events), rid)
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001
        logger.exception("Transcription failed")
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    finally:
        if tmp_path and os.path.isfile(tmp_path):
            try:
                os.unlink(tmp_path)
            except OSError:
                pass
