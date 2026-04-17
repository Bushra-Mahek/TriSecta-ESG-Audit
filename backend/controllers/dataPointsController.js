import { dataPointModel } from "../models/dataPointModel.js";
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

    const id = uuidv4();
    const val = Number(value);

    const rawData = `${disclosureId}-${metricId}-${value}-${periodStart}-${periodEnd}`;

    const hash = crypto.createHash("sha256").update(rawData).digest("hex");

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