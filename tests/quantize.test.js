import { describe, it, expect } from 'vitest';
import { toMeasures } from '../src/render/quantize.js';
const q = (start, end, pitch) => ({ start, end, pitch, velocity: 1 });

describe('toMeasures', () => {
  it('dört çeyrek notayı tek ölçüye koyar', () => {
    const notes = [q(0, 0.5, 60), q(0.5, 1, 62), q(1, 1.5, 64), q(1.5, 2, 65)];
    const [m] = toMeasures(notes, 120);
    expect(m.map(e => e.duration)).toEqual(['q', 'q', 'q', 'q']);
    expect(m.every(e => !e.rest)).toBe(true);
  });
  it('boşluğu dinlenmeyle doldurur', () => {
    const [m] = toMeasures([q(0, 0.5, 60), q(1, 1.5, 62)], 120);
    expect(m.map(e => (e.rest ? 'r' : 'n') + e.duration)).toEqual(['nq', 'rq', 'nq', 'rq']);
  });
  it('uzun notayı hizalı parçalara böler ve bağlar', () => {
    const [m] = toMeasures([q(0, 1.5, 60)], 120);
    expect(m[0]).toMatchObject({ duration: 'h', tie: true });
    expect(m[1]).toMatchObject({ duration: 'q', tie: false });
  });
  it('aynı anda başlayan notaları akor yapar', () => {
    const [m] = toMeasures([q(0, 1, 60), q(0, 1, 64)], 120);
    expect(m[0].keys).toEqual([60, 64]);
  });
  it('ölçü çizgisini geçen notayı iki ölçüye böler', () => {
    const measures = toMeasures([q(1.5, 2.5, 60)], 120);
    expect(measures.length).toBe(2);
    expect(measures[0][measures[0].length - 1].duration).toBe('q');
    expect(measures[1][0].duration).toBe('q');
  });
  it('tempo yoksa 120 BPM varsayar', () => {
    const [m] = toMeasures([q(0, 0.5, 60)], null);
    expect(m[0].duration).toBe('q');
  });
});
