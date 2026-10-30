import { describe, it, expect } from 'vitest';
import { mergeNoteEvents } from '../src/transcribe/basicPitch.js';
describe('mergeNoteEvents', () => {
  it('ikinci parçanın zamanlarını offset ile kaydırır', () => {
    const out = mergeNoteEvents([
      { offsetSeconds: 0, notes: [{ start: 0, end: 1, pitch: 60, velocity: 0.8 }] },
      { offsetSeconds: 30, notes: [{ start: 1, end: 2, pitch: 62, velocity: 0.8 }] },
    ]);
    expect(out.map(n => n.start)).toEqual([0, 31]);
  });
  it('boş girdide boş dizi döner', () => {
    expect(mergeNoteEvents([])).toEqual([]);
  });
});
