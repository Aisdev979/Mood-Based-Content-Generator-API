import express from 'express';
import { likeContent, saveContent } from '../controllers/interactioncontroller.js';
import { likeContent, saveContent, getSavedContent, removeSavedContent } from '../controllers/interactioncontroller.js';
const router = express.Router();

router.post('/api/content/:id/like', likeContent);
router.post('/api/content/:id/save', saveContent);

export default router;
router.get('/api/user/saved', getSavedContent);
router.delete('/api/user/saved/:id', removeSavedContent);