// AudioSet labels for instruments that YAMNet can name.
const INSTRUMENT_LABELS = new Set([
  'Piano', 'Electric piano', 'Organ', 'Guitar', 'Acoustic guitar', 'Electric guitar',
  'Bass guitar', 'Violin, fiddle', 'Viola', 'Cello', 'Double bass', 'Singing',
  'Flute', 'Saxophone', 'Trumpet', 'Drum kit',
]);
const CHUNK_SECONDS = 10;
const DEFAULT_THRESHOLD = 0.3;

// Turns per-window label scores into instrument findings. A window counts for a label
// when its score reaches the threshold. share = fraction of windows that count;
// confidence = mean score of those windows. Sorted by share, then confidence.
export function summarizeDetections(windows, { threshold = DEFAULT_THRESHOLD } = {}) {
  const hits = new Map();
  for (const categories of windows) {
    for (const { label, score } of categories) {
      if (!INSTRUMENT_LABELS.has(label) || score < threshold) continue;
      const entry = hits.get(label) ?? { count: 0, sum: 0 };
      entry.count++;
      entry.sum += score;
      hits.set(label, entry);
    }
  }
  return [...hits]
    .map(([label, { count, sum }]) => ({
      label,
      share: count / windows.length,
      confidence: sum / count,
    }))
    .sort((a, b) => b.share - a.share || b.confidence - a.confidence);
}

// Runs YAMNet (MediaPipe AudioClassifier) over 10-second chunks of a mono clip and
// returns the instrument findings. Throws if the model or WASM files cannot be loaded.
export async function detectInstruments(samples, sampleRate, onProgress = () => {}) {
  const { AudioClassifier, FilesetResolver } = await import('@mediapipe/tasks-audio');
  const fileset = await FilesetResolver.forAudioTasks('./mediapipe-wasm');
  const classifier = await AudioClassifier.createFromOptions(fileset, {
    baseOptions: { modelAssetPath: './models/yamnet.tflite' },
    maxResults: 60,
  });
  const size = sampleRate * CHUNK_SECONDS;
  const windows = [];
  for (let start = 0; start < samples.length; start += size) {
    const chunk = samples.subarray(start, Math.min(start + size, samples.length));
    const result = classifier.classify(chunk, sampleRate);
    const categories = result[0]?.classifications[0]?.categories ?? [];
    windows.push(categories.map(c => ({ label: c.categoryName, score: c.score })));
    onProgress(Math.min(1, (start + size) / samples.length));
  }
  classifier.close();
  return summarizeDetections(windows);
}
