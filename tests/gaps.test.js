import { describe, it, expect } from 'vitest';
import { findGaps, gapMeasures } from '../src/render/gaps.js';
const n = (start, end) => ({ start, end, pitch: 60, velocity: 1 });

describe('findGaps', () => {
  it('4 saniyeden uzun boşlukları bulur (FR-005)', () => {
    expect(findGaps([n(0, 1), n(6, 7)], 4)).toEqual([{ start: 1, end: 6 }]);
  });
  it('kısa boşlukları yok sayar', () => {
    expect(findGaps([n(0, 1), n(2, 3)], 4)).toEqual([]);
  });
});

describe('gapMeasures', () => {
  it('boşluğun düştüğü ölçü numaralarını verir (120 BPM, ölçü = 2 sn)', () => {
    expect([...gapMeasures([{ start: 3, end: 9 }], 120, 6)]).toEqual([1, 2, 3, 4]);
  });
});

import { localGapIndexes } from '../src/render/gaps.js';
describe('localGapIndexes', () => {
  it('genel ölçü numaralarını sayfa içi numaralara çevirir', () => {
    expect([...localGapIndexes(new Set([1, 25, 26]), 1, 24)]).toEqual([1, 2]);
  });
});
