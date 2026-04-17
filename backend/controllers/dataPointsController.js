import { dataPointModel } from "../models/dataPointModel.js";
import { disclosureModel } from "../models/disclosureModel.js";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

export const createDataPoint = async (req, res) => {
  try {
    const {
      disclosureId,
      metricId,
      value,
      periodStart,
      periodEnd
    } = req.body;

    // validation
    if (!disclosureId || !metricId || value == null) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }

    // ✅ get status via model
    const disclosure = await disclosureModel.getDisclosureStatus(disclosureId);

    if (!disclosure) {
      return res.status(404).json({
        error: "Disclosure not found"
      });
    }

    // ✅ lock enforcement
    if (disclosure.status !== "DRAFT") {
      return res.status(400).json({
        error: "Cannot modify submitted disclosure"
      });
    }

    const id = uuidv4();
    const val = Number(value);

    const rawData = `${disclosureId}-${metricId}-${value}-${periodStart}-${periodEnd}`;

    const hash = crypto
      .createHash("sha256")
      .update(rawData)
      .digest("hex");

    const result = await dataPointModel.createDataPoint(
      id,
      disclosureId,
      metricId,
      val,
      periodStart,
      periodEnd,
      hash
    );

    res.status(201).json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};