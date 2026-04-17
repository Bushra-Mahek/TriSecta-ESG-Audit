import { disclosureModel } from "../models/disclosureModel.js";
import { v4 as uuidv4 } from "uuid";

// CREATE DISCLOSURE
export const createDisclosureReport = async (req, res) => {
  try {
    const { companyId } = req.body;

    // basic validation
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


// GET DISCLOSURE BY ID (for later use)
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