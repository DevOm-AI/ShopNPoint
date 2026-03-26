const db = require('../config/db');

const { executeQuery } = require('../config/db');



const getGamificationStats = async (req, res) => {
    try {
        let rows = await executeQuery("SELECT xp, current_level, current_streak FROM user_gamification WHERE user_id = ?", [req.user.user_id]);
        
        if (rows.length === 0) {
            await executeQuery("INSERT INTO user_gamification (user_id, xp, current_level, current_streak) VALUES (?, 0, 1, 0)", [req.user.user_id]);
            rows = await executeQuery("SELECT xp, current_level, current_streak FROM user_gamification WHERE user_id = ?", [req.user.user_id]);
        }
        res.json(rows[0]);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const getUserMissions = async (req, res) => {
    try {
        const query = `
            SELECT m.*, IFNULL(um.current_value, 0) as current_value, IFNULL(um.is_completed, 0) as is_completed 
            FROM missions m 
            LEFT JOIN user_missions um ON m.mission_id = um.mission_id AND um.user_id = ?`;
        const rows = await executeQuery(query, [req.user.user_id]);
        res.json(rows);
    } catch (error) { res.status(500).json({ message: "Missions Fetch Failed" }); }
};



// @desc    Get top 10 users based on XP
// @route   GET /api/gamification/leaderboard
// @access  Public (or Private, your choice)
const getLeaderboard = async (req, res) => {
    try {
        const [rows] = await executeQuery(
            `SELECT u.name, g.xp, g.current_level 
             FROM user_gamification g 
             JOIN users u ON g.user_id = u.user_id 
             ORDER BY g.xp DESC 
             LIMIT 10`
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Get all badges earned by the logged-in user
// @route   GET /api/gamification/badges
// @access  Private
const getUserBadges = async (req, res) => {
    try {
        const [rows] = await executeQuery(
            `SELECT b.name, b.description, b.icon_url, ub.earned_at 
             FROM user_badges ub 
             JOIN badges b ON ub.badge_id = b.badge_id 
             WHERE ub.user_id = ?`,
            [req.user.user_id]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch badges" });
    }
};




module.exports = { 
    getGamificationStats, 
    getLeaderboard, 
    getUserBadges,
    getUserMissions
};
