import { Pool } from 'pg';
import { DATABASE_URL } from './config';

export const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // close idle clients after 30 seconds
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
