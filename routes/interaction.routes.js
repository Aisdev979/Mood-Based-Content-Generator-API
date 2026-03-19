import express from 'express';
import {
  likeContent,
  saveContent,
  getSavedContent,
  removeSavedContent
} from '../controllers/interaction.controller.js';
import { verifyToken, authorize } from "../middlewares/auth.middleware.js";

const interactionRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Interaction
 *   description: Like, save, and retrieve content interactions
 */

/**
 * @swagger
 * /api/v1/content/{id}/like:
 *   post:
 *     summary: Like a content item
 *     tags: [Interaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Content ID to like
 *     responses:
 *       201:
 *         description: Content liked successfully
 *       400:
 *         description: Already liked content
 *       404:
 *         description: Content not found
 */
interactionRouter.post('/content/:id/like', verifyToken, authorize("user"), likeContent);

/**
 * @swagger
 * /api/v1/content/{id}/save:
 *   post:
 *     summary: Save a content item
 *     tags: [Interaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Content ID to save
 *     responses:
 *       201:
 *         description: Content saved successfully
 *       400:
 *         description: Content already saved
 *       404:
 *         description: Content not found
 */
interactionRouter.post('/content/:id/save', verifyToken, authorize("user"), saveContent);

/**
 * @swagger
 * /api/v1/user/saved:
 *   get:
 *     summary: Get all saved content for authenticated user
 *     tags: [Interaction]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of saved content retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Save'
 */
interactionRouter.get('/user/saved', verifyToken, authorize("user"), getSavedContent);

/**
 * @swagger
 * /api/v1/user/saved/{id}:
 *   delete:
 *     summary: Remove saved content
 *     tags: [Interaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Content ID to remove from saved items
 *     responses:
 *       200:
 *         description: Content removed successfully
 *       404:
 *         description: Content not found
 */
interactionRouter.delete('/user/saved/:id', verifyToken, authorize("user"), removeSavedContent);

export default interactionRouter;
