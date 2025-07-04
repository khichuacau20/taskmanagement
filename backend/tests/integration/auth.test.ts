import request from 'supertest';
import app from '../../src/index';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
// const app = require('../../src/index');
// import { app } from '../../src/index';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

let authToken: string;
let testTaskId: number;

beforeAll(async () => {
  // Create a test user directly in the DB
  const passwordHash = await bcrypt.hash('TestPass123!', 10);
  console.log('Creating test user with hash:', passwordHash);
  await pool.query(
    `INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
    ['apitest@example.com', passwordHash, 'API Tester']
  );
  // Login to get JWT token
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'apitest@example.com', password: 'TestPass123!' });
  authToken = res.body.token;
});

afterAll(async () => {
  // Clean up test data
  await pool.query(`DELETE FROM tasks WHERE title = $1`, ['Integration Test Task']);
  await pool.query(`DELETE FROM users WHERE email = $1`, ['apitest@example.com']);
  await pool.end();
});

describe('Task API Integration', () => {
  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Integration Test Task',
        description: 'Task created by integration test',
        priority_id: 1,
        due_date: '2099-12-31'
      });
      console.log(res.body);
    expect(res.status).toBe(201);
    expect(res.body.task.title).toBe('Integration Test Task');
    testTaskId = res.body.task.id;
  });

  it('should get the created task', async () => {
    const res = await request(app)
      .get(`/api/v1/tasks/${testTaskId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.task.id).toBe(testTaskId);
  });

  it('should update the task', async () => {
    const res = await request(app)
      .put(`/api/v1/tasks/${testTaskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Updated Integration Test Task' });
    expect(res.status).toBe(200);
    expect(res.body.task.title).toBe('Updated Integration Test Task');
  });

  it('should delete the task', async () => {
    const res = await request(app)
      .delete(`/api/v1/tasks/${testTaskId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(204);
  });
});