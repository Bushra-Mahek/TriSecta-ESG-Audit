import express from "express";
import { createDataPoint } from "../controllers/dataPointsController.js"

const router = express.Router();

router.post("/", createDataPoint);

export default router;