import { assignFretted } from './fretted.js';

// Violin open strings: G3 D4 A4 E5, thickest first.
export const VIOLIN_TUNING = [55, 62, 69, 76];
const STRING_NAMES = { 4: 'G', 3: 'D', 2: 'A', 1: 'E' };
const MAX_FRET = 12;

// Returns the string, the position (0 = open string, 1 = first position, ...) and the
// finger (0 = open, 1-4 within a position) for a MIDI pitch. Returns null out of range.
export function assignViolin(pitch) {
  const spot = assignFretted(pitch, VIOLIN_TUNING, MAX_FRET);
  if (spot === null) return null;
  const { string, fret } = spot;
  const position = fret === 0 ? 0 : Math.floor((fret - 1) / 4) + 1;
  const finger = fret === 0 ? 0 : fret - 4 * (position - 1);
  return { string, stringName: STRING_NAMES[string], fret, position, finger };
}
