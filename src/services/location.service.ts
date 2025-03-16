/****************************************************************************
 * location.service.ts
 * Hada el file byaamol CRUD / findOrCreate 3a governorate, district, municipality
 ****************************************************************************/
import pool from '../config/db';

// createGovernorate => Insert fi table 'governorate'
export async function createGovernorate(name: string) {
  const sql = `INSERT INTO governorate (governorate_name) VALUES ($1) RETURNING governorate_id`;
  const result = await pool.query(sql, [name]);
  return result.rows[0].governorate_id;
}

// createDistrict => Insert bl 'district' w link to governorate
export async function createDistrict(name: string, governorateId: number) {
  const sql = `
    INSERT INTO district (district_name, governorate_id)
    VALUES ($1, $2)
    RETURNING district_id
  `;
  const result = await pool.query(sql, [name, governorateId]);
  return result.rows[0].district_id;
}

// createMunicipality => Insert bl 'municipality' w link to district
export async function createMunicipality(name: string, districtId: number) {
  const sql = `
    INSERT INTO municipality (municipality_name, district_id)
    VALUES ($1, $2)
    RETURNING municipality_id
  `;
  const result = await pool.query(sql, [name, districtId]);
  return result.rows[0].municipality_id;
}

// findOrCreateMunicipality => Example 3al ON CONFLICT 
export async function findOrCreateMunicipality(name: string, districtId: number) {
  const sql = `
    INSERT INTO municipality (municipality_name, district_id)
    VALUES ($1, $2)
    ON CONFLICT (municipality_name)
    DO UPDATE SET municipality_name = EXCLUDED.municipality_name
    RETURNING municipality_id
  `;
  const res = await pool.query(sql, [name, districtId]);
  return res.rows[0].municipality_id;
}

/** getMunicipalityDetails => byeji men municipality_id, 
 *  we do join 3a district w governorate la naaerf kel shi
 */
export async function getMunicipalityDetails(municipalityId: number) {
  const sql = `
    SELECT m.*,
           d.district_name,
           g.governorate_name
    FROM municipality m
    JOIN district d ON m.district_id = d.district_id
    JOIN governorate g ON d.governorate_id = g.governorate_id
    WHERE m.municipality_id = $1
  `;
  const result = await pool.query(sql, [municipalityId]);
  return result.rows[0] || null;
}
