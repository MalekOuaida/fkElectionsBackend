/****************************************************************************
 * volunteerDriverLeader.service.ts
 * hon bfout 3a tables: Volunteer, Logistics_Driver, Leader_Reference
 ****************************************************************************/
import pool from '../config/db';

export interface VolunteerInput {
  citizenId?: number;
  isVoter?: boolean;
  volunteerRole?: string;
}

export async function createVolunteer(data: VolunteerInput) {
  const sql = `
    INSERT INTO volunteer (citizen_id, is_voter, volunteer_role)
    VALUES ($1, $2, $3)
    RETURNING volunteer_id
  `;
  const values = [
    data.citizenId || null,
    data.isVoter === true,
    data.volunteerRole || null,
  ];
  const res = await pool.query(sql, values);
  return res.rows[0].volunteer_id;
}

// for Logistics_Driver
export interface DriverInput {
  citizenId?: number;
  isVoter?: boolean;
  vehicleInfo?: string;
}

export async function createDriver(data: DriverInput) {
  const sql = `
    INSERT INTO logistics_driver (citizen_id, is_voter, vehicle_info)
    VALUES ($1, $2, $3)
    RETURNING logistics_driver_id
  `;
  const values = [
    data.citizenId || null,
    data.isVoter === true,
    data.vehicleInfo || null,
  ];
  const res = await pool.query(sql, values);
  return res.rows[0].logistics_driver_id;
}

// for Leader_Reference
export interface LeaderInput {
  citizenId?: number;
  isVoter?: boolean;
  description?: string;
}

export async function createLeaderReference(data: LeaderInput) {
  const sql = `
    INSERT INTO leader_reference (citizen_id, is_voter, description)
    VALUES ($1, $2, $3)
    RETURNING leader_reference_id
  `;
  const values = [
    data.citizenId || null,
    data.isVoter === true,
    data.description || null,
  ];
  const res = await pool.query(sql, values);
  return res.rows[0].leader_reference_id;
}
