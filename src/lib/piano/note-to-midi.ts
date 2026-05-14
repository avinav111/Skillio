const MIDI_BY_NOTE: Record<string, number> = {
  F3: 53,
  G3: 55,
  A3: 57,
  B3: 59,
  C4: 60,
  D4: 62,
  E4: 64,
  F4: 65,
  G4: 67,
};

export function noteToMidi(note: string): number | undefined {
  return MIDI_BY_NOTE[note.trim()];
}
