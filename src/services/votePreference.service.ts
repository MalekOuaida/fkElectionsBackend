/****************************************************************************
 * votePreference.service.ts
 * Bya3mel manage la table: citizen_vote_preference
 * khass b Parliamentary, Municipal, or Mukhtar elections, etc.
 ****************************************************************************/
import pool from '../config/db';

// interface la input
export interface VotePreferenceInput {
  citizenId: number;
  electionYearId: number;
  electionTypeId: number;
  electionDistrictId?: number; // if Parliamentary
  municipalityId?: number;     // if Municipal / Mukhtar
  listId?: number;
  fav1CandidateId?: number;
  fav2CandidateId?: number;
}

export async function createVotePreference(data: VotePreferenceInput) {
  const sql = `
    INSERT INTO citizen_vote_preference (
      citizen_id,
      election_year_id,
      election_type_id,
      election_district_id,
      municipality_id,
      list_id,
      fav1_candidate_id,
      fav2_candidate_id
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING vote_preference_id
  `;
  const values = [
    data.citizenId,
    data.electionYearId,
    data.electionTypeId,
    data.electionDistrictId || null,
    data.municipalityId || null,
    data.listId || null,
    data.fav1CandidateId || null,
    data.fav2CandidateId || null,
  ];
  const res = await pool.query(sql, values);
  return res.rows[0].vote_preference_id;
}

// upsertVotePreference => yzabbit row once per citizen+year+type
export async function upsertVotePreference(data: VotePreferenceInput) {
  const sql = `
    INSERT INTO citizen_vote_preference (
      citizen_id,
      election_year_id,
      election_type_id,
      election_district_id,
      municipality_id,
      list_id,
      fav1_candidate_id,
      fav2_candidate_id
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    ON CONFLICT (citizen_id, election_year_id, election_type_id)
    DO UPDATE SET
      election_district_id = EXCLUDED.election_district_id,
      municipality_id = EXCLUDED.municipality_id,
      list_id = EXCLUDED.list_id,
      fav1_candidate_id = EXCLUDED.fav1_candidate_id,
      fav2_candidate_id = EXCLUDED.fav2_candidate_id
    RETURNING vote_preference_id
  `;
  const values = [
    data.citizenId,
    data.electionYearId,
    data.electionTypeId,
    data.electionDistrictId || null,
    data.municipalityId || null,
    data.listId || null,
    data.fav1CandidateId || null,
    data.fav2CandidateId || null,
  ];
  const res = await pool.query(sql, values);
  return res.rows[0].vote_preference_id;
}

// getPreferencesByCitizen => nji b citizen_id w ngeb kil preferences
export async function getPreferencesByCitizen(citizenId: number) {
  const sql = `
    SELECT cvp.*,
           ey.year,
           et.type_name,
           ed.district_name as election_dist_name,
           m.municipality_name,
           l.list_name
    FROM citizen_vote_preference cvp
    LEFT JOIN election_year ey ON cvp.election_year_id = ey.election_year_id
    LEFT JOIN election_type et ON cvp.election_type_id = et.election_type_id
    LEFT JOIN election_district ed ON cvp.election_district_id = ed.election_district_id
    LEFT JOIN municipality m ON cvp.municipality_id = m.municipality_id
    LEFT JOIN list l ON cvp.list_id = l.list_id
    WHERE cvp.citizen_id = $1
    ORDER BY ey.year DESC
  `;
  const res = await pool.query(sql, [citizenId]);
  return res.rows;
}
