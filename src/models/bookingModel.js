import pool from "../config/db.js";

//Проверка пересечения бронирований
export const findBookingConflict = async (
    resourceId,
    startTime,
    endTime
) => {

    const [rows] = await pool.query(
        `SELECT *
        FROM bookings
        WHERE resource_id = ?
        AND status = 'active'
        AND (
            start_time < ?
            AND end_time > ?
        )`,
        [
            resourceId,
            endTime,
            startTime
        ]
    );

    return rows;
};

//Создание бронирования
export const createBooking = async (
    resourceId,
    userId,
    startTime,
    endTime,
    purpose
) => {

    const [result] = await pool.query(
        `INSERT INTO bookings
        (
            resource_id,
            user_id,
            start_time,
            end_time,
            purpose
        )
        VALUES (?, ?, ?, ?, ?)`,
        [
            resourceId,
            userId,
            startTime,
            endTime,
            purpose
        ]
    );

    return result.insertId;

};

//Получить все бронирования
export const getAllBookings = async () => {

    const [rows] = await pool.query(
        `SELECT
            b.id,
            r.name AS resource_name,
            u.full_name AS booked_by,
            b.start_time,
            b.end_time,
            b.purpose,
            b.status,
            b.created_at
        FROM bookings b
        JOIN resources r
            ON b.resource_id = r.id
        JOIN users u
            ON b.user_id = u.id
        ORDER BY b.start_time`
    );

    return rows;

};

//Получить бронирования текущего пользователя
export const getMyBookings = async (userId) => {

    const [rows] = await pool.query(
        `SELECT
            b.id,
            r.name AS resource_name,
            b.start_time,
            b.end_time,
            b.purpose,
            b.status,
            b.created_at
        FROM bookings b
        JOIN resources r
            ON b.resource_id = r.id
        WHERE b.user_id = ?
        ORDER BY b.start_time`,
        [userId]
    );

    return rows;

};

//Получить бронирование по id
export const getBookingById = async (id) => {

    const [rows] = await pool.query(
        "SELECT * FROM bookings WHERE id = ?",
        [id]
    );

    return rows[0];

};

//Отменить бронирование
export const cancelBooking = async (id) => {

    const [result] = await pool.query(
        `UPDATE bookings
        SET status = 'cancelled'
        WHERE id = ?`,
        [id]
    );

    return result.affectedRows;

};