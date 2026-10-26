import React from 'react';
import { DiaryEntry } from '../types/diary';
import { EntryCard } from './EntryCard';
import { BookOpen, SearchX, PlusCircle } from 'lucide-react';

interface EntryListProps {
  entries: DiaryEntry[];
  totalEntriesCount: number;
  searchQuery: string;
  onViewEntry: (entry: DiaryEntry) => void;
  onEditEntry: (entry: DiaryEntry) => void;
  onDeleteEntry: (id: string) => void;
  onNewEntryClick: () => void;
}

export const EntryList: React.FC<EntryListProps> = ({
  entries,
  totalEntriesCount,
  searchQuery,
  onViewEntry,
  onEditEntry,
  onDeleteEntry,
  onNewEntryClick,
}) => {
  if (totalEntriesCount === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-12 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">
          Your diary is empty
        </h3>
        <p className="text-sm text-stone-500 mb-6 max-w-sm mx-auto">
          Capture your thoughts, daily adventures, or reflections. Your entries are saved privately in your browser.
        </p>
        <button
          onClick={onNewEntryClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-100 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Write First Entry</span>
        </button>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-stone-800 mb-1">
          No matching entries found
        </h3>
        <p className="text-xs text-stone-500">
          No diary entries match &ldquo;{searchQuery}&rdquo;. Try another search term.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-serif font-bold text-stone-800">
          Past Entries{' '}
          <span className="text-xs font-sans font-normal text-stone-500 ml-1">
            ({entries.length})
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" data-testid="entries-grid">
        {entries.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            onView={onViewEntry}
            onEdit={onEditEntry}
            onDelete={onDeleteEntry}
          />
        ))}
      </div>
    </div>
  );
};
