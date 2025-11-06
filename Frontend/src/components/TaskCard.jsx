// import { useState, useEffect } from "react";
// import api from "../api/axios";
// import { useAuth } from "../context/AuthContext";
// import { toast } from "sonner";
// import EditTask from "./EditTask"; 
// import Button from "./Button"; 

// export default function TaskCard({ task, refetch }) {
//     if (!task) return null;
//   const { token } = useAuth();
//   const [isRunning, setIsRunning] = useState(false);
//   const [elapsed, setElapsed] = useState(0);
//   const [intervalId, setIntervalId] = useState(null);
//   const [showEdit, setShowEdit] = useState(false); // 🆕 Edit modal state

//   // Fetch total time spent on mount
//   useEffect(() => {
//     const fetchTotal = async () => {
//       try {
//         const res = await api.get(`/timelog/${task.id}/total`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const { totalSeconds, isRunning, runningStart } = res.data;
//         setElapsed(totalSeconds);

//         if (isRunning && runningStart) {
//           const diff =
//             (Date.now() - new Date(runningStart).getTime()) / 1000;
//           setElapsed((prev) => prev + Math.floor(diff));
//           setIsRunning(true);

//           const id = setInterval(() => {
//             setElapsed((prev) => prev + 1);
//           }, 1000);
//           setIntervalId(id);
//         } else {
//           setIsRunning(false);
//         }
//       } catch (err) {
//         console.error("Error loading total time:", err);
//       }
//     };

//     fetchTotal();
//   }, [task.id, token]);

//   // convert seconds to readable format
//   const formatTime = (seconds) => {
//     const h = Math.floor(seconds / 3600);
//     const m = Math.floor((seconds % 3600) / 60);
//     const s = Math.floor(seconds % 60);
//     return `${h.toString().padStart(2, "0")}:${m
//       .toString()
//       .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
//   };

//   // Start Timer
//   const handleStart = async () => {
//     try {
//       await api.post(
//         `/timelog/${task.id}/start`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setIsRunning(true);
//       const id = setInterval(() => {
//         setElapsed((prev) => prev + 1);
//       }, 1000);
//       setIntervalId(id);
//       toast.success("Timer started ⏱️");
//     } catch (err) {
//       console.error("Error starting timer:", err);
//       toast.error("Failed to start timer");
//     }
//   };

//   // Stop Timer
//   const handleStop = async () => {
//     try {
//       await api.post(
//         `/timelog/${task.id}/stop`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       clearInterval(intervalId);
//       setIsRunning(false);
//       refetch();
//       toast.success("Timer stopped ✅");
//     } catch (err) {
//       console.error("Error stopping timer:", err);
//       toast.error("Failed to stop timer");
//     }
//   };

//   // Delete Task 
//   const handleDelete = async () => {
//     const confirmDelete = confirm(
//       `🗑️ Are you sure you want to delete "${task.title}"?`
//     );
//     if (!confirmDelete) return;

//     try {
//       await api.delete(`/tasks/${task.id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success("Task deleted successfully 🗑️");
//       refetch();
//     } catch (err) {
//       console.error("Error deleting task:", err);
//       toast.error("Failed to delete task ❌");
//     }
//   };

//   // Cleanup interval
//   useEffect(() => {
//     return () => clearInterval(intervalId);
//   }, [intervalId]);

//   return (
//     <div className="p-4 bg-white shadow rounded-md border hover:shadow-md transition">
//       <div className="flex justify-between items-center">
//         {/* LEFT SIDE: Task Info */}
//         <div>
//           <h3 className="font-semibold">{task.title}</h3>
//           <p className="text-sm text-gray-600">{task.status}</p>

//           {/* Smart Status Dropdown */}
//           <select
//             value={task.status}
//             disabled={isRunning}
//             onChange={async (e) => {
//               const newStatus = e.target.value;
//               const currentStatus = task.status;

//               // Validation Rules
//               if (currentStatus === "Completed" && newStatus === "Pending") {
//                 toast.error("❌ Cannot move a completed task back to Pending.");
//                 return;
//               }

//               if (currentStatus === "Pending" && newStatus === "Completed") {
//                 toast.error(
//                   "⚠️ Move to 'In Progress' before marking as Completed."
//                 );
//                 return;
//               }

//               try {
//                 await api.put(
//                   `/tasks/${task.id}`,
//                   { status: newStatus },
//                   { headers: { Authorization: `Bearer ${token}` } }
//                 );
//                 toast.success("Status updated ✅");
//                 refetch();
//               } catch (err) {
//                 console.error("Error updating status:", err);
//                 toast.error("Failed to update status ❌");
//               }
//             }}
//             className={`border text-sm px-2 py-1 rounded-md mt-1 ${
//               isRunning ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             <option value="Pending">Pending</option>
//             <option value="In Progress">In Progress</option>
//             <option value="Completed">Completed</option>
//           </select>
//         </div>

