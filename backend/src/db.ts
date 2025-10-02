import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set!');
}

const useSsl = connectionString.includes('ssl=true');

// Create and export the pool directly
export const pool = new Pool({
  connectionString: connectionString,
  ssl: useSsl ? { rejectUnauthorized: false } : true,
});

// We can still export a default query function for simple queries if we want
export default {
  query: (text: string, params?: any[]) => pool.query(text, params),
};