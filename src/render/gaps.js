const BEATS_PER_MEASURE = 4;
const DEFAULT_MIN_GAP_SECONDS = 4;

// Finds stretches longer than minSeconds with no note sounding, including before the
// first note. Returns [{ start, end }] in seconds.
export function findGaps(notes, minSeconds = DEFAULT_MIN_GAP_SECONDS) {
  const sorted = [...notes].sort((a, b) => a.start - b.start);
  const gaps = [];
  let covered = 0;
  for (const note of sorted) {
    if (note.start - covered > minSeconds) gaps.push({ start: covered, end: note.start });
    covered = Math.max(covered, note.end);
  }
  return gaps;
}

// Measure indexes (0-based, 4/4) that a gap touches, for the given tempo.
export function gapMeasures(gaps, bpm, measureCount) {
  const secondsPerMeasure = (BEATS_PER_MEASURE * 60) / bpm;
  const indexes = new Set();
  for (const gap of gaps) {
    const first = Math.floor(gap.start / secondsPerMeasure);
    const last = Math.floor((gap.end - 1e-9) / secondsPerMeasure);
    for (let i = first; i <= last && i < measureCount; i++) indexes.add(i);
  }
  return indexes;
}

// Converts whole-song measure indexes to indexes within one page of perPage measures.
export function localGapIndexes(globalIndexes, pageIndex, perPage) {
  const local = new Set();
  for (const i of globalIndexes) {
    if (i >= pageIndex * perPage && i < (pageIndex + 1) * perPage) local.add(i - pageIndex * perPage);
  }
  return local;
}
