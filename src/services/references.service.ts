/****************************************************************************
 * references.service.ts
 * Hada l file la lookup tables zay blood_type, marital_status, etc.
 ****************************************************************************/
import pool from '../config/db';

// getAllBloodTypes => SELECT men blood_type
export async function getAllBloodTypes() {
  const sql = 'SELECT * FROM blood_type ORDER BY blood_type_id';
  const res = await pool.query(sql);
  return res.rows;
}

// createBloodType => Insert new row fi blood_type
export async function createBloodType(name: string) {
  const sql = `
    INSERT INTO blood_type (blood_type_name)
    VALUES ($1)
    RETURNING blood_type_id
  `;
  const res = await pool.query(sql, [name]);
  return res.rows[0].blood_type_id;
}

// Similarly bta3mel for marital_status, education_level, support_status, etc.
// e.g. getAllMaritalStatuses, createMaritalStatus, ...
