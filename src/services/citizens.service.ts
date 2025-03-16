/****************************************************************************
 * citizens.service.ts
 * Hada l file be3mel el CRUD w advanced search 3ala table 'citizens_gov'.
 * Benstakhdem pg Pool men db/index.ts.
 ****************************************************************************/
import pool from '../config/db';
import { QueryResult } from 'pg';

// Hada interface la input: kif baddna n3abbi el record fil 'citizens_gov'
export interface CitizenInput {
  firstName: string;
  lastName: string;
  fatherName?: string;
  motherName?: string;
  dob: string; // e.g. 'YYYY-MM-DD'
  personalDoctrine?: string;
  gender: 'Male' | 'Female' | 'Other';
  regNumber: string;
  doctrine?: string;
  municipalityId?: number;
}

// createCitizen => be3mel INSERT fi citizens_gov
export async function createCitizen(data: CitizenInput) {
  const sql = `
    INSERT INTO citizens_gov (
      first_name, last_name, father_name, mother_name, dob,
      personal_doctrine, gender, reg_number, doctrine,
      municipality_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING citizens_gov_id
  `;
  const values = [
    data.firstName,
    data.lastName,
    data.fatherName || null,
    data.motherName || null,
    data.dob,
    data.personalDoctrine || null,
    data.gender,
    data.regNumber,
    data.doctrine || null,
    data.municipalityId || null,
  ];

  const result: QueryResult = await pool.query(sql, values);
  return result.rows[0].citizens_gov_id;
}

// getCitizenById => barde bi SELECT * men citizens_gov
export async function getCitizenById(citizenId: number) {
  const sql = 'SELECT * FROM citizens_gov WHERE citizens_gov_id = $1';
  const result = await pool.query(sql, [citizenId]);
  return result.rows[0] || null;
}

// updateCitizen => partial update 3ala row fi citizens_gov
export async function updateCitizen(citizenId: number, data: Partial<CitizenInput>) {
  const setClauses: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (data.firstName !== undefined) {
    setClauses.push(`first_name = $${idx}`);
    values.push(data.firstName);
    idx++;
  }
  if (data.lastName !== undefined) {
    setClauses.push(`last_name = $${idx}`);
    values.push(data.lastName);
    idx++;
  }
  if (data.fatherName !== undefined) {
    setClauses.push(`father_name = $${idx}`);
    values.push(data.fatherName);
    idx++;
  }
  if (data.motherName !== undefined) {
    setClauses.push(`mother_name = $${idx}`);
    values.push(data.motherName);
    idx++;
  }
  if (data.dob !== undefined) {
    setClauses.push(`dob = $${idx}`);
    values.push(data.dob);
    idx++;
  }
  if (data.personalDoctrine !== undefined) {
    setClauses.push(`personal_doctrine = $${idx}`);
    values.push(data.personalDoctrine);
    idx++;
  }
  if (data.gender !== undefined) {
    setClauses.push(`gender = $${idx}`);
    values.push(data.gender);
    idx++;
  }
  if (data.regNumber !== undefined) {
    setClauses.push(`reg_number = $${idx}`);
    values.push(data.regNumber);
    idx++;
  }
  if (data.doctrine !== undefined) {
    setClauses.push(`doctrine = $${idx}`);
    values.push(data.doctrine);
    idx++;
  }
  if (data.municipalityId !== undefined) {
    setClauses.push(`municipality_id = $${idx}`);
    values.push(data.municipalityId);
    idx++;
  }

  if (!setClauses.length) {
    return null; // ma fi updates
  }

  const sql = `
    UPDATE citizens_gov
    SET ${setClauses.join(', ')}
    WHERE citizens_gov_id = $${idx}
    RETURNING *
  `;
  values.push(citizenId);

  const result = await pool.query(sql, values);
  return result.rows[0] || null;
}

// deleteCitizen => be3mel DELETE men citizens_gov
export async function deleteCitizen(citizenId: number) {
  await pool.query('DELETE FROM citizens_gov WHERE citizens_gov_id = $1', [citizenId]);
  return true;
}

/** 
 * searchCitizens => advanced search 3an l citizens,
 * possible filters: firstName, lastName, regNumber, municipalityName, districtName, governorateName
 */
export interface CitizenSearchFilters {
  firstName?: string;
  lastName?: string;
  regNumber?: string;
  municipalityName?: string;
  districtName?: string;
  governorateName?: string;
}

export async function searchCitizens(filters: CitizenSearchFilters) {
  let sql = `
    SELECT cg.*,
           m.municipality_name,
           d.district_name,
           g.governorate_name
    FROM citizens_gov cg
    LEFT JOIN municipality m ON cg.municipality_id = m.municipality_id
    LEFT JOIN district d ON m.district_id = d.district_id
    LEFT JOIN governorate g ON d.governorate_id = g.governorate_id
    WHERE 1=1
  `;
  const values: any[] = [];
  let idx = 1;

  if (filters.firstName) {
    sql += ` AND cg.first_name ILIKE $${idx}`;
    values.push(`%${filters.firstName}%`);
    idx++;
  }
  if (filters.lastName) {
    sql += ` AND cg.last_name ILIKE $${idx}`;
    values.push(`%${filters.lastName}%`);
    idx++;
  }
  if (filters.regNumber) {
    sql += ` AND cg.reg_number = $${idx}`;
    values.push(filters.regNumber);
    idx++;
  }
  if (filters.municipalityName) {
    sql += ` AND m.municipality_name ILIKE $${idx}`;
    values.push(`%${filters.municipalityName}%`);
    idx++;
  }
  if (filters.districtName) {
    sql += ` AND d.district_name ILIKE $${idx}`;
    values.push(`%${filters.districtName}%`);
    idx++;
  }
  if (filters.governorateName) {
    sql += ` AND g.governorate_name ILIKE $${idx}`;
    values.push(`%${filters.governorateName}%`);
    idx++;
  }

  sql += ' ORDER BY cg.citizens_gov_id DESC LIMIT 200';

  const result = await pool.query(sql, values);
  return result.rows;
}
