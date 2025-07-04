-- Seed priorities
INSERT INTO priorities (level) VALUES ('low'), ('medium'), ('high') ON CONFLICT DO NOTHING;

-- Seed categories
INSERT INTO categories (name) VALUES ('Work'), ('Personal'), ('Urgent') ON CONFLICT DO NOTHING;

-- Seed a test user
INSERT INTO users (email, password_hash, name)
VALUES ('test@example.com', '$2b$10$abcdefghijklmnopqrstuv', 'Test User')
ON CONFLICT DO NOTHING;

-- Seed a test task
INSERT INTO tasks (user_id, category_id, priority_id, title, description, due_date, completed)
SELECT u.id, c.id, p.id, 'Sample Task', 'This is a sample task.', '2025-07-10', false
FROM users u, categories c, priorities p
WHERE u.email = 'test@example.com' AND c.name = 'Work' AND p.level = 'medium'
ON CONFLICT DO NOTHING;
