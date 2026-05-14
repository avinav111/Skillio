import type { MutableRefObject } from "react";
import { noteToMidi } from "@/lib/piano/note-to-midi";

export function playShortBeep(
  note: string,
  audioContextRef: MutableRefObject<AudioContext | null>
): void {
  const midi = noteToMidi(note);
  if (midi === undefined) {
    return;
  }
  const ctx = audioContextRef.current ?? new AudioContext();
  audioContextRef.current = ctx;
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  const frequency = 440 * 2 ** ((midi - 69) / 12);
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  oscillator.type = "triangle";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.1, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.25);
}
