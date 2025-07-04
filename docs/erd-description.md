# Entity Relationship Diagram (ERD) Description: Task Management System

## Entities and Relationships

### 1. Users
- **Attributes:**
  - id (PK)
  - email
  - password_hash
  - name
  - created_at
- **Description:** Represents a user of the system. Each user can create and manage their own tasks.

### 2. Categories
- **Attributes:**
  - id (PK)
  - name
- **Description:** Represents a category or label that can be assigned to tasks (e.g., Work, Personal).

### 3. Tasks
- **Attributes:**
  - id (PK)
  - user_id (FK to Users)
  - category_id (FK to Categories)
  - priority_id (FK to Priorities)
  - title
  - description
  - due_date
  - completed
  - created_at
  - updated_at
- **Description:** Represents a task created by a user. Each task belongs to one user and can be assigned a category and priority.

### 4. Priorities
- **Attributes:**
  - id (PK)
  - level
- **Description:** Represents the priority level of a task (e.g., Low, Medium, High).

### 5. Task_Assignments
- **Attributes:**
  - id (PK)
  - task_id (FK to Tasks)
  - user_id (FK to Users)
- **Description:** Represents the assignment of a task to a user. Allows for tasks to be assigned to multiple users (for collaboration).

## Relationships
- **Users to Tasks:** One-to-Many (A user can have many tasks; each task belongs to one user.)
- **Tasks to Categories:** Many-to-One (A task can have one category; a category can have many tasks.)
- **Tasks to Priorities:** Many-to-One (A task can have one priority; a priority can be assigned to many tasks.)
- **Tasks to Task_Assignments:** One-to-Many (A task can be assigned to multiple users via task_assignments.)
- **Users to Task_Assignments:** One-to-Many (A user can be assigned to multiple tasks via task_assignments.)

## Summary
This ERD supports user management, task creation, categorization, prioritization, and collaborative task assignments. The task_assignments table enables many-to-many relationships between users and tasks for flexible collaboration.