import { t } from '../ui/i18n.js';
export const TARGET_SAMPLE_RATE = 22050;

// Averages all channels into one. A single channel is returned unchanged.
export function mixToMono(channels) {
  if (channels.length === 1) return channels[0];
  const length = channels[0].length;
  const out = new Float32Array(length);
  for (const channel of channels) {
    for (let i = 0; i < length; i++) out[i] += channel[i];
  }
  for (let i = 0; i < length; i++) out[i] /= channels.length;
  return out;
}

// Splits samples into consecutive chunks of `seconds`. The last chunk may be shorter.
export function chunkSamples(samples, sampleRate, seconds = 30) {
  const size = Math.round(sampleRate * seconds);
  const chunks = [];
  for (let start = 0; start < samples.length; start += size) {
    chunks.push(samples.subarray(start, Math.min(start + size, samples.length)));
  }
  return chunks;
}

// Decodes an audio file in the browser and resamples it to mono 22050 Hz.
// Throws if the browser cannot decode the file.
export async function decodeToMono22050(arrayBuffer) {
  const decodeCtx = new AudioContext();
  let decoded;
  try {
    decoded = await decodeCtx.decodeAudioData(arrayBuffer);
  } finally {
    decodeCtx.close();
  }
  const channels = [];
  for (let c = 0; c < decoded.numberOfChannels; c++) {
    channels.push(decoded.getChannelData(c));
  }
  const mono = mixToMono(channels);
  const frames = Math.ceil(decoded.duration * TARGET_SAMPLE_RATE);
  const offline = new OfflineAudioContext(1, frames, TARGET_SAMPLE_RATE);
  const buffer = offline.createBuffer(1, mono.length, decoded.sampleRate);
  buffer.copyToChannel(mono, 0);
  const source = offline.createBufferSource();
  source.buffer = buffer;
  source.connect(offline.destination);
  source.start();
  const rendered = await offline.startRendering();
  return rendered.getChannelData(0);
}

// Files above this size may exhaust memory on a phone once decoded.
const LARGE_FILE_BYTES = 100 * 1024 * 1024;

// Returns a warning for very large files, else null.
export function largeFileWarning(bytes) {
  if (bytes <= LARGE_FILE_BYTES) return null;
  return t('largeFile');
}
