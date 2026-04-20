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
- `VITE_API_BASE_URL`

## Deploy (Atlas + Render + Vercel)

This is the easiest production setup for this codebase.

### 1) Create MongoDB Atlas Database

- Create a free Atlas cluster.
- In Atlas, create a database user and allow your backend host IP (`0.0.0.0/0` for quick setup).
- Copy your connection string and set it as `MONGO_URI` in Render.

### 2) Deploy Backend to Render

- Create a new Web Service from your GitHub repo.
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/api/health`
- Add environment variables:
  - `PORT=5000`
  - `NODE_ENV=production`
  - `JWT_SECRET=<your-strong-secret>`
  - `MONGO_URI=<your-atlas-uri>`
  - `CLIENT_URL=<your-vercel-frontend-url>`

After deploy, copy the backend URL, example:
`https://smart-business-backend.onrender.com`

### 3) Deploy Frontend to Vercel

- Import the same GitHub repo into Vercel.
- Set project root to `frontend`.
- Build command: `npm run build`
- Output directory: `dist`
- Add environment variable:
  - `VITE_API_BASE_URL=https://smart-business-backend.onrender.com/api`

The included `frontend/vercel.json` handles SPA route rewrites.

### 4) Final CORS Step

- Update backend `CLIENT_URL` on Render to your final Vercel domain:
  - `https://<your-project>.vercel.app`
- Redeploy backend once.

## Notes for Automation Jobs in Production

- The backend includes hourly `node-cron` jobs.
- Cron runs only while the backend process is awake.
- On free plans that sleep on inactivity, job timing can be delayed.
- For strict reliability, use an always-on service or external scheduler.

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
