import express from "express";
import { createDisclosureReport, submitDisclosure } from "../controllers/disclosureController.js";

const router = express.Router();

router.post("/", createDisclosureReport);
router.get("/:id", async (req, res) => {
  res.send("get disclosure - implement later");
});

router.post("/submit", submitDisclosure);

export default router;