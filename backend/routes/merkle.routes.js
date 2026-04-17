import express from "express";
import { generateMerkleRoot, verifyDisclosure } from "../controllers/merkleController.js";

const router = express.Router();

router.post("/generate", generateMerkleRoot);
router.post("/verify", verifyDisclosure);

export default router;