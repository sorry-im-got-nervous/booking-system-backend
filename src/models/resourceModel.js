import pool from "../config/db.js";

// Создание нового ресурса
export const createResource = async (
    name,
    description,
    type,
    responsibleUserId
) => {

    // Выполняем INSERT-запрос в таблицу resources
    const [result] = await pool.query(
        `INSERT INTO resources
        (name, description, type, responsible_user_id)
        VALUES (?, ?, ?, ?)`,
        [name, description, type, responsibleUserId] // Передаём значения безопасно через плейсхолдеры
    );

    // Возвращаем id созданной записи
    return result.insertId;

};

// Поиск ресурса по названию
export const findResourceByName = async (name) => {
    
    // Выполняем SELECT-запрос
    const [rows] = await pool.query(
        "SELECT * FROM resources WHERE name = ?",
        [name]
    );

    // Возвращаем первый найденный ресурс (или undefined)
    return rows[0];

};

// Получение всех ресурсов
export const getAllResources = async () => {

    // Получаем список ресурсов
    // LEFT JOIN используется, чтобы даже если пользователь удалён,
    // ресурс всё равно отображался
    const [rows] = await pool.query(
        `SELECT
            r.id,
            r.name,
            r.description,
            r.type,
            r.status,
            u.full_name AS responsible_person
        FROM resources r
        LEFT JOIN users u
        ON r.responsible_user_id = u.id`
    );

    return rows;

};

// Получение ресурса по ID
export const getResourceById = async (id) => {

    const [rows] = await pool.query(
        `SELECT
            r.id,
            r.name,
            r.description,
            r.type,
            r.status,
            u.full_name AS responsible_person
        FROM resources r
        LEFT JOIN users u
        ON r.responsible_user_id = u.id
        WHERE r.id = ?`,
        [id]
    );

    return rows[0];

};

// Обновление ресурса
export const updateResource = async (
    id,
    name,
    description,
    type,
    status
) => {
    // Выполняем UPDATE-запрос
    const [result] = await pool.query(
        `UPDATE resources
        SET
            name = ?,
            description = ?,
            type = ?,
            status = ?
        WHERE id = ?`,
        [name, description, type, status, id]
    );

    // Возвращаем количество изменённых строк
    // (0 — если ресурс не найден)
    return result.affectedRows;

};