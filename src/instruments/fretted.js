// Finds the lowest-fret position for a MIDI pitch on any fretted instrument.
// tuning lists open-string pitches from the thickest string to the thinnest.
// String numbers run 1 (thinnest) to tuning.length (thickest). Returns null when no
// string plays the pitch within maxFret.
export function assignFretted(pitch, tuning, maxFret) {
  let best = null;
  tuning.forEach((open, index) => {
    const fret = pitch - open;
    if (fret < 0 || fret > maxFret) return;
    if (best === null || fret < best.fret) {
      best = { string: tuning.length - index, fret };
    }
  });
  return best;
}
