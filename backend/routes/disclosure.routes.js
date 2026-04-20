import express from "express";
import {
  createDisclosureReport,
  submitDisclosure,
} from "../controllers/disclosureController.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", requireRole("company"), createDisclosureReport);
router.post("/submit", requireRole("company"), submitDisclosure);

router.get("/:id", async (req, res) => {
  res.send("get disclosure - implement later");
});

export default router;
