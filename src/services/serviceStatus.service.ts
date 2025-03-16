/****************************************************************************
 * serviceStatus.service.ts
 * Hayda el file byeshteghel maa table 'Service_Status'
 * kermle eza 3anna statuses metel "Pending", "In Progress", "Completed" etc.
 ****************************************************************************/
import pool from '../config/db';

export interface ServiceStatusInput {
  statusName: string; // e.g. "Pending"
}

// createServiceStatus => Insert row bel service_status
export async function createServiceStatus(data: ServiceStatusInput) {
  const sql = `
    INSERT INTO service_status (status_name)
    VALUES ($1)
    RETURNING support_status_id
  `;
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

// deleteServiceStatus => baamel DELETE men table service_status
export async function deleteServiceStatus(serviceStatusId: number) {
  const sql = `
    DELETE FROM service_status
    WHERE service_status_id = $1
  `;
  await pool.query(sql, [serviceStatusId]);
  return true;
}
