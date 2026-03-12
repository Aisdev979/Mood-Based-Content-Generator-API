import express from "express";
import {
  getByMood,
  getRandom,
  submitContent
} from "../controllers/content.controller.js";
import {verifyToken, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/content/mood/:mood", getByMood);
router.get("/content/random", getRandom);
router.post("/content", verifyToken, authorize("user"), submitContent);

export default router;