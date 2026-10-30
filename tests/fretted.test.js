import { describe, it, expect } from 'vitest';
import { assignFretted } from '../src/instruments/fretted.js';
import { BASS_TUNING, BASS_LABELS, BASS_MAX_FRET } from '../src/instruments/bass.js';
import { assignViolin } from '../src/instruments/violin.js';
describe('assignFretted', () => {
  it('en düşük perdeyi seçer', () => {
    expect(assignFretted(69, [40, 45, 50, 55, 59, 64], 15)).toEqual({ string: 1, fret: 5 });
  });
  it('aralık dışında null döner', () => {
    expect(assignFretted(20, [40, 45, 50, 55, 59, 64], 15)).toBeNull();
  });
});
describe('bas gitar', () => {
  it('en kalın tel E1 açık', () => {
    expect(assignFretted(28, BASS_TUNING, BASS_MAX_FRET)).toEqual({ string: 4, fret: 0 });
  });
  it('etiketler ince telden kalına', () => expect(BASS_LABELS).toEqual(['G', 'D', 'A', 'E']));
});
describe('assignViolin', () => {
  it('açık E teli', () => {
    expect(assignViolin(76)).toEqual({ string: 1, stringName: 'E', fret: 0, position: 0, finger: 0 });
  });
  it('B4 (71) A telinde 2. parmak, 1. pozisyon', () => {
    expect(assignViolin(71)).toEqual({ string: 2, stringName: 'A', fret: 2, position: 1, finger: 2 });
  });
  it('kemanın dışındaki perde null', () => expect(assignViolin(40)).toBeNull());
});
