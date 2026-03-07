import express from "express";
import { logMood,  getMoodHistory,  getRecommendations } from "../controllers/mood.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validateMoodBody, validateMoodDate} from "../middlewares/mood.validation.js";

const router = express.Router();

// All mood routes require authentication
router.use(authMiddleware);

// Log today's mood and receive content recommendations.
router.post("/", validateMoodBody, validateMoodDate, logMood);

// Retrieve the authenticated user's full mood history (paginated).
router.get("/history", getMoodHistory);

// Get content recommendations for a given mood without logging it.
router.get("/recommendations/:mood", getRecommendations);

export default router;
