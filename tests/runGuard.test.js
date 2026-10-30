import { describe, it, expect } from 'vitest';
import { createLatestRun } from '../src/ui/runGuard.js';
describe('createLatestRun', () => {
  it('yalnızca en son başlatılan analiz güncel sayılır', () => {
    const guard = createLatestRun();
    const first = guard.begin();
    const second = guard.begin();
    expect(guard.isCurrent(first)).toBe(false);
    expect(guard.isCurrent(second)).toBe(true);
  });
});
