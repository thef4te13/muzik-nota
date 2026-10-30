import { describe, it, expect } from 'vitest';
import { validateTheme } from '../src/theme/theme.js';
const ok = { name: 'x', colors: { bg: '#fff', fg: '#000', accent: '#f00', muted: '#888' }, font: 'serif' };
describe('validateTheme', () => {
  it('kabul eder', () => expect(validateTheme(ok)).toEqual([]));
  it('eksik renk anahtarını bildirir', () => {
    const bad = { ...ok, colors: { bg: '#fff' } };
    expect(validateTheme(bad)).toContain('colors.fg eksik');
  });
});

import { applyTheme } from '../src/theme/theme.js';
describe('applyTheme', () => {
  it('renkleri CSS değişkeni olarak yazar', () => {
    const written = {};
    const root = { style: { setProperty: (k, v) => { written[k] = v; } } };
    applyTheme(ok, root);
    expect(written['--bg']).toBe('#fff');
    expect(written['--accent']).toBe('#f00');
  });
});
