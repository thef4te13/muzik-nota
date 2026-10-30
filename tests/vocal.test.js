import { describe, it, expect } from 'vitest';
import { noteName, intervalSemitones, tessituraWarning } from '../src/instruments/vocal.js';
describe('vocal', () => {
  it('A4 adı', () => expect(noteName(69)).toBe('A4'));
  it('iki nota arası yarım ton', () => expect(intervalSemitones(60, 61)).toBe(1));
  it('C6 üstü notalar için uyarı verir', () => {
    expect(tessituraWarning([{ start: 0, end: 1, pitch: 72, velocity: 1 }, { start: 1, end: 2, pitch: 86, velocity: 1 }])).toMatch(/D6/);
  });
  it('makul aralıkta uyarı yoktur', () => {
    expect(tessituraWarning([{ start: 0, end: 1, pitch: 60, velocity: 1 }])).toBeNull();
  });
});
