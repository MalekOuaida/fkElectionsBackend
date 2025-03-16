/****************************************************************************
 * relativesAndServices.service.ts
 * B yetsarraf ma tables: relatives_details + citizens_services
 * CRM style, 3andek family members w services provided
 ****************************************************************************/
import pool from '../config/db';

// data for a new relative
export interface RelativeInput {
  citizensGovId: number;
  fullName: string;
  relationshipType?: string;
  rDob?: string;
  addressId?: number;
  maritalStatusId?: number;
}

// createRelative => y3abi relatives_details
export async function createRelative(data: RelativeInput) {
  const sql = `
    INSERT INTO relatives_details (
      citizens_gov_id,
      full_name,
      relationship_type,
      r_dob,
      address_id,
      marital_status_id
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING relatives_details_id
  `;
  const values = [
    data.citizensGovId,
    data.fullName,
    data.relationshipType || null,
    data.rDob || null,
    data.addressId || null,
    data.maritalStatusId || null,
  ];
  const res = await pool.query(sql, values);
  return res.rows[0].relatives_details_id;
}

/** CITIZENS_SERVICES => y2ayyed service be3mel hal citizen or relative. */
export interface CitizenServiceInput {
  citizensGovId: number;
  relativeService?: boolean;
  relativesDetailsId?: number;
  serviceTypeId?: number;
  serviceStatusId?: number;
  serviceDescription?: string;
}

// createCitizenService => insert fi citizens_services
export async function createCitizenService(data: CitizenServiceInput) {
  const sql = `
    INSERT INTO citizens_services (
      citizens_gov_id,
      relative_service,
      relatives_details_id,
      service_type_id,
      service_status_id,
      service_description
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING citizens_services_id
  `;
  const values = [
    data.citizensGovId,
    data.relativeService === true,
    data.relativesDetailsId || null,
    data.serviceTypeId || null,
    data.serviceStatusId || null,
    data.serviceDescription || null,
  ];
  const res = await pool.query(sql, values);
  return res.rows[0].citizens_services_id;
}

// getServicesForCitizen => jam3 kil services men citizens_services by citizens_gov_id
export async function getServicesForCitizen(citizensGovId: number) {
  const sql = `
    SELECT cs.*,
           rd.full_name as relative_name
    FROM citizens_services cs
    LEFT JOIN relatives_details rd ON cs.relatives_details_id = rd.relatives_details_id
    WHERE cs.citizens_gov_id = $1
    ORDER BY cs.citizens_services_id DESC
  `;
  const res = await pool.query(sql, [citizensGovId]);
  return res.rows;
}
