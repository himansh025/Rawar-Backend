import express from 'express';
import { userController } from './user.controller.js';

const router = express.Router();

router.get('/progress/:id', userController.getUserProgress); // Get progress of a user
router.put('/progress', userController.updateUserProgress);  // Update progress of a user
router.get('/leaderboard', userController.getLeaderboard);   // Get leaderboard

export default router;
