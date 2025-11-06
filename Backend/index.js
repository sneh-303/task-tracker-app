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
const allowedOrigins = [
  'https://task-tracker-app-main.vercel.app',
  'http://localhost:5173',          // dev
  'http://127.0.0.1:5173'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);   
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (/\.vercel\.app$/.test(origin)) return callback(null, true); 
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));   
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
