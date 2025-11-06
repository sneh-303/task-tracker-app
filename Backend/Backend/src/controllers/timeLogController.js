const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Start Timer 
const startTimer = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Check if task belongs to user
    const task = await prisma.task.findUnique({
      where: { id: Number(taskId) },
    });

    if (!task || task.userId !== req.user.id) {
      return res.status(403).json({ message: "Access denied to this task" });
    }

    // Create new time log with start time
    const newLog = await prisma.timeLog.create({
      data: {
        taskId: Number(taskId),
        startTime: new Date(),
      },
    });

    res.status(201).json({ message: "Timer started", log: newLog });
  } catch (error) {
    console.error("Error starting timer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Stop Timer 
const stopTimer = async (req, res) => {
  try {
    const { taskId } = req.params;

    // find last unfinished log for this task
    const log = await prisma.timeLog.findFirst({
      where: {
        taskId: Number(taskId),
        endTime: null,
      },
      orderBy: { startTime: "desc" },
    });

    if (!log) {
      return res.status(400).json({ message: "No active timer found" });
    }

    // stop it
    const updated = await prisma.timeLog.update({
      where: { id: log.id },
      data: { endTime: new Date() },
    });
await prisma.$disconnect(); // this will flush db before returning
    res.json({ message: "Timer stopped", log: updated });
  } catch (error) {
    console.error("Error stopping timer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get total time for a task 

 const getTotalTime = async (req, res) => {
  try {
    const { taskId } = req.params;

    const logs = await prisma.timeLog.findMany({
      where: { taskId: Number(taskId) },
      orderBy: { startTime: "asc" },
    });

    let totalMs = 0;
    let isRunning = false;
    let runningStart = null;

    for (const log of logs) {
      if (log.endTime) {
        totalMs += new Date(log.endTime) - new Date(log.startTime);
      } else {
        // Found an active timer that hasn’t been stopped yet
        isRunning = true;
        runningStart = log.startTime;
      }
    }

    // Convert milliseconds to seconds (not minutes)
    const totalSeconds = Math.floor(totalMs / 1000);

    // Send this in the response
    res.json({ totalSeconds, isRunning, runningStart });
  } catch (error) {
    console.error("Error calculating total time:", error);
    res.status(500).json({ message: "Server error" });
  }
};


 const getLogsByTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const logs = await prisma.timeLog.findMany({
      where: { taskId: Number(taskId) },
      orderBy: { startTime: "desc" },
    });
    res.json(logs);
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  startTimer,
  stopTimer,
  getTotalTime,
  getLogsByTask,
};
