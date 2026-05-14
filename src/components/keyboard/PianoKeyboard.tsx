const WHITE_KEYS = ["F3", "G3", "A3", "B3", "C4", "D4", "E4", "F4", "G4"];

const BLACK_AFTER_INDEX = new Set([0, 1, 3, 4, 5, 7]);

type Props = {
  highlightNotes?: string[];
};

export function PianoKeyboard({ highlightNotes = ["C4"] }: Props) {
  const active = new Set(highlightNotes);

  return (
    <div className="overflow-x-auto">
      <div className="relative mx-auto flex w-max select-none rounded-lg bg-muted/40 p-4">
        <div className="relative flex">
          {WHITE_KEYS.map((label, index) => {
            const isBlackSlot = BLACK_AFTER_INDEX.has(index);
            return (
              <div key={label} className="relative flex">
                <div
                  className={`relative flex h-40 w-11 items-end justify-center border-x border-b border-border bg-card pb-3 text-xs font-medium text-muted-foreground ${
                    active.has(label)
                      ? "bg-primary/20 text-foreground ring-2 ring-primary/60"
                      : ""
                  }`}
                >
                  {label}
                </div>
                {isBlackSlot ? (
                  <div className="pointer-events-none absolute -right-4 top-0 z-10 h-24 w-8 rounded-b-md bg-foreground shadow-md" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Simplified keyboard map. Black keys are shown as compact rectangles for
        orientation only.
      </p>
    </div>
  );
}
