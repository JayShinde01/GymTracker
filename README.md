# 🏋️‍♂️ Gym Tracker — Beginner-Friendly Full-Stack Application

A clean, easy-to-understand Full-Stack Gym Tracker built with **Next.js (App Router, JavaScript & JSX)**, **Express.js**, **Prisma ORM**, **PostgreSQL**, **JWT Authentication**, **Docker**, and **GitHub Actions**.

---

## 📌 Project Architecture

```text
gym-tracker/
│
├── frontend/                     # Next.js App Router (JavaScript + JSX)
│   ├── app/
│   │   ├── login/page.jsx        # Login page
│   │   ├── register/page.jsx     # User registration
│   │   ├── dashboard/page.jsx    # Dashboard stats
│   │   ├── exercises/page.jsx    # Exercise CRUD
│   │   ├── workouts/page.jsx    # Workout listing & creation
│   │   ├── workouts/[id]/page.jsx# Workout details & set management
│   │   ├── progress/page.jsx     # 1RM & strength progress tracking
│   │   ├── profile/page.jsx      # User profile page
│   │   ├── layout.jsx            # Root Layout with Navbar
│   │   ├── page.jsx              # Landing / Home Page
│   │   └── globals.css           # Fitness-themed CSS styles
│   │
│   ├── components/               # Reusable JSX components
│   │   ├── Navbar.jsx
│   │   ├── StatCard.jsx
│   │   ├── ExerciseForm.jsx
│   │   ├── WorkoutForm.jsx
│   │   ├── SetRow.jsx
│   │   ├── Loading.jsx
│   │   └── EmptyState.jsx
│   │
│   ├── services/
│   │   └── api.js                # Fetch API wrapper for backend endpoints
│   ├── Dockerfile
│   └── package.json
│
├── backend/                      # Express REST API (JavaScript)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── exerciseController.js
│   │   ├── workoutController.js
│   │   ├── dashboardController.js
│   │   └── progressController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── exerciseRoutes.js
│   │   ├── workoutRoutes.js
│   │   ├── setRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── progressRoutes.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT token verifier
│   │
│   ├── prisma/
│   │   └── schema.prisma         # Relational database schema
│   │
│   ├── utils/
│   │   └── streak.js             # Streak calculation algorithm
│   │
│   ├── tests/
│   │   └── streak.test.js        # Unit test suite for streak logic
│   │
│   ├── server.js                 # Express server entry point
│   ├── Dockerfile
│   └── package.json
│
├── database/
│   └── schema.sql                # Raw SQL schema reference
│
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD workflow
│
├── docker-compose.yml            # Container orchestrator
├── .gitignore
└── README.md
```

---

## 🚀 Features

1. **Authentication:** User Registration, Login, JWT Token generation & middleware validation.
2. **Exercise Management:** Full CRUD (Create, Read, Update, Delete) for custom exercises with muscle group & equipment filters.
3. **Workout Logging:** Create workout sessions, attach exercises, log multiple sets (Weight × Reps), edit/delete sets.
4. **Dashboard:**
   - Total Workouts
   - Total Exercises Performed
   - Total Volume (`Sum of Weight × Reps`)
   - Workouts This Week
   - Current Streak & Longest Streak
5. **Progress Tracking:**
   - Estimated 1RM: `Weight × (1 + Reps / 30)`
   - Comparison between Previous Session and Current Session (`↑ Improved`, `→ Maintained`, `↓ Decreased`).
6. **Streak Calculation:** Calculates consecutive workout days without storing redundant database fields.
7. **Strict Multi-Tenant Security:** All endpoints filter queries strictly by `req.userId`.

---

## ⚡ Quick Start — Local Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed locally OR running via Docker

### 1. Clone & Configure Environment
Create `.env` file in `backend/`:
```env
PORT=4000
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/gymtracker?schema=public"
JWT_SECRET="supersecretjwtkey"
```

Create `.env.local` file in `frontend/`:
```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
```

### 2. Run Backend
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run dev
```

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Docker Setup

Run the entire application (PostgreSQL + Backend + Frontend) with one command:

```bash
docker compose up --build
```

- Frontend UI: `http://localhost:3000`
- Backend REST API: `http://localhost:4000`

---

## 🧪 Running Tests

```bash
cd backend
npm test
```

---

## 📦 Docker Hub Commands

To manually push containers to Docker Hub:

```bash
docker login

docker build -t YOUR_DOCKERHUB_USERNAME/gym-tracker-backend ./backend
docker build -t YOUR_DOCKERHUB_USERNAME/gym-tracker-frontend ./frontend

docker push YOUR_DOCKERHUB_USERNAME/gym-tracker-backend
docker push YOUR_DOCKERHUB_USERNAME/gym-tracker-frontend
```

---

## ☁️ Cloud Deployment

- **Frontend:** Deploy `frontend/` directory to **Vercel** with `NEXT_PUBLIC_API_URL` environment variable.
- **Backend:** Deploy `backend/` directory to **Render** or **Railway**.
- **Database:** Provision a free PostgreSQL database on **Neon.tech** or **Supabase** and set `DATABASE_URL`.

---

## 🔗 Live URLs (Placeholders)

- **Frontend:** `YOUR_FRONTEND_URL`
- **Backend API:** `YOUR_BACKEND_URL`
- **Docker Hub:** `YOUR_DOCKERHUB_URL`
- **GitHub:** `YOUR_GITHUB_URL`
