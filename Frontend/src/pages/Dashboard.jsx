
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AddTask from "./AddTask";
import TaskCard from "../components/TaskCard";
import { Clock, CheckCircle2, ClipboardList, Timer } from "lucide-react";
import Button from "../components/Button";
import SummaryCard from "../components/ui/SummaryCard";
import { ClipLoader } from "react-spinners";
import Loader from "../components/ui/Loader";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const { token } = useAuth(); 
  const navigate = useNavigate();
  const [showAddTask, setShowAddTask] = useState(false);

  // Fetch tasks
  const {
    data: tasks = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  // Fetch today's summary
  const { data: summaryData } = useQuery({
    queryKey: ["summary"],
    queryFn: async () => {
      const res = await api.get("/summary/today", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Navbar */}
      <Navbar />

      {/* Daily Summary Section */}
      {!summaryData ? (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">
            Daily Summary
          </h2>
          <Loader />
        </div>
      ) : (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">
            Daily Summary – {summaryData.date}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <SummaryCard
              icon={ClipboardList}
              label="Total Tasks"
              value={summaryData.summary.totalTasks}
              color="text-blue-600"
            />
            <SummaryCard
              icon={Clock}
              label="Total Time"
              value={summaryData.summary.totalTime}
              color="text-indigo-600"
            />
            <SummaryCard
              icon={CheckCircle2}
              label="Completed"
              value={summaryData.summary.completed}
              color="text-green-600"
            />
            <SummaryCard
              icon={Timer}
              label="Pending"
              value={summaryData.summary.pending}
              color="text-orange-500"
            />
          </div>
        </div>
      )}

      {/* Add Task Button */}
      <div className="flex justify-end mb-6">
        <Button onClick={() => setShowAddTask(true)}>+ Add Task</Button>
      </div>

      {/* Task List */}
      {isLoading ? (
        <div className="flex justify-center mt-10">
          <ClipLoader color="#2563EB" size={32} />
        </div>
      ) : tasks.length === 0 ? (
        <p className="text-gray-600 text-center mt-6">
          No tasks yet. Add your first task!
        </p>
      ) : (
        <ul className="space-y-3">
          {tasks
            .filter((t) => t && t.id)
            .map((task) => (
              <TaskCard key={task.id} task={task} refetch={refetch} />
            ))}
        </ul>
      )}

      {/* Add Task Modal */}
      {showAddTask && (
        <AddTask onClose={() => setShowAddTask(false)} refetch={refetch} />
      )}
    </div>
  );
}
