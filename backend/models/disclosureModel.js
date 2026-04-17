import { db } from "../config/db.js";

export const disclosureModel = {
  async createDisclosure(id, reportId, companyId) {
    const query = `
      INSERT INTO disclosures (id, company_id, report_id, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [id, companyId, reportId, "DRAFT"];

    const result = await db.query(query, values);

    return result.rows[0];
  },

  // GET DISCLOSURE BY ID
  async getDisclosureById(id) {
    const query = `
      SELECT * FROM disclosures
      WHERE id = $1;
    `;

    const result = await db.query(query, [id]);

    return result.rows[0];
  }

};

export const verifyDisclosure = async (req, res) => {
  try {
    const { disclosureId } = req.body;

    // get stored root
    const stored = await db.query(
      "SELECT root_hash FROM merkle_roots WHERE disclosure_id = $1 ORDER BY created_at DESC LIMIT 1",
      [disclosureId]
    );

    if (stored.rows.length === 0) {
      return res.status(404).json({ error: "No root found" });
    }

    const storedRoot = stored.rows[0].root_hash;

    // recompute hashes
    const result = await db.query(
      "SELECT hash FROM data_points WHERE disclosure_id = $1",
      [disclosureId]
    );

    let hashes = result.rows.map(r => r.hash);

    if (hashes.length === 0) {
      return res.status(400).json({ error: "No data points" });
    }

    // rebuild merkle
    while (hashes.length > 1) {
      let next = [];

      for (let i = 0; i < hashes.length; i += 2) {
        const left = hashes[i];
        const right = hashes[i + 1] || left;

        const combined = crypto
          .createHash("sha256")
          .update(left + right)
          .digest("hex");

        next.push(combined);
      }

      hashes = next;
    }

    const computedRoot = hashes[0];

    res.json({
      valid: computedRoot === storedRoot,
      storedRoot,
      computedRoot
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};