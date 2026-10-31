import { describe, it, expect } from 'vitest';
import { summarizeDetections } from '../src/instruments/detect.js';
const win = (label, score) => [{ label, score }];

describe('summarizeDetections', () => {
  it('etiketin süre oranını pencere sayısından hesaplar (FR-006, FR-007)', () => {
    const windows = [win('Piano', 0.8), win('Piano', 0.6), win('Speech', 0.9), win('Piano', 0.1)];
    const [piano] = summarizeDetections(windows, { threshold: 0.3 });
    expect(piano.label).toBe('Piano');
    expect(piano.share).toBeCloseTo(0.5);
    expect(piano.confidence).toBeCloseTo(0.7);
  });
  it('eşiğin altındaki etiketleri listelemez', () => {
    expect(summarizeDetections([win('Piano', 0.1)], { threshold: 0.3 })).toEqual([]);
  });
  it('bilinmeyen etiketleri (enstrüman değilse) dışarıda bırakır', () => {
    expect(summarizeDetections([win('Speech', 0.9)], { threshold: 0.3 })).toEqual([]);
  });
  it('en çok süreden başlayarak sıralar', () => {
    const windows = [win('Piano', 0.5), win('Guitar', 0.5), win('Guitar', 0.5)];
    const labels = summarizeDetections(windows, { threshold: 0.3 }).map(d => d.label);
    expect(labels).toEqual(['Guitar', 'Piano']);
  });
});
