import { describe, it, expect } from 'vitest';
import { exportMidi } from '../src/render/midi.js';
import { toVexKeys } from '../src/render/notation.js';
import { tabText } from '../src/render/tab.js';
import { toTabLines } from '../src/instruments/guitar.js';
describe('exportMidi', () => {
  it('MIDI başlığıyla başlar', () => {
    const bytes = exportMidi([{ start: 0, end: 1, pitch: 60, velocity: 0.8 }], 120);
    expect(String.fromCharCode(...bytes.slice(0, 4))).toBe('MThd');
  });
});
describe('toVexKeys', () => {
  it('C4 için "c/4"', () => expect(toVexKeys({ start: 0, end: 1, pitch: 60, velocity: 1 })).toBe('c/4'));
  it('diyez için "c#/4"', () => expect(toVexKeys({ start: 0, end: 1, pitch: 61, velocity: 1 })).toBe('c#/4'));
});
describe('tabText', () => {
  it('1. telde 5. perdeyi doğru satıra yazar', () => {
    const note = { start: 0, end: 1, pitch: 69, velocity: 1 };
    const rows = tabText(toTabLines([note])).split('\n');
    expect(rows[0]).toBe('e|5--');
    expect(rows[5]).toBe('E|---');
  });
  it('gitar dışı notayı ? ile işaretler', () => {
    const note = { start: 0, end: 1, pitch: 20, velocity: 1 };
    expect(tabText(toTabLines([note])).split('\n')[2]).toBe('G|?--');
  });
});
