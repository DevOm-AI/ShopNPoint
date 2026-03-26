const express = require('express');
const router = express.Router();
const { 
    getGamificationStats, 
    getUserMissions, 
    getLeaderboard 
} = require('../controllers/gamificationController');
const { protect } = require('../middleware/authMiddleware');

// User-specific stats and progress
router.get('/stats', protect, getGamificationStats);
router.get('/missions', protect, getUserMissions);

// Global leaderboard
router.get('/leaderboard', getLeaderboard);

module.exports = router;