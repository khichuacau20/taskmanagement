# Task Management System - REST API Endpoints

## Authentication
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Log in and receive a JWT token
- `POST /api/auth/logout` — Log out (invalidate token)

## User Profile
- `GET /api/users/me` — Get current user profile

## Tasks
- `POST /api/tasks` — Create a new task
- `GET /api/tasks` — Get a list of tasks (with filtering & search)
  - Query parameters:
    - `priority` (low|medium|high)
    - `completed` (true|false)
    - `category` (category id)
    - `due_before` (date)
    - `due_after` (date)
    - `search` (keyword in title/description)
- `GET /api/tasks/:id` — Get a single task by ID
- `PUT /api/tasks/:id` — Update a task by ID
- `PATCH /api/tasks/:id/complete` — Mark a task as completed/incomplete
- `DELETE /api/tasks/:id` — Delete a task by ID

## Categories
- `GET /api/categories` — List all categories
- `POST /api/categories` — Create a new category
- `PUT /api/categories/:id` — Update a category
- `DELETE /api/categories/:id` — Delete a category

## Priorities
- `GET /api/priorities` — List all priority levels

## Task Assignments (for collaborative tasks)
- `POST /api/tasks/:id/assign` — Assign a task to a user
- `DELETE /api/tasks/:id/assign/:userId` — Remove a user from a task

## Notes
- All `/api/tasks` endpoints require authentication.
- Filtering and search are supported via query parameters on `GET /api/tasks`.
- All endpoints return standard HTTP status codes and error messages.
