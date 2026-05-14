import { describe, expect, it } from "vitest";
import { virtualKeyForCode, VIRTUAL_WHITE_KEYS } from "./virtual-white-keys";

describe("virtual-white-keys", () => {
  it("maps home-row KeyA–KeyL to ascending white keys", () => {
    expect(virtualKeyForCode("KeyA")?.note).toBe("F3");
    expect(virtualKeyForCode("KeyG")?.note).toBe("C4");
    expect(virtualKeyForCode("KeyL")?.note).toBe("G4");
  });

  it("has one binding per white key", () => {
    expect(VIRTUAL_WHITE_KEYS).toHaveLength(9);
  });
});
