"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  buildVirtualTranscriptionResult,
  type VirtualNoteCapture,
} from "@/lib/transcription/virtual-to-transcription";
import { useSampledPiano } from "@/hooks/use-sampled-piano";
import {
  virtualKeyForCode,
  VIRTUAL_WHITE_KEYS,
} from "@/lib/piano/virtual-white-keys";

const BLACK_AFTER_INDEX = new Set([0, 1, 3, 4, 5, 7]);
const SAME_NOTE_DEBOUNCE_MS = 45;

type Props = {
  onSubmit: (result: ReturnType<typeof buildVirtualTranscriptionResult>) => void;
};

export function VirtualPiano({ onSubmit }: Props) {
  const [captures, setCaptures] = useState<VirtualNoteCapture[]>([]);
  const [pressed, setPressed] = useState<Set<string>>(() => new Set());
  const { engine, begin, end } = useSampledPiano();
  const pointerIdsByNoteRef = useRef<Map<string, number>>(new Map());
  const lastSameNoteRef = useRef<{ note: string; t: number } | null>(null);

  const appendCapture = useCallback((note: string) => {
    const now = performance.now();
    const last = lastSameNoteRef.current;
    if (last && last.note === note && now - last.t < SAME_NOTE_DEBOUNCE_MS) {
      return;
    }
    lastSameNoteRef.current = { note, t: now };
    setCaptures((prev) => [...prev, { note, onsetMs: now }]);
  }, []);

  const startNote = useCallback(
    async (note: string, record: boolean) => {
      if (engine === "loading") {
        return;
      }
      await begin(note);
      setPressed((prev) => new Set(prev).add(note));
      if (record) {
        appendCapture(note);
      }
    },
    [appendCapture, begin, engine]
  );

  const stopNote = useCallback(
    async (note: string) => {
      await end(note);
      setPressed((prev) => {
        const next = new Set(prev);
        next.delete(note);
        return next;
      });
    },
    [end]
  );

  useEffect(() => {
    function isTypingTarget(target: EventTarget | null) {
      if (!(target instanceof HTMLElement)) {
        return false;
      }
      return Boolean(
        target.closest("input, textarea, select, [contenteditable=true]")
      );
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      if (isTypingTarget(event.target)) {
        return;
      }
      if (engine === "loading") {
        return;
      }
      const mapping = virtualKeyForCode(event.code);
      if (!mapping) {
        return;
      }
      if (event.repeat) {
        return;
      }
      event.preventDefault();
      void startNote(mapping.note, true);
    }

    function onKeyUp(event: KeyboardEvent) {
      const mapping = virtualKeyForCode(event.code);
      if (!mapping) {
        return;
      }
      if (isTypingTarget(event.target)) {
        return;
      }
      event.preventDefault();
      void stopNote(mapping.note);
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [engine, startNote, stopNote]);

  function handleClear() {
    setCaptures([]);
    lastSameNoteRef.current = null;
  }

  function handleSubmit() {
    if (captures.length === 0) {
      return;
    }
    const recordingId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `virtual_${Date.now()}`;
    onSubmit(buildVirtualTranscriptionResult(captures, recordingId));
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card/40 p-4">
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">On-screen keyboard</p>
        <p className="text-sm text-muted-foreground">
          Hold mouse or keyboard for sustain. Each new press adds one step to the
          exercise sequence. Spacing between presses is used for rhythm grading.
          Samples: MusyngKite acoustic grand (Gleitz CDN).
        </p>
        {engine === "loading" ? (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            Loading piano samples…
          </p>
        ) : engine === "fallback" ? (
          <p className="text-xs text-muted-foreground">
            Piano samples could not load; using a simple fallback tone instead.
          </p>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <div className="relative mx-auto flex w-max select-none rounded-lg bg-muted/40 p-4">
          <div className="relative flex">
            {VIRTUAL_WHITE_KEYS.map((key, index) => {
              const isBlackSlot = BLACK_AFTER_INDEX.has(index);
              const isActive = pressed.has(key.note);
              return (
                <div key={key.note} className="relative flex">
                  <button
                    type="button"
                    disabled={engine === "loading"}
                    className={`relative flex h-44 w-12 cursor-pointer flex-col items-center justify-end gap-1 border-x border-b border-border bg-card pb-2 text-[0.65rem] font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 ${
                      isActive
                        ? "bg-primary/25 text-foreground ring-2 ring-primary/50"
                        : "text-muted-foreground"
                    }`}
                    onPointerDown={(event) => {
                      if (engine === "loading") {
                        return;
                      }
                      event.preventDefault();
                      (event.currentTarget as HTMLButtonElement).setPointerCapture(
                        event.pointerId
                      );
                      pointerIdsByNoteRef.current.set(key.note, event.pointerId);
                      void startNote(key.note, true);
                    }}
                    onPointerUp={(event) => {
                      const stored = pointerIdsByNoteRef.current.get(key.note);
                      if (stored === event.pointerId) {
                        pointerIdsByNoteRef.current.delete(key.note);
                        void stopNote(key.note);
                      }
                      try {
                        (event.currentTarget as HTMLButtonElement).releasePointerCapture(
                          event.pointerId
                        );
                      } catch {
                        /* not captured */
                      }
                    }}
                    onPointerCancel={(event) => {
                      pointerIdsByNoteRef.current.delete(key.note);
                      void stopNote(key.note);
                      try {
                        (event.currentTarget as HTMLButtonElement).releasePointerCapture(
                          event.pointerId
                        );
                      } catch {
                        /* */
                      }
                    }}
                    onLostPointerCapture={() => {
                      pointerIdsByNoteRef.current.delete(key.note);
                      void stopNote(key.note);
                    }}
                  >
                    <span className="rounded border border-border bg-muted/80 px-1.5 py-0.5 font-mono text-[0.6rem] text-foreground">
                      {key.keyLabel}
                    </span>
                    <span>{key.note}</span>
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
        Computer keys (when not typing in a field):{" "}
        <span className="font-mono text-foreground">
          {VIRTUAL_WHITE_KEYS.map((k) => k.keyLabel).join(" ")}
        </span>{" "}
        → {VIRTUAL_WHITE_KEYS.map((k) => k.note).join(" ")}. Black keys are visual
        only for now.
      </p>

      <div className="rounded-md border border-dashed border-border bg-background/60 px-3 py-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Sequence: </span>
        {captures.length > 0
          ? captures.map((c) => c.note).join(" → ")
          : "No notes yet"}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="secondary" onClick={handleClear}>
          Clear sequence
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={captures.length === 0}
        >
          Submit for analysis
        </Button>
      </div>
    </div>
  );
}
