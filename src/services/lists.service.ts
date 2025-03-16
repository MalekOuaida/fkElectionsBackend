/****************************************************************************
 * lists.service.ts
 ****************************************************************************/
import pool from '../config/db';

// createList => Insert fi table "list"
export async function createList(listName: string) {
  const sql = `
    INSERT INTO list (list_name)
    VALUES ($1)
    RETURNING list_id
  `;
  const res = await pool.query(sql, [listName]);
  return res.rows[0].list_id;
}

export async function getAllLists() {
  const sql = `SELECT * FROM list ORDER BY list_id`;
  const res = await pool.query(sql);
  return res.rows;
}

// createCandidate => Insert bi list_candidates
export async function createCandidate(listId: number, candidateId: number, candidateName: string) {
  const sql = `
    INSERT INTO list_candidates (list_id, candidate_id, candidate_name)
    VALUES ($1, $2, $3)
    RETURNING list_candidate_id
  `;
  const values = [listId, candidateId, candidateName];
  const res = await pool.query(sql, values);
  return res.rows[0].list_candidate_id;
}

export async function getCandidatesByList(listId: number) {
  const sql = `
    SELECT * 
    FROM list_candidates
    WHERE list_id = $1
    ORDER BY list_candidate_id
  `;
  const res = await pool.query(sql, [listId]);
  return res.rows;
}
