import React from 'react';
import { DiaryEntry } from '../types/diary';
import { formatDateDisplay } from '../utils/storage';
import { Calendar, Trash2, Edit3, ArrowRight } from 'lucide-react';

interface EntryCardProps {
  entry: DiaryEntry;
  onView: (entry: DiaryEntry) => void;
  onEdit: (entry: DiaryEntry) => void;
  onDelete: (id: string) => void;
}

export const EntryCard: React.FC<EntryCardProps> = ({
  entry,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <article
      data-testid="entry-card"
      className="bg-white rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between group"
    >
      <div>
        {/* Top meta: Date and Mood */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            <time dateTime={entry.date}>{formatDateDisplay(entry.date)}</time>
          </div>
          {entry.mood && (
            <span
              className="text-base"
              title={`Mood: ${entry.mood}`}
              aria-label={`Mood: ${entry.mood}`}
            >
              {entry.mood}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          onClick={() => onView(entry)}
          className="text-lg font-serif font-bold text-stone-900 group-hover:text-indigo-600 cursor-pointer transition line-clamp-1 mb-2"
        >
          {entry.title}
        </h3>

        {/* Content snippet */}
        <p className="text-stone-600 text-sm leading-relaxed line-clamp-3 mb-4 whitespace-pre-line">
          {entry.content}
        </p>
      </div>

      {/* Card Actions */}
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
        <button
          onClick={() => onView(entry)}
          className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 transition"
        >
          <span>Read more</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(entry)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
            title="Edit entry"
            aria-label={`Edit ${entry.title}`}
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Delete entry"
            aria-label={`Delete ${entry.title}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
