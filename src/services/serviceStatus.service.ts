/****************************************************************************
 * serviceStatus.service.ts
 * Hada l file yetsarraf ma table 'Service_Status'
 * 3ashan law 3anna statuses zay "Pending", "In Progress", "Completed" etc.
 ****************************************************************************/
import pool from '../config/db';

export interface ServiceStatusInput {
  statusName: string; // e.g. "Pending"
}

// createServiceStatus => Insert row fi service_status
export async function createServiceStatus(data: ServiceStatusInput) {
  const sql = `
    INSERT INTO service_status (status_name)
    VALUES ($1)
    RETURNING support_status_id
  `;
  // But wait, fi final schema you might have 'Support_Status' or 'Service_Status'?
  // If table is 'Service_Status', aw naming is 'service_status_id'? 
  // Double-check your actual columns. If table is "Service_Status", we do:
  //   CREATE TABLE Service_Status (
  //     Service_Status_ID SERIAL PRIMARY KEY,
  //     Status_Name VARCHAR(100) UNIQUE NOT NULL
  //   )
  // So let's do it that way:
  const correctSql = `
    INSERT INTO service_status (status_name)
    VALUES ($1)
    RETURNING service_status_id
  `;
  const values = [data.statusName];
  const res = await pool.query(correctSql, values);
  return res.rows[0].service_status_id;
}

// getAllServiceStatuses => SELECT men service_status
export async function getAllServiceStatuses() {
  const sql = `
    SELECT *
    FROM service_status
    ORDER BY service_status_id
  `;
  const res = await pool.query(sql);
  return res.rows;
}

// updateServiceStatus => partial update, kaman
export async function updateServiceStatus(serviceStatusId: number, newName: string) {
  const sql = `
    UPDATE service_status
    SET status_name = $1
    WHERE service_status_id = $2
    RETURNING *
  `;
  const values = [newName, serviceStatusId];
  const res = await pool.query(sql, values);
  return res.rows[0] || null;
}

// deleteServiceStatus => b3mel DELETE men table service_status
export async function deleteServiceStatus(serviceStatusId: number) {
  const sql = `
    DELETE FROM service_status
    WHERE service_status_id = $1
  `;
  await pool.query(sql, [serviceStatusId]);
  return true;
}
