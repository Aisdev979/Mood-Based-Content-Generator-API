import express from 'express';
import { likeContent, saveContent, getSavedContent, removeSavedContent } from '../controllers/interaction.controller.js';
import {verifyToken, authorize } from "../middlewares/auth.middleware.js";

const interactionRouter = express.Router();

interactionRouter.post('/content/:id/like', verifyToken, authorize("user"), likeContent);
interactionRouter.post('/content/:id/save', verifyToken, authorize("user"), saveContent);
interactionRouter.get('/user/saved', verifyToken, authorize("user"), getSavedContent);
interactionRouter.delete('/user/saved/:id', verifyToken, authorize("user"), removeSavedContent);

export default interactionRouter;