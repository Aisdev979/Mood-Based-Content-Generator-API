import express from "express";
import {
  getByMood,
  getRandom,
  submitContent
} from "../controllers/content.controller.js";
import {verifyToken, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Content
 *   description: Manage content by mood
 */

/**
 * @swagger
 * /api/v1/content/mood/{mood}:
 *   get:
 *     summary: Get approved content by mood
 *     tags: [Content]
 *     parameters:
 *       - in: path
 *         name: mood
 *         schema:
 *           type: string
 *         required: true
 *         description: Mood to filter content
 *     responses:
 *       200:
 *         description: Content retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     mood:
 *                       type: string
 *                     type:
 *                       type: string
 *                     content:
 *                       type: string
 *                     status:
 *                       type: string
 *                     createdBy:
 *                       type: string
 *       404:
 *         description: No approved content found
 */
router.get("/content/mood/:mood", getByMood);

/**
 * @swagger
 * /api/v1/content/random:
 *   get:
 *     summary: Get a random approved content
 *     tags: [Content]
 *     responses:
 *       200:
 *         description: Random content retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     mood:
 *                       type: string
 *                     type:
 *                       type: string
 *                     content:
 *                       type: string
 *                     status:
 *                       type: string
 *                     createdBy:
 *                       type: string
 *       404:
 *         description: No approved content available
 */
router.get("/content/random", getRandom);

/**
 * @swagger
 * /api/v1/content:
 *   post:
 *     summary: Submit new content (requires authentication)
 *     tags: [Content]
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
 *               - type
 *               - content
 *             properties:
 *               mood:
 *                 type: string
 *               type:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Content submitted for approval
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     mood:
 *                       type: string
 *                     type:
 *                       type: string
 *                     content:
 *                       type: string
 *                     status:
 *                       type: string
 *                     createdBy:
 *                       type: string
 *       400:
 *         description: Mood, type, or content missing
 *       401:
 *         description: Unauthorized
 */
router.post("/content", verifyToken, authorize("user"), submitContent);

export default router;