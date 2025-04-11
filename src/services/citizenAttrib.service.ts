// services/citizenAttrib.service.ts

import pool from '../config/db';

/**
 * This interface defines all the columns we have in citizen_attrib,
 * including the address fields directly in the same table.
 */
export interface CitizenAttribInput {
  citizensGovId: number;                   // foreign key to some 'citizens' table, if you have it
  bloodTypeId?: number;
  maritalStatusId?: number;
  nationalIdNumber: string;                // NOT NULL
  mobileNumber: string;                    // NOT NULL
  alternativeMobileNumber?: string;
  emailAddress?: string;
  educationLevelId?: number;
  jobTitle?: string;
  belong2Syndicate?: boolean;
  profilePicture?: string;
  supportStatusId?: number;
  mukhId?: number;

  // Address fields (all in the same table)
  buildingNumber?: string;
  street?: string;
  floorNumber?: string;
  aptNumber?: string;

  municipalityId?: number;
  districtId?: number;
  governorateId?: number;

  additionalInfo?: string;
}

/**
 * CREATE: Insert a new row into citizen_attrib.
 * Returns the newly created citizen_attrib_id.
 */
export async function createCitizenAttrib(data: CitizenAttribInput): Promise<number> {
  const sql = `
    INSERT INTO citizen_attrib (
      citizens_gov_id,
      blood_type_id,
      marital_status_id,
      national_id_number,
      mobile_number,
      alternative_mobile_number,
      email_address,
      education_level_id,
      job_title,
      belong_2_syndicate,
      profile_picture,
      support_status_id,
      mukh_id,
      building_number,
      street,
      floor_number,
      apt_number,
      municipality_id,
      district_id,
      governorate_id,
      additional_info
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
    RETURNING citizen_attrib_id
  `;
  const values = [
    data.citizensGovId,
    data.bloodTypeId || null,
    data.maritalStatusId || null,
    data.nationalIdNumber,
    data.mobileNumber,
    data.alternativeMobileNumber || null,
    data.emailAddress || null,
    data.educationLevelId || null,
    data.jobTitle || null,
    data.belong2Syndicate === true ? true : false,
    data.profilePicture || null,
    data.supportStatusId || null,
    data.mukhId || null,
    data.buildingNumber || null,
    data.street || null,
    data.floorNumber || null,
    data.aptNumber || null,
    data.municipalityId || null,
    data.districtId || null,
    data.governorateId || null,
    data.additionalInfo || null,
  ];

  const result = await pool.query(sql, values);
  return result.rows[0].citizen_attrib_id;
}

/**
 * READ: Get the citizen_attrib row by the "citizens_gov_id".
 * For example, if you have a citizen in another table with ID=42,
 * you'd store that ID in "citizens_gov_id" here, and fetch it with:
 *    getCitizenAttribByCitizenId(42)
 */
export async function getCitizenAttribByCitizenId(citizensGovId: number) {
  const sql = `
    SELECT *
    FROM citizen_attrib
    WHERE citizens_gov_id = $1
  `;
  const result = await pool.query(sql, [citizensGovId]);
  return result.rows[0] || null;  // return first row or null if none
}

/**
 * UPDATE: Partially update the citizen_attrib row identified by "citizen_attrib_id".
 * Only updates the fields that are defined in the "data" object.
 * Returns the updated row.
 */
export async function updateCitizenAttrib(citizenAttribId: number, data: Partial<CitizenAttribInput>) {
  const setClauses: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (data.bloodTypeId !== undefined) {
    setClauses.push(`blood_type_id = $${idx++}`);
    values.push(data.bloodTypeId);
  }
  if (data.maritalStatusId !== undefined) {
    setClauses.push(`marital_status_id = $${idx++}`);
    values.push(data.maritalStatusId);
  }
  if (data.nationalIdNumber !== undefined) {
    setClauses.push(`national_id_number = $${idx++}`);
    values.push(data.nationalIdNumber);
  }
  if (data.mobileNumber !== undefined) {
    setClauses.push(`mobile_number = $${idx++}`);
    values.push(data.mobileNumber);
  }
  if (data.alternativeMobileNumber !== undefined) {
    setClauses.push(`alternative_mobile_number = $${idx++}`);
    values.push(data.alternativeMobileNumber);
  }
  if (data.emailAddress !== undefined) {
    setClauses.push(`email_address = $${idx++}`);
    values.push(data.emailAddress);
  }
  if (data.educationLevelId !== undefined) {
    setClauses.push(`education_level_id = $${idx++}`);
    values.push(data.educationLevelId);
  }
  if (data.jobTitle !== undefined) {
    setClauses.push(`job_title = $${idx++}`);
    values.push(data.jobTitle);
  }
  if (data.belong2Syndicate !== undefined) {
    setClauses.push(`belong_2_syndicate = $${idx++}`);
    values.push(data.belong2Syndicate);
  }
  if (data.profilePicture !== undefined) {
    setClauses.push(`profile_picture = $${idx++}`);
    values.push(data.profilePicture);
  }
  if (data.supportStatusId !== undefined) {
    setClauses.push(`support_status_id = $${idx++}`);
    values.push(data.supportStatusId);
  }
  if (data.mukhId !== undefined) {
    setClauses.push(`mukh_id = $${idx++}`);
    values.push(data.mukhId);
  }

  // Address fields
  if (data.buildingNumber !== undefined) {
    setClauses.push(`building_number = $${idx++}`);
    values.push(data.buildingNumber);
  }
  if (data.street !== undefined) {
    setClauses.push(`street = $${idx++}`);
    values.push(data.street);
  }
  if (data.floorNumber !== undefined) {
    setClauses.push(`floor_number = $${idx++}`);
    values.push(data.floorNumber);
  }
  if (data.aptNumber !== undefined) {
    setClauses.push(`apt_number = $${idx++}`);
    values.push(data.aptNumber);
  }
  if (data.municipalityId !== undefined) {
    setClauses.push(`municipality_id = $${idx++}`);
    values.push(data.municipalityId);
  }
  if (data.districtId !== undefined) {
    setClauses.push(`district_id = $${idx++}`);
    values.push(data.districtId);
  }
  if (data.governorateId !== undefined) {
    setClauses.push(`governorate_id = $${idx++}`);
    values.push(data.governorateId);
  }
  if (data.additionalInfo !== undefined) {
    setClauses.push(`additional_info = $${idx++}`);
    values.push(data.additionalInfo);
  }

  if (!setClauses.length) {
    // No fields to update
    return null;
  }

  const sql = `
    UPDATE citizen_attrib
    SET ${setClauses.join(', ')}
    WHERE citizen_attrib_id = $${idx}
    RETURNING *
  `;
  values.push(citizenAttribId);

  const result = await pool.query(sql, values);
  return result.rows[0] || null;
}
