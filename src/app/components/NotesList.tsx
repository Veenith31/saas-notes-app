"use client";

import { useEffect, useState, useCallback } from "react";
import { CreateNoteForm } from "./CreateNoteForm";

type Note = {
  id: string;
  title: string;
  content: string | null;
};

export function NotesList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch("/api/notes");
    if (res.ok) {
      const data = await res.json();
      setNotes(data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleDelete = async (noteId: string) => {
    if (!confirm("Are you sure?")) return;
    const res = await fetch(`/api/notes/${noteId}`, { method: "DELETE" });
    if (res.ok) {
      setNotes((prev) => prev.filter((note) => note.id !== noteId));
    } else {
      alert("Failed to delete note.");
    }
  };

  const handleEditClick = (note: Note) => {
    setEditingNoteId(note.id);
    setEditedTitle(note.title);
    setEditedContent(note.content || "");
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
  };

  const handleSaveEdit = async (noteId: string) => {
    const res = await fetch(`/api/notes/${noteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editedTitle, content: editedContent }),
    });
    if (res.ok) {
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, title: editedTitle, content: editedContent } : n))
      );
      setEditingNoteId(null);
    } else {
      alert("Failed to save changes.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <CreateNoteForm onNoteCreated={fetchNotes} />
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold">Your Notes</h2>
        {isLoading ? (
          <p className="mt-4 text-gray-400">Loading notes...</p>
        ) : notes.length === 0 ? (
          <div className="p-8 mt-4 text-center bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg">
            <p className="text-gray-400">You have no notes yet. Create one above!</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="p-5 bg-gray-800 border border-gray-700 rounded-lg">
                {editingNoteId === note.id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full px-3 py-2 text-lg font-bold text-white bg-gray-700 border border-gray-600 rounded-md"
                    />
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md"
                    />
                    <div className="flex space-x-2">
                      <button onClick={() => handleSaveEdit(note.id)} className="px-4 py-2 text-sm font-bold text-white bg-green-600 rounded-md hover:bg-green-700">Save</button>
                      <button onClick={handleCancelEdit} className="px-4 py-2 text-sm font-bold text-black bg-gray-300 rounded-md hover:bg-gray-400">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-bold">{note.title}</h3>
                      <div className="flex flex-shrink-0 space-x-2">
                        <button onClick={() => handleEditClick(note)} className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Edit</button>
                        <button onClick={() => handleDelete(note.id)} className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Delete</button>
                      </div>
                    </div>
                    <p className="mt-3 text-gray-300">{note.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
