const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//  CREATE TASK
const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const task = await prisma.task.create({
      data: {
        title,
        description: description || "",
        userId: req.user.id,
      },
    });

    res.status(201).json({ message: "Task created", task });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//  GET TASKS
const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    const cleanTasks = tasks.filter((t) => t && t.id);

    res.json(cleanTasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE TASK
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const existingTask = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!existingTask || existingTask.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized or task not found" });
    }

    const updated = await prisma.task.update({
      where: { id: Number(id) },
      data: { title, description, status },
    });

    res.json({ message: "Task updated", updated });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//  DELETE TASK
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!task || task.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized or task not found" });
    }

    await prisma.task.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
