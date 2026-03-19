import express from "express";
import { logMood,  getMoodHistory,  getRecommendations } from "../controllers/mood.controller.js";
import {verifyToken, authorize } from "../middlewares/auth.middleware.js";
import { validateMoodBody, validateMoodDate} from "../middlewares/mood.validation.js";

const moodRouter = express.Router();

// Log today's mood and receive content recommendations.
moodRouter.post("/user/mood/log", verifyToken, authorize("user"), validateMoodBody, validateMoodDate, logMood);

// Retrieve the authenticated user's full mood history (paginated).
moodRouter.get("/user/mood/history", verifyToken, authorize("user"), getMoodHistory);

// Get content recommendations for a given mood without logging it.
moodRouter.get("/recommendations/:mood", verifyToken, authorize("user"), getRecommendations);

export default moodRouter;
