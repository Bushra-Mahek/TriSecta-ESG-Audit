import { disclosureModel } from "../models/disclosureModel.js";
import { v4 as uuidv4 } from "uuid";
import { dataPointModel } from "../models/dataPointModel.js";
import { merkleModel } from "../models/merkleModel.js";
import { generateMerkleRoot } from "../utils/merkle.js";


// 🟢 CREATE DISCLOSURE (DRAFT)
export const createDisclosureReport = async (req, res) => {
  try {
    const { companyId } = req.body;

    if (!companyId) {
      return res.status(400).json({ error: "companyId is required" });
    }

    const id = uuidv4();
    const reportId = `REP-${Date.now()}`;

    const result = await disclosureModel.createDisclosure(
      id,
      reportId,
      companyId
    );

    res.status(201).json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


// 🟢 GET DISCLOSURE BY ID
export const getDisclosureById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await disclosureModel.getDisclosureById(id);

    if (!result) {
      return res.status(404).json({ error: "Disclosure not found" });
    }

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


export const submitDisclosure = async (req, res) => {
  try {
    const { disclosureId } = req.body;

    if (!disclosureId) {
      return res.status(400).json({ error: "disclosureId is required" });
    }

    // 🔹 Step 1: Check if disclosure exists
    const disclosure = await disclosureModel.getDisclosureStatus(disclosureId);

    if (!disclosure) {
      return res.status(404).json({ error: "Disclosure not found" });
    }

    // 🔹 Step 2: Prevent double submission
    if (disclosure.status !== "DRAFT") {
      return res.status(400).json({
        error: "Disclosure already submitted or locked"
      });
    }

    // 🔥 NEW LOGIC STARTS HERE

    // 3. get hashes
    const hashes = await dataPointModel.getHashesByDisclosure(disclosureId);

    if (!hashes.length) {
      return res.status(400).json({
        error: "No data points to submit"
      });
    }

    // 4. generate merkle root
    const rootHash = generateMerkleRoot(hashes);

    // 5. store root
    await merkleModel.storeMerkleRoot(
      uuidv4(),
      disclosureId,
      rootHash
    );

    // 🔥 NEW LOGIC ENDS HERE

    // 🔹 Step 6: Update status (LOCK)
    const updated = await disclosureModel.submitDisclosure(disclosureId);

    res.json({
      message: "Disclosure submitted successfully. Data is now locked.",
      rootHash,
      data: updated
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Submission failed" });
  }
};