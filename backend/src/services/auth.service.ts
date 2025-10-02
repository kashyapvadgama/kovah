import { pool } from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-please-change';

export class AuthService {
  async signUp(userData: any) {
    // ... (This function is already complete and correct)
    const { username, fullName, email, password } = userData;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const existingUser = await client.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        throw new Error('An account with this email already exists.');
      }
      const existingProfile = await client.query('SELECT id FROM profiles WHERE username = $1', [username]);
      if (existingProfile.rows.length > 0) {
        throw new Error('This username is already taken.');
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const newUserId = randomUUID();
      await client.query(
        'INSERT INTO users (id, email, password_hash) VALUES ($1, $2, $3)',
        [newUserId, email, passwordHash]
      );
      const profileQuery = await client.query(
        'INSERT INTO profiles (id, username, full_name) VALUES ($1, $2, $3) RETURNING id, username, full_name',
        [newUserId, username, fullName]
      );
      const newProfile = profileQuery.rows[0];
      await client.query('COMMIT');
      const token = jwt.sign({ userId: newProfile.id, email: email }, JWT_SECRET, { expiresIn: '7d' });
      return { token, user: newProfile };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async signIn(credentials: any) {
    const { email, password } = credentials;

    // Find user by email from our private users table
    const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userQuery.rows[0];

    if (!user) {
      return null; // User not found
    }

    // Check if the provided password matches the stored hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return null; // Incorrect password
    }
    
    // If login is successful, fetch the user's public profile
    const profileQuery = await pool.query('SELECT id, username, full_name, avatar_url FROM profiles WHERE id = $1', [user.id]);
    const userProfile = profileQuery.rows[0];

    // Create a JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return { token, user: userProfile };
  }
}