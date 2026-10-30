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
