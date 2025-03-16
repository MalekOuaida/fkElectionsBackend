/****************************************************************************
 * electionData.service.ts
 * Handles CRUD for election_year, election_type, election_district
 ****************************************************************************/
import pool from '../config/db';

export async function createElectionYear(year: number) {
  const sql = `
    INSERT INTO election_year (year)
    VALUES ($1)
    RETURNING election_year_id
  `;
  const res = await pool.query(sql, [year]);
  return res.rows[0].election_year_id;
}

export async function getAllElectionYears() {
  const sql = `SELECT * FROM election_year ORDER BY year DESC`;
  const res = await pool.query(sql);
  return res.rows;
}

// Similarly for election_type
export async function createElectionType(typeName: string) {
  const sql = `
    INSERT INTO election_type (type_name)
    VALUES ($1)
    RETURNING election_type_id
  `;
  const res = await pool.query(sql, [typeName]);
  return res.rows[0].election_type_id;
}

// getAllElectionTypes, etc.

// For election_district
export async function createElectionDistrict(districtName: string) {
  const sql = `
    INSERT INTO election_district (district_name)
    VALUES ($1)
    RETURNING election_district_id
  `;
  const res = await pool.query(sql, [districtName]);
  return res.rows[0].election_district_id;
}
