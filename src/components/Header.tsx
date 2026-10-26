import React from 'react';
import { BookOpen, PenSquare, Search } from 'lucide-react';

interface HeaderProps {
  entryCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewEntryClick: () => void;
  isWriting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  entryCount,
  searchQuery,
  onSearchChange,
  onNewEntryClick,
  isWriting,
}) => {
  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-20 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight leading-none">
              Personal Diary
            </h1>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              {entryCount === 1 ? '1 entry recorded' : `${entryCount} entries recorded`}
            </p>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block w-48 md:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search entries..."
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-stone-100 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              aria-label="Search entries"
            />
          </div>

          <button
            onClick={onNewEntryClick}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm ${
              isWriting
                ? 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
            }`}
          >
            <PenSquare className="w-4 h-4" />
            <span>{isWriting ? 'View Entries' : 'Write Entry'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
