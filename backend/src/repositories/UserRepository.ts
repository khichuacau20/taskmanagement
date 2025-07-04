import { pool } from '../db';
import { User } from '../models/User';

export class UserRepository {
  static async create(email: string, password_hash: string, name?: string): Promise<User> {
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, password_hash, name, created_at',
      [email, password_hash, name || null]
    );
    return result.rows[0];
  }

  static async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT id, email, password_hash, name, created_at FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  static async findById(id: number): Promise<User | null> {
    const result = await pool.query(
      'SELECT id, email, password_hash, name, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  static async updateName(id: number, name: string): Promise<User | null> {
    const result = await pool.query(
      'UPDATE users SET name = $1 WHERE id = $2 RETURNING id, email, password_hash, name, created_at',
      [name, id]
    );
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  static async updatePassword(id: number, password_hash: string): Promise<boolean> {
    const result = await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [password_hash, id]
    );
    return (result.rowCount ?? 0) > 0;
  }
}
