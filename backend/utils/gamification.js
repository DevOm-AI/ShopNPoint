const { executeQuery } = require('../config/db');

const XP_VALUES = {
    PURCHASE: 50,
    REFERRAL: 100,
    DAILY_LOGIN: 10,
    MISSION_COMPLETE: 0
};

const calculateLevel = (xp) => Math.floor(Math.sqrt(xp / 100)) + 1;

const addXP = async (userId, eventType, customXP = null) => {
    const xpToAdd = customXP !== null ? customXP : (XP_VALUES[eventType] || 0);
    try {
        await executeQuery("INSERT IGNORE INTO user_gamification (user_id, xp, current_level, current_streak) VALUES (?, 0, 1, 0)", [userId]);
        await executeQuery("UPDATE user_gamification SET xp = xp + ? WHERE user_id = ?", [xpToAdd, userId]);

        const rows = await executeQuery("SELECT xp, current_level FROM user_gamification WHERE user_id = ?", [userId]);
        
        if (rows && rows.length > 0) {
            const { xp, current_level } = rows[0];
            if (eventType !== 'MISSION_COMPLETE') await updateMissionProgress(userId, eventType);
            await checkAndAwardBadges(userId, xp);

            const newLevel = calculateLevel(xp);
            if (newLevel > current_level) {
                await executeQuery("UPDATE user_gamification SET current_level = ? WHERE user_id = ?", [newLevel, userId]);
            }
        }
    } catch (error) { console.error("XP Error:", error); }
};

const updateMissionProgress = async (userId, eventType) => {
    try {
        const missions = await executeQuery("SELECT * FROM missions WHERE requirement_type = ?", [eventType]);
        if (!missions) return;

        for (const mission of missions) {
            const userMissions = await executeQuery("SELECT * FROM user_missions WHERE user_id = ? AND mission_id = ?", [userId, mission.mission_id]);
            const progress = userMissions[0];

            if (!progress) {
                await executeQuery("INSERT INTO user_missions (user_id, mission_id, current_value) VALUES (?, ?, 1)", [userId, mission.mission_id]);
            } else if (!progress.is_completed) {
                const newVal = progress.current_value + 1;
                if (newVal >= mission.requirement_value) {
                    await executeQuery("UPDATE user_missions SET current_value = ?, is_completed = TRUE, completed_at = NOW() WHERE user_id = ? AND mission_id = ?", [newVal, userId, mission.mission_id]);
                    await addXP(userId, 'MISSION_COMPLETE', mission.xp_reward);
                    await executeQuery("UPDATE users SET total_tokens = total_tokens + ? WHERE user_id = ?", [mission.token_reward, userId]);
                } else {
                    await executeQuery("UPDATE user_missions SET current_value = ? WHERE user_id = ? AND mission_id = ?", [newVal, userId, mission.mission_id]);
                }
            }
        }
    } catch (e) { console.error("Mission Error:", e); }
};

const checkAndAwardBadges = async (userId, currentXp) => {
    try {
        const badges = await executeQuery(
            "SELECT badge_id FROM badges WHERE xp_requirement <= ? AND badge_id NOT IN (SELECT badge_id FROM user_badges WHERE user_id = ?)",
            [currentXp, userId]
        );
        for (const b of badges) {
            await executeQuery("INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)", [userId, b.badge_id]);
        }
    } catch (e) { console.error("Badge Error:", e); }
};

module.exports = { addXP, calculateLevel, checkAndAwardBadges, updateMissionProgress };