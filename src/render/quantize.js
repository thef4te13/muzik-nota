// Rhythm quantization: turns timed notes into 4/4 measures of notation events.
// One unit is a sixteenth note. A whole note is 16 units.
const MEASURE_UNITS = 16;
const DEFAULT_BPM = 120;
// Allowed note lengths in units, largest first, with their VexFlow names.
const LENGTHS = [
  { units: 16, name: 'w' },
  { units: 8, name: 'h' },
  { units: 4, name: 'q' },
  { units: 2, name: '8' },
  { units: 1, name: '16' },
];

// Splits [start, start+length) into pieces that each sit on a beat-aligned position.
function decompose(start, length) {
  const pieces = [];
  let position = start;
  let remaining = length;
  while (remaining > 0) {
    const size = LENGTHS.find(l => l.units <= remaining && position % l.units === 0) ?? LENGTHS[LENGTHS.length - 1];
    pieces.push({ position, units: size.units, duration: size.name });
    position += size.units;
    remaining -= size.units;
  }
  return pieces;
}

// Groups notes that start at the same unit into one event; each event lasts until the
// next event starts, so no two events overlap.
function toEvents(notes, bpm) {
  const unitsPerSecond = (bpm / 60) * 4;
  const byStart = new Map();
  for (const note of notes) {
    const start = Math.round(note.start * unitsPerSecond);
    const end = Math.max(start + 1, Math.round(note.end * unitsPerSecond));
    if (!byStart.has(start)) byStart.set(start, { start, end, pitches: [] });
    const event = byStart.get(start);
    event.end = Math.max(event.end, end);
    if (!event.pitches.includes(note.pitch)) event.pitches.push(note.pitch);
  }
  const sorted = [...byStart.values()].sort((a, b) => a.start - b.start);
  return sorted.map((event, i) => {
    const nextStart = i + 1 < sorted.length ? sorted[i + 1].start : Infinity;
    const end = Math.max(event.start + 1, Math.min(event.end, nextStart));
    return { start: event.start, end, pitches: event.pitches.sort((a, b) => a - b) };
  });
}

// Converts timed notes to measures. Each measure is a list of pieces:
// { rest, keys (MIDI pitches, [] for rests), duration (VexFlow name), tie }.
// `tie` is true when the next piece in the same measure continues the same notes.
// Notes that cross a barline are split, and the split is not tied across measures.
export function toMeasures(notes, bpm) {
  const tempo = bpm ?? DEFAULT_BPM;
  const events = toEvents(notes, tempo);
  const spans = [];
  let cursor = 0;
  for (const event of events) {
    if (event.start > cursor) spans.push({ start: cursor, end: event.start, keys: [] });
    spans.push({ start: event.start, end: event.end, keys: event.pitches });
    cursor = event.end;
  }
  const total = Math.ceil(cursor / MEASURE_UNITS) * MEASURE_UNITS;
  if (cursor < total) spans.push({ start: cursor, end: total, keys: [] });

  const measureCount = Math.max(1, total / MEASURE_UNITS);
  const measures = Array.from({ length: measureCount }, () => []);
  for (const span of spans) {
    let pos = span.start;
    while (pos < span.end) {
      const measureIndex = Math.floor(pos / MEASURE_UNITS);
      const measureEnd = (measureIndex + 1) * MEASURE_UNITS;
      const pieceEnd = Math.min(span.end, measureEnd);
      const pieces = decompose(pos, pieceEnd - pos);
      pieces.forEach((piece, i) => {
        measures[measureIndex].push({
          rest: span.keys.length === 0,
          keys: span.keys,
          duration: piece.duration,
          tie: span.keys.length > 0 && i < pieces.length - 1,
        });
      });
      pos = pieceEnd;
    }
  }
  return measures;
}
