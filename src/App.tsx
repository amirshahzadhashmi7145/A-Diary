import { useState, useEffect, useMemo } from 'react';
import { DiaryEntry, NewDiaryEntry } from './types/diary';
import { getStoredEntries, saveEntriesToStorage } from './utils/storage';
import { Header } from './components/Header';
import { EntryForm } from './components/EntryForm';
import { EntryList } from './components/EntryList';
import { EntryDetailModal } from './components/EntryDetailModal';
import { CheckCircle2, Info, Search } from 'lucide-react';

export function App() {
  const [entries, setEntries] = useState<DiaryEntry[]>(() => getStoredEntries());
  const [isWriting, setIsWriting] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [viewingEntry, setViewingEntry] = useState<DiaryEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Sync entries to localStorage whenever they change
  useEffect(() => {
    saveEntriesToStorage(entries);
  }, [entries]);

  // Auto-dismiss notification after 3 seconds
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      setNotification(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [notification]);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
  };

  const handleSaveEntry = (entryData: NewDiaryEntry, id?: string) => {
    if (id) {
      // Update existing entry
      setEntries((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                ...entryData,
                updatedAt: new Date().toISOString(),
              }
            : item
        )
      );
      showNotification('Diary entry updated successfully!');
    } else {
      // Add new entry
      const newEntry: DiaryEntry = {
        ...entryData,
        id: `entry_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        createdAt: new Date().toISOString(),
      };
      setEntries((prev) => [newEntry, ...prev]);
      showNotification('New diary entry saved!');
    }

    setIsWriting(false);
    setEditingEntry(null);
  };

  const handleDeleteEntry = (id: string) => {
    const target = entries.find((e) => e.id === id);
    const confirmMessage = target ? `Delete "${target.title}"?` : 'Delete this entry?';
    if (window.confirm(confirmMessage)) {
      setEntries((prev) => prev.filter((item) => item.id !== id));
      if (viewingEntry?.id === id) {
        setViewingEntry(null);
      }
      showNotification('Diary entry deleted.', 'info');
    }
  };

  const handleEditEntry = (entry: DiaryEntry) => {
    setEditingEntry(entry);
    setIsWriting(true);
    setViewingEntry(null);
  };

  const handleOpenWriting = () => {
    setEditingEntry(null);
    setIsWriting(true);
  };

  const handleToggleWriting = () => {
    if (isWriting) {
      setIsWriting(false);
      setEditingEntry(null);
    } else {
      handleOpenWriting();
    }
  };

  // Filtered entries
  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const sorted = [...entries].sort((a, b) => {
      const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    if (!q) return sorted;

    return sorted.filter(
      (entry) =>
        entry.title.toLowerCase().includes(q) ||
        entry.content.toLowerCase().includes(q) ||
        entry.date.includes(q)
    );
  }, [entries, searchQuery]);

  return (
    <div className="min-h-screen bg-stone-50/70 text-stone-900 flex flex-col font-sans">
      <Header
        entryCount={entries.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewEntryClick={handleToggleWriting}
        isWriting={isWriting}
      />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-stone-800 border-stone-700 text-stone-100'
            }`}
            role="status"
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-stone-400 flex-shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Mobile search bar */}
      <div className="sm:hidden px-4 pt-4 max-w-5xl mx-auto w-full">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search diary entries..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {isWriting ? (
          <div className="max-w-3xl mx-auto">
            <EntryForm
              initialEntry={editingEntry}
              onSave={handleSaveEntry}
              onCancel={() => {
                setIsWriting(false);
                setEditingEntry(null);
              }}
            />
          </div>
        ) : (
          <EntryList
            entries={filteredEntries}
            totalEntriesCount={entries.length}
            searchQuery={searchQuery}
            onViewEntry={setViewingEntry}
            onEditEntry={handleEditEntry}
            onDeleteEntry={handleDeleteEntry}
            onNewEntryClick={handleOpenWriting}
          />
        )}
      </main>

      {/* Entry Detail Modal */}
      <EntryDetailModal
        entry={viewingEntry}
        onClose={() => setViewingEntry(null)}
        onEdit={handleEditEntry}
        onDelete={handleDeleteEntry}
      />

      {/* Footer */}
      <footer className="border-t border-stone-200 py-6 text-center text-xs text-stone-500 mt-auto">
        <p>Personal Diary &bull; Saved locally in your browser</p>
      </footer>
    </div>
  );
}

export default App;
