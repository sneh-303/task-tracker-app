# 🕒 TaskFlow – Task & Time Tracking App

A modern full-stack productivity app that helps users **create, manage, and track tasks** efficiently — with **real-time timers**, **JWT authentication**, and **Gemini AI integration** for task suggestions.

Built using **React, Node.js, Express, MySQL (via Prisma ORM)**, and **Google’s Gemini API**.
---
🌐 Live Demo

🔗 Task-Tracker (Vercel):
👉 https://task-tracker-bzn41tagx-sneh-303s-projects.vercel.app/
---

---

## 🚀 Features

✅ JWT-based Authentication (Signup, Login, Logout)  
✅ Strong Password Validation (uppercase, lowercase, number, symbol)  
✅ Add, Edit, Delete Tasks  
✅ Start/Stop Timer with real-time tracking  
✅ Daily Summary Dashboard  
✅ AI Task Suggestions via Gemini API  
✅ Responsive & modern UI  
✅ Cascade delete for related logs  
✅ Protected routes using middleware  

---

## 🧠 Tech Stack

### Frontend
- ⚛️ React.js (with Hooks + Context API)  
- 🎨 Tailwind CSS  
- 🔔 Sonner (toast notifications)  
- 🔄 React Query (for API calls & caching)  

### Backend
- 🟩 Node.js + Express  
- 🗄️ MySQL + Prisma ORM  
- 🔐 JWT + bcrypt  
- 🤖 Gemini API (Google Generative AI)

---

## ⚙️ Setup Instructions

### 🧩 Clone the Repository
```bash
[git clone https://github.com/<your-username/taskflow.git](https://github.com/sneh-303/task-tracker-app.git)
cd taskflow
```

---

## 🛠️ Backend Setup

### 1️⃣ Go to Backend Folder
```bash
cd backend
```

### 2️⃣ Install Dependencies
```bash
npm install express bcryptjs jsonwebtoken dotenv cors prisma @prisma/client
npm install --save-dev nodemon
```

### 💡 What they do
| Package | Purpose |
|----------|----------|
| express | Server framework |
| bcryptjs | Hashing passwords |
| jsonwebtoken | Generating and verifying JWT |
| dotenv | Environment variables |
| cors | Cross-origin requests |
| prisma | ORM for MySQL |
| @prisma/client | Prisma client to interact with DB |
| nodemon | Auto-restart server during dev |

---

### 3️⃣ Initialize Prisma & Database
```bash
npx prisma init
```

Edit `prisma/schema.prisma` (already configured like this 👇):

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  tasks     Task[]
  createdAt DateTime @default(now())
}

model Task {
  id          Int       @id @default(autoincrement())
  title       String
  description String?
  status      String    @default("Pending")
  userId      Int
  user        User      @relation(fields: [userId], references: [id])
  timeLogs    TimeLog[]
  createdAt   DateTime  @default(now())
}

model TimeLog {
  id        Int      @id @default(autoincrement())
  taskId    Int
  task      Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
  startTime DateTime @default(now())
  endTime   DateTime?
}
```

---

### 4️⃣ Create `.env` File
```env
DATABASE_URL="mysql://root:yourpassword@localhost:3306/task_tracker_db"
JWT_SECRET="your_jwt_secret_here"
GEMINI_API_KEY="your_gemini_api_key_here"
PORT=8080
```

---

### 5️⃣ Run Database Migration
```bash
npx prisma migrate dev --name init
```

### 6️⃣ Start Backend Server
```bash
npm run dev
```

✅ Backend runs at → [http://localhost:8080](http://localhost:8080)

---

## 💻 Frontend Setup

### 1️⃣ Go to Frontend Folder
```bash
cd ../frontend
```

### 2️⃣ Install Dependencies
```bash
npm install react react-dom react-router-dom @tanstack/react-query axios tailwindcss sonner lucide-react react-spinners
```

### 💡 What they do
| Package | Purpose |
|----------|----------|
| react, react-dom | Core React packages |
| react-router-dom | Routing (login/signup/dashboard) |
| @tanstack/react-query | API calls and caching |
| axios | HTTP requests |
| tailwindcss | Styling |
| sonner | Toast notifications |
| lucide-react | Modern icons |
| react-spinners | Loaders for UI |

---

### 3️⃣ Initialize TailwindCSS
```bash
npx tailwindcss init -p
```

Add to `tailwind.config.js`:
```js
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
theme: { extend: {} },
plugins: [],
```

---

### 4️⃣ Start Frontend
```bash
npm run dev
```

✅ Frontend runs at → [http://localhost:5173](http://localhost:5173)

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | /auth/register | Register user |
| POST | /auth/login | Login user |
| GET | /tasks | Get all tasks |
| POST | /tasks | Create task |
| PUT | /tasks/:id | Update task |
| DELETE | /tasks/:id | Delete task |
| POST | /timelog/:id/start | Start task timer |
| POST | /timelog/:id/stop | Stop task timer |
| GET | /summary/today | Get today’s task summary |

---

## 🤖 Gemini API Integration

Example (in your controller):

```js
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateTaskSuggestion = async (req, res) => {
  try {
    const { input } = req.body;
    const prompt = `Suggest smart subtasks for: ${input}`;
    const result = await openai.responses.create({
      model: "gemini-1.5-flash",
      input: prompt,
    });
    res.json({ suggestion: result.output_text });
  } catch (error) {
    res.status(500).json({ message: "AI suggestion failed" });
  }
};
```

---

## 🧪 Run Both

✅ Start Backend:
```bash
cd backend
npm run dev
```

✅ Start Frontend:
```bash
cd frontend
npm run dev
```

Then open → [http://localhost:5173](http://localhost:5173)

---
