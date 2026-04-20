import { db } from "../config/db.js";

export const dataPointModel = {
  // CREATE DATA POINT
  async createDataPoint(
    id,
    disclosureId,
    metricId,
    value,
    periodStart,
    periodEnd,
    hash,
  ) {
    const query = `
      INSERT INTO data_points 
      (id, disclosure_id, metric_id, value, period_start, period_end, hash)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [
      id,
      disclosureId,
      metricId,
      value,
      periodStart,
      periodEnd,
      hash,
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  },

  // GET ALL DATA POINTS FOR A DISCLOSURE (needed for merkle)
  async getDataPointsByDisclosure(disclosureId) {
    const query = `
      SELECT * FROM data_points
      WHERE disclosure_id = $1
      ORDER BY created_at ASC;
    `;

    const result = await db.query(query, [disclosureId]);
    return result.rows;
  },

  // GET ONLY HASHES (used in verification)
  async getHashesByDisclosure(disclosureId) {
    const query = `
    SELECT hash
    FROM data_points
    WHERE disclosure_id = $1
    ORDER BY created_at ASC;
  `;

    const result = await db.query(query, [disclosureId]);
    return result.rows.map((row) => row.hash);
  },
};
