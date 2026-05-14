"use client";

import { useCallback, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import { Button } from "@/components/ui/button";
import { buildVirtualTranscriptionResult } from "@/lib/transcription/virtual-to-transcription";
import { noteToMidi } from "@/lib/piano/note-to-midi";

const WHITE_KEYS = ["F3", "G3", "A3", "B3", "C4", "D4", "E4", "F4", "G4"] as const;

const BLACK_AFTER_INDEX = new Set([0, 1, 3, 4, 5, 7]);

type Props = {
  onSubmit: (result: ReturnType<typeof buildVirtualTranscriptionResult>) => void;
};

function playShortTone(midi: number, audioContextRef: MutableRefObject<AudioContext | null>) {
  const ctx = audioContextRef.current ?? new AudioContext();
  audioContextRef.current = ctx;
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  const frequency = 440 * 2 ** ((midi - 69) / 12);
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.2);
}

export function VirtualPiano({ onSubmit }: Props) {
  const [sequence, setSequence] = useState<string[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  const appendNote = useCallback((note: string) => {
    const midi = noteToMidi(note);
    if (midi !== undefined) {
      playShortTone(midi, audioContextRef);
    }
    setSequence((prev) => [...prev, note]);
  }, []);

  function handleClear() {
    setSequence([]);
  }

  function handleSubmit() {
    if (sequence.length === 0) {
      return;
    }
    const recordingId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `virtual_${Date.now()}`;
    onSubmit(buildVirtualTranscriptionResult(sequence, recordingId));
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card/40 p-4">
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">On-screen keyboard</p>
        <p className="text-sm text-muted-foreground">
          Tap the white keys in order for your exercise, then submit. This path skips
          the microphone and sends structured note taps straight to the same
          evaluator used after transcription.
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="relative mx-auto flex w-max select-none rounded-lg bg-muted/40 p-4">
          <div className="relative flex">
            {WHITE_KEYS.map((label, index) => {
              const isBlackSlot = BLACK_AFTER_INDEX.has(index);
              return (
                <div key={label} className="relative flex">
                  <button
                    type="button"
                    className="relative flex h-40 w-11 cursor-pointer items-end justify-center border-x border-b border-border bg-card pb-3 text-xs font-medium text-muted-foreground transition hover:bg-muted active:bg-primary/15"
                    onClick={() => appendNote(label)}
                  >
                    {label}
                  </button>
                  {isBlackSlot ? (
                    <div className="pointer-events-none absolute -right-4 top-0 z-10 h-24 w-8 rounded-b-md bg-foreground shadow-md" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Black keys are shown for orientation only (same as the lesson diagram). Early
        exercises use white keys.
      </p>

      <div className="rounded-md border border-dashed border-border bg-background/60 px-3 py-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Sequence: </span>
        {sequence.length > 0 ? sequence.join(" → ") : "No notes yet"}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="secondary" onClick={handleClear}>
          Clear sequence
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={sequence.length === 0}
        >
          Submit for analysis
        </Button>
      </div>
    </div>
  );
}
