import { db } from "../config/db.js";

export const merkleModel = {

  async storeMerkleRoot(id, disclosureId, rootHash) {
    const query = `
      INSERT INTO merkle_roots (id, disclosure_id, root_hash)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const result = await db.query(query, [id, disclosureId, rootHash]);

    return result.rows[0];
  },

  async getLatestRoot(disclosureId) {
  const result = await db.query(
    `SELECT root_hash FROM merkle_roots
     WHERE disclosure_id = $1
     ORDER BY created_at DESC
     LIMIT 1`,
    [disclosureId]
  );

  return result.rows[0];
}

};