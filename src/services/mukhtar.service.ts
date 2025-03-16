/****************************************************************************
 * mukhtar.service.ts
 ****************************************************************************/
import pool from '../config/db';

export async function createMukhtar(name: string) {
  const sql = `
    INSERT INTO mukhtar (mukh_name)
    VALUES ($1)
    RETURNING mukh_id
  `;
  const res = await pool.query(sql, [name]);
  return res.rows[0].mukh_id;
}

export async function getAllMukhtars() {
  const sql = `SELECT * FROM mukhtar ORDER BY mukh_id`;
  const res = await pool.query(sql);
  return res.rows;
}

// And you can do updateMukhtar, deleteMukhtar, etc. if needed
