/****************************************************************************
 * references.service.ts
 * Hada el file la lookup tables metel el blood_type, marital_status, etc.
 ****************************************************************************/
import pool from '../config/db';

// getAllBloodTypes => SELECT men blood_type
export async function getAllBloodTypes() {
  const sql = 'SELECT * FROM blood_type ORDER BY blood_type_id';
  const res = await pool.query(sql);
  return res.rows;
}

// createBloodType => Insert new row bl blood_type
export async function createBloodType(name: string) {
  const sql = `
    INSERT INTO blood_type (blood_type_name)
    VALUES ($1)
    RETURNING blood_type_id
  `;
  const res = await pool.query(sql, [name]);
  return res.rows[0].blood_type_id;
}

// bade kamel for marital_status, education_level, support_status, etc.
