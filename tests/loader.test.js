import { describe, it, expect } from 'vitest';
import { mixToMono, chunkSamples } from '../src/audio/loader.js';
describe('mixToMono', () => {
  it('stereo kanalları ortalar', () => {
    const out = mixToMono([new Float32Array([1, 0]), new Float32Array([0, 0])]);
    expect(Array.from(out)).toEqual([0.5, 0]);
  });
  it('tek kanalı aynen döner', () => {
    expect(Array.from(mixToMono([new Float32Array([0.25])]))).toEqual([0.25]);
  });
});
describe('chunkSamples', () => {
  it('30 saniyelik parçalara böler, hiçbir örneği kaybetmez', () => {
    const sr = 10, total = 75;
    const chunks = chunkSamples(new Float32Array(total), sr, 3);
    expect(chunks.map(c => c.length)).toEqual([30, 30, 15]);
  });
});

import { largeFileWarning } from '../src/audio/loader.js';
describe('largeFileWarning', () => {
  it('küçük dosyada uyarı yoktur', () => expect(largeFileWarning(5 * 1024 * 1024)).toBeNull());
  it('çok büyük dosyada uyarı verir', () => expect(largeFileWarning(200 * 1024 * 1024)).toMatch(/büyük/));
});
