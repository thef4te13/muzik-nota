import { describe, it, expect } from 'vitest';
import { estimateTempo } from '../src/transcribe/tempo.js';
describe('estimateTempo', () => {
  it('120 BPM vuruşlarını tanır', () => {
    const onsets = Array.from({ length: 16 }, (_, i) => i * 0.5);
    expect(estimateTempo(onsets)).toBeCloseTo(120, 0);
  });
  it('yetersiz veride null döner', () => {
    expect(estimateTempo([0, 0.5])).toBeNull();
  });
});
