import express from "express";
import { TestConnection } from "../controllers/testController.js";

const router = express.Router();
router.get("/healthCheck", TestConnection);

export default router;
