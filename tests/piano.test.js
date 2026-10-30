import { describe, it, expect } from 'vitest';
import { assignHandAndFinger } from '../src/instruments/piano.js';
describe('assignHandAndFinger', () => {
  it('60 altı sol el', () => expect(assignHandAndFinger(48, 0).hand).toBe('L'));
  it('60 ve üstü sağ el', () => expect(assignHandAndFinger(60, 0).hand).toBe('R'));
  it('parmak 1-5 aralığında kalır', () => expect(assignHandAndFinger(72, 9).finger).toBe(5));
});
