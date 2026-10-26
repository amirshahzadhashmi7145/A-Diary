import { describe, it, expect, beforeEach } from 'vitest';
import { getStoredEntries, saveEntriesToStorage, formatDateDisplay, getTodayDateString, STORAGE_KEY } from './storage';
import { DiaryEntry } from '../types/diary';

describe('storage utility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty array when localStorage is empty', () => {
    const entries = getStoredEntries();
    expect(entries).toEqual([]);
  });

  it('saves and retrieves entries properly', () => {
    const mockEntries: DiaryEntry[] = [
      {
        id: '1',
        title: 'First Entry',
        date: '2025-01-15',
        content: 'This is my first diary entry.',
        mood: '✨',
        createdAt: '2025-01-15T10:00:00.000Z',
      },
      {
        id: '2',
        title: 'Second Entry',
        date: '2025-01-16',
        content: 'Second day reflection.',
        mood: '🌿',
        createdAt: '2025-01-16T10:00:00.000Z',
      },
    ];

    saveEntriesToStorage(mockEntries);
    const loaded = getStoredEntries();

    expect(loaded).toHaveLength(2);
    // Should be sorted by date descending (2025-01-16 first)
    expect(loaded[0].id).toBe('2');
    expect(loaded[1].id).toBe('1');
  });

  it('handles invalid JSON in localStorage gracefully', () => {
    localStorage.setItem(STORAGE_KEY, 'invalid-json{{{');
    const entries = getStoredEntries();
    expect(entries).toEqual([]);
  });

  it('formats display dates correctly', () => {
    const formatted = formatDateDisplay('2025-05-20');
    expect(formatted).toContain('2025');
    expect(formatted).toContain('May');
    expect(formatted).toContain('20');
  });

  it('returns today date in YYYY-MM-DD format', () => {
    const today = getTodayDateString();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
