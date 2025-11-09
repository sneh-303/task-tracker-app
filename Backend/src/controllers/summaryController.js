
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getTodaySummary = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not found in token" });
    }

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const tasks = await prisma.task.findMany({
      where: { userId },
      include: {
        timeLogs: {
          where: { startTime: { gte: startOfDay, lte: endOfDay } },
        },
      },
    });

    let totalMs = 0;
    tasks.forEach((task) => {
      (task.timeLogs || []).forEach((log) => {
        if (log.endTime) {
          totalMs += new Date(log.endTime) - new Date(log.startTime);
        }
      });
    });

    const totalMinutes = Math.floor(totalMs / 60000);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    const completed = tasks.filter((t) => t.status === "Completed").length;
    const pending = tasks.filter((t) => t.status === "Pending").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;

    return res.status(200).json({
      date: now.toLocaleDateString(),
      summary: {
        totalTasks: tasks.length,
        totalTime: `${totalHours}h ${remainingMinutes}m`,
        completed,
        pending,
        inProgress,
      },
    });
  } catch (error) {
    console.error("Error fetching summary:", error);
    return res.status(500).json({ message: "Server error while fetching summary" });
  }
};

module.exports = { getTodaySummary };
