import { describe, it, expect } from 'vitest';
import { paginate, pageHeight } from '../src/render/score.js';
describe('paginate', () => {
  it('ölçüleri 24\'erlik sayfalara böler', () => {
    const measures = Array.from({ length: 49 }, () => []);
    expect(paginate(measures).map(p => p.length)).toEqual([24, 24, 1]);
  });
  it('sayfa yüksekliği sistem sayısına göre büyür', () => {
    expect(pageHeight(4)).toBeLessThan(pageHeight(8));
  });
});
