import { RANGES } from '../instruments/ranges.js';

const DEFAULT_MIN_VELOCITY = 0.3;
const DEFAULT_MIN_DURATION_MS = 60;
// Notes starting within this window count as simultaneous.
const SIMULTANEOUS_SECONDS = 0.03;

// Drops quiet, very short, and out-of-range notes.
// options.range: [low, high] MIDI pitches; defaults to no range limit.
export function filterNotes(notes, options = {}) {
  const minVelocity = options.minVelocity ?? DEFAULT_MIN_VELOCITY;
  const minDurationMs = options.minDurationMs ?? DEFAULT_MIN_DURATION_MS;
  const [low, high] = options.range ?? [0, 127];
  return notes.filter(
    n =>
      n.velocity >= minVelocity &&
      (n.end - n.start) * 1000 >= minDurationMs &&
      n.pitch >= low &&
      n.pitch <= high,
  );
}

// Groups notes that start together into onset groups, in time order.
function onsetGroups(notes) {
  const sorted = [...notes].sort((a, b) => a.start - b.start);
  const groups = [];
  for (const note of sorted) {
    const last = groups[groups.length - 1];
    if (last && note.start - last.start < SIMULTANEOUS_SECONDS) {
      last.notes.push(note);
    } else {
      groups.push({ start: note.start, notes: [note] });
    }
  }
  return groups;
}

// Keeps at most `max` notes per onset group, choosing the loudest.
export function limitSimultaneous(notes, max) {
  return onsetGroups(notes).flatMap(group =>
    [...group.notes].sort((a, b) => b.velocity - a.velocity).slice(0, max),
  );
}

// Keeps only the highest note of each onset group: the melody line.
export function melodyOnly(notes) {
  return onsetGroups(notes).map(group => group.notes.reduce((top, n) => (n.pitch > top.pitch ? n : top)));
}

// The full cleanup used before notation: quality filter, then melody or chord limit.
export function prepareNotes(raw, { mode = 'melody', maxSimultaneous = 4, range } = {}) {
  const filtered = filterNotes(raw, { range });
  return mode === 'melody' ? melodyOnly(filtered) : limitSimultaneous(filtered, maxSimultaneous);
}
