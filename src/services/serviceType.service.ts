/****************************************************************************
 * serviceType.service.ts
 * Hada l file yetsarraf ma table 'Service_Type' la Citizens_Services
 * 3ashan law 3anna types zay "Financial Aid", "Medical", "Academic", etc.
 ****************************************************************************/
import pool from '../config/db';

export interface ServiceTypeInput {
  serviceTypeName: string; // e.g. "Financial Aid"
}

// createServiceType => Insert row fi service_type
export async function createServiceType(data: ServiceTypeInput) {
  const sql = `
    INSERT INTO service_type (service_type_name)
    VALUES ($1)
    RETURNING service_type_id
  `;
  const values = [data.serviceTypeName];
  const res = await pool.query(sql, values);
  return res.rows[0].service_type_id;
}

// getAllServiceTypes => SELECT men service_type
export async function getAllServiceTypes() {
  const sql = `
    SELECT *
    FROM service_type
    ORDER BY service_type_id
  `;
  const res = await pool.query(sql);
  return res.rows;
}

// updateServiceType => partial update, but here we only have name, so...
export async function updateServiceType(serviceTypeId: number, newName: string) {
  const sql = `
    UPDATE service_type
    SET service_type_name = $1
    WHERE service_type_id = $2
    RETURNING *
  `;
  const values = [newName, serviceTypeId];
  const res = await pool.query(sql, values);
  return res.rows[0] || null;
}

// deleteServiceType => b3mel DELETE men table service_type
export async function deleteServiceType(serviceTypeId: number) {
  const sql = `
    DELETE FROM service_type
    WHERE service_type_id = $1
  `;
  await pool.query(sql, [serviceTypeId]);
  return true;
}
