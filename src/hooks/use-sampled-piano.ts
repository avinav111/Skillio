"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Sampler } from "tone";
import { playShortBeep } from "@/lib/piano/simple-beep";

export type PianoEngineState = "loading" | "ready" | "fallback";

const GLEITZ_GRAND_PIANO_BASE =
  "https://gleitz.github.io/midi-js-soundfonts/MusyngKite/acoustic_grand_piano-mp3/";

const SAMPLE_URLS = {
  F3: "F3.mp3",
  G3: "G3.mp3",
  A3: "A3.mp3",
  B3: "B3.mp3",
  C4: "C4.mp3",
  D4: "D4.mp3",
  E4: "E4.mp3",
  F4: "F4.mp3",
  G4: "G4.mp3",
} as const;

export function useSampledPiano() {
  const [engine, setEngine] = useState<PianoEngineState>("loading");
  const samplerRef = useRef<Sampler | null>(null);
  const fallbackCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    let cancelled = false;
    let instance: Sampler | null = null;

    const failTimer = window.setTimeout(() => {
      if (!cancelled && samplerRef.current === null) {
        setEngine((prev) => (prev === "loading" ? "fallback" : prev));
      }
    }, 28000);

    (async () => {
      try {
        const Tone = await import("tone");
        if (cancelled) {
          return;
        }

        instance = new Tone.Sampler({
          urls: { ...SAMPLE_URLS },
          baseUrl: GLEITZ_GRAND_PIANO_BASE,
          attack: 0.002,
          release: 0.55,
          curve: "exponential",
          onload: () => {
            window.clearTimeout(failTimer);
            if (cancelled || !instance) {
              return;
            }
            instance.volume.value = -6;
            samplerRef.current = instance;
            setEngine("ready");
          },
          onerror: () => {
            window.clearTimeout(failTimer);
            if (cancelled) {
              return;
            }
            instance?.dispose();
            instance = null;
            samplerRef.current = null;
            setEngine("fallback");
          },
        }).toDestination();
      } catch {
        window.clearTimeout(failTimer);
        if (!cancelled) {
          setEngine("fallback");
        }
      }
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(failTimer);
      const toDispose = samplerRef.current ?? instance;
      toDispose?.dispose();
      samplerRef.current = null;
    };
  }, []);

  const ensureToneStarted = useCallback(async () => {
    const Tone = await import("tone");
    await Tone.start();
  }, []);

  const begin = useCallback(
    async (note: string) => {
      if (samplerRef.current) {
        await ensureToneStarted();
        samplerRef.current.triggerAttack(note);
        return;
      }
      playShortBeep(note, fallbackCtxRef);
    },
    [ensureToneStarted]
  );

  const end = useCallback(
    async (note: string) => {
      if (samplerRef.current) {
        await ensureToneStarted();
        samplerRef.current.triggerRelease(note);
      }
    },
    [ensureToneStarted]
  );

  return { engine, begin, end };
}
