import React, { useState, useEffect } from 'react';
import { DiaryEntry, NewDiaryEntry } from '../types/diary';
import { getTodayDateString } from '../utils/storage';
import { Calendar, Save, X, Smile, AlertCircle } from 'lucide-react';

interface EntryFormProps {
  initialEntry?: DiaryEntry | null;
  onSave: (entryData: NewDiaryEntry, id?: string) => void;
  onCancel: () => void;
}

const MOOD_OPTIONS = [
  { label: 'Peaceful', emoji: '🌿' },
  { label: 'Happy', emoji: '✨' },
  { label: 'Productive', emoji: '⚡' },
  { label: 'Reflective', emoji: '☕' },
  { label: 'Grateful', emoji: '💛' },
  { label: 'Tired', emoji: '🌙' },
];

export const EntryForm: React.FC<EntryFormProps> = ({
  initialEntry,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialEntry?.title || '');
  const [date, setDate] = useState(initialEntry?.date || getTodayDateString());
  const [content, setContent] = useState(initialEntry?.content || '');
  const [mood, setMood] = useState(initialEntry?.mood || '✨');
  const [errors, setErrors] = useState<{ title?: string; date?: string; content?: string }>({});

  useEffect(() => {
    if (initialEntry) {
      setTitle(initialEntry.title);
      setDate(initialEntry.date);
      setContent(initialEntry.content);
      setMood(initialEntry.mood || '✨');
    } else {
      setTitle('');
      setDate(getTodayDateString());
      setContent('');
      setMood('✨');
    }
    setErrors({});
  }, [initialEntry]);

  const validate = (): boolean => {
    const newErrors: { title?: string; date?: string; content?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length > 120) {
      newErrors.title = 'Title must be 120 characters or fewer';
    }

    if (!date) {
      newErrors.date = 'Date is required';
    }

    if (!content.trim()) {
      newErrors.content = 'Entry content cannot be empty';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    onSave(
      {
        title: title.trim(),
        date,
        content: content.trim(),
        mood,
      },
      initialEntry?.id
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6"
      noValidate
      data-testid="entry-form"
    >
      <div className="flex items-center justify-between border-b border-stone-100 pb-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-stone-900">
            {initialEntry ? 'Edit Diary Entry' : 'New Diary Entry'}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Record your thoughts, emotions, and memories
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-100 transition"
          aria-label="Cancel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Title & Date Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="entry-title" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
            Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="entry-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
            }}
            placeholder="e.g. A walk through autumn leaves"
            className={`w-full px-4 py-2.5 rounded-xl border text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 transition text-sm ${
              errors.title
                ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
                : 'border-stone-200 focus:ring-indigo-500 bg-stone-50/40 focus:bg-white'
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {errors.title}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="entry-date" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
            Date <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="entry-date"
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
              }}
              className={`w-full px-4 py-2.5 rounded-xl border text-stone-900 focus:outline-none focus:ring-2 transition text-sm ${
                errors.date
                  ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
                  : 'border-stone-200 focus:ring-indigo-500 bg-stone-50/40 focus:bg-white'
              }`}
            />
            <Calendar className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:block" />
          </div>
          {errors.date && (
            <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {errors.date}
            </p>
          )}
        </div>
      </div>

      {/* Mood Selector */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2 flex items-center gap-1.5">
          <Smile className="w-3.5 h-3.5 text-stone-500" />
          Mood / Feeling
        </label>
        <div className="flex flex-wrap gap-2">
          {MOOD_OPTIONS.map((opt) => {
            const isSelected = mood === opt.emoji;
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => setMood(opt.emoji)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span>{opt.emoji}</span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Textarea */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="entry-content" className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
            Content <span className="text-rose-500">*</span>
          </label>
          <span className="text-xs text-stone-400">
            {content.trim().length} characters
          </span>
        </div>
        <textarea
          id="entry-content"
          rows={8}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (errors.content) setErrors((prev) => ({ ...prev, content: undefined }));
          }}
          placeholder="Dear diary, today was..."
          className={`w-full px-4 py-3 rounded-xl border text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 transition text-sm leading-relaxed resize-y ${
            errors.content
              ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
              : 'border-stone-200 focus:ring-indigo-500 bg-stone-50/40 focus:bg-white'
          }`}
        />
        {errors.content && (
          <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {errors.content}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-sm font-medium transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold shadow-md shadow-indigo-100 transition"
        >
          <Save className="w-4 h-4" />
          <span>{initialEntry ? 'Update Entry' : 'Save Entry'}</span>
        </button>
      </div>
    </form>
  );
};
