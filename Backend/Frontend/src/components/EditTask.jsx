import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

import { toast } from "sonner";

export default function EditTask({ task, onClose, refetch }) {
  const { token } = useAuth();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [loading, setLoading] = useState(false);

  // Update task
  const handleUpdate = async () => {
    if (!title.trim()) {
      toast.error("Task title cannot be empty!");
      return;
    }

    setLoading(true);
    try {
      await api.put(
        `/tasks/${task.id}`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ Task updated successfully!");
      refetch();
      onClose();
    } catch (err) {
      console.error("Error updating task:", err);
      toast.error("❌ Failed to update task. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl p-6 w-96 transform transition-all scale-100">
        <h2 className="text-lg font-semibold mb-3 text-center text-gray-800">
          ✏️ Edit Task
        </h2>

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          className="w-full border rounded-md p-2 mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {/* Description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add task description..."
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
          {loading ? "Updating..." : "Save Changes"}
        </button>

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
