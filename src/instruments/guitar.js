import { assignFretted } from './fretted.js';

// Open-string MIDI pitches, 6th string (low E) first, 1st string (high E) last.
export const TUNING = [40, 45, 50, 55, 59, 64];
const MAX_FRET = 15;

// Returns the lowest-fret position for a MIDI pitch. String numbers run 1 (thinnest)
// to 6 (thickest). Returns null when no string can play the pitch within MAX_FRET.
export function assignPosition(pitch) {
  return assignFretted(pitch, TUNING, MAX_FRET);
}

// Pairs each note with its tab position on the given tuning. Notes outside the range get position null.
export function toTabLines(notes, tuning = TUNING, maxFret = MAX_FRET) {
  return notes.map(note => ({ position: assignFretted(note.pitch, tuning, maxFret), note }));
}
