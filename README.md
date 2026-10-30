# StaffSync — Modern Human Resource Management System

A full-stack MERN starter application for HR teams, managers, and employees. It includes JWT authentication, role-based access, employee records, attendance, leave workflows, announcements, training programs, and dashboards.

## Tech stack
- Frontend: React, Vite, React Router, Axios, Bootstrap-compatible responsive custom CSS
- Backend: Node.js, Express, Mongoose, MongoDB
- Security: JWT, bcryptjs, role-based middleware, input validation, Helmet, CORS

## Requirements
- Node.js 18+ (Node 20 LTS recommended)
- npm 8+
- MongoDB local instance or MongoDB Atlas connection string

## Project structure
```text
StaffSync/
├── client/       # React frontend
└── server/       # Express API
```

## 1. Configure the backend
```bash
cd server
cp .env.example .env
npm install
```
Set `MONGODB_URI` and a long random `JWT_SECRET` in `server/.env`.

Start the API:
```bash
npm run dev
```
The API runs at `http://localhost:5000`.

## 2. Configure the frontend
In a second terminal:
```bash
cd client
cp .env.example .env
npm install
npm run dev
```
Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

## 3. Create the first HR account
Use the Register screen to create an account. For a local demo, set `ALLOW_PUBLIC_HR_REGISTRATION=true` in the backend `.env` before registering the first HR account. After creating the HR account, set it back to `false`. Otherwise, new registrations are created as employees.

Alternatively, register normally and promote a trusted account directly in MongoDB:
```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "hr" } })
```

## Demo workflow
1. Register an employee account.
2. Sign in and mark attendance.
3. Apply for leave.
4. Sign in as HR or manager to review requests (HR can review all; managers can review requests from their direct reports).
5. HR can add announcements, training programs, and employee records.

## API overview
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/employees`, `POST /api/employees`, `PATCH /api/employees/:id`
- `GET /api/attendance`, `POST /api/attendance/check-in`, `PATCH /api/attendance/:id/check-out`
- `GET /api/leaves`, `POST /api/leaves`, `PATCH /api/leaves/:id/review`
- `GET /api/announcements`, `POST /api/announcements`
- `GET /api/trainings`, `POST /api/trainings`, `POST /api/trainings/:id/enroll`

## Notes
- This is a functional project foundation, not a certified enterprise HR/payroll product.
- Configure HTTPS, production secrets, backups, audit logging, email delivery, and stricter organizational policies before real deployment.
- Never commit `.env` files or production credentials.
