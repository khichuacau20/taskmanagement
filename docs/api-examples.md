# API Request/Response Examples

## 1. User Registration
### Request
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```
### Response (201 Created)
```
{
  "message": "User registered successfully"
}
```

## 2. User Login
### Request
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```
### Response (200 OK)
```
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

## 3. Create Task
### Request
```
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Finish project report",
  "description": "Complete the final report for the project.",
  "priority_id": 2,
  "category_id": 1,
  "due_date": "2025-07-10"
}
```
### Response (201 Created)
```
{
  "id": 101,
  "user_id": 1,
  "category_id": 1,
  "priority_id": 2,
  "title": "Finish project report",
  "description": "Complete the final report for the project.",
  "due_date": "2025-07-10",
  "completed": false,
  "created_at": "2025-07-01T10:00:00Z",
  "updated_at": "2025-07-01T10:00:00Z"
}
```

## 4. Update Task
### Request
```
PUT /api/tasks/101
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Finish project report (updated)",
  "priority_id": 3
}
```
### Response (200 OK)
```
{
  "id": 101,
  "user_id": 1,
  "category_id": 1,
  "priority_id": 3,
  "title": "Finish project report (updated)",
  "description": "Complete the final report for the project.",
  "due_date": "2025-07-10",
  "completed": false,
  "created_at": "2025-07-01T10:00:00Z",
  "updated_at": "2025-07-01T12:00:00Z"
}
```

## 5. Error Case: Invalid Login
### Request
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "WrongPassword"
}
```
### Response (401 Unauthorized)
```
{
  "error": "Invalid email or password"
}
```

## 6. Error Case: Validation Error on Task Creation
### Request
```
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "",
  "priority_id": 5
}
```
### Response (400 Bad Request)
```
{
  "error": "Title is required and priority_id must be valid."
}
```
