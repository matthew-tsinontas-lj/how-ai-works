import { describe, expect, it, vi } from 'vitest';
import { getProgress, recordResult, resetProgressCache, STORAGE_KEY } from './progress';

const when = new Date('2026-10-30T12:00:00Z');

describe('progress', () => {
  it('starts empty', () => {
    expect(getProgress()).toEqual({});
  });

  it('saves a result to localStorage', () => {
    recordResult('tokens', 2, 3, when);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual({
      tokens: { bestScore: 2, total: 3, completedAt: when.toISOString() },
    });
  });

  it('keeps the best score across attempts', () => {
    recordResult('tokens', 3, 3, when);
    recordResult('tokens', 1, 3, when);
    expect(getProgress().tokens?.bestScore).toBe(3);
  });

  it('reads saved progress back after a reload', () => {
    recordResult('context', 1, 3, when);
    resetProgressCache();
    expect(getProgress().context?.bestScore).toBe(1);
  });

  it('ignores corrupt or unexpected saved data', () => {
    localStorage.setItem(STORAGE_KEY, '{not json');
    expect(getProgress()).toEqual({});
    resetProgressCache();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tokens: { bestScore: 'lots' } }));
    expect(getProgress()).toEqual({});
  });

  it('still works for the session when storage is unavailable', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    recordResult('tokens', 2, 3, when);
    expect(getProgress().tokens?.bestScore).toBe(2);
    setItem.mockRestore();
  });
});
