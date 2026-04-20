# Smart Business Management System

Full-stack business management platform with CRM, leads, tasks, communication, content planning, and meetings.

## Tech Stack

- Frontend: React, Tailwind CSS, Axios, React Router
- Backend: Node.js, Express, JWT auth
- Database: MongoDB with Mongoose

## Project Structure

```text
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    utils/
frontend/
  src/
    components/
    context/
    pages/
    services/
```

## Setup

### 1) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 2) Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Environment Variables

Backend (`backend/.env`)
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `NODE_ENV`

Frontend (`frontend/.env`)
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Deploy (Firebase + Vercel)

This is now the easiest production setup for this codebase.

### 1) Create Firebase Project

- Create a Firebase project.
- Enable Authentication (Email/Password).
- Create Firestore Database in production or test mode.
- From Project Settings, copy web app config keys.

### 2) Deploy Frontend to Vercel

- Import the same GitHub repo into Vercel.
- Set project root to `frontend`.
- Build command: `npm run build`
- Output directory: `dist`
- Add environment variable:
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`

The included `frontend/vercel.json` handles SPA route rewrites.

## Implemented Modules

# Smart-business-management-system

- CRM (clients + leads, including kanban lead board)
- Task manager (task create/list with due dates)
- Communication (message log + templates)
- Content planner (post scheduling + timeline support)
- Dashboard overview (stats)
- Meetings (schedule and timeline/calendar view)

## Automation Implemented

- New lead automatically creates a follow-up task
- Clients with no contact in 3+ days are flagged as follow-up needed
- Client status changes create activity log entries

## API Endpoints

Auth:
- `POST /api/auth/register`
- `POST /api/auth/login`

Clients:
- `GET /api/clients`
- `POST /api/clients`
- `PUT /api/clients/:id`
- `DELETE /api/clients/:id`

Tasks:
- `GET /api/tasks`
- `POST /api/tasks`

Leads:
- `GET /api/leads`
- `POST /api/leads`

Messages:
- `GET /api/messages`
- `POST /api/messages`
- `GET /api/messages/templates`

Meetings:
- `GET /api/meetings`
- `POST /api/meetings`

Content:
- `GET /api/content`
- `POST /api/content`

Dashboard:
- `GET /api/dashboard/stats`
