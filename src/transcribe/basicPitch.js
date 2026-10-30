import { chunkSamples, TARGET_SAMPLE_RATE } from '../audio/loader.js';

const CHUNK_SECONDS = 30;
// Notes of the same pitch that touch across a chunk boundary are joined.
const JOIN_TOLERANCE_SECONDS = 0.05;
const MODEL_URL = './model/model.json';

// Joins chunk results into one list. Each chunk's note times are shifted by its offset.
export function mergeNoteEvents(parts) {
  const shifted = [];
  for (const { offsetSeconds, notes } of parts) {
    for (const note of notes) {
      shifted.push({
        start: note.start + offsetSeconds,
        end: note.end + offsetSeconds,
        pitch: note.pitch,
        velocity: note.velocity,
      });
    }
  }
  shifted.sort((a, b) => a.start - b.start);

  const merged = [];
  for (const note of shifted) {
    const open = [...merged].reverse().find(n => n.pitch === note.pitch);
    if (open && open.end >= note.start - JOIN_TOLERANCE_SECONDS) {
      open.end = Math.max(open.end, note.end);
      open.velocity = Math.max(open.velocity, note.velocity);
    } else {
      merged.push({ ...note });
    }
  }
  return merged;
}

// Runs Basic Pitch on 30-second chunks and returns notes in seconds.
// Throws if the model cannot be loaded.
export async function transcribe(samples, sampleRate = TARGET_SAMPLE_RATE, onProgress = () => {}) {
  const { BasicPitch, outputToNotesPoly, noteFramesToTime } = await import('@spotify/basic-pitch');
  const model = new BasicPitch(MODEL_URL);
  const chunks = chunkSamples(samples, sampleRate, CHUNK_SECONDS);
  const parts = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const notes = await new Promise((resolve, reject) => {
      model
        .evaluateModel(
          chunk,
          (frames, onsets, contours) => {
            try {
              const poly = outputToNotesPoly(frames, onsets);
              resolve(
                noteFramesToTime(poly).map(n => ({
                  start: n.startTimeSeconds,
                  end: n.startTimeSeconds + n.durationSeconds,
                  pitch: n.pitchMidi,
                  velocity: n.amplitude,
                })),
              );
            } catch (err) {
              reject(err);
            }
          },
          fraction => onProgress((i + fraction) / chunks.length),
        )
        .catch(reject);
    });
    parts.push({ offsetSeconds: i * CHUNK_SECONDS, notes });
  }
  onProgress(1);
  return mergeNoteEvents(parts);
}
