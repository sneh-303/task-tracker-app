
import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import Button from "../components/Button";
import Loader from "../components/ui/Loader";
export default function AddTask({ onClose, refetch }) {
  const [input, setInput] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const { token } = useAuth();

  // Generate AI suggestion 
  const generateSuggestion = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setSuggestion(null);
    setTyping(false);

    try {
      const res = await api.post(
        "/tasks/nlp",
        { input },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { title, description } = res.data;

      // Typewriter animation
      setSuggestion({ title: "", description: "" });
      setTyping(true);

      let i = 0;
      const titleInterval = setInterval(() => {
        if (i < title.length) {
          setSuggestion((prev) => ({
            ...prev,
            title: title.slice(0, i + 1),
          }));
          i++;
        } else clearInterval(titleInterval);
      }, 25);

      let j = 0;
      const descInterval = setInterval(() => {
        if (j < description.length) {
          setSuggestion((prev) => ({
            ...prev,
            description: description.slice(0, j + 1),
          }));
          j++;
        } else {
          clearInterval(descInterval);
          setTyping(false);
        }
      }, 15);
    } catch (err) {
      console.error("Error:", err);
      toast.error("AI generation failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // Save task 
 const saveTask = async () => {
  if (!suggestion) return;
  try {
    await api.post(
      "/tasks",
      {
        title: suggestion.title,
        description: suggestion.description,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success("Task added successfully!");
    refetch();
    onClose();
  } catch (err) {
    console.error("Error:", err);
    toast.error("Failed to save task ❌");
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-96 animate-fadeIn">
        <h2 className="text-lg font-semibold mb-3 text-center">
          ✨ Add New Task
        </h2>

        {/* Input Field */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your task naturally..."
          className="w-full border rounded-md p-2 h-24 focus:ring-2 focus:ring-blue-400 outline-none transition"
        />

        {/* Generate Button */}
<Button
  onClick={generateSuggestion}
  disabled={loading}
  variant={loading ? "gray" : "primary"}
>
  {loading ? "✨ Thinking..." : "💡 Generate Suggestion"}
</Button>

        {/* Shimmer Loader */}
      {loading && <Loader />}


        {/* AI Suggestion Box */}
        {suggestion && !loading && (
          <div className="mt-4 bg-gray-50 p-3 rounded-md border border-gray-200 shadow-sm transition-all duration-300">
            <h3
              className={`font-semibold text-gray-800 ${
                typing ? "animate-pulse" : ""
              }`}
            >
              {suggestion.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {suggestion.description}
            </p>

            <button
              onClick={saveTask}
              disabled={typing}
              className={`w-full mt-4 py-2 rounded-md text-white transition ${
                typing
                  ? "bg-green-400 cursor-wait"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {typing ? "⏳ Generating..." : "✅ Use Suggestion"}
            </button>
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
