import { pool } from '../db';
import { Task } from '../models/Task';

export class TaskRepository {
  static async create(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    const result = await pool.query(
      `INSERT INTO tasks (user_id, category_id, priority_id, title, description, due_date, completed)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [task.user_id, task.category_id || null, task.priority_id || null, task.title, task.description || null, task.due_date || null, task.completed]
    );
    return result.rows[0];
  }

  static async findById(id: number, user_id: number): Promise<Task | null> {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [id, user_id]);
    return result.rows[0] || null;
  }

  static async update(id: number, user_id: number, updates: Partial<Task>): Promise<Task | null> {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    if (fields.length === 0) return null;
    const setClause = fields.map((f, i) => `${f} = $${i + 3}`).join(', ');
    const result = await pool.query(
      `UPDATE tasks SET ${setClause}, updated_at = NOW() WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, user_id, ...values]
    );
    return result.rows[0] || null;
  }

  static async delete(id: number, user_id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [id, user_id]);
    return (result.rowCount ?? 0) > 0;
  }

  static async findAll(user_id: number, filters: any = {}): Promise<Task[]> {
    let query = 'SELECT * FROM tasks WHERE user_id = $1';
    const params: any[] = [user_id];
    if (filters.priority_id) {
      params.push(filters.priority_id);
      query += ` AND priority_id = $${params.length}`;
    }
    if (filters.completed !== undefined) {
      params.push(filters.completed);
      query += ` AND completed = $${params.length}`;
    }
    if (filters.category_id) {
      params.push(filters.category_id);
      query += ` AND category_id = $${params.length}`;
    }
    if (filters.due_before) {
      params.push(filters.due_before);
      query += ` AND due_date <= $${params.length}`;
    }
    if (filters.due_after) {
      params.push(filters.due_after);
      query += ` AND due_date >= $${params.length}`;
    }
    if (filters.search) {
      params.push(`%${filters.search}%`);
      query += ` AND (title ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }
    query += ' ORDER BY due_date ASC, created_at DESC';
    const result = await pool.query(query, params);
    return result.rows;
  }
}
