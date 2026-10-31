import { describe, it, expect } from 'vitest';
import { scoreNotes } from '../src/transcribe/scoring.js';
const n = (start, pitch) => ({ start, end: start + 0.5, pitch, velocity: 1 });

describe('scoreNotes', () => {
  it('birebir eşleşen notalarda F1 = 1', () => {
    const ref = [n(0, 60), n(1, 62)];
    expect(scoreNotes(ref, ref).f1).toBe(1);
  });
  it('tolerans içinde başlayan aynı perdeyi eşler', () => {
    expect(scoreNotes([n(0, 60)], [n(0.04, 60)]).f1).toBe(1);
  });
  it('yanlış perdeyi eşlemez', () => {
    expect(scoreNotes([n(0, 61)], [n(0, 60)]).f1).toBe(0);
  });
  it('bir eşleşme iki referansa birden sayılmaz', () => {
    const r = scoreNotes([n(0, 60)], [n(0, 60), n(0, 60)]);
    expect(r.matched).toBe(1);
    expect(r.recall).toBe(0.5);
  });
});
