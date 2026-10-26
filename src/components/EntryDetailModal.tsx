import React, { useEffect } from 'react';
import { DiaryEntry } from '../types/diary';
import { formatDateDisplay } from '../utils/storage';
import { Calendar, X, Edit3, Trash2 } from 'lucide-react';

interface EntryDetailModalProps {
  entry: DiaryEntry | null;
  onClose: () => void;
  onEdit: (entry: DiaryEntry) => void;
  onDelete: (id: string) => void;
}

export const EntryDetailModal: React.FC<EntryDetailModalProps> = ({
  entry,
  onClose,
  onEdit,
  onDelete,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (entry) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [entry, onClose]);

  if (!entry) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-entry-title"
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                <Calendar className="w-3.5 h-3.5" />
                <time dateTime={entry.date}>{formatDateDisplay(entry.date)}</time>
              </span>
              {entry.mood && (
                <span className="text-sm px-2 py-0.5 bg-stone-100 rounded-full">
                  Mood: {entry.mood}
                </span>
              )}
            </div>
            <h2 id="modal-entry-title" className="text-2xl font-serif font-bold text-stone-900 pt-1">
              {entry.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-100 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="prose prose-stone max-w-none">
          <p className="text-stone-700 leading-relaxed whitespace-pre-wrap text-base font-sans font-normal">
            {entry.content}
          </p>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs text-stone-400">
            Recorded {new Date(entry.createdAt).toLocaleDateString()}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(entry);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 transition"
            >
              <Edit3 className="w-3.5 h-3.5 text-stone-500" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => {
                onDelete(entry.id);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-xs font-semibold text-rose-600 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
