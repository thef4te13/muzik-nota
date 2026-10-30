const MIN_ONSETS = 4;
const MIN_BPM = 60;
const MAX_BPM = 200;

// Estimates beats per minute from onset times (seconds) by finding the most common
// inter-onset interval, folded into the 60-200 BPM range. Returns null if there is
// not enough data.
export function estimateTempo(onsetsSeconds) {
  if (onsetsSeconds.length < MIN_ONSETS) return null;

  const counts = new Map();
  for (let i = 1; i < onsetsSeconds.length; i++) {
    const interval = onsetsSeconds[i] - onsetsSeconds[i - 1];
    if (interval <= 0) continue;
    let bpm = 60 / interval;
    while (bpm < MIN_BPM) bpm *= 2;
    while (bpm >= MAX_BPM) bpm /= 2;
    const bin = Math.round(bpm);
    counts.set(bin, (counts.get(bin) ?? 0) + 1);
  }
  if (counts.size === 0) return null;

  let best = null;
  for (const [bpm, count] of counts) {
    if (best === null || count > best.count) best = { bpm, count };
  }
  return best.bpm;
}
