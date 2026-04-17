import { db } from "../config/db.js";

export const disclosureModel = {

  // CREATE DISCLOSURE
  async createDisclosure(id, reportId, companyId) {
    const result = await db.query(
      `INSERT INTO disclosures (id, company_id, report_id, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, companyId, reportId, "DRAFT"]
    );

    return result.rows[0];
  },

  // GET DISCLOSURE BY ID
  async getDisclosureById(id) {
    const result = await db.query(
      "SELECT * FROM disclosures WHERE id = $1",
      [id]
    );

    return result.rows[0];
  },

  // GET STATUS ONLY
  async getDisclosureStatus(disclosureId) {
    const result = await db.query(
      "SELECT status FROM disclosures WHERE id = $1",
      [disclosureId]
    );

    return result.rows[0];
  },

  // 🔥 ADD THIS (missing earlier)
  async submitDisclosure(disclosureId) {
    const result = await db.query(
      `UPDATE disclosures
       SET status = 'SUBMITTED',
           submitted_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [disclosureId]
    );

    return result.rows[0];
  }

};