import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export default function EditTask({ task, onClose, refetch }) {
  const { token } = useAuth();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);

  // Update + Generate New AI Suggestion
  const handleUpdate = async () => {
    if (!title.trim()) return toast.error("Task title cannot be empty!");
    setLoading(true);
    setSuggestion(null);

    try {
      // Step 1: Update task
      await api.put(
        `/tasks/${task.id}`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Step 2: Generate new AI suggestion based on latest content
      const res = await api.post(
        "/tasks/nlp",
        { input: `${title} ${description}` },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuggestion(res.data);
      toast.success("Task updated ✅ New AI suggestion generated ✨");

      // Step 3: Refresh list
      refetch();
    } catch (err) {
      console.error("Error updating task:", err);
      toast.error("❌ Failed to update task or generate suggestion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl p-6 w-96">
        <h2 className="text-lg font-semibold mb-3 text-center text-gray-800">
          ✏️ Edit Task
        </h2>

        {/* Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="w-full border rounded-md p-2 mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {/* Description Input */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description..."
          className="w-full border rounded-md p-2 h-24 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {/* Save Button */}
        <button
          onClick={handleUpdate}
          disabled={loading}
          className={`w-full py-2 mt-4 rounded-md text-white transition ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Updating..." : "💾 Save & Regenerate AI Suggestion"}
        </button>

        {/* AI Suggestion Box */}
        {suggestion && (
          <div className="mt-4 bg-gray-50 p-3 rounded-md border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-800">{suggestion.title}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {suggestion.description}
            </p>
          </div>
        )}

        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="text-gray-600 text-sm mt-4 underline w-full"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
