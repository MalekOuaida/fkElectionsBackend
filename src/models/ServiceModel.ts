import pool from "../config/db";

export default class ServiceModel {
    static async createService(serviceData: any) {
        const query = `
            INSERT INTO services (voter_id, service_type, provided_at, created_by)
            VALUES ($1, $2, $3, $4) RETURNING *;
        `;
        const values = Object.values(serviceData);
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async getServicesByVoter(voter_id: number) {
        const query = "SELECT * FROM services WHERE voter_id = $1";
        const { rows } = await pool.query(query, [voter_id]);
        return rows;
    }
}
