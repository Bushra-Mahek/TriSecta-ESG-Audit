import { db } from "../config/db.js";

export const dataPointModel = {

  async createDataPoint(id, disclosureId, metricId, value, start, end, hash) {
    const query = `
      INSERT INTO data_points 
      (id, disclosure_id, metric_id, value, period_start, period_end,hash)
      VALUES ($1, $2, $3, $4, $5, $6,$7)
      RETURNING *;
    `;

    const values = [id, disclosureId, metricId, value, start, end, hash];

    const result = await db.query(query, values);

    return result.rows[0];
  }

};