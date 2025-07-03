// routes/gemini.routes.js
import express from "express";
import { generateText } from "../controllers/gemini.controller.js";

const router = express.Router();

router.post("/", generateText);

export default router;
