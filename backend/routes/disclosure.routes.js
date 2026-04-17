import express from "express";
import { createDisclosureReport } from "../controllers/disclosureController.js";

const router = express.Router();

router.post("/", createDisclosureReport);
router.get("/:id", async (req, res) => {
  res.send("get disclosure - implement later");
});


export default router;