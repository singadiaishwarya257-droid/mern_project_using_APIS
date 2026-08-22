# Task Management Application

## Overview
A task management application built with React, Node.js, Express, and MySQL.

## Folder structure
- `backend/` — Express API server, JWT auth, MySQL integration, role-based access control
- `frontend/` — React + Vite client with protected routes and responsive UI
- `postman/` — Postman collection for all REST API endpoints

## Backend setup
1. Copy `backend/.env.example` to `backend/.env`.
2. Update `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, and `CLIENT_URL`.
3. Install dependencies:
   - `cd backend`
   - `npm install`
4. Initialize MySQL database:
   - Run the SQL in `backend/src/migrations/init.sql`
5. Start the backend:
   - `npm run dev`

## Frontend setup
1. Copy `frontend/.env.example` to `frontend/.env`.
2. Set `VITE_API_URL=http://localhost:4000/api`.
3. Install dependencies:
   - `cd frontend`
   - `npm install`
4. Start the frontend:
   - `npm run dev`

## API base URL
`http://localhost:4000/api`

## Core modules
1. Authentication
2. Users
3. Roles
4. Projects
5. Tasks
6. Comments
7. Tags
8. Teams
9. Activities
10. Settings

## Functional features
- JWT-based login
- Multiple roles: `admin`, `manager`, `user`
- Authenticated routes with role authorization
- Create, retrieve, update, delete, search, and filter operations for modules
- Responsive React UI for browser and device compatibility
- Secure headers, rate limiting, and input-safe SQL handling

## Postman collection
Import `postman/task-management-api.postman_collection.json` into Postman to test all endpoints.

