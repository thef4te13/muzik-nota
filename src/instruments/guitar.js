// Open-string MIDI pitches, 6th string (low E) first, 1st string (high E) last.
export const TUNING = [40, 45, 50, 55, 59, 64];
const MAX_FRET = 15;

// Returns the lowest-fret position for a MIDI pitch. String numbers run 1 (thinnest)
// to 6 (thickest). Returns null when no string can play the pitch within MAX_FRET.
export function assignPosition(pitch) {
  let best = null;
  TUNING.forEach((open, index) => {
    const fret = pitch - open;
    if (fret < 0 || fret > MAX_FRET) return;
    if (best === null || fret < best.fret) {
      best = { string: TUNING.length - index, fret };
    }
  });
  return best;
}

// Pairs each note with its tab position. Notes outside the guitar range get position null.
export function toTabLines(notes) {
  return notes.map(note => ({ position: assignPosition(note.pitch), note }));
}
