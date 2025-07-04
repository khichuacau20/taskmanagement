# Functional Requirements Document

## 1. Authentication & Authorization
- The API must allow users to register with a unique email and secure password.
- The API must allow users to log in and receive a JWT or session token for authenticated requests.
- The API must require authentication for all task management endpoints.
- The API must allow users to log out and invalidate their session/token.
- The API must restrict access so users can only access their own tasks.

## 2. Task Management
- The API must allow authenticated users to create new tasks with the following fields:
  - Title (required, string, max 100 chars)
  - Description (optional, string, max 500 chars)
  - Priority (required, enum: low, medium, high)
  - Due date (optional, ISO 8601 date)
  - Completed status (boolean, default: false)
- The API must allow users to retrieve a list of their tasks, with optional filtering by:
  - Priority
  - Due date (before/after a given date)
  - Completion status
  - Search by keyword in title or description
- The API must allow users to retrieve details of a single task by its ID (if owned by the user).
- The API must allow users to update any field of their own tasks.
- The API must allow users to mark tasks as completed or incomplete.
- The API must allow users to delete their own tasks.

## 3. Data Validation & Error Handling
- The API must validate all input data:
  - Title: required, string, not empty, max 100 chars
  - Description: optional, string, max 500 chars
  - Priority: required, must be one of [low, medium, high]
  - Due date: optional, must be a valid date (ISO 8601)
- The API must return appropriate error messages and status codes for:
  - Authentication failures (401 Unauthorized)
  - Authorization failures (403 Forbidden)
  - Validation errors (400 Bad Request)
  - Not found (404 Not Found)
  - Server errors (500 Internal Server Error)

## 4. Security Requirements
- Passwords must be securely hashed and never stored in plain text.
- JWTs or session tokens must be securely generated and validated.
- Sensitive endpoints must be protected against common vulnerabilities (e.g., SQL injection, XSS).

## 5. API Documentation
- The API must provide clear documentation for all endpoints, request/response formats, and error codes.
