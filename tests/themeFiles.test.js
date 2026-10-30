import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { validateTheme } from '../src/theme/theme.js';
const files = JSON.parse(readFileSync('themes/index.json', 'utf8'));
describe('tema dosyaları', () => {
  for (const file of files) {
    it(`${file} geçerli`, () => {
      const theme = JSON.parse(readFileSync(`themes/${file}`, 'utf8'));
      expect(validateTheme(theme)).toEqual([]);
    });
  }
});
