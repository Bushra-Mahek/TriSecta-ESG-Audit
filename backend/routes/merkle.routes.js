import express from "express";
import { verifyDisclosure } from "../controllers/merkleController.js";

const router = express.Router();


router.post("/verify", verifyDisclosure);

export default router;