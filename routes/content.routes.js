import express from "express";
import {
  getByMood,
  getRandom,
  submitContent
} from "../controllers/content.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/mood/:mood", getByMood);
router.get("/random", getRandom);
router.post("/", authMiddleware, submitContent);

export default router;