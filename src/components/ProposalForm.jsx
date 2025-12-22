import React, { useState } from "react";

export default function ProposalForm({ onSubmit, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [optionsInput, setOptionsInput] = useState("Yes,No");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const options = optionsInput.split(",").map((o) => o.trim()).filter(Boolean);
    if (!title || options.length < 2) return setError("Provide a title and at least two options (comma separated).");
    const res = await onSubmit(title, description, options);
    if (res) {
      setTitle("");
      setDescription("");
      setOptionsInput("Yes,No");
      if (onCancel) onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <div className="text-sm text-red-400">{error}</div>}
      <div>
        <label className="block text-sm text-gray-300">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mt-1 p-2 rounded bg-[#0b0b0b] border border-white/5 outline-none" placeholder="Proposal title" />
      </div>
      <div>
        <label className="block text-sm text-gray-300">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 p-2 rounded bg-[#0b0b0b] border border-white/5 outline-none" placeholder="Short description (optional)" />
      </div>
      <div>
        <label className="block text-sm text-gray-300">Options (comma separated)</label>
        <input value={optionsInput} onChange={(e) => setOptionsInput(e.target.value)} className="w-full mt-1 p-2 rounded bg-[#0b0b0b] border border-white/5 outline-none" />
      </div>

      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-brand-green text-black rounded">Propose</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-700 rounded">Cancel</button>
      </div>
    </form>
  );
}
