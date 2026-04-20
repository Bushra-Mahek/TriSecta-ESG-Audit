import { dataPointModel } from "../models/dataPointModel.js";
import { merkleModel } from "../models/merkleModel.js";
import { generateMerkleRoot } from "../utils/merkle.js";
import { disclosureModel } from "../models/disclosureModel.js";

export const verifyDisclosure = async (req, res) => {
  try {
    const { disclosureId } = req.body;

    if (!disclosureId) {
      return res.status(400).json({
        error: "disclosureId is required",
      });
    }

    // 1. get stored root
    const stored = await merkleModel.getLatestRoot(disclosureId);

    if (!stored) {
      return res.status(404).json({
        error: "No root found",
      });
    }

    // 2. get hashes
    const hashes = await dataPointModel.getHashesByDisclosure(disclosureId);

    if (!hashes.length) {
      return res.status(400).json({
        error: "No data points",
      });
    }

    // 3. recompute root
    const computedRoot = generateMerkleRoot(hashes);

    // 4. compare
    const isValid = computedRoot === stored.root_hash;

    if (!isValid) {
      return res.status(400).json({
        valid: false,
        message: "Tampering detected",
        storedRoot: stored.root_hash,
        computedRoot,
      });
    }

    // 5. update final disclosure status
    const updatedDisclosure = await disclosureModel.markVerified(disclosureId);

    res.json({
      valid: true,
      message: "Disclosure verified successfully",
      storedRoot: stored.root_hash,
      computedRoot,
      disclosure: updatedDisclosure,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Verification failed",
    });
  }
};
