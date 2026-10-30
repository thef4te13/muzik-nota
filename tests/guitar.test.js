import { describe, it, expect } from 'vitest';
import { assignPosition, toTabLines } from '../src/instruments/guitar.js';
describe('assignPosition', () => {
  it('açık 6. tel E2 için', () => expect(assignPosition(40)).toEqual({ string: 6, fret: 0 }));
  it('A4 (69) en düşük perdeyle 1. telde 5. perde', () => expect(assignPosition(69)).toEqual({ string: 1, fret: 5 }));
  it('gitarın dışındaki perde null', () => expect(assignPosition(20)).toBeNull());
});
describe('toTabLines', () => {
  it('her nota için pozisyon ve nota çifti döner', () => {
    const note = { start: 0, end: 1, pitch: 69, velocity: 1 };
    expect(toTabLines([note])).toEqual([{ position: { string: 1, fret: 5 }, note }]);
  });
});
