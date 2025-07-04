import { Pool } from 'pg';
import bcrypt from 'bcrypt';

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const testUser = {
  email: 'testuser@example.com',
  password: 'TestPass123!',
  name: 'Test User'
};

export async function createTestUser() {
  const passwordHash = await bcrypt.hash(testUser.password, 10);
  await pool.query(
    `INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
    [testUser.email, passwordHash, testUser.name]
  );
}

export async function deleteTestUser() {
  await pool.query(`DELETE FROM users WHERE email = $1`, [testUser.email]);
}

export async function createTestTask(userId: number) {
  const result = await pool.query(
    `INSERT INTO tasks (user_id, title, description, priority_id, due_date)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, 'Fixture Task', 'Task for fixture', 1, '2099-12-31']
  );
  return result.rows[0];
}

export async function deleteTestTask(taskId: number) {
  await pool.query(`DELETE FROM tasks WHERE id = $1`, [taskId]);
}

export async function getUserIdByEmail(email: string) {
  const result = await pool.query(`SELECT id FROM users WHERE email = $1`, [email]);
  return result.rows[0]?.id;
}

// Utility to clear all tasks for a user (for cleanup)
export async function clearUserTasks(userId: number) {
  await pool.query(`DELETE FROM tasks WHERE user_id = $1`, [userId]);
}

