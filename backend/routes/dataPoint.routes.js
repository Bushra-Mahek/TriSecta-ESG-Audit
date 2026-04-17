import express from "express";
import { createDataPoint } from "../controllers/dataPointsController.js"
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", requireRole("company"), createDataPoint);
router.post("/", createDataPoint);

export default router;