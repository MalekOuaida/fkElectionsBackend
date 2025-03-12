import pool from "../config/db";

export default class VoterModel {
    static async createVoter(voterData: any) {
        const query = `
            INSERT INTO voters (first_name, last_name, father_name, mother_name, date_of_birth, personal_sect, gender, registry_number, registry_sect, town, judiciary, governorate, electoral_district, phone_number, email, support_status_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *;
        `;
        const values = Object.values(voterData);
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async getVoterById(voter_id: number) {
        const query = "SELECT * FROM voters WHERE voter_id = $1";
        const { rows } = await pool.query(query, [voter_id]);
        return rows[0];
    }

    static async updateVoter(voter_id: number, updates: any) {
        const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`).join(", ");
        const query = `UPDATE voters SET ${fields}, updated_at = NOW() WHERE voter_id = $${Object.keys(updates).length + 1} RETURNING *`;
        const values = [...Object.values(updates), voter_id];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }
}
