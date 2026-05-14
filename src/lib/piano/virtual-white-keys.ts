export type VirtualWhiteKey = {
  note: "F3" | "G3" | "A3" | "B3" | "C4" | "D4" | "E4" | "F4" | "G4";
  /** `KeyboardEvent.code` (layout-stable on QWERTY). */
  keyCode: string;
  /** Single character shown on the key cap. */
  keyLabel: string;
};

export const VIRTUAL_WHITE_KEYS: readonly VirtualWhiteKey[] = [
  { note: "F3", keyCode: "KeyA", keyLabel: "A" },
  { note: "G3", keyCode: "KeyS", keyLabel: "S" },
  { note: "A3", keyCode: "KeyD", keyLabel: "D" },
  { note: "B3", keyCode: "KeyF", keyLabel: "F" },
  { note: "C4", keyCode: "KeyG", keyLabel: "G" },
  { note: "D4", keyCode: "KeyH", keyLabel: "H" },
  { note: "E4", keyCode: "KeyJ", keyLabel: "J" },
  { note: "F4", keyCode: "KeyK", keyLabel: "K" },
  { note: "G4", keyCode: "KeyL", keyLabel: "L" },
] as const;

const BY_CODE = new Map(VIRTUAL_WHITE_KEYS.map((k) => [k.keyCode, k]));

export function virtualKeyForCode(code: string): VirtualWhiteKey | undefined {
  return BY_CODE.get(code);
}
