import { describe, it, expect } from 'vitest';
import { filterNotes, limitSimultaneous, melodyOnly } from '../src/transcribe/melody.js';
const n = (start, end, pitch, velocity = 0.8) => ({ start, end, pitch, velocity });

describe('filterNotes', () => {
  it('düşük şiddetli notaları atar', () => {
    expect(filterNotes([n(0, 1, 60, 0.1)], { minVelocity: 0.3 })).toEqual([]);
  });
  it('60 ms altı notaları atar', () => {
    expect(filterNotes([n(0, 0.03, 60)], { minDurationMs: 60 })).toEqual([]);
  });
  it('enstrüman aralığı dışındaki perdeleri atar', () => {
    const kept = filterNotes([n(0, 1, 20), n(0, 1, 60)], { range: [40, 79] });
    expect(kept.map(x => x.pitch)).toEqual([60]);
  });
});

describe('limitSimultaneous', () => {
  it('aynı andaki perde sayısını sınırlar, en güçlüleri tutar', () => {
    const notes = [n(0, 1, 60, 0.9), n(0, 1, 62, 0.2), n(0, 1, 64, 0.8), n(0, 1, 65, 0.7)];
    const kept = limitSimultaneous(notes, 2);
    expect(kept.map(x => x.pitch).sort()).toEqual([60, 64]);
  });
  it('farklı zamandaki notalara dokunmaz', () => {
    const notes = [n(0, 1, 60), n(2, 3, 62)];
    expect(limitSimultaneous(notes, 1)).toHaveLength(2);
  });
});

describe('melodyOnly', () => {
  it('her an için en yüksek perdeyi tutar', () => {
    const notes = [n(0, 1, 48), n(0, 1, 72), n(0, 1, 60)];
    expect(melodyOnly(notes).map(x => x.pitch)).toEqual([72]);
  });
});

import { prepareNotes } from '../src/transcribe/melody.js';
describe('prepareNotes', () => {
  const chord = [60, 62, 64, 65, 67, 69].map(p => n(0, 1, p, 0.8));
  it('akor modunda en fazla 4 perde tutar (T006)', () => {
    expect(prepareNotes(chord, { mode: 'chords' })).toHaveLength(4);
  });
  it('melodi modunda tek nota tutar (P2)', () => {
    expect(prepareNotes(chord, { mode: 'melody' }).map(x => x.pitch)).toEqual([69]);
  });
  it('yalnızca sessiz notalar varsa boş döner (T008)', () => {
    expect(prepareNotes([n(0, 1, 60, 0.05)], { mode: 'chords' })).toEqual([]);
  });
});
