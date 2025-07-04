import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db';
import { JWT_SECRET } from '../config';

const router = Router();

// Helper: validate email and password
function validateInput(email: string, password: string) {
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!email || !emailRegex.test(email)) return 'Invalid email';
  if (!password || password.length < 8) return 'Password must be at least 8 characters';
  return null;
}

// Register endpoint
router.post('/register', async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const validationError = validateInput(email, password);
  if (validationError) return res.status(400).json({ error: validationError });

  try {
    const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hashedPassword, name || null]
    );
    return res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const validationError = validateInput(email, password);
  if (validationError) return res.status(400).json({ error: validationError });

  try {
    const userResult = await pool.query('SELECT id, email, password_hash, name FROM users WHERE email = $1', [email]);
    console.log('User query result:', userResult.rows);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const user = userResult.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    console.log('Password match:', passwordMatch);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
