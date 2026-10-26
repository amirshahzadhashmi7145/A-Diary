export interface DiaryEntry {
  id: string;
  title: string;
  date: string; // ISO date string YYYY-MM-DD
  content: string;
  mood?: string;
  createdAt: string;
  updatedAt?: string;
}

export type NewDiaryEntry = Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>;
