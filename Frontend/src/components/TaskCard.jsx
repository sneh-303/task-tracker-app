import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import EditTask from "./EditTask";
import Button from "./Button";

export default function TaskCard({ task, refetch }) {
  const { token } = useAuth();

  // Skip rendering if invalid task
  if (!task || typeof task !== "object" || !task.id) {
    console.warn("⚠️ Skipping invalid task:", task);
    return null;
  }

  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  // Fetch total time on mount
  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const res = await api.get(`/timelog/${task.id}/total`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { totalSeconds = 0, isRunning: running, runningStart } = res.data;
        setElapsed(totalSeconds);

        if (running && runningStart) {
          const diff = (Date.now() - new Date(runningStart).getTime()) / 1000;
          setElapsed((prev) => prev + Math.floor(diff));
          setIsRunning(true);

          const id = setInterval(() => setElapsed((p) => p + 1), 1000);
          setIntervalId(id);
        }
      } catch (err) {
        console.error("Error loading total time:", err);
      }
    };

    fetchTotal();
    return () => clearInterval(intervalId);
  }, [task.id, token]);

  // Format time display
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Start Timer
  const handleStart = async () => {
    try {
      await api.post(`/timelog/${task.id}/start`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsRunning(true);
      const id = setInterval(() => setElapsed((p) => p + 1), 1000);
      setIntervalId(id);
      toast.success("Timer started ⏱️");
    } catch {
      toast.error("Failed to start timer ❌");
    }
  };

  // View Logs
  const handleViewLogs = async () => {
    try {
      const res = await api.get(`/timelog/${task.id}/logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const logs = res.data;

      if (!logs.length) return toast.info("No logs yet for this task.");

      // Show all logs in toast
      toast.info(
        logs
          .map(
            (log) =>
              `🕒 ${new Date(log.startTime).toLocaleTimeString()} → ${
                log.endTime
                  ? new Date(log.endTime).toLocaleTimeString()
                  : "Running..."
              }`
          )
          .join("\n")
      );
    } catch {
      toast.error("Failed to load logs ❌");
    }
  };


  const handleStop = async () => {
    try {
      await api.post(`/timelog/${task.id}/stop`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      clearInterval(intervalId);
      setIsRunning(false);
      refetch();

      
      toast.success("Timer stopped ✅", {
        duration: 8000,
        action: {
          label: "View Logs",
          onClick: () => handleViewLogs(),
        },
      });
    } catch {
      toast.error("Failed to stop timer ❌");
    }
  };

  // Delete Task
  const handleDelete = async () => {
    if (!confirm(`🗑️ Delete "${task.title}"?`)) return;
    try {
      await api.delete(`/tasks/${task.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Task deleted 🗑️");
      refetch();
    } catch {
      toast.error("Failed to delete task ❌");
    }
  };

  // Update Status
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    const currentStatus = task.status;

    if (currentStatus === "Completed" && newStatus === "Pending") {
      toast.error("❌ Cannot move a completed task back to Pending.");
      return;
    }

    if (currentStatus === "Pending" && newStatus === "Completed") {
      toast.error("⚠️ Move to 'In Progress' before marking as Completed.");
      return;
    }

    try {
      await api.put(
        `/tasks/${task.id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status updated ✅");
      refetch();
    } catch {
      toast.error("Failed to update status ❌");
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-md border hover:shadow-md transition">
      <div className="flex justify-between items-center">
        {/* LEFT SIDE */}
        <div>
          <h3 className="font-semibold">{task.title}</h3>
          <p className="text-sm text-gray-600">{task.status}</p>

          <select
            value={task.status}
            onChange={handleStatusChange}
            disabled={isRunning}
            className={`border text-sm px-2 py-1 rounded-md mt-1 ${
              isRunning ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* RIGHT SIDE */}
        <div className="text-right">
          <p className="text-gray-700 font-mono text-sm">{formatTime(elapsed)}</p>

          {isRunning ? (
            <Button onClick={handleStop} variant="danger" className="mt-2 w-full">
              Stop
            </Button>
          ) : (
            <Button
              onClick={() => {
                if (task.status === "Pending")
                  return toast.error("⏳ Change to 'In Progress' first.");
                if (task.status === "Completed")
                  return toast.error("✅ Task already completed.");
                handleStart();
              }}
              variant={task.status === "Completed" ? "gray" : "primary"}
              disabled={task.status === "Completed"}
              className="mt-2 w-full"
            >
              Start
            </Button>
          )}

          {/* View Logs Button */}
          <Button
            onClick={handleViewLogs}
            variant="gray"
            className="mt-2 text-xs w-full"
          >
            View Logs
          </Button>

          <Button
            onClick={() => setShowEdit(true)}
            variant="primary"
            className="mt-2 text-xs w-full"
          >
            ✏️ Edit
          </Button>

          <Button
            onClick={handleDelete}
            variant="danger"
            className="mt-2 text-xs w-full"
          >
            🗑️ Delete
          </Button>
        </div>
      </div>

      {/*Edit Modal */}
      {showEdit && (
        <EditTask
          task={task}
          onClose={() => setShowEdit(false)}
          refetch={refetch}
        />
      )}
    </div>
  );
}
