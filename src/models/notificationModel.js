import pool from "../config/db.js";

// Создать уведомление
export const createNotification = async (
    userId,
    title,
    message
) => {

    const [result] = await pool.query(
        `INSERT INTO notifications
        (user_id, title, message)
        VALUES (?, ?, ?)`,
        [userId, title, message]
    );

    return result.insertId;
};

// Получить уведомления пользователя
export const getUserNotifications = async (userId) => {

    const [rows] = await pool.query(
        `SELECT
            id,
            title,
            message,
            is_read,
            created_at
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC`,
        [userId]
    );

    return rows;
};

// Отметить уведомление как прочитанное
export const markNotificationAsRead = async (id, userId) => {

    const [result] = await pool.query(
        `UPDATE notifications
        SET is_read = 1
        WHERE id = ?
        AND user_id = ?`,
        [id, userId]
    );

    return result.affectedRows;
};