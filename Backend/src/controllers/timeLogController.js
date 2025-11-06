// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

// /**
//  * Start Timer
//  */
// const startTimer = async (req, res) => {
//   try {
//     const { taskId } = req.params;

//     // Verify the task belongs to the authenticated user
//     const task = await prisma.task.findUnique({
//       where: { id: Number(taskId) },
//     });

//     if (!task || task.userId !== req.user.id) {
//       return res.status(403).json({ message: "Access denied to this task" });
//     }

//     // Start new time log
//     const newLog = await prisma.timeLog.create({
//       data: {
//         taskId: Number(taskId),
//         startTime: new Date(),
//       },
//     });

//     res.status(201).json({ message: "Timer started", log: newLog });
//   } catch (error) {
//     console.error("Error starting timer:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**
//  * Stop Timer
//  */
// const stopTimer = async (req, res) => {
//   try {
//     const { taskId } = req.params;

//     // Find the most recent unfinished log for this task
//     const log = await prisma.timeLog.findFirst({
//       where: {
//         taskId: Number(taskId),
//         endTime: null,
//       },
//       orderBy: { startTime: "desc" },
//     });

//     if (!log) {
//       return res.status(400).json({ message: "No active timer found" });
//     }

//     // Stop timer by setting endTime
//     const updatedLog = await prisma.timeLog.update({
//       where: { id: log.id },
//       data: { endTime: new Date() },
//     });

//     res.json({ message: "Timer stopped", log: updatedLog });
//   } catch (error) {
//     console.error("Error stopping timer:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**
//  * Get total time spent on a specific task
//  */
// const getTotalTime = async (req, res) => {
//   try {
//     const { taskId } = req.params;

//     const logs = await prisma.timeLog.findMany({
//       where: { taskId: Number(taskId) },
//       orderBy: { startTime: "asc" },
//     });

//     let totalMs = 0;
//     let isRunning = false;
//     let runningStart = null;

//     for (const log of logs) {
//       if (log.endTime) {
//         totalMs += new Date(log.endTime) - new Date(log.startTime);
//       } else {
//         isRunning = true;
//         runningStart = log.startTime;
//       }
//     }

//     const totalSeconds = Math.floor(totalMs / 1000);

//     res.json({ totalSeconds, isRunning, runningStart });
//   } catch (error) {
//     console.error("Error calculating total time:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**
//  * Get all logs for a specific task
//  */
// const getLogsByTask = async (req, res) => {
//   try {
//     const { taskId } = req.params;

//     const logs = await prisma.timeLog.findMany({
//       where: { taskId: Number(taskId) },
//       orderBy: { startTime: "desc" },
//     });

//     res.json(logs);
//   } catch (error) {
//     console.error("Error fetching logs:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = {
//   startTimer,
//   stopTimer,
//   getTotalTime,
//   getLogsByTask,
// };



const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Start Timer
 */
const startTimer = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Verify task ownership
    const task = await prisma.task.findUnique({
      where: { id: Number(taskId) },
    });

    if (!task || task.userId !== req.user.id) {
      return res.status(403).json({ message: "Access denied to this task" });
    }

    // Create new log
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

/**
 * Stop Timer
 */
const stopTimer = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Find unfinished log
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

    // Stop timer
    const updatedLog = await prisma.timeLog.update({
      where: { id: log.id },
      data: { endTime: new Date() },
    });

    res.json({ message: "Timer stopped", log: updatedLog });
  } catch (error) {
    console.error("Error stopping timer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get total time for a task
 */
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
        isRunning = true;
        runningStart = log.startTime;
      }
    }

    const totalSeconds = Math.floor(totalMs / 1000);

    res.json({ totalSeconds, isRunning, runningStart });
  } catch (error) {
    console.error("Error calculating total time:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get logs for a specific task
 */
const getLogsByTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const logs = await prisma.timeLog.findMany({
      where: { taskId: Number(taskId) },
      orderBy: { startTime: "desc" },
    });

    res.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  startTimer,
  stopTimer,
  getTotalTime,
  getLogsByTask,
};
