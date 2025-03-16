/****************************************************************************
 * address.service.ts
 ****************************************************************************/
import pool from '../config/db';

export interface AddressInput {
  city: string;
  road?: string;
  building?: string;
  floor?: string;
  nearby?: string;
}

export async function createAddress(data: AddressInput) {
  const sql = `
    INSERT INTO address (city, road, building, floor, nearby)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING address_id
  `;
  const values = [
    data.city,
    data.road || null,
    data.building || null,
    data.floor || null,
    data.nearby || null,
  ];
  const res = await pool.query(sql, values);
  return res.rows[0].address_id;
}

// getAddress, updateAddress, etc.