//         {/* RIGHT SIDE: Timer & Buttons */}
//         <div className="text-right">
//           <p className="text-gray-700 font-mono text-sm">
//             {formatTime(elapsed)}
//           </p>

//           {/* Start / Stop Buttons */}
//           {isRunning ? (
//             <button
//               onClick={handleStop}
//               className="bg-red-500 text-white px-3 py-1 rounded-md mt-2 text-sm"
//             >
//               Stop
//             </button>
//           ) : (
//             <button
//               onClick={() => {
//                 if (task.status === "Pending") {
//                   toast.error(
//                     "⏳ Change to 'In Progress' before starting timer."
//                   );
//                   return;
//                 }
//                 if (task.status === "Completed") {
//                   toast.error("✅ Cannot start timer for a completed task.");
//                   return;
//                 }
//                 handleStart();
//               }}
//               className={`px-3 py-1 rounded-md mt-2 text-sm ${
//                 task.status === "Completed"
//                   ? "bg-gray-400 text-white cursor-not-allowed"
//                   : "bg-green-600 hover:bg-green-700 text-white"
//               }`}
//             >
//               Start
//             </button>
//           )}

//           {/* View Logs Button */}
//           <button
//             onClick={async () => {
//               try {
//                 const res = await api.get(`/timelog/${task.id}/logs`, {
//                   headers: { Authorization: `Bearer ${token}` },
//                 });
//                 const logs = res.data;

//                 if (logs.length === 0) {
//                   toast.error("No logs yet for this task.");
//                   return;
//                 }

//                 toast.info(
//                   logs
//                     .map(
//                       (log) =>
//                         `🕒 ${new Date(
//                           log.startTime
//                         ).toLocaleTimeString()} → ${
//                           log.endTime
//                             ? new Date(log.endTime).toLocaleTimeString()
//                             : "Running..."
//                         }`
//                     )
//                     .join("\n")
//                 );
//               } catch (err) {
//                 console.error("Error fetching time logs:", err);
//                 toast.error("Failed to load logs.");
//               }
//             }}
//             className="text-xs mt-2 text-blue-600 underline block w-full"
//           >
//             View Logs
//           </button>

//           {/* Edit Button 🆕 */}
//           <button
//             onClick={() => setShowEdit(true)}
//             className="text-xs mt-2 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md w-full"
//           >
//             ✏️ Edit
//           </button>

//           {/* Delete Button 🆕 */}
//           <button
//             onClick={handleDelete}
//             className="text-xs mt-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md w-full"
//           >
//             🗑️ Delete
//           </button>
//         </div>
//       </div>

//       {/* Edit Modal */}
//       {showEdit && (
//         <EditTask
//           task={task}
//           onClose={() => setShowEdit(false)}
//           refetch={refetch}
//         />
//       )}
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import EditTask from "./EditTask";
import Button from "./Button";

export default function TaskCard({ task, refetch }) {
  const { token } = useAuth();

  // 🧠 Defensive: Skip rendering if invalid task
  if (!task || typeof task !== "object" || !task.id) {
    console.warn("⚠️ Skipping invalid task:", task);
    return null;
  }

  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  // 🕒 Fetch total time on mount
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

  // ⏱ Format time display
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // ▶ Start Timer
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

  // ⏹ Stop Timer
  const handleStop = async () => {
    try {
      await api.post(`/timelog/${task.id}/stop`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      clearInterval(intervalId);
      setIsRunning(false);
      refetch();
      toast.success("Timer stopped ✅");
    } catch {
      toast.error("Failed to stop timer ❌");
    }
  };

  // 🗑 Delete Task
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

  // ⚙ Update Status
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

  // 🔍 View Logs
  const handleViewLogs = async () => {
    try {
      const res = await api.get(`/timelog/${task.id}/logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const logs = res.data;

      if (!logs.length) return toast.info("No logs yet for this task.");
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

          <Button onClick={handleViewLogs} variant="gray" className="mt-2 text-xs w-full">
            View Logs
          </Button>

          <Button onClick={() => setShowEdit(true)} variant="primary" className="mt-2 text-xs w-full">
            ✏️ Edit
          </Button>

          <Button onClick={handleDelete} variant="danger" className="mt-2 text-xs w-full">
            🗑️ Delete
          </Button>
        </div>
      </div>

      {showEdit && (
        <EditTask task={task} onClose={() => setShowEdit(false)} refetch={refetch} />
      )}
    </div>
  );
}
// 