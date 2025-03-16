// src/services/auth.service.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db';
import dotenv from 'dotenv';

dotenv.config();

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'fallbackSecret';

export interface RegisterInput {
  userName: string;
  userEmail: string;
  password: string;
  phoneNumber: string;
  role?: string;      // e.g. 'User' or 'Admin' or 'Delegate'
  citizenId?: number; // optional link to Citizens_Gov
}

// create new user row in system_users ( hashed password ), returning minimal info
export async function registerUser(data: RegisterInput) {
  const hashed = await bcrypt.hash(data.password, SALT_ROUNDS);

  const sql = `
    INSERT INTO system_users (
      citizen_id,
      user_name,
      user_email,
      password,
      phone_number,
      role
    )
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING user_id, user_name, user_email, role
  `;
  const values = [
    data.citizenId || null,
    data.userName,
    data.userEmail,
    hashed,
    data.phoneNumber,
    data.role || 'User'
  ];

  const res = await pool.query(sql, values);
  return res.rows[0];
}

// check user_email & password => return user record if valid
export async function authenticateUser(email: string, plainPassword: string) {
  const userRes = await pool.query('SELECT * FROM system_users WHERE user_email = $1', [email]);
  if (userRes.rowCount === 0) return null;

  const user = userRes.rows[0];
  const match = await bcrypt.compare(plainPassword, user.password);
  if (!match) return null;
  return user; // includes user_id, role, etc.
}

// create a JWT with user_id & role in the payload
export function generateToken(user: any) {
  const payload = {
    userId: user.user_id,
    role: user.role
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
  return token;
}
