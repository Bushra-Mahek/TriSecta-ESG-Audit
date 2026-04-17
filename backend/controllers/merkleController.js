import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { db } from "../config/db.js";
import { merkleModel } from "../models/merkleModel.js";

export const generateMerkleRoot = async (req, res) => {
  try {
    const { disclosureId } = req.body;

    // get all hashes
    const result = await db.query(
      "SELECT hash FROM data_points WHERE disclosure_id = $1",
      [disclosureId]
    );

    const hashes = result.rows.map(row => row.hash);

    if (hashes.length === 0) {
      return res.status(400).json({ error: "No data points found" });
    }

    // merkle logic
    let currentLevel = hashes;

    while (currentLevel.length > 1) {
      let nextLevel = [];

      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right = currentLevel[i + 1] || left;

        const combined = crypto
          .createHash("sha256")
          .update(left + right)
          .digest("hex");

        nextLevel.push(combined);
      }

      currentLevel = nextLevel;
    }

    const rootHash = currentLevel[0];

    const id = uuidv4();

    const saved = await merkleModel.storeMerkleRoot(
      id,
      disclosureId,
      rootHash
    );

    res.json({
      rootHash,
      saved
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
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