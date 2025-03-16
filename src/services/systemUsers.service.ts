/****************************************************************************
 * systemUsers.service.ts
 * hon aam naamol el ashkhas li aandon access admin, delegate ...
 ****************************************************************************/
import pool from '../config/db';
import bcrypt from 'bcrypt';

export interface UserInput {
  citizenId?: number;
  userName: string;
  userEmail: string;
  password: string;  // plaintext -> hashed
  phoneNumber: string;
  role?: string;     // e.g. 'admin', 'delegate', ...
}

// createSystemUser => Insert bl system_users
export async function createSystemUser(data: UserInput) {
  const hashed = await bcrypt.hash(data.password, 10);

  const sql = `
    INSERT INTO system_users (
      citizen_id, user_name, user_email, password, phone_number, role
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING user_id
  `;
  const values = [
    data.citizenId || null,
    data.userName,
    data.userEmail,
    hashed,
    data.phoneNumber,
    data.role || 'delegate',
  ];
  const res = await pool.query(sql, values);
  return res.rows[0].user_id;
}

// authenticateUser => baamel SELECT by email, w bcrypt.compare kermel check password
export async function authenticateUser(email: string, plainPassword: string) {
  const userRes = await pool.query(
    'SELECT * FROM system_users WHERE user_email = $1',
    [email]
  );
  if (userRes.rowCount === 0) return null;

  const user = userRes.rows[0];
  const match = await bcrypt.compare(plainPassword, user.password);
  if (!match) return null;
  return user;
}

export async function getUserById(userId: number) {
  const sql = 'SELECT * FROM system_users WHERE user_id = $1';
  const res = await pool.query(sql, [userId]);
  return res.rows[0] || null;
}

export async function updateSystemUser(userId: number, data: Partial<UserInput>) {
  const setClauses: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (data.citizenId !== undefined) {
    setClauses.push(`citizen_id = $${idx}`);
    values.push(data.citizenId);
    idx++;
  }
  if (data.userName !== undefined) {
    setClauses.push(`user_name = $${idx}`);
    values.push(data.userName);
    idx++;
  }
  if (data.userEmail !== undefined) {
    setClauses.push(`user_email = $${idx}`);
    values.push(data.userEmail);
    idx++;
  }
  if (data.password !== undefined) {
    // need to re-hash
    const hashed = await bcrypt.hash(data.password, 10);
    setClauses.push(`password = $${idx}`);
    values.push(hashed);
    idx++;
  }
  if (data.phoneNumber !== undefined) {
    setClauses.push(`phone_number = $${idx}`);
    values.push(data.phoneNumber);
    idx++;
  }
  if (data.role !== undefined) {
    setClauses.push(`role = $${idx}`);
    values.push(data.role);
    idx++;
  }

  if (!setClauses.length) return null;

  const sql = `
    UPDATE system_users
    SET ${setClauses.join(', ')}
    WHERE user_id = $${idx}
    RETURNING *
  `;
  values.push(userId);

  const result = await pool.query(sql, values);
  return result.rows[0] || null;
}

export async function deleteSystemUser(userId: number) {
  await pool.query('DELETE FROM system_users WHERE user_id = $1', [userId]);
  return true;
}
