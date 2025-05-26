import { useState } from 'react';

interface Note {
  id: number;
  content: string;
  // Add other note properties as needed
}

export function NoteButton() {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNote = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/note/1');
      if (!response.ok) {
        throw new Error(`Failed to fetch note: ${response.statusText}`);
      }
      const data = await response.json();
      setNote(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="note-button-container">
      <button 
        onClick={fetchNote}
        disabled={loading}
        className="fetch-note-button"
      >
        {loading ? 'Loading...' : 'Fetch Note #1'}
      </button>
      
      {error && (
        <p className="error-message">Error: {error}</p>
      )}
      
      {note && (
        <div className="note-display">
          <h3>Note #{note.id}</h3>
          <p>{note.content}</p>
        </div>
      )}
    </div>
  );
} 