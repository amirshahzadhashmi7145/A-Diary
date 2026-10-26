import { DiaryEntry } from '../types/diary';

export const STORAGE_KEY = 'personal_diary_entries_v1';

export const getStoredEntries = (): DiaryEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Failed to read diary entries from localStorage:', error);
    return [];
  }
};

export const saveEntriesToStorage = (entries: DiaryEntry[]): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch (error) {
    console.error('Failed to save diary entries to localStorage:', error);
    return false;
  }
};

export const formatDateDisplay = (dateString: string): string => {
  if (!dateString) return '';
  // dateString is typically YYYY-MM-DD
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return dateString;
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
