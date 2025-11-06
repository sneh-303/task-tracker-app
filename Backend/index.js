const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const { PrismaClient } = require("@prisma/client");

const authRoutes = require("./src/routes/authRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const timeLogRoutes = require("./src/routes/timeLogRoutes");
const summaryRoutes = require("./src/routes/summaryRoutes");
const nlpRoutes = require("./src/routes/nlpRoutes");

const app = express();
const prisma = new PrismaClient();

// app.use(cors());
app.use(cors({
  origin: ["https://task-tracker-app-main.vercel.app", "https://task-tracker-app-main-ghd225vkq-sneh-303s-projects.vercel.app",
    'http://localhost:5173',    
  'http://127.0.0.1:5173'
   ], 
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
  credentials: true
}));
app.options("*", cors());
app.use(express.json());

// Base route
app.get("/", (req, res) => {
  res.send("Task Tracker API Running ");
});

// API route
app.use("/api/auth", authRoutes);

// task route
app.use("/api/tasks", taskRoutes);

// timelogroute
app.use("/api/timelog", timeLogRoutes);
app.use("/api/summary", summaryRoutes);
// nlp route
app.use("/api/tasks/nlp", nlpRoutes);
// Server listen
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
