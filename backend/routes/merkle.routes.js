import express from "express";
import { verifyDisclosure } from "../controllers/merkleController.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();


router.post("/verify", requireRole("auditor"), verifyDisclosure);
router.post("/verify", verifyDisclosure);

export default router;