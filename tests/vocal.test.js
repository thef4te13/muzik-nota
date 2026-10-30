import { describe, it, expect } from 'vitest';
import { noteName, intervalSemitones } from '../src/instruments/vocal.js';
describe('vocal', () => {
  it('A4 adı', () => expect(noteName(69)).toBe('A4'));
  it('iki nota arası yarım ton', () => expect(intervalSemitones(60, 61)).toBe(1));
});
