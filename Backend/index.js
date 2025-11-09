
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

const allowedOrigins = [
  'https://task-tracker-app-main.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Task Tracker API Running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/timelog", timeLogRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/tasks/nlp", nlpRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.message || err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
