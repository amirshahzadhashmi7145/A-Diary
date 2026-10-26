import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import App from './App';
import { STORAGE_KEY } from './utils/storage';
import { DiaryEntry } from './types/diary';

describe('Personal Diary App', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders initial empty state when no entries exist', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Personal Diary', level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/0 entries recorded/i)).toBeInTheDocument();
    expect(screen.getByText(/Your diary is empty/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Write First Entry/i })).toBeInTheDocument();
  });

  it('allows user to add a new diary entry with title, date, and text content', async () => {
    render(<App />);

    // Click "Write First Entry"
    const writeBtn = screen.getByRole('button', { name: /Write First Entry/i });
    fireEvent.click(writeBtn);

    // Form should be visible
    expect(screen.getByRole('heading', { name: /New Diary Entry/i })).toBeInTheDocument();

    // Fill form
    const titleInput = screen.getByLabelText(/Title/i);
    const dateInput = screen.getByLabelText(/Date/i);
    const contentInput = screen.getByLabelText(/Content/i);

    fireEvent.change(titleInput, { target: { value: 'My Sunny Vacation' } });
    fireEvent.change(dateInput, { target: { value: '2025-06-15' } });
    fireEvent.change(contentInput, {
      target: { value: 'Had a wonderful day at the seaside drinking fresh coconut water.' },
    });

    // Save
    const saveBtn = screen.getByRole('button', { name: /Save Entry/i });
    fireEvent.click(saveBtn);

    // Should return to list view and display the new entry
    await waitFor(() => {
      expect(screen.getByText('My Sunny Vacation')).toBeInTheDocument();
    });

    expect(
      screen.getByText(/Had a wonderful day at the seaside drinking fresh coconut water./i)
    ).toBeInTheDocument();
    expect(screen.getByText(/1 entry recorded/i)).toBeInTheDocument();

    // Verify localStorage has the saved entry
    const rawStorage = localStorage.getItem(STORAGE_KEY);
    expect(rawStorage).toBeTruthy();
    const storedEntries: DiaryEntry[] = JSON.parse(rawStorage || '[]');
    expect(storedEntries).toHaveLength(1);
    expect(storedEntries[0].title).toBe('My Sunny Vacation');
    expect(storedEntries[0].date).toBe('2025-06-15');
    expect(storedEntries[0].content).toContain('Had a wonderful day');
  });

  it('validates that title and content are required', () => {
    render(<App />);

    const writeBtn = screen.getByRole('button', { name: /Write First Entry/i });
    fireEvent.click(writeBtn);

    const saveBtn = screen.getByRole('button', { name: /Save Entry/i });
    fireEvent.click(saveBtn);

    expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Entry content cannot be empty/i)).toBeInTheDocument();
  });

  it('loads and displays past entries from localStorage', () => {
    const existingEntries: DiaryEntry[] = [
      {
        id: 'entry-1',
        title: 'Morning Reflections',
        date: '2025-03-10',
        content: 'Enjoying my morning coffee and listening to the birds.',
        mood: '🌿',
        createdAt: '2025-03-10T08:00:00.000Z',
      },
      {
        id: 'entry-2',
        title: 'Hiking Trip',
        date: '2025-03-11',
        content: 'Climbed the summit and watched the sunset.',
        mood: '⚡',
        createdAt: '2025-03-11T18:00:00.000Z',
      },
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingEntries));

    render(<App />);

    expect(screen.getByText(/2 entries recorded/i)).toBeInTheDocument();
    expect(screen.getByText('Hiking Trip')).toBeInTheDocument();
    expect(screen.getByText('Morning Reflections')).toBeInTheDocument();
    expect(screen.getByText(/Climbed the summit/i)).toBeInTheDocument();
    expect(screen.getByText(/Enjoying my morning coffee/i)).toBeInTheDocument();
  });

  it('opens and closes entry detail modal when viewing past entries', () => {
    const existingEntries: DiaryEntry[] = [
      {
        id: 'entry-1',
        title: 'Deep Thoughts on Architecture',
        date: '2025-04-01',
        content: 'Detailed paragraphs about software design patterns and component structures.',
        mood: '☕',
        createdAt: '2025-04-01T12:00:00.000Z',
      },
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingEntries));

    render(<App />);

    // Click "Read more"
    const readMoreBtn = screen.getByRole('button', { name: /Read more/i });
    fireEvent.click(readMoreBtn);

    // Modal dialog is displayed
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
    expect(within(modal).getByRole('heading', { name: 'Deep Thoughts on Architecture' })).toBeInTheDocument();
    expect(within(modal).getByText(/Detailed paragraphs about software design patterns/i)).toBeInTheDocument();

    // Close modal
    const closeBtn = screen.getByLabelText(/Close modal/i);
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('allows user to delete an entry', async () => {
    window.confirm = vi.fn(() => true);

    const existingEntries: DiaryEntry[] = [
      {
        id: 'entry-to-delete',
        title: 'Entry to Delete',
        date: '2025-05-01',
        content: 'This will be deleted.',
        createdAt: '2025-05-01T12:00:00.000Z',
      },
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingEntries));

    render(<App />);

    expect(screen.getByText('Entry to Delete')).toBeInTheDocument();

    const deleteBtn = screen.getByLabelText('Delete Entry to Delete');
    fireEvent.click(deleteBtn);

    expect(window.confirm).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.queryByText('Entry to Delete')).not.toBeInTheDocument();
    });

    const storedEntries: DiaryEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    expect(storedEntries).toHaveLength(0);
  });

  it('allows user to edit an existing entry', async () => {
    const existingEntries: DiaryEntry[] = [
      {
        id: 'entry-to-edit',
        title: 'Initial Title',
        date: '2025-05-01',
        content: 'Initial text.',
        createdAt: '2025-05-01T12:00:00.000Z',
      },
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingEntries));

    render(<App />);

    const editBtn = screen.getByLabelText('Edit Initial Title');
    fireEvent.click(editBtn);

    expect(screen.getByRole('heading', { name: /Edit Diary Entry/i })).toBeInTheDocument();

    const titleInput = screen.getByLabelText(/Title/i);
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

    const updateBtn = screen.getByRole('button', { name: /Update Entry/i });
    fireEvent.click(updateBtn);

    await waitFor(() => {
      expect(screen.getByText('Updated Title')).toBeInTheDocument();
      expect(screen.queryByText('Initial Title')).not.toBeInTheDocument();
    });
  });

  it('filters past entries by search query', () => {
    const existingEntries: DiaryEntry[] = [
      {
        id: 'entry-1',
        title: 'Biking in the park',
        date: '2025-02-01',
        content: 'Rode 20 miles along the river trail.',
        createdAt: '2025-02-01T10:00:00.000Z',
      },
      {
        id: 'entry-2',
        title: 'Reading books',
        date: '2025-02-02',
        content: 'Finished reading a great sci-fi novel.',
        createdAt: '2025-02-02T10:00:00.000Z',
      },
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingEntries));

    render(<App />);

    const searchInput = screen.getByRole('textbox', { name: /Search entries/i });
    fireEvent.change(searchInput, { target: { value: 'river' } });

    expect(screen.getByText('Biking in the park')).toBeInTheDocument();
    expect(screen.queryByText('Reading books')).not.toBeInTheDocument();
  });
});
