"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

type CreateNoteFormProps = {
  onNoteCreated: () => void;
};

export function CreateNoteForm({ onNoteCreated }: CreateNoteFormProps) {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShowUpgrade(false);
    setIsSubmitting(true);

    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      setTitle("");
      setContent("");
      onNoteCreated();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create note.");
      if (res.status === 403) {
        setShowUpgrade(true);
      }
    }
    setIsSubmitting(false);
  };

  const handleUpgrade = async () => {
    if (!session?.user?.tenantSlug) return;
    
    const res = await fetch(`/api/tenants/${session.user.tenantSlug}/upgrade`, {
        method: "POST",
    });

    if (res.ok) {
        alert("Upgrade successful! You now have unlimited notes.");
        setShowUpgrade(false);
        setError("");
    } else {
        alert("Upgrade failed. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 mb-8 space-y-4 bg-gray-800 border border-gray-700 rounded-md shadow-sm"
    >
      <h3 className="text-lg font-semibold">Create a New Note</h3>
      {error && <p className="text-sm text-red-500">{error}</p>}
      
      {/* --- START: UPDATED LOGIC --- */}
      {showUpgrade && (
        <div className="p-4 my-4 text-center bg-blue-900 border border-blue-700 rounded-md">
            <p className="mb-4">You've reached the 3-note limit for the Free plan.</p>
            {session?.user?.role === 'ADMIN' ? (
                <button
                    type="button"
                    onClick={handleUpgrade}
                    className="px-6 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                    Upgrade to Pro for Unlimited Notes
                </button>
            ) : (
                <p className="text-yellow-400">Please ask an administrator to upgrade the plan.</p>
            )}
        </div>
      )}
      {/* --- END: UPDATED LOGIC --- */}

      <div>
        <label htmlFor="title" className="block text-sm font-medium">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 mt-1 text-black border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium">Content (Optional)</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 mt-1 text-black border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
      >
        {isSubmitting ? "Saving..." : "Save Note"}
      </button>
    </form>
  );
}