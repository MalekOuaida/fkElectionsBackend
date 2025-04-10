/****************************************************************************
 * citizenAttrib.service.ts
 * Hayda el file byhki 3an table 'citizen_attrib' 
 * li fiyo info metel blood_type_id, marital_status_id, mobile_number, etc.
 ****************************************************************************/
import pool from '../config/db';

// Interface la input kermel create fi citizen_attrib
export interface CitizenAttribInput {
  citizensGovId: number;
  bloodTypeId?: number;
  maritalStatusId?: number;
  nationalIdNumber: string;
  mobileNumber: string;
  alternativeMobileNumber?: string;
  emailAddress: string;
  educationLevelId?: number;
  jobTitle?: string;
  belong2Syndicate?: boolean;
  addressId?: number;
  profilePicture?: string;
  supportStatusId?: number;
  mukhId?: number;
}

// createCitizenAttrib => hon mn aabe l extra info ba3d ma ykoon 3anna citizen bi table citizens_gov
export async function createCitizenAttrib(data: CitizenAttribInput) {
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
      address_id,
      profile_picture,
      support_status_id,
      mukh_id
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
    RETURNING citizen_attrib_id
  `;
  const values = [
    data.citizensGovId,
    data.bloodTypeId || null,
    data.maritalStatusId || null,
    data.nationalIdNumber,
    data.mobileNumber,
    data.alternativeMobileNumber || null,
    data.emailAddress,
    data.educationLevelId || null,
    data.jobTitle || null,
    data.belong2Syndicate === true ? true : false,
    data.addressId || null,
    data.profilePicture || null,
    data.supportStatusId || null,
    data.mukhId || null,
  ];

  const result = await pool.query(sql, values);
  return result.rows[0].citizen_attrib_id;
}

// getCitizenAttribByCitizenId => SELECT row men citizen_attrib by citizens_gov_id
export async function getCitizenAttribByCitizenId(citizensGovId: number) {
  const sql = `
    SELECT *
    FROM citizen_attrib
    WHERE citizens_gov_id = $1
  `;
  const result = await pool.query(sql, [citizensGovId]);
  return result.rows[0] || null;
}

// updateCitizenAttrib => partial update
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
  if (data.addressId !== undefined) {
    setClauses.push(`address_id = $${idx++}`);
    values.push(data.addressId);
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

  if (!setClauses.length) {
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
