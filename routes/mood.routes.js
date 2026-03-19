import express from "express";
import { logMood, getMoodHistory, getRecommendations } from "../controllers/mood.controller.js";
import { verifyToken, authorize } from "../middlewares/auth.middleware.js";
import { validateMoodBody, validateMoodDate } from "../middlewares/mood.validation.js";

const moodRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Mood
 *   description: Log moods and get mood-based content recommendations
 */

/**
 * @swagger
 * /api/v1/user/mood/log:
 *   post:
 *     summary: Log today's mood and get content recommendations
 *     tags: [Mood]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mood
 *             properties:
 *               mood:
 *                 type: string
 *                 description: Mood of the user (e.g., happy, sad)
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Optional ISO date (defaults to today)
 *     responses:
 *       201:
 *         description: Mood logged successfully with recommendations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Mood logged successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     moodLog:
 *                       type: object
 *                       description: Logged mood record
 *                     recommendations:
 *                       type: array
 *                       description: Content recommended based on mood
 */
moodRouter.post("/user/mood/log", verifyToken, authorize("user"), validateMoodBody, validateMoodDate, logMood);
/**
 * @swagger
 * /api/v1/user/mood/history:
 *   get:
 *     summary: Get paginated mood history for the authenticated user
 *     tags: [Mood]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           minimum: 1
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated mood history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     logs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           mood:
 *                             type: string
 *                           date:
 *                             type: string
 *                             format: date
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 */
moodRouter.get("/user/mood/history", verifyToken, authorize("user"), getMoodHistory);
/**
 * @swagger
 * /api/v1/recommendations/{mood}:
 *   get:
 *     summary: Get content recommendations for a specific mood without logging it
 *     tags: [Mood]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mood
 *         schema:
 *           type: string
 *         required: true
 *         description: Mood for which to fetch recommendations
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *         description: Maximum number of recommended content items
 *     responses:
 *       200:
 *         description: List of recommended content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   description: Recommended content based on the given mood
 */
moodRouter.get("/recommendations/:mood", verifyToken, authorize("user"), getRecommendations);

export default moodRouter;
