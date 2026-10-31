import { t } from '../ui/i18n.js';
const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Scientific pitch name for a MIDI number, e.g. 69 -> "A4".
export function noteName(pitch) {
  const octave = Math.floor(pitch / 12) - 1;
  return `${NAMES[pitch % 12]}${octave}`;
}

// Distance between two MIDI pitches in semitones (always positive).
export function intervalSemitones(a, b) {
  return Math.abs(b - a);
}

// Highest pitch most singers reach comfortably (C6). Above it, a warning is shown.
const COMFORTABLE_HIGH = 84;

// Returns a warning when the melody goes above the comfortable singing range, else null.
export function tessituraWarning(notes) {
  if (notes.length === 0) return null;
  const highest = Math.max(...notes.map(n => n.pitch));
  if (highest <= COMFORTABLE_HIGH) return null;
  return t('vocal.high', { note: noteName(highest) });
}
